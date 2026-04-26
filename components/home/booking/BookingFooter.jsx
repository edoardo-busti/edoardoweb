'use client'

export default function BookingFooter({ stepIndex, canProceed, onBack, onNext, isConfirm, submitting }) {
  return (
    <div className="bm-footer">
      {stepIndex > 0 && (
        <button className="bm-btn bm-btn--back" onClick={onBack} disabled={submitting}>
          ← Indietro
        </button>
      )}
      <button
        className="bm-btn bm-btn--next"
        onClick={onNext}
        disabled={!canProceed || submitting}
      >
        {submitting ? 'Conferma in corso...' : isConfirm ? 'Conferma prenotazione →' : 'Continua →'}
      </button>
    </div>
  )
}
