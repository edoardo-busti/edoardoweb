import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createCalendarEvent } from "@/lib/google-calendar";
import { bookingSchema } from "@/lib/schemas";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const result = bookingSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 422 },
    );
  }

  const { date, slot, type, name, email, phone, privacyAccepted } = result.data;

  try {
    const cancelToken = crypto.randomUUID();

    const { data, error: dbError } = await supabaseAdmin
      .from("bookings")
      .insert({
        date,
        slot,
        type,
        name,
        email,
        phone: phone ?? null,
        privacy_accepted: privacyAccepted,
        cancel_token: cancelToken,
      })
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    const { eventId, meetLink } = await createCalendarEvent({
      date,
      slot,
      name,
      email,
      type,
    });

    await supabaseAdmin
      .from("bookings")
      .update({ google_event_id: eventId, meet_link: meetLink })
      .eq("id", data.id);

    const dateLabel = new Date(`${date}T${slot}:00`).toLocaleDateString(
      "it-IT",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );

    const templateVars = {
      name,
      email,
      phone: phone ?? "",
      date: dateLabel,
      slot,
      type: type === "meet" ? "Google Meet" : "Telefono",
      meet_link: meetLink ?? "",
      from_name: process.env.RESEND_FROM_NAME ?? "Edoardo",
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancella/${data.id}?token=${cancelToken}`,
    };

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: email,
      subject: `Prenotazione confermata — ${dateLabel} alle ${slot}`,
      html: renderTemplate("email-confirmation", templateVars),
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_NOTIFY_EMAIL,
      subject: `Nuova prenotazione — ${name}`,
      html: renderTemplate("email-notification", templateVars),
    });

    return NextResponse.json({ success: true, bookingId: data.id, meetLink });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      {
        error:
          "Si è verificato un problema di connessione. Non ti preoccupare, contattami direttamente su Whatsapp al numero +39 3751458896.",
        detail: err.message,
      },
      { status: 500 },
    );
  }
}
