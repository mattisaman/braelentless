'use client'

import { useState, useEffect } from 'react'
import type { HabitEntry } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props {
  habits: HabitEntry[]
}

export default function DailyHabitList({ habits }: Props) {
  const storageKey = `braelentless_habits_${todayISO()}`
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => {
    setCompleted(loadData<string[]>(storageKey, []))
  }, [storageKey])

  function toggle(id: string) {
    const next = completed.includes(id)
      ? completed.filter((x) => x !== id)
      : [...completed, id]
    setCompleted(next)
    saveData(storageKey, next)
  }

  const doneCount = completed.length
  const total = habits.length
  const allDone = doneCount === total && total > 0

  return (
    <div className="tile-card">
      {/* Header */}
      <div className="tile-header" style={{ cursor: 'default' }}>
        <span className="tile-header-label">TODAY&apos;S HABITS</span>
        <span className="tile-badge">{doneCount}/{total}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {/* All done banner */}
        {allDone && (
          <div style={{
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #22c55e22, #16a34a11)',
            border: '1px solid #22c55e44',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            color: '#22c55e',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            ALL HABITS LOCKED IN 🔥
          </div>
        )}

        {/* Habit rows */}
        <div>
          {habits.map((habit) => {
            const done = completed.includes(habit.id)
            return (
              <div
                key={habit.id}
                className={'checklist-row' + (done ? ' row-done' : '')}
              >
                {/* Circle checkbox */}
                <div
                  className={'check-circle' + (done ? ' done' : '')}
                  onClick={() => toggle(habit.id)}
                >
                  {done && <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>✓</span>}
                </div>

                {/* Label */}
                <div style={{
                  flex: 1,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: done ? '#6b5a50' : '#e8dcd4',
                }}>
                  {habit.label}
                </div>

                {/* Streak pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(245,126,68,0.1)',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '11px' }}>🔥</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#f57e44' }}>
                    {habit.streak}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
