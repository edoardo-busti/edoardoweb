import { NextResponse } from 'next/server'
import { getBusySlots } from '@/lib/google-calendar'

// Slot disponibili per giorno della settimana
// 0=Dom, 1=Lun, 2=Mar, 3=Mer, 4=Gio, 5=Ven, 6=Sab
const SLOTS_BY_DOW = {
  1: ['09:00','09:30','10:00','10:30','11:00','14:00','15:00','16:00'],
  2: ['10:00','10:30','14:00','14:30','16:00','16:30'],
  3: ['09:00','09:30','11:00','15:00','15:30'],
  4: ['09:30','10:00','11:30','14:00','16:00','16:30'],
  5: ['09:00','10:30','11:00','11:30'],
}

function slotToMinutes(slot) {
  const [h, m] = slot.split(':').map(Number)
  return h * 60 + m
}

function isSlotBusy(slot, busyPeriods) {
  const slotStart = slotToMinutes(slot)
  const slotEnd   = slotStart + 30

  return busyPeriods.some(({ start, end }) => {
    const busyStart = slotToMinutes(new Date(start).toTimeString().slice(0, 5))
    const busyEnd   = slotToMinutes(new Date(end).toTimeString().slice(0, 5))
    return slotStart < busyEnd && slotEnd > busyStart
  })
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') // formato YYYY-MM-DD

  if (!date) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 })
  }

  const dow = new Date(date).getDay()
  const allSlots = SLOTS_BY_DOW[dow] ?? []

  if (allSlots.length === 0) {
    return NextResponse.json({ slots: [] })
  }

  try {
    const busyPeriods = await getBusySlots(date)
    const available = allSlots.filter(slot => !isSlotBusy(slot, busyPeriods))
    return NextResponse.json({ slots: available })
  } catch (err) {
    console.error('Error fetching slots:', err)
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 })
  }
}
