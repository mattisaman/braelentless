'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadData, saveData } from '@/lib/storage'

// localStorage + Supabase key for the saved goal scenario (persists edits)
const PENT_GOAL_KEY = 'pentGoal'

/* ============================================================
   GIRLS HIGH SCHOOL PENTATHLON — World Athletics scoring tables
   These are the official combined-events coefficients used by
   meet-management software (Hy-Tek / DirectAthletics) to score
   US high school girls pentathlons.

   Points = floor( A * (B - P)^C )   for running events (P = time, s)
   Points = floor( A * (P - B)^C )   for field events
     - jumps: P in centimetres
     - throws: P in metres

   Standard outdoor girls pentathlon order:
     100m Hurdles · High Jump · Shot Put · Long Jump · 800m
   ============================================================ */

type Kind = 'run' | 'jump' | 'throw'

interface EventDef {
  key: string
  label: string
  short: string
  kind: Kind
  A: number
  B: number
  C: number
  // input value is in: run = seconds, jump = metres, throw = metres
  min: number
  max: number
  step: number
  current: number // Braelyn's personal best (the baseline / reference point)
}

// Baselines below are Braelyn's verified personal bests.
// PB total scores 2,523 pts (Varsity Level) on these World Athletics tables.
const EVENTS: EventDef[] = [
  { key: '100h', label: '100m Hurdles', short: '100mH', kind: 'run', A: 9.23076, B: 26.7, C: 1.835, min: 13.0, max: 20.0, step: 0.01, current: 20.0 },
  { key: 'hj', label: 'High Jump', short: 'HJ', kind: 'jump', A: 1.84523, B: 75, C: 1.348, min: 1.2, max: 1.9, step: 0.01, current: 1.35 },
  { key: 'sp', label: 'Shot Put', short: 'SP', kind: 'throw', A: 56.0211, B: 1.5, C: 1.05, min: 5.0, max: 14.0, step: 0.01, current: 9.60 },
  { key: 'lj', label: 'Long Jump', short: 'LJ', kind: 'jump', A: 0.188807, B: 210, C: 1.41, min: 3.5, max: 6.5, step: 0.01, current: 4.86 },
  { key: '800', label: '800m', short: '800m', kind: 'run', A: 0.11193, B: 254, C: 1.88, min: 120, max: 200, step: 0.1, current: 146.6 },
]

const TIERS = [
  { pts: 4000, label: 'Elite / National', color: '#a78bfa' },
  { pts: 3600, label: 'D1 Scholarship', color: '#f57e44' },
  { pts: 3200, label: 'D1 Recruit Target', color: '#fbbf24' },
  { pts: 2800, label: 'D2 / D3 Competitive', color: '#22c55e' },
  { pts: 2400, label: 'Varsity Level', color: '#60a5fa' },
]

// Official scoring — floor of the power formula.
function score(ev: EventDef, value: number): number {
  let p = 0
  if (ev.kind === 'run') {
    p = ev.A * Math.pow(Math.max(0, ev.B - value), ev.C)
  } else if (ev.kind === 'jump') {
    p = ev.A * Math.pow(Math.max(0, value * 100 - ev.B), ev.C) // metres → cm
  } else {
    p = ev.A * Math.pow(Math.max(0, value - ev.B), ev.C) // metres
  }
  return Math.max(0, Math.floor(p))
}

// metres → feet'inches"
function mToFtIn(m: number): string {
  const totalIn = m * 39.3701
  const ft = Math.floor(totalIn / 12)
  const inches = Math.round(totalIn - ft * 12)
  if (inches === 12) return `${ft + 1}'0"`
  return `${ft}'${inches}"`
}

// seconds → m:ss.t
function secToClock(s: number): string {
  const m = Math.floor(s / 60)
  const rem = s - m * 60
  return `${m}:${rem.toFixed(1).padStart(4, '0')}`
}

// Friendly readout under each input
function readout(ev: EventDef, v: number): string {
  if (ev.key === '800') return secToClock(v)
  if (ev.kind === 'run') return `${v.toFixed(2)}s`
  return `${v.toFixed(2)}m  ·  ${mToFtIn(v)}`
}

// Parse a typed string into the metric input value for the event.
// Accepts: seconds "14.2"; clock "2:28"; metres "1.63"; feet-inches "5-4" / 5'4"
function parseInput(ev: EventDef, raw: string): number | null {
  const s = raw.trim()
  if (s === '') return null
  // clock for 800
  if (ev.key === '800' && s.includes(':')) {
    const [m, sec] = s.split(':')
    const mm = parseFloat(m), ss = parseFloat(sec)
    if (isNaN(mm) || isNaN(ss)) return null
    return mm * 60 + ss
  }
  // feet-inches for field events
  if (ev.kind !== 'run' && /[-']/.test(s)) {
    const m = s.match(/(\d+(?:\.\d+)?)\s*['\-]\s*(\d+(?:\.\d+)?)/)
    if (m) {
      const ft = parseFloat(m[1]), inch = parseFloat(m[2])
      return (ft * 12 + inch) * 0.0254
    }
  }
  const n = parseFloat(s)
  return isNaN(n) ? null : n
}

export default function PentPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(EVENTS.map((e) => [e.key, e.current]))
  )
  // Raw text mirrors so typing feels natural even with partial input
  const [text, setText] = useState<Record<string, string>>(
    Object.fromEntries(EVENTS.map((e) => [e.key, e.key === '800' ? secToClock(e.current) : e.kind === 'run' ? e.current.toFixed(2) : e.current.toFixed(2)]))
  )
  const [showCompare, setShowCompare] = useState(true)

  // Hydrate any saved goal scenario after mount (avoids SSR mismatch).
  useEffect(() => {
    const saved = loadData<Record<string, number> | null>(PENT_GOAL_KEY, null)
    if (saved && typeof saved === 'object') {
      setValues((prev) => ({ ...prev, ...saved }))
      setText(
        Object.fromEntries(
          EVENTS.map((e) => {
            const v = saved[e.key] ?? e.current
            return [e.key, e.key === '800' ? secToClock(v) : v.toFixed(2)]
          })
        )
      )
    }
  }, [])

  const persist = (vals: Record<string, number>) => saveData(PENT_GOAL_KEY, vals)

  const eventPoints = EVENTS.map((e) => ({
    ev: e,
    value: values[e.key],
    pts: score(e, values[e.key]),
    basePts: score(e, e.current),
  }))
  const totalPoints = eventPoints.reduce((s, e) => s + e.pts, 0)
  const baseTotal = EVENTS.reduce((s, e) => s + score(e, e.current), 0)
  const totalDelta = totalPoints - baseTotal

  const tierIndex = TIERS.findIndex((t) => totalPoints >= t.pts)
  const currentTier = tierIndex >= 0 ? TIERS[tierIndex] : null
  const nextTier = tierIndex === -1 ? TIERS[TIERS.length - 1] : tierIndex > 0 ? TIERS[tierIndex - 1] : null
  const tierFloor = tierIndex >= 0 ? TIERS[tierIndex].pts : 0
  const tierPct = nextTier ? Math.min(100, Math.max(0, ((totalPoints - tierFloor) / (nextTier.pts - tierFloor)) * 100)) : 100

  function setVal(ev: EventDef, v: number) {
    const clamped = Math.min(ev.max, Math.max(ev.min, v))
    setValues((prev) => {
      const next = { ...prev, [ev.key]: clamped }
      persist(next)
      return next
    })
  }

  function onSlider(ev: EventDef, v: number) {
    setVal(ev, v)
    setText((prev) => ({ ...prev, [ev.key]: ev.key === '800' ? secToClock(v) : v.toFixed(2) }))
  }

  function onText(ev: EventDef, raw: string) {
    setText((prev) => ({ ...prev, [ev.key]: raw }))
    const parsed = parseInput(ev, raw)
    if (parsed !== null && !isNaN(parsed)) setVal(ev, parsed)
  }

  function reset() {
    const base = Object.fromEntries(EVENTS.map((e) => [e.key, e.current]))
    setValues(base)
    setText(Object.fromEntries(EVENTS.map((e) => [e.key, e.key === '800' ? secToClock(e.current) : e.current.toFixed(2)])))
    persist(base)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>
      {/* Ambient track background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'url(/track-night.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07, pointerEvents: 'none' }} />

      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, paddingTop: 24 }}>
        <Link href="/sports/track" style={{ color: '#f57e44', textDecoration: 'none', fontSize: '13px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block', marginBottom: '14px' }}>
          ‹ Track &amp; Field
        </Link>

        {/* Title + total score side-by-side on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, alignItems: 'center', marginBottom: 8 }} className="pent-top">
          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(34px, 6vw, 54px)', color: 'var(--text)', letterSpacing: '0.03em', lineHeight: 0.95 }}>
              PENTATHLON
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '13px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 6 }}>
              Girls High School · World Athletics Scoring Tables
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'var(--text-3)', marginTop: 12, maxWidth: 460, lineHeight: 1.5 }}>
              Drag a slider or type a mark for each event. Field events accept metric (<span style={{ color: 'var(--text-2)' }}>1.63</span>) or feet-inches (<span style={{ color: 'var(--text-2)' }}>5-4</span>); the 800 accepts <span style={{ color: 'var(--text-2)' }}>2:28</span> or seconds.
            </div>
          </div>

          {/* Total score card */}
          <div className="tile-card" style={{ padding: '22px 24px', textAlign: 'center', background: 'linear-gradient(160deg, rgba(245,126,68,0.10), var(--bg-2))' }}>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(56px, 9vw, 86px)', color: '#f57e44', lineHeight: 0.9, textShadow: '0 0 40px rgba(245,126,68,0.35)' }}>
              {totalPoints.toLocaleString()}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 2 }}>
              Total Points
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
              {currentTier && (
                <span style={{ display: 'inline-block', background: `${currentTier.color}22`, border: `1px solid ${currentTier.color}55`, borderRadius: '20px', padding: '4px 14px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: currentTier.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {currentTier.label}
                </span>
              )}
              {showCompare && totalDelta !== 0 && (
                <span style={{ display: 'inline-block', borderRadius: '20px', padding: '4px 12px', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '12px', background: totalDelta > 0 ? 'rgba(34,197,94,0.14)' : 'rgba(239,68,68,0.14)', color: totalDelta > 0 ? '#22c55e' : '#ef4444', border: `1px solid ${totalDelta > 0 ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                  {totalDelta > 0 ? '+' : ''}{totalDelta} vs PB
                </span>
              )}
            </div>

            {/* Progress to next tier */}
            {nextTier && totalPoints < nextTier.pts && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '11px', color: 'var(--text-4)' }}>
                    {nextTier.pts - totalPoints} pts to {nextTier.label}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#f57e44' }}>{Math.round(tierPct)}%</span>
                </div>
                <div className="prog-track" style={{ height: 6 }}><div className="prog-fill" style={{ width: `${tierPct}%`, height: '100%' }} /></div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <button onClick={reset} style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-3)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reset to PB</button>
              <button onClick={() => setShowCompare((s) => !s)} style={{ background: showCompare ? 'rgba(245,126,68,0.14)' : 'var(--input-bg)', border: `1px solid ${showCompare ? 'rgba(245,126,68,0.4)' : 'var(--input-border)'}`, color: showCompare ? '#f57e44' : 'var(--text-3)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Compare {showCompare ? 'on' : 'off'}</button>
            </div>
          </div>
        </div>

        {/* Event cards */}
        <div className="pent-events">
          {eventPoints.map(({ ev, value, pts, basePts }) => {
            const delta = pts - basePts
            const pctOfMax = ev.kind === 'run'
              ? ((ev.max - value) / (ev.max - ev.min)) * 100
              : ((value - ev.min) / (ev.max - ev.min)) * 100
            return (
              <div key={ev.key} className="tile-card" style={{ padding: '18px 18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: '17px', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ev.label}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>{readout(ev, value)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '34px', color: 'var(--text)', lineHeight: 0.9 }}>{pts}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, color: 'var(--text-5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>pts</span>
                      {showCompare && delta !== 0 && (
                        <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 11, color: delta > 0 ? '#22c55e' : '#ef4444' }}>{delta > 0 ? '+' : ''}{delta}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Text input */}
                <input
                  type="text"
                  inputMode="decimal"
                  value={text[ev.key]}
                  onChange={(e) => onText(ev, e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: 'var(--text)',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 15,
                    outline: 'none',
                    marginBottom: 12,
                  }}
                />

                {/* Slider */}
                <input
                  type="range"
                  min={ev.min}
                  max={ev.max}
                  step={ev.step}
                  value={value}
                  onChange={(e) => onSlider(ev, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#f57e44', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: 'var(--text-5)' }}>
                    {ev.kind === 'run' ? (ev.key === '800' ? secToClock(ev.max) : `${ev.max}s`) : `${ev.min}m`}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: 'var(--text-5)' }}>
                    {ev.kind === 'run' ? (ev.key === '800' ? secToClock(ev.min) : `${ev.min}s`) : `${ev.max}m`}
                  </span>
                </div>
                {/* mini progress relative to range */}
                <div className="prog-track" style={{ height: 3, marginTop: 8 }}>
                  <div className="prog-fill" style={{ width: `${Math.min(100, Math.max(0, pctOfMax))}%`, height: '100%' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Point breakdown */}
        <div className="section-header"><div className="section-header-bar" /><div className="section-header-text">Point Breakdown</div></div>
        <div className="tile-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {eventPoints.map(({ ev, pts }) => {
            const pct = (pts / Math.max(1, totalPoints)) * 100
            return (
              <div key={ev.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', width: '64px', flexShrink: 0 }}>{ev.short}</span>
                <div style={{ flex: 1, height: '8px', background: 'var(--prog-track)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #e35d2a, #f57e44)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#f57e44', width: '44px', textAlign: 'right', flexShrink: 0 }}>{pts}</span>
              </div>
            )
          })}
        </div>

        {/* Tiers */}
        <div className="section-header"><div className="section-header-bar" /><div className="section-header-text">Score Tiers</div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: 60 }}>
          {TIERS.map((tier) => {
            const reached = totalPoints >= tier.pts
            return (
              <div key={tier.pts} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: reached ? `${tier.color}14` : 'var(--bg-2)', borderRadius: '10px', border: `1px solid ${reached ? `${tier.color}44` : 'var(--border)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: reached ? tier.color : 'var(--border-2)' }} />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: reached ? 'var(--text-2)' : 'var(--text-5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{tier.label}</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: reached ? tier.color : 'var(--text-5)' }}>{tier.pts.toLocaleString()}+</span>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .pent-events {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 8px;
        }
        @media (min-width: 720px) {
          .pent-events { grid-template-columns: 1fr 1fr; gap: 16px; }
          .pent-top { grid-template-columns: 1.2fr 1fr !important; }
        }
        @media (min-width: 1100px) {
          .pent-events { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  )
}
