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
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 12px',
          background: 'linear-gradient(135deg, #1a0e08 0%, #0f0b08 100%)',
          borderLeft: '3px solid #f57e44',
        }}
      >
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 13,
            textTransform: 'uppercase',
            color: '#f57e44',
            letterSpacing: '0.05em',
          }}
        >
          TODAY&apos;S HABITS
        </span>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            color: '#f57e44',
            background: '#f57e4422',
            border: '1px solid #f57e4444',
            borderRadius: 12,
            padding: '3px 10px',
          }}
        >
          {doneCount} / {total}
        </span>
      </div>

      <div style={{ padding: '4px 16px 16px' }}>
        {/* Habit rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {habits.map((habit, idx) => {
            const done = completed.includes(habit.id)
            const isLast = idx === habits.length - 1
            return (
              <div
                key={habit.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: done ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                  padding: '11px 0',
                  borderBottom: isLast ? 'none' : '1px solid #1a1008',
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

                {/* Streak pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    background: '#f57e4415',
                    borderRadius: 10,
                    padding: '2px 7px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 12 }}>🔥</span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      color: '#f57e44',
                    }}
                  >
                    {habit.streak}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* All done banner */}
        {allDone && (
          <div
            style={{
              marginTop: 14,
              background: 'linear-gradient(135deg, #22c55e22, #16a34a11)',
              border: '1px solid #22c55e44',
              borderRadius: 6,
              padding: '8px 12px',
              textAlign: 'center',
              fontFamily: "'Anton', sans-serif",
              fontSize: 13,
              textTransform: 'uppercase',
              color: '#22c55e',
              letterSpacing: '0.05em',
            }}
          >
            ALL HABITS LOCKED IN 🔥
          </div>
        )}
      </div>
    </div>
  )
}
