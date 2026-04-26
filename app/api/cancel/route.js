import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cancelSchema } from "@/lib/schemas";
import { google } from "googleapis";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

function renderTemplate(templateName, vars) {
  const filePath = path.join(process.cwd(), "emails", `${templateName}.html`);
  let html = fs.readFileSync(filePath, "utf-8");
  Object.entries(vars).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value ?? "");
  });
  html = html.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, content) => {
      return vars[key] ? content : "";
    },
  );
  return html;
}

export async function POST(request) {
  const body = await request.json();

  // Validazione con Zod
  const result = cancelSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Dati non validi" },
      { status: 422 },
    );
  }

  const { bookingId, cancelToken } = result.data;

  try {
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "Prenotazione non trovata" },
        { status: 404 },
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Questa prenotazione è già stata cancellata" },
        { status: 400 },
      );
    }

    if (booking.cancel_token !== cancelToken) {
      return NextResponse.json({ error: "Token non valido" }, { status: 403 });
    }

    if (booking.google_event_id) {
      try {
        await calendar.events.delete({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          eventId: booking.google_event_id,
          sendUpdates: "none",
        });
      } catch (calErr) {
        if (calErr.status !== 410) throw calErr;
        // 410 = evento già eliminato dal calendario — procedi comunque
      }
    }

    await supabaseAdmin
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    const dateLabel = new Date(
      `${booking.date}T${booking.slot}:00`,
    ).toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const templateVars = {
      name: booking.name,
      email: booking.email,
      date: dateLabel,
      slot: booking.slot,
      type: booking.type === "meet" ? "Google Meet" : "Telefono",
      from_name: process.env.RESEND_FROM_NAME ?? "Edoardo",
    };

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: booking.email,
      subject: `Prenotazione cancellata — ${dateLabel} alle ${booking.slot}`,
      html: renderTemplate("email-cancellation", templateVars),
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_NOTIFY_EMAIL,
      subject: `Prenotazione cancellata — ${booking.name}`,
      html: renderTemplate("email-cancellation-admin", templateVars),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel error:", err);
    return NextResponse.json(
      { error: "Cancellazione fallita", detail: err.message },
      { status: 500 },
    );
  }
}
