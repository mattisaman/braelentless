'use client'

import { useState } from 'react'
import { DEFAULT_HABITS, DEFAULT_DRILLS } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import type { HabitEntry, Drill } from '@/lib/types'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#22c55e',
  basketball: '#f57e44',
  track: '#60a5fa',
  general: '#a78bfa',
}

const SPORT_LABELS: Record<string, string> = {
  all: 'All',
  basketball: 'Basketball',
  soccer: 'Soccer',
  track: 'Track',
  general: 'General',
}

// Weekly training emphasis — one focus per day, motivating + concrete
const WEEK_FOCUS: { day: string; short: string; focus: string; sport: string }[] = [
  { day: 'Monday', short: 'MON', focus: 'Lower-body strength + plyometrics', sport: 'track' },
  { day: 'Tuesday', short: 'TUE', focus: 'Shooting volume — 200 makes', sport: 'basketball' },
  { day: 'Wednesday', short: 'WED', focus: 'Speed & agility · ball mastery', sport: 'soccer' },
  { day: 'Thursday', short: 'THU', focus: 'Upper-body strength + core', sport: 'basketball' },
  { day: 'Friday', short: 'FRI', focus: 'Event work — hurdles & jumps', sport: 'track' },
  { day: 'Saturday', short: 'SAT', focus: 'Game / scrimmage · compete', sport: 'basketball' },
  { day: 'Sunday', short: 'SUN', focus: 'Mobility · film · active recovery', sport: 'general' },
]

// Strength / skill focus blocks for the current cycle
const FOCUS_BLOCKS: { label: string; detail: string; sport: string; tag: string }[] = [
  { label: 'Explosive First Step', detail: 'Trap-bar deadlift, box jumps, sled pushes. Build the burst that beats defenders.', sport: 'basketball', tag: 'Power' },
  { label: 'Single-Leg Stability', detail: 'Bulgarian splits, step-ups, balance holds. Bulletproof the landing leg for jumps.', sport: 'track', tag: 'Strength' },
  { label: 'Left-Hand Finishing', detail: 'Off-hand layups, euro steps, floaters. Become unguardable going either way.', sport: 'basketball', tag: 'Skill' },
  { label: 'First-Touch Control', detail: 'Wall passes, juggling, receiving under pressure. Kill the ball dead, every time.', sport: 'soccer', tag: 'Skill' },
]

export default function TrainPage() {
  const [habits, setHabits] = useState<HabitEntry[]>(() =>
    loadData<HabitEntry[]>('braelentless_habits', DEFAULT_HABITS)
  )
  const [drills] = useState<Drill[]>(() =>
    loadData<Drill[]>('braelentless_drills', DEFAULT_DRILLS)
  )
  const [filter, setFilter] = useState<string>('all')

  function toggleHabit(id: string) {
    const updated = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            completedToday: !h.completedToday,
            streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1),
          }
        : h
    )
    setHabits(updated)
    saveData('braelentless_habits', updated)
  }

  const completedCount = habits.filter((h) => h.completedToday).length
  const completionPct = habits.length > 0 ? (completedCount / habits.length) * 100 : 0
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.streak), 0)
  const totalStreakDays = habits.reduce((s, h) => s + h.streak, 0)

  const filteredDrills = filter === 'all' ? drills : drills.filter((d) => d.sport === filter)
  const filterOptions = ['all', 'basketball', 'soccer', 'track', 'general'] as const

  const todayShort = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '48px', position: 'relative' }}>
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

      {/* ── HERO ── */}
      <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div
          className="animate-kenburns"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage: 'url(/track-night.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,7,6,0.42) 0%, rgba(10,7,6,0.82) 60%, rgba(8,5,3,1) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f57e44 20%, #f57e44 80%, transparent)' }} />

        <div
          className="dashboard-content"
          style={{ position: 'relative', zIndex: 1, paddingTop: '54px', paddingBottom: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '230px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginBottom: 16 }}>
            <span className="countdown-pill">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f57e44', boxShadow: '0 0 8px #f57e44', display: 'inline-block' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f57e44' }}>
                Train like a champion
              </span>
            </span>
          </div>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(34px, 6.5vw, 60px)', color: '#ffffff', letterSpacing: '0.03em', lineHeight: 0.95, textShadow: '0 2px 22px rgba(0,0,0,0.9)' }}>
            TRAIN
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '13px', color: '#c8a890', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '8px' }}>
            Habits · Drill Library · Weekly Emphasis
          </div>
        </div>
      </div>

      {/* ── STATS RIBBON ── */}
      <div style={{ background: 'linear-gradient(90deg, #e35d2a, #f57e44, #e35d2a)', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="dashboard-content" style={{ display: 'flex', padding: 0 }}>
          {[
            { value: `${completedCount}/${habits.length}`, unit: 'TODAY' },
            { value: `${Math.round(completionPct)}%`, unit: 'COMPLETE' },
            { value: bestStreak, unit: 'BEST STREAK' },
            { value: drills.length, unit: 'DRILLS' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.2)' : 'none' }}>
              <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(26px, 4vw, 34px)', color: '#0a0706', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(10,7,6,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── WEEKLY EMPHASIS ── */}
        <div className="section-header">
          <div className="section-header-bar" />
          <div className="section-header-text">WEEKLY EMPHASIS</div>
        </div>
        <div className="train-week-grid">
          {WEEK_FOCUS.map((d) => {
            const color = SPORT_COLORS[d.sport] ?? '#f57e44'
            const isToday = d.short === todayShort
            return (
              <div
                key={d.short}
                className="tile-card"
                style={{
                  padding: '14px 14px 16px',
                  position: 'relative',
                  borderColor: isToday ? 'rgba(245,126,68,0.5)' : undefined,
                  boxShadow: isToday ? '0 0 0 1px rgba(245,126,68,0.25), 0 10px 32px rgba(0,0,0,0.25)' : undefined,
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 22, color: isToday ? '#f57e44' : 'var(--text-2)', lineHeight: 1, letterSpacing: '0.04em' }}>{d.short}</span>
                  {isToday && (
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 8.5, color: '#f57e44', background: 'rgba(245,126,68,0.14)', border: '1px solid rgba(245,126,68,0.35)', borderRadius: 5, padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today</span>
                  )}
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.45, minHeight: 52 }}>{d.focus}</div>
                <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: color }} />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9.5, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d.sport === 'general' ? 'Recovery' : d.sport}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── HABITS + FOCUS ── */}
        <div className="train-main-row">
          {/* Daily habits */}
          <div>
            <div className="section-header" style={{ paddingTop: 28 }}>
              <div className="section-header-bar" />
              <div className="section-header-text">DAILY HABITS</div>
            </div>

            {/* Progress card */}
            <div className="tile-card" style={{ padding: '18px 20px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Today&apos;s Progress</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 44, color: '#f57e44', lineHeight: 0.9 }}>{completedCount}</span>
                    <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 500, fontSize: 24, color: 'var(--text-4)', lineHeight: 1 }}>/ {habits.length}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 30, color: 'var(--text-2)', lineHeight: 1 }}>{totalStreakDays}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Streak Days</div>
                </div>
              </div>
              <div className="prog-track" style={{ height: 8 }}>
                <div className={completionPct === 100 ? 'prog-fill prog-fill-green' : 'prog-fill'} style={{ width: `${completionPct}%` }} />
              </div>
              {completionPct === 100 ? (
                <div style={{ marginTop: 12, textAlign: 'center', fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontWeight: 600, fontSize: 13, color: '#22c55e' }}>
                  All habits complete. Relentless.
                </div>
              ) : (
                <div style={{ marginTop: 12, textAlign: 'center', fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: 12.5, color: 'var(--text-4)' }}>
                  {habits.length - completedCount} more to lock in the day.
                </div>
              )}
            </div>

            {/* Habit list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="tile-card"
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    borderColor: habit.completedToday ? 'rgba(34,197,94,0.3)' : undefined,
                    background: habit.completedToday ? 'rgba(34,197,94,0.06)' : 'var(--bg-2)',
                  }}
                >
                  <span className={`check-circle ${habit.completedToday ? 'done-green' : ''}`} style={{ width: 24, height: 24 }}>
                    {habit.completedToday && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </span>
                  <span style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: 14, color: habit.completedToday ? 'var(--text)' : 'var(--text-2)' }}>
                    {habit.label}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <span style={{ fontSize: 15 }}>🔥</span>
                    <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 20, color: '#f57e44', lineHeight: 1 }}>{habit.streak}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Strength / skill focus */}
          <div>
            <div className="section-header" style={{ paddingTop: 28 }}>
              <div className="section-header-bar" />
              <div className="section-header-text">STRENGTH &amp; SKILL FOCUS</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FOCUS_BLOCKS.map((b) => {
                const color = SPORT_COLORS[b.sport] ?? '#f57e44'
                return (
                  <div key={b.label} className="tile-card" style={{ padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: color }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 7 }}>
                      <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.05 }}>{b.label}</div>
                      <span style={{ flexShrink: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, color, background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 5, padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{b.tag}</span>
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{b.detail}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── DRILL LIBRARY ── */}
        <div className="section-header" style={{ paddingTop: 30 }}>
          <div className="section-header-bar" />
          <div className="section-header-text">DRILL LIBRARY</div>
        </div>

        {/* Sport filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {filterOptions.map((f) => {
            const active = filter === f
            const fc = f === 'all' ? '#f57e44' : (SPORT_COLORS[f] ?? '#f57e44')
            const count = f === 'all' ? drills.length : drills.filter((d) => d.sport === f).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: `1px solid ${active ? fc : 'var(--border-2)'}`,
                  background: active ? `${fc}22` : 'var(--bg-2)',
                  color: active ? fc : 'var(--text-4)',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s',
                }}
              >
                {SPORT_LABELS[f] ?? f}
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, opacity: 0.75 }}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="train-drill-grid">
          {filteredDrills.map((drill) => {
            const color = SPORT_COLORS[drill.sport] ?? '#f57e44'
            return (
              <div key={drill.id} className="tile-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, transparent)`, flexShrink: 0 }} />
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 19, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.05 }}>{drill.title}</div>
                    <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-3)', background: 'var(--border)', borderRadius: 6, padding: '4px 8px', whiteSpace: 'nowrap' }}>
                      <span style={{ opacity: 0.7 }}>⏱</span>{drill.duration}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.55, flex: 1 }}>{drill.description}</div>
                  <div style={{ marginTop: 14, display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: color }} />
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{drill.sport}</span>
                  </div>
                </div>
              </div>
            )
          })}
          {filteredDrills.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-5)', fontFamily: "'Barlow', sans-serif", fontSize: 14, padding: '40px 0' }}>
              No drills found for this filter.
            </div>
          )}
        </div>

        {/* ── MOTIVATION BAND ── */}
        <div style={{ marginTop: 34 }}>
          <div className="quote-band">
            <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontStyle: 'italic', fontSize: 'clamp(17px, 2.4vw, 23px)', color: 'var(--text)', lineHeight: 1.45, maxWidth: 760 }}>
              The work you do when no one is watching is what shows up when everyone is.
            </div>
            <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f57e44', marginTop: 14 }}>
              — Braelentless
            </div>
          </div>
        </div>
      </div>

      {/* Layout helpers scoped to this page */}
      <style>{`
        .train-week-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 600px) { .train-week-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1100px) { .train-week-grid { grid-template-columns: repeat(7, 1fr); } }

        .train-main-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px 28px;
        }
        @media (min-width: 980px) { .train-main-row { grid-template-columns: 1.15fr 1fr; align-items: start; } }

        .train-drill-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 640px) { .train-drill-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1100px) { .train-drill-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </div>
  )
}
