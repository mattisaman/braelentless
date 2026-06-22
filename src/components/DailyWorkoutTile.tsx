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
  const [expanded, setExpanded] = useState(true)

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
        overflow: 'hidden',
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
            color: allDone ? '#22c55e' : '#f57e44',
            letterSpacing: '0.05em',
          }}
        >
          {allDone ? 'WORKOUT COMPLETE ✓' : "TODAY'S WORKOUT"}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

      <div style={{ padding: '12px 16px 16px' }}>
        {/* Progress bar always visible */}
        <ProgressBar pct={pct} height={5} />

        {/* Expanded drill list */}
        {expanded && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            {drills.map((drill, idx) => {
              const done = completed.includes(drill.id)
              const isLast = idx === drills.length - 1
              return (
                <div
                  key={drill.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    opacity: done ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                    padding: '12px 0',
                    borderBottom: isLast ? 'none' : '1px solid #1a1008',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          fontSize: 15,
                          color: '#ffffff',
                          textDecoration: done ? 'line-through' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {drill.title}
                      </div>
                      {drill.sport && (
                        <span
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 700,
                            fontSize: 9,
                            color: '#f57e44',
                            background: '#f57e4415',
                            border: '1px solid #f57e4430',
                            borderRadius: 8,
                            padding: '1px 6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            flexShrink: 0,
                          }}
                        >
                          {drill.sport}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: '#8a6a58',
                        marginTop: 3,
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
    </div>
  )
}
