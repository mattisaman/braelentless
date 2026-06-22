'use client'

import { useState, useMemo } from 'react'
import { DEFAULT_SCHEDULE } from '@/lib/data'
import { loadData } from '@/lib/storage'
import CalendarGrid from '@/components/CalendarGrid'
import type { ScheduleEvent, SportKey } from '@/lib/types'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#22c55e',
  basketball: '#f57e44',
  track: '#60a5fa',
}

const TYPE_LABEL: Record<ScheduleEvent['type'], string> = {
  game: 'Game',
  tournament: 'Tournament',
  practice: 'Practice',
  meet: 'Meet',
}

function formatTime(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h)) return time
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function CalendarPage() {
  // Merge default + any sport-specific stored schedules (preserves localStorage)
  const [allEvents] = useState<ScheduleEvent[]>(() => {
    const sports: SportKey[] = ['soccer', 'basketball', 'track']
    const stored: ScheduleEvent[] = []
    for (const sport of sports) {
      const sportEvents = loadData<ScheduleEvent[]>(`braelentless_schedule_${sport}`, [])
      if (sportEvents.length > 0) {
        stored.push(...sportEvents)
      } else {
        stored.push(...DEFAULT_SCHEDULE.filter((e) => e.sport === sport))
      }
    }
    const seen = new Set<string>()
    return stored.filter((e) => {
      if (seen.has(e.id)) return false
      seen.add(e.id)
      return true
    })
  })

  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const upcoming = useMemo(
    () =>
      [...allEvents]
        .filter((e) => e.date >= todayKey)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [allEvents, todayKey],
  )

  // Summary counts by sport across all events
  const counts = useMemo(() => {
    const c: Record<string, number> = { soccer: 0, basketball: 0, track: 0 }
    for (const e of allEvents) c[e.sport] = (c[e.sport] ?? 0) + 1
    return c
  }, [allEvents])

  const nextEvent = upcoming[0]
  const daysToNext = nextEvent
    ? Math.max(0, Math.ceil((new Date(nextEvent.date + 'T12:00:00').getTime() - today.getTime()) / 86400000))
    : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 48, position: 'relative' }}>
      {/* Cinematic ambient background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url(/track-night.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      />

      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, paddingTop: 28 }}>
        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <div style={{ width: 4, height: 40, background: 'linear-gradient(180deg, #f57e44, #e35d2a)', borderRadius: 2, flexShrink: 0, boxShadow: '0 0 14px rgba(245,126,68,0.5)' }} />
            <div>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--text)', letterSpacing: '0.03em', lineHeight: 0.95 }}>
                CALENDAR
              </div>
              <div className="lead-sub" style={{ marginTop: 6 }}>
                All Sports · Season Schedule
              </div>
            </div>
          </div>

          {nextEvent && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(245,126,68,0.10)',
                border: '1px solid rgba(245,126,68,0.35)',
                borderRadius: 12,
                padding: '10px 16px',
              }}
            >
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#f57e44', boxShadow: '0 0 10px #f57e44', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  {daysToNext === 0 ? 'Today' : `Next up · ${daysToNext} day${daysToNext === 1 ? '' : 's'}`}
                </div>
                <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {nextEvent.opponent}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SPORT COUNT RIBBON ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '18px 0 26px' }}>
          {(['soccer', 'basketball', 'track'] as const).map((sport) => {
            const c = SPORT_COLORS[sport]
            return (
              <div
                key={sport}
                className="tile-card"
                style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderLeft: `3px solid ${c}` }}
              >
                <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(26px, 4vw, 34px)', color: c, lineHeight: 1 }}>
                  {counts[sport] ?? 0}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {sport === 'track' ? 'Track' : sport}<br />
                  <span style={{ color: 'var(--text-5)', fontSize: 9, letterSpacing: '0.08em' }}>events</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── GRID + AGENDA ── */}
        <div className="home-row two" style={{ alignItems: 'start' }}>
          {/* Calendar grid */}
          <div className="tile-card" style={{ padding: 'clamp(16px, 2vw, 24px)' }}>
            <CalendarGrid events={allEvents} />
          </div>

          {/* Upcoming agenda */}
          <div>
            <div className="section-header" style={{ paddingTop: 0 }}>
              <div className="section-header-bar" />
              <div className="section-header-text">Upcoming</div>
            </div>

            {upcoming.length === 0 ? (
              <div className="tile-card" style={{ padding: '24px 18px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-5)' }}>
                  No upcoming events. Add events from the sport schedule pages.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map((ev) => {
                  const c = SPORT_COLORS[ev.sport] ?? '#f57e44'
                  const d = new Date(ev.date + 'T12:00:00')
                  const isWin = ev.result?.trim().toUpperCase().startsWith('W')
                  const isLoss = ev.result?.trim().toUpperCase().startsWith('L')
                  const resultColor = isWin ? '#22c55e' : isLoss ? '#ef4444' : 'var(--text-3)'
                  return (
                    <div
                      key={ev.id}
                      className="tile-card"
                      style={{ padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', borderLeft: `3px solid ${c}` }}
                    >
                      {/* Date badge */}
                      <div
                        style={{
                          minWidth: 46,
                          background: 'var(--surface)',
                          borderRadius: 8,
                          padding: '7px 4px',
                          textAlign: 'center',
                          border: '1px solid var(--border-2)',
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, color: c, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--text)', lineHeight: 1 }}>
                          {d.getDate()}
                        </div>
                      </div>

                      {/* Detail */}
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
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11.5, color: 'var(--text-4)', marginTop: 2 }}>
                          {formatTime(ev.time)} · {ev.location}
                        </div>
                      </div>

                      {ev.result && ev.result.trim() && (
                        <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 12, color: resultColor, flexShrink: 0 }}>
                          {ev.result}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
