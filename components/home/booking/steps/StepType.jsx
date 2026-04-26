"use client";

import { Video, Phone } from "lucide-react";

const OPTIONS = [
  {
    value: "meet",
    label: "Google Meet",
    desc: "Link via email",
    Icon: Video,
  },
  {
    value: "phone",
    label: "Telefono",
    desc: "Ti chiamo io",
    Icon: Phone,
  },
];

export default function StepType({ value, onChange }) {
  return (
    <div>
      <p className="bm-section-label">tipo di chiamata</p>
      <div className="bm-type-grid">
        {OPTIONS.map(({ value: v, label, desc, Icon }) => (
          <button
            key={v}
            className={`bm-type-card${value === v ? " bm-type-card--selected" : ""}`}
            onClick={() => onChange(v)}
          >
            <div className="bm-type-icon">
              <Icon size={14} strokeWidth={1.5} />
            </div>
            <p className="bm-type-name">{label}</p>
            <p className="bm-type-desc">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
