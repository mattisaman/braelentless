'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { SPORTS_DATA, DEFAULT_SCHEDULE } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import ScheduleCard from '@/components/ScheduleCard'
import type { ScheduleEvent, SportKey } from '@/lib/types'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#a8b0ba',
  basketball: '#f57e44',
  track: '#a8b0ba',
}

const SUB_TABS = ['Overview', 'Stats', 'Schedule', 'Goals'] as const

function getTodayKey() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

export default function SchedulePage({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport: sportKey } = use(params)
  const sportData = SPORTS_DATA.find((s) => s.key === sportKey)
  const color = SPORT_COLORS[sportKey] ?? '#f57e44'

  const STORAGE_KEY = `braelentless_schedule_${sportKey}`
  const defaultEvents = DEFAULT_SCHEDULE.filter((e) => e.sport === sportKey)

  const [events, setEvents] = useState<ScheduleEvent[]>(() =>
    loadData<ScheduleEvent[]>(STORAGE_KEY, defaultEvents)
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    opponent: '',
    date: '',
    time: '16:00',
    location: '',
    type: 'game' as ScheduleEvent['type'],
    result: '',
  })

  const todayKey = getTodayKey()

  const sorted = [...events].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const upcoming = sorted.filter((e) => e.date >= todayKey)
  const past = sorted.filter((e) => e.date < todayKey)

  function handleAdd() {
    if (!form.opponent || !form.date) return
    const newEvent: ScheduleEvent = {
      id: `sch-${Date.now()}`,
      sport: sportKey as SportKey,
      opponent: form.opponent,
      date: form.date,
      time: form.time,
      location: form.location,
      type: form.type,
      result: form.result,
    }
    const updated = [...events, newEvent]
    setEvents(updated)
    saveData(STORAGE_KEY, updated)
    setForm({ opponent: '', date: '', time: '16:00', location: '', type: 'game', result: '' })
    setShowForm(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 8,
    padding: '10px 12px',
    color: 'var(--text-2)',
    fontFamily: "'Barlow', sans-serif",
    fontSize: 14,
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: 11,
    color: 'var(--text-4)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 6,
    display: 'block',
  }

  const hrefFor = (label: string) =>
    label === 'Overview' ? `/sports/${sportKey}` : `/sports/${sportKey}/${label.toLowerCase()}`

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 56 }}>
      <div className="dashboard-content" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href={`/sports/${sportKey}`} style={{ color, textDecoration: 'none', fontSize: 26, lineHeight: 1 }}>‹</Link>
          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text)', lineHeight: 1, letterSpacing: '0.03em' }}>
              SCHEDULE
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 4 }}>
              {sportData?.name ?? sportKey}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ borderBottom: '1px solid var(--border)', marginTop: 16 }}>
        <div className="dashboard-content" style={{ display: 'flex', maxWidth: 640 }}>
          {SUB_TABS.map((label) => {
            const isActive = label === 'Schedule'
            return (
              <Link key={label} href={hrefFor(label)} style={{
                flex: 1, padding: '14px 4px', textAlign: 'center', textDecoration: 'none',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: isActive ? '#f57e44' : 'var(--text-4)',
                borderBottom: isActive ? '2px solid #f57e44' : '2px solid transparent',
              }}>
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="dashboard-content" style={{ paddingTop: 22 }}>
        {/* Add event button */}
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            width: '100%',
            padding: 13,
            background: showForm ? 'var(--bg-2)' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
            border: showForm ? '1px solid var(--border-2)' : 'none',
            borderRadius: 10,
            color: showForm ? '#f57e44' : '#fff',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            marginBottom: 18,
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Event'}
        </button>

        {/* Add event form */}
        {showForm && (
          <div className="tile-card" style={{ padding: 18, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={labelStyle}>Opponent / Event</label>
              <input
                type="text"
                value={form.opponent}
                onChange={(e) => setForm((f) => ({ ...f, opponent: e.target.value }))}
                placeholder="Letchworth, Tournament Name..."
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Home Field, Away, Venue..."
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ScheduleEvent['type'] }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="game">Game</option>
                  <option value="tournament">Tournament</option>
                  <option value="practice">Practice</option>
                  <option value="meet">Meet</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Result (optional)</label>
                <input
                  type="text"
                  value={form.result}
                  onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
                  placeholder="W 58-41"
                  style={inputStyle}
                />
              </div>
            </div>
            <button
              onClick={handleAdd}
              style={{
                padding: 13,
                background: form.opponent && form.date ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
                border: 'none',
                borderRadius: 8,
                color: form.opponent && form.date ? '#fff' : 'var(--text-5)',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                cursor: form.opponent && form.date ? 'pointer' : 'default',
              }}
            >
              Add to Schedule
            </button>
          </div>
        )}

        {/* Two-column upcoming / past on desktop */}
        <div className="schedule-cols">
          {/* Upcoming */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color, textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                Upcoming ({upcoming.length})
              </span>
            </div>
            {upcoming.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map((ev) => (
                  <ScheduleCard key={ev.id} event={ev} isUpcoming={true} />
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-4)', padding: '8px 0' }}>No upcoming events.</div>
            )}
          </div>

          {/* Past */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-5)' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                Results ({past.length})
              </span>
            </div>
            {past.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...past].reverse().map((ev) => (
                  <ScheduleCard key={ev.id} event={ev} isUpcoming={false} />
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-4)', padding: '8px 0' }}>No past events yet.</div>
            )}
          </div>
        </div>

        {events.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-5)', fontFamily: "'Barlow', sans-serif", fontSize: 14, padding: '40px 0' }}>
            No events yet. Add one above.
          </div>
        )}
      </div>

      <style>{`
        .schedule-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 900px) {
          .schedule-cols { grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
        }
      `}</style>
    </div>
  )
}
