'use client'

import { useState, useMemo } from 'react'
import type { ScheduleEvent, SportKey } from '@/lib/types'

interface CalendarGridProps {
  events: ScheduleEvent[]
}

const SPORT_COLORS: Record<string, string> = {
  soccer: '#a8b0ba',
  basketball: '#f57e44',
  track: '#a8b0ba',
}

const SPORT_LABEL: Record<string, string> = {
  soccer: 'Soccer',
  basketball: 'Basketball',
  track: 'Track',
}

const TYPE_LABEL: Record<ScheduleEvent['type'], string> = {
  game: 'Game',
  tournament: 'Tournament',
  practice: 'Practice',
  meet: 'Meet',
}

const TYPE_ICON: Record<ScheduleEvent['type'], string> = {
  game: '🏀',
  tournament: '🏆',
  practice: '🔁',
  meet: '🏁',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function colorFor(sport: SportKey | string) {
  return SPORT_COLORS[sport] ?? '#f57e44'
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatTime(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h)) return time
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function CalendarGrid({ events }: CalendarGridProps) {
  const today = new Date()
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  // Build event map: { 'YYYY-MM-DD': ScheduleEvent[] }
  const eventMap = useMemo(() => {
    const map: Record<string, ScheduleEvent[]> = {}
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.time.localeCompare(b.time))
    }
    return map
  }, [events])

  // Default the visible month to the month of the next upcoming event so events
  // are visible immediately (events live in July 2026). Fall back to today.
  const initial = useMemo(() => {
    const upcoming = [...events]
      .filter((e) => e.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date))[0]
    const seed = upcoming
      ? new Date(upcoming.date + 'T12:00:00')
      : (events.length > 0
        ? new Date([...events].sort((a, b) => b.date.localeCompare(a.date))[0].date + 'T12:00:00')
        : today)
    return { year: seed.getFullYear(), month: seed.getMonth() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [viewYear, setViewYear] = useState(initial.year)
  const [viewMonth, setViewMonth] = useState(initial.month)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Count of events in the visible month
  const monthEventCount = useMemo(() => {
    let n = 0
    for (let d = 1; d <= daysInMonth; d++) {
      n += (eventMap[formatDateKey(viewYear, viewMonth, d)] ?? []).length
    }
    return n
  }, [eventMap, viewYear, viewMonth, daysInMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
    setSelectedDate(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
    setSelectedDate(null)
  }
  function jumpToday() {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setSelectedDate(todayKey)
  }

  const selectedEvents = selectedDate ? (eventMap[selectedDate] ?? []) : []

  const navBtn: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border-2)',
    color: '#f57e44',
    width: 38,
    height: 38,
    borderRadius: 10,
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.18s, background 0.18s',
  }

  return (
    <div>
      {/* Month navigation bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            style={navBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(245,126,68,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-2)' }}
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            style={navBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(245,126,68,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-2)' }}
          >
            ›
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(22px, 3vw, 30px)', color: 'var(--text)', letterSpacing: '0.03em', lineHeight: 1 }}>
              {MONTHS[viewMonth]} <span style={{ color: '#f57e44' }}>{viewYear}</span>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>
              {monthEventCount === 0 ? 'No events this month' : `${monthEventCount} event${monthEventCount === 1 ? '' : 's'} scheduled`}
            </div>
          </div>
        </div>
        <button
          onClick={jumpToday}
          style={{
            background: 'rgba(245,126,68,0.12)',
            border: '1px solid rgba(245,126,68,0.4)',
            color: '#f57e44',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            transition: 'background 0.18s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,126,68,0.22)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,126,68,0.12)' }}
        >
          Today
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
        {DAYS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              color: 'var(--text-5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '2px 0',
            }}
          >
            <span className="hide-mobile">{d}</span>
            <span className="show-mobile">{DAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {/* Empty leading cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="cal-cell cal-cell-empty" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateKey = formatDateKey(viewYear, viewMonth, day)
          const dayEvents = eventMap[dateKey] ?? []
          const isToday = dateKey === todayKey
          const isSelected = dateKey === selectedDate
          const accentColor = dayEvents.length > 0 ? colorFor(dayEvents[0].sport) : undefined

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className="cal-cell"
              style={{
                border: isSelected
                  ? '1.5px solid #f57e44'
                  : isToday
                    ? '1.5px solid rgba(245,126,68,0.55)'
                    : '1px solid var(--tile-border)',
                background: isSelected
                  ? 'rgba(245,126,68,0.10)'
                  : isToday
                    ? 'var(--surface)'
                    : 'var(--bg-2)',
                boxShadow: isSelected ? '0 0 0 3px rgba(245,126,68,0.12)' : undefined,
              }}
            >
              {/* Date number row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span
                  style={{
                    fontFamily: "'Teko', sans-serif",
                    fontWeight: 600,
                    fontSize: 17,
                    lineHeight: 1,
                    color: isToday || isSelected ? '#f57e44' : 'var(--text-2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 20,
                    height: 20,
                    borderRadius: isToday ? 6 : 0,
                    background: isToday ? 'rgba(245,126,68,0.16)' : 'transparent',
                    padding: isToday ? '0 4px' : 0,
                  }}
                >
                  {day}
                </span>
                {accentColor && (
                  <span className="hide-mobile" style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-5)' }}>
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event chips (desktop) */}
              <div className="cal-chips hide-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 5, width: '100%' }}>
                {dayEvents.slice(0, 3).map((ev) => {
                  const c = colorFor(ev.sport)
                  return (
                    <div
                      key={ev.id}
                      title={`${TYPE_LABEL[ev.type]} · ${ev.opponent} · ${formatTime(ev.time)}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: `${c}1f`,
                        borderLeft: `2px solid ${c}`,
                        borderRadius: 4,
                        padding: '2px 5px',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c, flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 600,
                          fontSize: 10.5,
                          color: 'var(--text-2)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ev.opponent}
                      </span>
                    </div>
                  )
                })}
                {dayEvents.length > 3 && (
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 9.5, color: 'var(--text-5)', letterSpacing: '0.06em', paddingLeft: 2 }}>
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>

              {/* Event dots (mobile) */}
              {dayEvents.length > 0 && (
                <div className="show-mobile" style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {dayEvents.slice(0, 4).map((ev, idx) => (
                    <span key={idx} style={{ width: 5, height: 5, borderRadius: '50%', background: colorFor(ev.sport) }} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div
          style={{
            marginTop: 18,
            background: 'var(--bg-2)',
            border: '1px solid var(--tile-border)',
            borderRadius: 14,
            padding: '16px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              aria-label="Close"
              style={{ background: 'none', border: 'none', color: 'var(--text-4)', fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          {selectedEvents.length === 0 ? (
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-5)', padding: '12px 0' }}>
              No events on this day. A rest day is part of the plan.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedEvents.map((ev) => (
                <EventRow key={ev.id} ev={ev} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 18,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid var(--border)',
        }}
      >
        {(['soccer', 'basketball', 'track'] as const).map((sport) => (
          <div key={sport} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: SPORT_COLORS[sport], boxShadow: `0 0 8px ${SPORT_COLORS[sport]}66` }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {SPORT_LABEL[sport]}
            </span>
          </div>
        ))}
      </div>

      {/* Component-scoped styles for cells + responsive helpers */}
      <style jsx>{`
        .cal-cell {
          min-height: 96px;
          border-radius: 10px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
        }
        .cal-cell:hover {
          border-color: rgba(245, 126, 68, 0.45) !important;
          transform: translateY(-1px);
        }
        .cal-cell-empty {
          border: 1px dashed var(--border) !important;
          background: transparent !important;
          opacity: 0.35;
          cursor: default;
          min-height: 96px;
        }
        .cal-cell-empty:hover {
          transform: none;
          border-color: var(--border) !important;
        }
        .show-mobile { display: none; }
        @media (max-width: 640px) {
          .cal-cell { min-height: 58px; padding: 5px; align-items: center; }
          .cal-cell-empty { min-height: 58px; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

function EventRow({ ev }: { ev: ScheduleEvent }) {
  const c = colorFor(ev.sport)
  const isWin = ev.result?.trim().toUpperCase().startsWith('W')
  const isLoss = ev.result?.trim().toUpperCase().startsWith('L')
  const resultColor = isWin ? '#22c55e' : isLoss ? '#ef4444' : 'var(--text-3)'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: `1px solid ${c}40`,
        borderLeft: `3px solid ${c}`,
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 9,
          background: `${c}1f`,
          border: `1px solid ${c}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 17,
        }}
      >
        {TYPE_ICON[ev.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {ev.opponent}
          </span>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 9,
              color: c,
              background: `${c}22`,
              padding: '2px 7px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {TYPE_LABEL[ev.type]}
          </span>
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'var(--text-4)', marginTop: 3 }}>
          {formatTime(ev.time)}{ev.location ? ` · ${ev.location}` : ''}
        </div>
      </div>
      {ev.result && ev.result.trim() && (
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 13,
            color: resultColor,
            flexShrink: 0,
            textAlign: 'right',
          }}
        >
          {ev.result}
        </div>
      )}
    </div>
  )
}
