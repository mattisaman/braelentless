'use client'

import type { StatEntry } from '@/lib/types'

interface StatGridProps {
  stats: StatEntry[]
  color?: string
}

export default function StatGrid({ stats, color = '#f57e44' }: StatGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="tile-card"
          style={{
            padding: '20px 16px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            position: 'relative',
            cursor: 'default',
          }}
        >
          {/* top accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
          />
          <div
            style={{
              fontFamily: "'Teko', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 52px)',
              color,
              lineHeight: 0.9,
              textShadow: `0 0 24px ${color}33`,
            }}
          >
            {stat.value}
            {stat.unit && (
              <span style={{ fontSize: '0.45em', color: 'var(--text-4)', marginLeft: 2 }}>
                {stat.unit}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              textAlign: 'center',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
