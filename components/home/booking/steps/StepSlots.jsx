"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function StepSlots({ date, value, onChange }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const res = await fetch(`/api/slots?date=${dateStr}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error ?? "Errore nel caricamento");

        setSlots(data.slots);
      } catch (err) {
        setError("Impossibile caricare gli slot. Riprova.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  if (!date) return null;

  const dateLabel = format(date, "EEEE d MMMM", { locale: it });

  return (
    <div>
      <p className="bm-section-label">{dateLabel}</p>

      {loading && (
        <div className="bm-slots-loading">
          <span className="bm-spinner" />
          <span>Verifica disponibilità...</span>
        </div>
      )}

      {error && <p className="bm-slots-error">{error}</p>}

      {!loading && !error && slots.length === 0 && (
        <p className="bm-slots-empty">
          Nessuno slot disponibile per questo giorno.
        </p>
      )}

      {!loading && !error && slots.length > 0 && (
        <div className="bm-slots-grid">
          {slots.map((slot) => (
            <button
              key={slot}
              className={`bm-slot${value === slot ? " bm-slot--selected" : ""}`}
              onClick={() => onChange(slot)}
              aria-pressed={value === slot}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
