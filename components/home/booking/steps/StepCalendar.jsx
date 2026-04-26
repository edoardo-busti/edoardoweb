"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isBefore,
  isToday,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfDay,
} from "date-fns";
import { it } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_NAMES = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const dowIndex = (date) => (getDay(date) + 6) % 7;

const isWeekend = (date) => {
  const d = getDay(date);
  return d === 0 || d === 6;
};

export default function StepCalendar({ value, onChange }) {
  const [viewDate, setViewDate] = useState(new Date());

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = dowIndex(monthStart);
  const today = startOfDay(new Date());

  // oggi è disabilitato — solo giorni futuri
  const isNotBookable = (d) => isBefore(startOfDay(d), today) || isToday(d);
  const isAvailable = (d) => !isNotBookable(d) && !isWeekend(d);

  // non si può tornare al mese corrente o precedenti
  const isCurrentMonth = isSameMonth(viewDate, today);

  return (
    <div>
      <div className="bm-cal-header">
        <button
          className="bm-cal-nav"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          disabled={isCurrentMonth}
          aria-label="Mese precedente"
          style={{
            opacity: isCurrentMonth ? 0.25 : 1,
            pointerEvents: isCurrentMonth ? "none" : "auto",
          }}
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>
        <span className="bm-cal-month">
          {format(viewDate, "MMMM yyyy", { locale: it })}
        </span>
        <button
          className="bm-cal-nav"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          aria-label="Mese successivo"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="bm-cal-grid">
        {DAY_NAMES.map((d) => (
          <div key={d} className="bm-cal-dn">
            {d}
          </div>
        ))}

        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const available = isAvailable(day);
          const selected = value && isSameDay(day, value);
          const todayDay = isToday(day);
          const notBookable = isNotBookable(day);

          return (
            <button
              key={day.toISOString()}
              className={[
                "bm-cal-day",
                notBookable && !todayDay ? "bm-cal-day--past" : "",
                todayDay ? "bm-cal-day--today" : "",
                available ? "bm-cal-day--available" : "",
                selected ? "bm-cal-day--selected" : "",
              ].join(" ")}
              onClick={() => available && onChange(day)}
              disabled={!available}
              aria-pressed={selected}
              aria-label={format(day, "dd MMMM yyyy", { locale: it })}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
