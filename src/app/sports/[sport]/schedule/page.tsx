'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { SPORTS_DATA, DEFAULT_SCHEDULE } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import ScheduleCard from '@/components/ScheduleCard'
import type { ScheduleEvent, SportKey } from '@/lib/types'

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

  const inputStyle = {
    width: '100%',
    background: '#1a1008',
    border: '1px solid #2a1f18',
    borderRadius: '6px',
    padding: '10px 12px',
    color: '#e8dcd4',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '13px',
    outline: 'none',
  }

  const labelStyle = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: '11px',
    color: '#6b5a50',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px 16px 0', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href={`/sports/${sportKey}`} style={{ color: '#f57e44', textDecoration: 'none', fontSize: '20px' }}>
            ‹
          </Link>
          <div>
            <div
              style={{ fontFamily: "'Anton', sans-serif", fontSize: '24px', color: '#ffffff', lineHeight: 1, letterSpacing: '0.04em' }}
            >
              SCHEDULE
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {sportData?.name ?? sportKey}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e1410', marginTop: '12px' }}>
        {[
          { label: 'Overview', href: `/sports/${sportKey}` },
          { label: 'Stats', href: `/sports/${sportKey}/stats` },
          { label: 'Schedule', href: `/sports/${sportKey}/schedule` },
          { label: 'Goals', href: `/sports/${sportKey}/goals` },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              padding: '12px 4px',
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: tab.label === 'Schedule' ? '#f57e44' : '#4a3a30',
              borderBottom: tab.label === 'Schedule' ? '2px solid #f57e44' : '2px solid transparent',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Add event button */}
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            width: '100%',
            padding: '12px',
            background: showForm ? '#1e1410' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
            border: 'none',
            borderRadius: '8px',
            color: showForm ? '#f57e44' : '#fff',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Event'}
        </button>

        {/* Add event form */}
        {showForm && (
          <div
            style={{
              background: '#0f0b08',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #2a1f18',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                padding: '12px',
                background: form.opponent && form.date ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : '#1e1410',
                border: 'none',
                borderRadius: '8px',
                color: form.opponent && form.date ? '#fff' : '#4a3a30',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: form.opponent && form.date ? 'pointer' : 'default',
              }}
            >
              Add to Schedule
            </button>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>
              Upcoming ({upcoming.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {upcoming.map((ev) => (
                <ScheduleCard key={ev.id} event={ev} isUpcoming={true} />
              ))}
            </div>
          </>
        )}

        {/* Past */}
        {past.length > 0 && (
          <>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: '#4a3a30', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>
              Past Events
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...past].reverse().map((ev) => (
                <ScheduleCard key={ev.id} event={ev} isUpcoming={false} />
              ))}
            </div>
          </>
        )}

        {events.length === 0 && (
          <div style={{ textAlign: 'center', color: '#4a3a30', fontFamily: "'Barlow', sans-serif", fontSize: '13px', padding: '32px 0' }}>
            No events yet. Add one above.
          </div>
        )}
      </div>
    </div>
  )
}
