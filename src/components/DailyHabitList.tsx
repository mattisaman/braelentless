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
    <div
      style={{
        background: '#0f0b08',
        borderRadius: 10,
        border: '1px solid #1e1410',
        padding: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'uppercase',
            color: '#f57e44',
            letterSpacing: '0.08em',
          }}
        >
          TODAY&apos;S HABITS
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: '#f57e44',
            background: '#1e1410',
            borderRadius: 4,
            padding: '2px 8px',
          }}
        >
          {doneCount} / {total}
        </span>
      </div>

      {/* Habit rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {habits.map((habit) => {
          const done = completed.includes(habit.id)
          return (
            <div
              key={habit.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: done ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Checkbox */}
              <div
                onClick={() => toggle(habit.id)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: `2px solid ${done ? '#f57e44' : '#2a1f18'}`,
                  background: done ? '#f57e44' : 'transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {done && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
              </div>

              {/* Label */}
              <div
                style={{
                  flex: 1,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#ffffff',
                  textDecoration: done ? 'line-through' : 'none',
                }}
              >
                {habit.label}
              </div>

              {/* Streak */}
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: '#6b5a50',
                  flexShrink: 0,
                }}
              >
                🔥 {habit.streak}
              </span>
            </div>
          )
        })}
      </div>

      {/* All done banner */}
      {allDone && (
        <div
          style={{
            marginTop: 14,
            background: '#f57e44',
            borderRadius: 6,
            padding: '8px 12px',
            textAlign: 'center',
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'uppercase',
            color: '#0a0706',
            letterSpacing: '0.08em',
          }}
        >
          ALL HABITS LOCKED IN 🔥
        </div>
      )}
    </div>
  )
}
