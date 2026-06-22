'use client'

import { useState, useEffect } from 'react'
import type { Drill } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'
import ProgressBar from '@/components/ProgressBar'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props {
  drills: Drill[]
}

export default function DailyWorkoutTile({ drills }: Props) {
  const storageKey = `braelentless_workout_${todayISO()}`
  const [completed, setCompleted] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)

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
  const total = drills.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
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
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'uppercase',
            color: allDone ? '#22c55e' : '#f57e44',
            letterSpacing: '0.08em',
          }}
        >
          {allDone ? 'WORKOUT COMPLETE ✓' : "TODAY'S WORKOUT"}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            {doneCount} / {total} DONE
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: '#6b5a50',
            }}
          >
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Progress bar always visible */}
      <ProgressBar pct={pct} height={5} />

      {/* Expanded drill list */}
      {expanded && (
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {drills.map((drill) => {
            const done = completed.includes(drill.id)
            return (
              <div
                key={drill.id}
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
                  onClick={() => toggle(drill.id)}
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
                {/* Drill info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#ffffff',
                      textDecoration: done ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {drill.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      color: '#6b5a50',
                      marginTop: 1,
                    }}
                  >
                    {drill.duration}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
