"use client";

import { Video, Phone } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "meet", label: "Google Meet", desc: "Link via email", Icon: Video },
  { value: "phone", label: "Telefono", desc: "Ti chiamiamo noi", Icon: Phone },
];

export default function StepForm({ booking, onChange }) {
  return (
    <div>
      <p className="bm-section-label">i tuoi dati</p>

      <div className="bm-form-row">
        <label className="bm-form-label" htmlFor="bm-name">
          Nome e cognome
        </label>
        <input
          id="bm-name"
          className="bm-form-input"
          type="text"
          placeholder="Mario Rossi"
          value={booking.name}
          onChange={(e) => onChange({ name: e.target.value })}
          autoComplete="name"
        />
      </div>

      <div className="bm-form-row">
        <label className="bm-form-label" htmlFor="bm-email">
          Email
        </label>
        <input
          id="bm-email"
          className="bm-form-input"
          type="email"
          placeholder="mario@example.com"
          value={booking.email}
          onChange={(e) => onChange({ email: e.target.value })}
          autoComplete="email"
        />
      </div>

      <div className="bm-form-row">
        <label className="bm-form-label">Tipo di chiamata</label>
        <div className="bm-type-options">
          {TYPE_OPTIONS.map(({ value, label, desc, Icon }) => (
            <button
              key={value}
              type="button"
              className={`bm-type-option${booking.type === value ? " bm-type-option--selected" : ""}`}
              onClick={() => onChange({ type: value, phone: "" })}
            >
              <span className="bm-type-option-dot" />
              <Icon size={14} strokeWidth={1.5} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {booking.type === "phone" && (
        <div className="bm-form-row">
          <label className="bm-form-label" htmlFor="bm-phone">
            Numero di telefono
          </label>
          <input
            id="bm-phone"
            className="bm-form-input"
            type="tel"
            placeholder="+39 340 000 0000"
            value={booking.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            autoComplete="tel"
          />
        </div>
      )}

      <div className="bm-consents">
        <label className="bm-consent-row">
          <input
            type="checkbox"
            className="bm-checkbox"
            checked={booking.privacyAccepted ?? false}
            onChange={(e) => onChange({ privacyAccepted: e.target.checked })}
          />
          <span className="bm-consent-text">
            Ho letto e accetto la{" "}
            <a
              href="https://www.iubenda.com/privacy-policy/41659310"
              target="_blank"
              rel="noopener noreferrer"
              className="bm-consent-link"
            >
              Privacy Policy
            </a>{" "}
            <span className="bm-consent-required">*</span>
          </span>
        </label>
      </div>
    </div>
  );
}
