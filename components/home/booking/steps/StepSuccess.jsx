"use client";

import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Check } from "lucide-react";

export default function StepSuccess({ booking }) {
  const { date, slot, email } = booking;

  const dateLabel = date ? format(date, "EEEE d MMMM", { locale: it }) : "";

  return (
    <div className="bm-success">
      <div className="bm-success-ring">
        <Check size={22} strokeWidth={2} />
      </div>
      <p className="bm-success-title">Prenotazione confermata</p>
      <p className="bm-success-sub">
        Ti aspetto {dateLabel} alle {slot}.
        <br />
        Riceverai una conferma a <strong>{email}</strong>.
      </p>
    </div>
  );
}
