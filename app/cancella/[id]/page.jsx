"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function CancelPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const cancelToken = searchParams.get("token");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!cancelToken) {
      setMessage("Link di cancellazione non valido.");
      setStatus("error");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/booking/${id}?token=${cancelToken}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setBooking(data);
      } catch (err) {
        setMessage(err.message);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, cancelToken]);

  const handleCancel = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id, cancelToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore nella cancellazione");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  const card = {
    width: "100%",
    maxWidth: "420px",
    background: "#141414",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "40px 32px",
    fontFamily: "system-ui, sans-serif",
  };

  const label = {
    margin: "0 0 4px",
    fontSize: "10px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.28)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  const value = {
    margin: "0",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
  };

  const row = {
    paddingBottom: "14px",
    marginBottom: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  };

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "#ff0000",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div style={card}>
        {status === "idle" && booking && (
          <>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "1px solid rgba(255,0,0,0.3)",
                background: "rgba(255,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff0000"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </div>

            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Cancella prenotazione
            </h1>
            <p
              style={{
                margin: "0 0 28px",
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              Stai per cancellare la seguente prenotazione.
            </p>

            <div
              style={{
                background: "#1c1c1c",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "20px 24px",
                marginBottom: "24px",
              }}
            >
              <div style={row}>
                <p style={label}>Partecipante</p>
                <p style={value}>{booking.name}</p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {booking.email}
                </p>
              </div>
              <div style={row}>
                <p style={label}>Data e orario</p>
                <p style={value}>
                  {new Date(
                    `${booking.date}T${booking.slot}:00`,
                  ).toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {booking.slot}
                </p>
              </div>
              <div>
                <p style={label}>Tipo di chiamata</p>
                <p style={value}>
                  {booking.type === "meet" ? "Google Meet" : "Telefono"}
                </p>
              </div>
            </div>

            <button
              onClick={handleCancel}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "#ff0000",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Conferma cancellazione
            </button>
          </>
        )}

        {status === "loading" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.1)",
                borderTopColor: "#ff0000",
                animation: "spin 0.7s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Cancellazione in corso...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === "success" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Prenotazione cancellata
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: "1.6",
              }}
            >
              Riceverai una conferma via email.
            </p>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign: "center" }}>
            <p
              style={{ margin: "0 0 16px", fontSize: "14px", color: "#ff0000" }}
            >
              {message}
            </p>
            {message !== "Link di cancellazione non valido." &&
              message !== "Token non valido" && (
                <button
                  onClick={() => setStatus("idle")}
                  style={{
                    padding: "10px 24px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Riprova
                </button>
              )}
          </div>
        )}
      </div>
    </main>
  );
}
