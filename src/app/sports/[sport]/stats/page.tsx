'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SPORTS_DATA } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import type { StatEntry, SportKey } from '@/lib/types'

export default function StatsEntryPage({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport: sportKey } = use(params)
  const sportData = SPORTS_DATA.find((s) => s.key === sportKey)
  if (!sportData) notFound()

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

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: '20px 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '4px',
        }}
      >
        <Link
          href={`/sports/${sportKey}`}
          style={{
            color: '#f57e44',
            textDecoration: 'none',
            fontSize: '20px',
            lineHeight: 1,
          }}
        >
          ‹
        </Link>
        <div>
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '24px',
              color: '#ffffff',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            EDIT STATS
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 500,
              fontSize: '12px',
              color: '#6b5a50',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {sportData.name} · {sportData.position}
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #1e1410',
          background: '#0a0706',
          marginTop: '12px',
        }}
      >
        {[
          { label: 'Overview', href: `/sports/${sportKey}` },
          { label: 'Stats', href: `/sports/${sportKey}/stats` },
          { label: 'Schedule', href: `/sports/${sportKey}/schedule` },
          { label: 'Goals', href: `/sports/${sportKey}/goals` },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              padding: '12px 4px',
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: tab.label === 'Stats' ? '#f57e44' : '#4a3a30',
              borderBottom: tab.label === 'Stats' ? '2px solid #f57e44' : '2px solid transparent',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: '#6b5a50',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '14px',
          }}
        >
          Current Season Stats
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#0f0b08',
                borderRadius: '8px',
                padding: '14px 16px',
                border: '1px solid #1e1410',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <label
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#8a6a58',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {stat.label}
                {stat.unit && (
                  <span style={{ color: '#4a3a30', fontSize: '11px', marginLeft: '4px' }}>
                    ({stat.unit})
                  </span>
                )}
              </label>
              <input
                type="text"
                value={stat.value}
                onChange={(e) => handleChange(i, e.target.value)}
                style={{
                  width: '90px',
                  background: '#1a1008',
                  border: '1px solid #2a1f18',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#f57e44',
                  fontFamily: "'Teko', sans-serif",
                  fontWeight: 600,
                  fontSize: '20px',
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
            padding: '14px',
            background: saved
              ? '#1e3a1e'
              : 'linear-gradient(135deg, #e35d2a, #f57e44)',
            border: 'none',
            borderRadius: '8px',
            color: saved ? '#4ade80' : '#fff',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {saved ? 'Saved!' : 'Save Stats'}
        </button>

        {/* Current values display */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: '#6b5a50',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '24px 0 10px',
          }}
        >
          Stat Summary
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: '#1a1008',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #1a1008',
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#0f0b08',
                padding: '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontFamily: "'Teko', sans-serif",
                  fontWeight: 600,
                  fontSize: '26px',
                  color: '#f57e44',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: '9px',
                  color: '#6b5a50',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  textAlign: 'center',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
