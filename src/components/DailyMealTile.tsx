'use client'

import { useState, useEffect } from 'react'
import type { DailyMealEntry } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'
import ProgressBar from '@/components/ProgressBar'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const DAILY_CAL_GOAL = 2400

interface Props {
  meals: DailyMealEntry[]
}

export default function DailyMealTile({ meals }: Props) {
  const storageKey = `braelentless_meals_${todayISO()}`
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
  const total = meals.length
  const totalCal = meals.reduce((sum, m) => sum + m.calories, 0)
  const consumedCal = meals
    .filter((m) => completed.includes(m.id))
    .reduce((sum, m) => sum + m.calories, 0)
  const calPct = Math.round((consumedCal / DAILY_CAL_GOAL) * 100)

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
          TODAY&apos;S FUEL
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
          {doneCount} / {total} MEALS
        </span>
      </div>

      <div style={{ padding: '4px 16px 16px' }}>
        {/* Meal rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {meals.map((meal, idx) => {
            const done = completed.includes(meal.id)
            const isLast = idx === meals.length - 1
            return (
              <div
                key={meal.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  opacity: done ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                  padding: '11px 0',
                  borderBottom: isLast ? 'none' : '1px solid #1a1008',
                }}
              >
                {/* Checkbox */}
                <div
                  onClick={() => toggle(meal.id)}
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
                    marginTop: 2,
                  }}
                >
                  {done && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                </div>

                {/* Label + calories + description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#ffffff',
                        textDecoration: done ? 'line-through' : 'none',
                      }}
                    >
                      {meal.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        color: '#f57e44',
                        background: '#f57e4415',
                        borderRadius: 8,
                        padding: '1px 6px',
                        flexShrink: 0,
                      }}
                    >
                      {meal.calories} cal
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 12,
                      color: '#6b5a50',
                      marginTop: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {meal.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Calorie progress bar */}
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                color: '#6b5a50',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              CALORIES
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#f57e44',
                fontWeight: 700,
              }}
            >
              {consumedCal} / {DAILY_CAL_GOAL} cal
            </span>
          </div>
          <ProgressBar pct={calPct} height={6} />
        </div>
      </div>
    </div>
  )
}
