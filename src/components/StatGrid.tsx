import type { StatEntry } from '@/lib/types'

interface StatGridProps {
  stats: StatEntry[]
}

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: '#1a1008',
        border: '1px solid #1a1008',
        borderRadius: '8px',
        overflow: 'hidden',
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
              fontSize: '28px',
              color: '#f57e44',
              lineHeight: 1,
            }}
          >
            {stat.value}
            {stat.unit && (
              <span style={{ fontSize: '14px', color: '#b87a55', marginLeft: '1px' }}>
                {stat.unit}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: '10px',
              color: '#8a6a58',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
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
