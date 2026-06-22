'use client'

import { useState } from 'react'
import type { ScheduleEvent } from '@/lib/types'

interface CalendarGridProps {
  events: ScheduleEvent[]
}

const SPORT_COLORS: Record<string, string> = {
  soccer: '#4ade80',
  basketball: '#f57e44',
  track: '#60a5fa',
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CalendarGrid({ events }: CalendarGridProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Build event map: { 'YYYY-MM-DD': ScheduleEvent[] }
  const eventMap: Record<string, ScheduleEvent[]> = {}
  for (const ev of events) {
    if (!eventMap[ev.date]) eventMap[ev.date] = []
    eventMap[ev.date].push(ev)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelectedDate(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelectedDate(null)
  }

  function formatDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const selectedEvents = selectedDate ? (eventMap[selectedDate] ?? []) : []

  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'var(--border)',
            border: 'none',
            color: '#f57e44',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>
        <div
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--text-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {MONTHS[viewMonth]} {viewYear}
        </div>
        <button
          onClick={nextMonth}
          style={{
            background: 'var(--border)',
            border: 'none',
            color: '#f57e44',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {DAYS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '10px',
              color: 'var(--text-5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 0',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {/* Empty cells for first day offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ height: '44px' }} />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateKey = formatDateKey(viewYear, viewMonth, day)
          const dayEvents = eventMap[dateKey] ?? []
          const isToday = dateKey === todayKey
          const isSelected = dateKey === selectedDate
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              style={{
                height: '44px',
                borderRadius: '8px',
                border: isSelected
                  ? '1px solid #f57e44'
                  : isToday
                  ? '1px solid #f57e4466'
                  : '1px solid transparent',
                background: isSelected ? '#f57e4422' : isToday ? 'var(--surface)' : 'var(--bg-2)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
            >
              <span
                style={{
                  fontFamily: "'Teko', sans-serif",
                  fontWeight: 500,
                  fontSize: '16px',
                  color: isSelected ? '#f57e44' : isToday ? '#f57e44' : 'var(--text-2)',
                  lineHeight: 1,
                }}
              >
                {day}
              </span>
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div style={{ display: 'flex', gap: '2px' }}>
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: SPORT_COLORS[ev.sport] ?? '#f57e44',
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day events */}
      {selectedDate && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              color: 'var(--text-4)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '10px',
            }}
          >
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {selectedEvents.length === 0 ? (
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '13px',
                color: 'var(--text-5)',
                textAlign: 'center',
                padding: '16px',
              }}
            >
              No events on this day
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedEvents.map((ev) => {
                const color = SPORT_COLORS[ev.sport] ?? '#f57e44'
                return (
                  <div
                    key={ev.id}
                    style={{
                      background: 'var(--bg-2)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      border: `1px solid ${color}44`,
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "'Saira Condensed', sans-serif",
                          fontWeight: 700,
                          fontSize: '14px',
                          color: 'var(--text-2)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {ev.opponent}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: '12px',
                          color: 'var(--text-4)',
                        }}
                      >
                        {ev.time} · {ev.location}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '9px',
                        color,
                        background: color + '22',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {ev.sport}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
        }}
      >
        {(['soccer', 'basketball', 'track'] as const).map((sport) => (
          <div
            key={sport}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: SPORT_COLORS[sport],
              }}
            />
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: '10px',
                color: 'var(--text-4)',
                textTransform: 'capitalize',
              }}
            >
              {sport}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
