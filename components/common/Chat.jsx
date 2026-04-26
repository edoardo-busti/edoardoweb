"use client";

import { useState, useEffect } from "react";

const PHONE_NUMBER = "393751458896"; // <-- Inserisci il tuo numero con prefisso internazionale

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    const text = name.trim() ? `${message.trim()}.` : `${message.trim()}.`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .wa-root {
          --wa-green: #25D366;
          --wa-green-dark: #128C7E;
          --wa-teal: #075E54;
          --wa-light: #DCF8C6;
          --wa-bg: #E5DDD5;
          --wa-panel: #ffffff;
          --wa-text: #111B21;
          --wa-muted: #667781;
          --wa-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
        }

        /* ── Floating Button ── */
        .wa-fab {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--wa-green);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
          position: relative;

        }
        .wa-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.55), 0 3px 10px rgba(0,0,0,0.18);
        }
        .wa-fab:active { transform: scale(0.95); }

        .wa-fab svg {
          transition: transform 0.3s ease, opacity 0.25s ease;
        }
        .wa-fab .wa-icon-close { position: absolute; }
        .wa-fab[data-open="true"] .wa-icon-wa { opacity: 0; transform: rotate(90deg) scale(0.5); }
        .wa-fab[data-open="true"] .wa-icon-close { opacity: 1; transform: rotate(0deg) scale(1); }
        .wa-fab[data-open="false"] .wa-icon-wa { opacity: 1; transform: rotate(0deg) scale(1); }
        .wa-fab[data-open="false"] .wa-icon-close { opacity: 0; transform: rotate(-90deg) scale(0.5); }



        /* ── Pulse ring ── */
        .wa-fab::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid var(--wa-green);
          opacity: 0;
          animation: wa-pulse 2.5s ease-out infinite;
        }
        .wa-fab[data-open="true"]::after { animation: none; opacity: 0; }

        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        /* ── Panel ── */
        .wa-panel {
          position: absolute;
          bottom: 72px;
          right: 0;
          width: 340px;
          border-radius: var(--wa-radius);
          overflow: hidden;
          box-shadow: 0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08);
          transform-origin: bottom right;
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
        }
        .wa-panel[data-visible="false"] {
          transform: scale(0.4) translateY(20px);
          opacity: 0;
          pointer-events: none;
        }
        .wa-panel[data-visible="true"] {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        /* ── Header ── */
        .wa-header {
          background: var(--wa-teal);
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wa-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--wa-green-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wa-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;          
        }

        .wa-header-info h3 {
          margin: 0;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.3;
        }
        .wa-header-info span {
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .wa-online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--wa-green);
          display: inline-block;
        }

        /* ── Chat Body ── */
        .wa-body {
          background: var(--wa-bg);
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 5 Q20 0 25 5 Q30 10 25 15 Q20 20 15 15 Q10 10 15 5Z' fill='%23c8c3b8' opacity='0.12'/%3E%3C/svg%3E");
          padding: 20px 16px;
          min-height: 100px;
        }

        /* ── Chat Bubble ── */
        .wa-bubble {
          background: var(--wa-panel);
          border-radius: 0 12px 12px 12px;
          padding: 12px 14px;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--wa-text);
          max-width: 88%;
          position: relative;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
          animation: wa-bubble-in 0.4s ease forwards;
        }
        .wa-bubble::before {
          content: '';
          position: absolute;
          top: 0;
          left: -8px;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid var(--wa-panel);
        }
        .wa-bubble-time {
          font-size: 11px;
          color: var(--wa-muted);
          text-align: right;
          margin-top: 4px;
        }
        @keyframes wa-bubble-in {
          0% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* ── Form Area ── */
        .wa-form {
          background: var(--wa-panel);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid #e9ecef;
        }
        .wa-input {
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: var(--wa-text);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background: #fafafa;
          width: 100%;
          box-sizing: border-box;
          resize: none;
        }
        .wa-input:focus {
          border-color: var(--wa-green);
          box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.12);
          background: #fff;
        }
        .wa-input::placeholder { color: #aab4bd; }

        .wa-send-btn {
          border: none;
          border-radius: 10px;
          padding: 11px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          background: var(--wa-green);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .wa-send-btn:hover { background: #20c05c; }
        .wa-send-btn:active { transform: scale(0.97); }
        .wa-send-btn:disabled {
          background: #c8c8c8;
          cursor: not-allowed;
        }

        @media (max-width: 420px) {
          .wa-root { bottom: 16px; right: 16px; }
          .wa-panel { width: calc(100vw - 32px); right: 0; }
        }
      `}</style>

      <div className="wa-root">
        {/* Panel */}
        <div className="wa-panel" data-visible={open}>
          <div className="wa-header">
            <div className="wa-avatar">
              <img
                src="/assets/images/banner/sito-web-foto-bg.png"
                alt="Assistenza"
                width={42}
                height={42}
                fill="true"
              />
            </div>
            <div className="wa-header-info">
              <h3>Edoardo</h3>
              <span>
                <span className="wa-online-dot" /> Online
              </span>
            </div>
          </div>

          <div className="wa-body">
            <div className="wa-bubble">
              Come posso aiutarti? Lasciami un messaggio e ti rispondo su
              WhatsApp.
              <div className="wa-bubble-time">
                {mounted
                  ? new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "\u00A0"}
              </div>
            </div>
          </div>

          <div className="wa-form">
            <input
              className="wa-input"
              type="text"
              placeholder="Il tuo nome (opzionale)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="wa-input"
              rows={3}
              placeholder="Scrivi un messaggio..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              className="wa-send-btn"
              disabled={!message.trim()}
              onClick={handleSend}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              Chatta su WhatsApp
            </button>
          </div>
        </div>

        {/* FAB */}
        <button
          className="wa-fab"
          data-open={open}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Chiudi chat" : "Apri chat WhatsApp"}
        >
          {/* WhatsApp icon */}
          <svg
            className="wa-icon-wa"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="#fff"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {/* Close icon */}
          <svg
            className="wa-icon-close"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#fff"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </>
  );
}
