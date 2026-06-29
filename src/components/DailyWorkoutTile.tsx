'use client'

import { useState, useEffect } from 'react'
import type { Drill } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const SPORT_COLORS: Record<string, string> = {
  basketball: '#f57e44',
  soccer: '#a8b0ba',
  track: '#a8b0ba',
  general: '#a78bfa',
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
  const allDone = doneCount === total && total > 0
  const pct = total > 0 ? (doneCount / total) * 100 : 0

  return (
    <div className="tile-card tile-workout">
      {/* Header */}
      <div className="tile-header" onClick={() => setExpanded((v) => !v)}>
        <span className="tile-header-label">
          TODAY&apos;S WORKOUT
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="tile-badge">
            {doneCount}/{total} DONE
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'var(--text-4)' }}>
            {expanded ? '▴' : '▾'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {/* Progress bar */}
        <div className="prog-track">
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* All done banner */}
        {allDone && (
          <div style={{
            marginTop: '12px',
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
            WORKOUT COMPLETE ✓
          </div>
        )}

        {/* Drill list */}
        {expanded && (
          <div style={{ marginTop: '4px' }}>
            {drills.map((drill) => {
              const done = completed.includes(drill.id)
              const sportColor = SPORT_COLORS[drill.sport] ?? '#a78bfa'
              return (
                <div
                  key={drill.id}
                  className={'checklist-row' + (done ? ' row-done' : '')}
                >
                  {/* Circle checkbox */}
                  <div
                    className={'check-circle' + (done ? ' done' : '')}
                    onClick={() => toggle(drill.id)}
                  >
                    {done && <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>✓</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{
                      fontFamily: "'Saira Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '14px',
                      color: 'var(--text)',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {drill.title}
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-4)' }}>
                      {drill.duration}
                    </div>
                  </div>

                  {/* Sport badge */}
                  {drill.sport && (
                    <div style={{
                      background: `${sportColor}18`,
                      border: `1px solid ${sportColor}44`,
                      borderRadius: '10px',
                      padding: '3px 8px',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '9px',
                        color: sportColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}>
                        {drill.sport}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
