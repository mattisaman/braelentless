'use client'

import { useState } from 'react'
import Link from 'next/link'

// IAAF 2004 Women's Pentathlon scoring tables (simplified linear approximation)
// Real formula: Points = A × (P - B)^C (power formula)
const EVENTS = [
  {
    key: '100h',
    label: '100m Hurdles',
    unit: 's',
    defaultVal: 14.2,
    min: 12,
    max: 20,
    step: 0.1,
    lowerBetter: true,
    // A=9.23076, B=26.7, C=1.835
    calc: (t: number) => Math.round(9.23076 * Math.pow(Math.max(0, 26.7 - t), 1.835)),
  },
  {
    key: 'hj',
    label: 'High Jump',
    unit: 'm',
    defaultVal: 1.63,
    min: 1.0,
    max: 2.0,
    step: 0.01,
    lowerBetter: false,
    // A=1.84523, B=75, C=1.348 (height in cm)
    calc: (m: number) => Math.round(1.84523 * Math.pow(Math.max(0, m * 100 - 75), 1.348)),
  },
  {
    key: 'sp',
    label: 'Shot Put',
    unit: 'm',
    defaultVal: 9.79,
    min: 4,
    max: 18,
    step: 0.1,
    lowerBetter: false,
    // A=56.0211, B=1.5, C=1.05
    calc: (m: number) => Math.round(56.0211 * Math.pow(Math.max(0, m - 1.5), 1.05)),
  },
  {
    key: '200m',
    label: '200m',
    unit: 's',
    defaultVal: 25.8,
    min: 21,
    max: 32,
    step: 0.1,
    lowerBetter: true,
    // A=4.99087, B=42.5, C=1.81
    calc: (t: number) => Math.round(4.99087 * Math.pow(Math.max(0, 42.5 - t), 1.81)),
  },
  {
    key: '800m',
    label: '800m',
    unit: 's',
    defaultVal: 148,
    min: 105,
    max: 200,
    step: 1,
    lowerBetter: true,
    // A=0.11193, B=254, C=1.88
    calc: (t: number) => Math.round(0.11193 * Math.pow(Math.max(0, 254 - t), 1.88)),
  },
]

const TIER_LABELS = [
  { pts: 4200, label: 'Elite / Olympic' },
  { pts: 3800, label: 'D1 Scholarship' },
  { pts: 3400, label: 'D1 Recruit Target' },
  { pts: 3000, label: 'D2 Competitive' },
  { pts: 2600, label: 'Varsity Level' },
]

export default function PentPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(EVENTS.map((e) => [e.key, e.defaultVal]))
  )
  const [displayUnit, setDisplayUnit] = useState<Record<string, 'raw' | 'min'>>({
    '800m': 'min',
  })

  function formatDisplay(event: (typeof EVENTS)[0]) {
    const v = values[event.key]
    if (event.key === '800m') {
      const mins = Math.floor(v / 60)
      const secs = Math.round(v % 60)
      return `${mins}:${String(secs).padStart(2, '0')}`
    }
    if (event.key === 'hj') {
      const totalIn = Math.round(v * 39.3701)
      const ft = Math.floor(totalIn / 12)
      const inches = totalIn % 12
      return `${ft}'${inches}"`
    }
    return v.toFixed(event.step < 1 ? 1 : 0)
  }

  const eventPoints = EVENTS.map((e) => ({ ...e, pts: e.calc(values[e.key]) }))
  const totalPoints = eventPoints.reduce((sum, e) => sum + e.pts, 0)

  const tierIndex = TIER_LABELS.findIndex((t) => totalPoints >= t.pts)
  const currentTier = tierIndex >= 0 ? TIER_LABELS[tierIndex] : null
  const nextTier = tierIndex > 0 ? TIER_LABELS[tierIndex - 1] : TIER_LABELS[0]
  const prevTierPts = tierIndex >= 0 && tierIndex < TIER_LABELS.length - 1 ? TIER_LABELS[tierIndex + 1].pts : 0
  const tierPct = nextTier
    ? Math.min(100, ((totalPoints - prevTierPts) / (nextTier.pts - prevTierPts)) * 100)
    : 100

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(to bottom, #1a0d08, #0a0706)',
          padding: '24px 16px 20px',
        }}
      >
        <Link href="/sports/track" style={{ color: '#f57e44', textDecoration: 'none', fontSize: '13px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>
          ‹ Track & Field
        </Link>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '32px', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1 }}>
          PENTATHLON
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
          IAAF Score Calculator · Adjust sliders
        </div>

        {/* Total score */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '72px', color: '#f57e44', lineHeight: 1 }}>
            {totalPoints.toLocaleString()}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#8a6a58', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Total Points
          </div>
          {currentTier && (
            <div style={{ marginTop: '8px', display: 'inline-block', background: '#f57e4422', border: '1px solid #f57e4444', borderRadius: '20px', padding: '4px 16px' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {currentTier.label}
              </span>
            </div>
          )}
        </div>

        {/* Progress to next tier */}
        {nextTier && totalPoints < nextTier.pts && (
          <div style={{ marginTop: '16px', padding: '0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '11px', color: '#6b5a50' }}>
                {nextTier.pts - totalPoints} pts to {nextTier.label}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#f57e44' }}>
                {Math.round(tierPct)}%
              </span>
            </div>
            <div style={{ height: '4px', background: '#1e1410', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${tierPct}%`, height: '100%', background: 'linear-gradient(90deg, #e35d2a, #f57e44)', borderRadius: '4px' }} />
            </div>
          </div>
        )}
      </div>

      {/* Event sliders */}
      <div style={{ padding: '16px' }}>
        {eventPoints.map((event) => (
          <div
            key={event.key}
            style={{ background: '#0f0b08', borderRadius: '10px', padding: '16px', border: '1px solid #1e1410', marginBottom: '10px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: '#e8dcd4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {event.label}
                </div>
                <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '24px', color: '#f57e44', lineHeight: 1 }}>
                  {formatDisplay(event)}
                  <span style={{ fontSize: '14px', color: '#8a6a58', marginLeft: '4px' }}>{event.unit}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '28px', color: '#ffffff', lineHeight: 1 }}>
                  {event.pts}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '10px', color: '#4a3a30', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  pts
                </div>
              </div>
            </div>
            <input
              type="range"
              min={event.min}
              max={event.max}
              step={event.step}
              value={values[event.key]}
              onChange={(e) => setValues((v) => ({ ...v, [event.key]: parseFloat(e.target.value) }))}
              style={{
                width: '100%',
                accentColor: '#f57e44',
                height: '4px',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#2a1f18' }}>
                {event.lowerBetter ? event.max : event.min}{event.unit}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#2a1f18' }}>
                {event.lowerBetter ? event.min : event.max}{event.unit}
              </span>
            </div>
          </div>
        ))}

        {/* Event breakdown */}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '16px 0 10px' }}>
          Point Breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {eventPoints.map((e) => {
            const pct = (e.pts / Math.max(1, totalPoints)) * 100
            return (
              <div key={e.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.08em', width: '80px', flexShrink: 0 }}>
                  {e.label.replace('100m Hurdles', '100mH')}
                </span>
                <div style={{ flex: 1, height: '6px', background: '#1e1410', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #e35d2a, #f57e44)', borderRadius: '4px' }} />
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#f57e44', width: '36px', textAlign: 'right', flexShrink: 0 }}>
                  {e.pts}
                </span>
              </div>
            )
          })}
        </div>

        {/* Tier table */}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '20px 0 10px' }}>
          Score Tiers
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {TIER_LABELS.map((tier) => {
            const isCurrentOrAbove = totalPoints >= tier.pts
            return (
              <div
                key={tier.pts}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: isCurrentOrAbove ? '#f57e4411' : '#0f0b08',
                  borderRadius: '6px',
                  border: `1px solid ${isCurrentOrAbove ? '#f57e4444' : '#1e1410'}`,
                }}
              >
                <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '13px', color: isCurrentOrAbove ? '#e8dcd4' : '#4a3a30' }}>
                  {tier.label}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: isCurrentOrAbove ? '#f57e44' : '#2a1f18' }}>
                  {tier.pts.toLocaleString()}+
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
