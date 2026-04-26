import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const cancelToken = searchParams.get("token");

  if (!cancelToken) {
    return NextResponse.json({ error: "Token mancante" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("name, email, date, slot, type, status, cancel_token")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Prenotazione non trovata" },
      { status: 404 },
    );
  }

  if (data.status === "cancelled") {
    return NextResponse.json(
      { error: "Questa prenotazione è già stata cancellata." },
      { status: 400 },
    );
  }

  if (data.cancel_token !== cancelToken) {
    return NextResponse.json({ error: "Token non valido" }, { status: 403 });
  }

  const { cancel_token, ...safeData } = data;
  return NextResponse.json(safeData);
}
