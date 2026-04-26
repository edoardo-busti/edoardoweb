import { useState } from "react";

// ─── CustomSelect ──────────────────────────────────────────────────────────────
export default function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((o) => o.id === value || o.value === value)?.label ?? null;

  return (
    <div
      className={[
        "qw-select-wrapper",
        disabled ? "qw-select-wrapper--disabled" : "",
        open ? "qw-select-wrapper--open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      tabIndex="0"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="qw-select-trigger input-field"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedLabel ? "" : "qw-select-placeholder"}>
          {selectedLabel ?? placeholder}
        </span>
        <span
          className={`qw-select-arrow${open ? " qw-select-arrow--open" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="qw-select-dropdown" role="listbox">
          {options.map((opt) => {
            const optValue = opt.id ?? opt.value ?? opt;
            const optLabel = opt.label ?? opt;
            const optDescription = opt.description ?? null;
            const isSelected = value === optValue;
            return (
              <li
                key={optValue}
                role="option"
                aria-selected={isSelected}
                className={[
                  "qw-select-option",
                  isSelected ? "qw-select-option--selected" : "",
                  optDescription ? "qw-select-option--described" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseDown={() => {
                  onChange(optValue);
                  setOpen(false);
                }}
              >
                {optLabel}
                {optDescription && (
                  <span className="qw-select-option-desc">
                    {optDescription}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
