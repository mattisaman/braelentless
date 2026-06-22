'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SPORTS_DATA } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import StatGrid from '@/components/StatGrid'
import type { StatEntry } from '@/lib/types'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#22c55e',
  basketball: '#f57e44',
  track: '#60a5fa',
}

const SUB_TABS = ['Overview', 'Stats', 'Schedule', 'Goals'] as const

export default function StatsEntryPage({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport: sportKey } = use(params)
  const sportData = SPORTS_DATA.find((s) => s.key === sportKey)
  if (!sportData) notFound()

  const color = SPORT_COLORS[sportKey] ?? '#f57e44'
  const STORAGE_KEY = `braelentless_stats_${sportKey}`

  const [stats, setStats] = useState<StatEntry[]>(() =>
    loadData<StatEntry[]>(STORAGE_KEY, sportData.stats)
  )
  const [saved, setSaved] = useState(false)

  function handleChange(index: number, value: string) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, value } : s)))
    setSaved(false)
  }

  function handleSave() {
    saveData(STORAGE_KEY, stats)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const hrefFor = (label: string) =>
    label === 'Overview' ? `/sports/${sportKey}` : `/sports/${sportKey}/${label.toLowerCase()}`

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 56 }}>
      <div className="dashboard-content" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href={`/sports/${sportKey}`} style={{ color: color, textDecoration: 'none', fontSize: 26, lineHeight: 1 }}>‹</Link>
          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text)', letterSpacing: '0.03em', lineHeight: 1 }}>
              EDIT STATS
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 4 }}>
              {sportData.name} · {sportData.position}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ borderBottom: '1px solid var(--border)', marginTop: 16 }}>
        <div className="dashboard-content" style={{ display: 'flex', maxWidth: 640 }}>
          {SUB_TABS.map((label) => {
            const isActive = label === 'Stats'
            return (
              <Link key={label} href={hrefFor(label)} style={{
                flex: 1, padding: '14px 4px', textAlign: 'center', textDecoration: 'none',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: isActive ? '#f57e44' : 'var(--text-4)',
                borderBottom: isActive ? '2px solid #f57e44' : '2px solid transparent',
              }}>
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="dashboard-content" style={{ paddingTop: 24 }}>
        {/* Live summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14 }}>
          <div style={{ width: 4, height: 24, background: 'linear-gradient(180deg, #f57e44, #e35d2a)', borderRadius: 2, boxShadow: '0 0 12px rgba(245,126,68,0.5)' }} />
          <div className="lead-head">Live Summary</div>
        </div>
        <StatGrid stats={stats} color={color} />

        {/* Edit form */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '30px 0 14px' }}>
          <div style={{ width: 4, height: 24, background: 'linear-gradient(180deg, #f57e44, #e35d2a)', borderRadius: 2, boxShadow: '0 0 12px rgba(245,126,68,0.5)' }} />
          <div className="lead-head">Update Values</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
          {stats.map((stat, i) => (
            <div key={i} className="tile-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, minWidth: 0 }}>
                {stat.label}
                {stat.unit && <span style={{ color: 'var(--text-5)', fontSize: 11, marginLeft: 4 }}>({stat.unit})</span>}
              </label>
              <input
                type="text"
                value={stat.value}
                onChange={(e) => handleChange(i, e.target.value)}
                style={{
                  width: 96,
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  color: color,
                  fontFamily: "'Teko', sans-serif",
                  fontWeight: 700,
                  fontSize: 24,
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: 16,
            background: saved ? '#1e3a1e' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
            border: 'none',
            borderRadius: 10,
            color: saved ? '#4ade80' : '#fff',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {saved ? '✓ Saved!' : 'Save Stats'}
        </button>
      </div>
    </div>
  )
}
