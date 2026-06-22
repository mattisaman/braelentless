'use client'

import { useState } from 'react'
import { DEFAULT_HABITS, DEFAULT_DRILLS } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import type { HabitEntry, Drill } from '@/lib/types'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#4ade80',
  basketball: '#f57e44',
  track: '#60a5fa',
  general: '#a78bfa',
}

export default function TrainPage() {
  const [habits, setHabits] = useState<HabitEntry[]>(() =>
    loadData<HabitEntry[]>('braelentless_habits', DEFAULT_HABITS)
  )
  const [drills] = useState<Drill[]>(() =>
    loadData<Drill[]>('braelentless_drills', DEFAULT_DRILLS)
  )
  const [filter, setFilter] = useState<string>('all')
  const [tab, setTab] = useState<'habits' | 'drills'>('habits')

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

  const filteredDrills = filter === 'all' ? drills : drills.filter((d) => d.sport === filter)

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '32px', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1 }}>
          TRAIN
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
          Habits & Drill Library
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e1410', margin: '16px 0 0' }}>
        {(['habits', 'drills'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'none',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px',
              textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
              color: tab === t ? '#f57e44' : '#4a3a30',
              borderBottom: tab === t ? '2px solid #f57e44' : '2px solid transparent',
            }}
          >
            {t === 'habits' ? 'Daily Habits' : 'Drill Library'}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 16px' }}>
        {tab === 'habits' && (
          <>
            {/* Daily progress */}
            <div style={{ background: '#0f0b08', borderRadius: '10px', padding: '16px', border: '1px solid #1e1410', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#8a6a58', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Today&apos;s Progress
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#f57e44' }}>
                  {completedCount}/{habits.length}
                </span>
              </div>
              <div style={{ height: '8px', background: '#1e1410', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${completionPct}%`, height: '100%', background: 'linear-gradient(90deg, #e35d2a, #f57e44)', borderRadius: '8px', transition: 'width 0.3s ease' }} />
              </div>
              {completionPct === 100 && (
                <div style={{ marginTop: '10px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: '13px', color: '#f57e44' }}>
                  All habits complete. Relentless.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  style={{
                    background: habit.completedToday ? '#0d1a0d' : '#0f0b08',
                    border: `1px solid ${habit.completedToday ? '#4ade8044' : '#1e1410'}`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: `2px solid ${habit.completedToday ? '#4ade80' : '#2a1f18'}`,
                      background: habit.completedToday ? '#4ade80' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    {habit.completedToday && (
                      <span style={{ color: '#0a0706', fontSize: '12px', fontWeight: 700 }}>✓</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '13px', color: habit.completedToday ? '#e8dcd4' : '#8a6a58' }}>
                      {habit.label}
                    </div>
                  </div>
                  {/* Streak */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '14px' }}>🔥</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#f57e44', fontWeight: 700 }}>
                      {habit.streak}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'drills' && (
          <>
            {/* Sport filter */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {(['all', 'basketball', 'soccer', 'track', 'general'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: `1px solid ${filter === f ? (SPORT_COLORS[f] ?? '#f57e44') : '#1e1410'}`,
                    background: filter === f ? (SPORT_COLORS[f] ?? '#f57e44') + '22' : '#0f0b08',
                    color: filter === f ? (SPORT_COLORS[f] ?? '#f57e44') : '#4a3a30',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredDrills.map((drill) => {
                const color = SPORT_COLORS[drill.sport] ?? '#f57e44'
                return (
                  <div
                    key={drill.id}
                    style={{ background: '#0f0b08', borderRadius: '10px', padding: '14px 16px', border: '1px solid #1e1410' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'flex-start' }}>
                      <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '16px', color: '#e8dcd4', textTransform: 'uppercase', letterSpacing: '0.04em', flex: 1, paddingRight: '8px' }}>
                        {drill.title}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color, background: color + '22', padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {drill.sport}
                        </span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#4a3a30', background: '#1e1410', padding: '2px 7px', borderRadius: '4px' }}>
                          {drill.duration}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: '#6b5a50', lineHeight: 1.5 }}>
                      {drill.description}
                    </div>
                  </div>
                )
              })}
              {filteredDrills.length === 0 && (
                <div style={{ textAlign: 'center', color: '#4a3a30', fontSize: '13px', padding: '32px 0' }}>
                  No drills found for this filter.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
