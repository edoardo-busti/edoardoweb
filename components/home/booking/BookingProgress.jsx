'use client'

const PROGRESS_STEPS = ['calendar', 'slots', 'form']

export default function BookingProgress({ currentStep }) {
  const currentIndex = PROGRESS_STEPS.indexOf(currentStep)

  return (
    <div className="bm-progress">
      {PROGRESS_STEPS.map((step, i) => {
        const isDone   = i < currentIndex
        const isActive = i === currentIndex
        return (
          <div
            key={step}
            className={[
              'bm-progress-seg',
              isDone   ? 'bm-progress-seg--done'   : '',
              isActive ? 'bm-progress-seg--active' : '',
            ].join(' ')}
          />
        )
      })}
    </div>
  )
}
