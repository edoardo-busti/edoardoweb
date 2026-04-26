// ─── ProgressBar ───────────────────────────────────────────────────────────────
const STEPS = ["Progetto", "Dettagli", "Dati", "Riepilogo"];

export default function ProgressBar({ step }) {
  return (
    <div className="qw-progress">
      {STEPS.map((label, i) => (
        <div key={i} className="qw-progress-item">
          <div
            className={[
              "qw-progress-dot",
              i < step ? "qw-progress-dot--done" : "",
              i === step ? "qw-progress-dot--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {i < step ? "✓" : i + 1}
          </div>
          <span
            className={`qw-progress-label${i === step ? " qw-progress-label--active" : ""}`}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`qw-progress-line${i < step ? " qw-progress-line--done" : ""}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
