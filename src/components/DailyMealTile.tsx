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
          TODAY&apos;S FUEL
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
          {doneCount} / {total} MEALS
        </span>
      </div>

      {/* Meal rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {meals.map((meal) => {
          const done = completed.includes(meal.id)
          return (
            <div
              key={meal.id}
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
                }}
              >
                {done && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
              </div>

              {/* Label + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#ffffff',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {meal.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 12,
                    color: '#6b5a50',
                    marginTop: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {meal.description}
                </div>
              </div>

              {/* Calories */}
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: '#f57e44',
                  flexShrink: 0,
                }}
              >
                {meal.calories}
              </span>
            </div>
          )
        })}
      </div>

      {/* Calorie progress bar */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
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
            }}
          >
            {consumedCal} / {DAILY_CAL_GOAL} cal
          </span>
        </div>
        <ProgressBar pct={calPct} height={5} />
      </div>
    </div>
  )
}
