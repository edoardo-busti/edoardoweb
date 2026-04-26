'use client'

import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Calendar, Video, Phone, User } from 'lucide-react'

export default function StepConfirm({ booking }) {
  const { type, date, slot, name, email, phone } = booking

  const dateLabel = date
    ? format(date, 'EEEE d MMMM yyyy', { locale: it })
    : '—'

  const rows = [
    {
      icon: Calendar,
      label: 'Data e orario',
      value: `${dateLabel} · ${slot}`,
    },
    {
      icon: type === 'meet' ? Video : Phone,
      label: 'Tipo chiamata',
      value: type === 'meet' ? 'Google Meet' : 'Telefono',
    },
    {
      icon: User,
      label: 'Partecipante',
      value: name,
    },
  ]

  return (
    <div>
      <p className="bm-section-label">riepilogo prenotazione</p>

      <div className="bm-summary-block">
        <p className="bm-summary-section-title">dettagli</p>
        <div className="bm-summary-grid">
          <span className="bm-summary-key">Data</span>
          <span className="bm-summary-val">{dateLabel}</span>
          <span className="bm-summary-key">Orario</span>
          <span className="bm-summary-val">{slot}</span>
          <span className="bm-summary-key">Tipo</span>
          <span className="bm-summary-val">{type === 'meet' ? 'Google Meet' : 'Telefono'}</span>
        </div>
      </div>

      <div className="bm-summary-block">
        <p className="bm-summary-section-title">partecipante</p>
        <div className="bm-summary-grid">
          <span className="bm-summary-key">Nome</span>
          <span className="bm-summary-val">{name}</span>
          <span className="bm-summary-key">Email</span>
          <span className="bm-summary-val">{email}</span>
          {type === 'phone' && (
            <>
              <span className="bm-summary-key">Telefono</span>
              <span className="bm-summary-val">{phone}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
