'use client'

import { useState, useEffect } from 'react'
import type { DailyMealEntry } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const DAILY_CAL_GOAL = 2400

const MEAL_EMOJIS: Record<string, string> = {
  Breakfast: '🌅',
  Lunch: '⚡',
  Dinner: '🔥',
  Snack: '🍎',
}

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
  const totalConsumed = meals
    .filter((m) => completed.includes(m.id))
    .reduce((sum, m) => sum + m.calories, 0)
  const calPct = Math.min(100, (totalConsumed / DAILY_CAL_GOAL) * 100)

  return (
    <div className="tile-card">
      {/* Header */}
      <div className="tile-header">
        <span className="tile-header-label">TODAY&apos;S FUEL</span>
        <span className="tile-badge tile-badge-green">{doneCount}/{total} MEALS</span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {/* Meal rows */}
        <div>
          {meals.map((meal) => {
            const done = completed.includes(meal.id)
            const emoji = MEAL_EMOJIS[meal.label] ?? '🍽️'
            return (
              <div
                key={meal.id}
                className={'checklist-row' + (done ? ' row-done' : '')}
              >
                {/* Circle checkbox */}
                <div
                  className={'check-circle' + (done ? ' done-green' : '')}
                  onClick={() => toggle(meal.id)}
                >
                  {done && <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>✓</span>}
                </div>

                {/* Emoji */}
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{emoji}</span>

                {/* Label + description */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                  }}>
                    {meal.label}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '12px',
                    color: '#6b5a50',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {meal.description}
                  </div>
                </div>

                {/* Calorie pill */}
                <div style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '8px',
                  padding: '2px 8px',
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#22c55e' }}>
                    {meal.calories}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Calorie total */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              color: '#6b5a50',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>
              CALORIES
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#f57e44', fontWeight: 700 }}>
              {totalConsumed} / {DAILY_CAL_GOAL} cal
            </span>
          </div>
          <div className="prog-track">
            <div className="prog-fill prog-fill-green" style={{ width: `${calPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
