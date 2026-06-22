'use client'

import { useState } from 'react'
import { DEFAULT_SCHEDULE } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import CalendarGrid from '@/components/CalendarGrid'
import type { ScheduleEvent, SportKey } from '@/lib/types'

export default function CalendarPage() {
  // Merge default + any sport-specific stored schedules
  const [allEvents] = useState<ScheduleEvent[]>(() => {
    const sports: SportKey[] = ['soccer', 'basketball', 'track']
    const stored: ScheduleEvent[] = []
    for (const sport of sports) {
      const sportEvents = loadData<ScheduleEvent[]>(`braelentless_schedule_${sport}`, [])
      // If stored is non-empty, use it; otherwise fall back to defaults for that sport
      if (sportEvents.length > 0) {
        stored.push(...sportEvents)
      } else {
        stored.push(...DEFAULT_SCHEDULE.filter((e) => e.sport === sport))
      }
    }
    // Deduplicate by id
    const seen = new Set<string>()
    return stored.filter((e) => {
      if (seen.has(e.id)) return false
      seen.add(e.id)
      return true
    })
  })

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '32px',
            color: '#ffffff',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          CALENDAR
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: '12px',
            color: '#6b5a50',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: '4px',
          }}
        >
          All Sports · Events View
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <CalendarGrid events={allEvents} />

        {/* All upcoming events list */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: '#6b5a50',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '28px 0 12px',
          }}
        >
          All Upcoming Events
        </div>
        {(() => {
          const today = new Date()
          const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
          const upcoming = [...allEvents]
            .filter((e) => e.date >= todayKey)
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

          const SPORT_COLORS: Record<string, string> = {
            soccer: '#4ade80',
            basketball: '#f57e44',
            track: '#60a5fa',
          }

          if (upcoming.length === 0) {
            return (
              <div style={{ textAlign: 'center', color: '#4a3a30', fontSize: '13px', padding: '24px 0' }}>
                No upcoming events. Add events from the sport schedule pages.
              </div>
            )
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcoming.map((ev) => {
                const color = SPORT_COLORS[ev.sport] ?? '#f57e44'
                const d = new Date(ev.date + 'T12:00:00')
                const [h, m] = ev.time.split(':').map(Number)
                const ampm = h >= 12 ? 'PM' : 'AM'
                const hour = h % 12 || 12
                const timeStr = `${hour}:${String(m).padStart(2, '0')} ${ampm}`

                return (
                  <div
                    key={ev.id}
                    style={{
                      background: '#0f0b08',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      border: `1px solid ${color}44`,
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Date badge */}
                    <div
                      style={{
                        minWidth: '40px',
                        background: '#1a1008',
                        borderRadius: '6px',
                        padding: '6px 4px',
                        textAlign: 'center',
                        border: `1px solid ${color}44`,
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '8px', color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {d.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '20px', color: '#e8dcd4', lineHeight: 1 }}>
                        {d.getDate()}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#e8dcd4', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {ev.opponent}
                      </div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '11px', color: '#6b5a50' }}>
                        {timeStr} · {ev.location}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '9px',
                        color,
                        background: color + '22',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'capitalize',
                        flexShrink: 0,
                      }}
                    >
                      {ev.sport}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
