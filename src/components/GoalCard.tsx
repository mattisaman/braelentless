import type { Goal } from '@/lib/types'
import ProgressBar from './ProgressBar'

interface GoalCardProps {
  goal: Goal
  color?: string
}

export default function GoalCard({ goal, color = '#f57e44' }: GoalCardProps) {
  const { current, target, lowerBetter } = goal

  const displayPct = lowerBetter
    ? current <= target
      ? 100
      : Math.max(0, 100 - ((current - target) / target) * 100)
    : target === 0
      ? 0
      : Math.min(100, (current / target) * 100)

  const complete = displayPct >= 100

  return (
    <div className="tile-card" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <span
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '17px',
              color: 'var(--text-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {goal.label}
          </span>
          {lowerBetter && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '10px', color: 'var(--text-4)', marginLeft: 8 }}>
              lower is better
            </span>
          )}
        </div>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: complete ? '#f57e44' : color,
            background: complete ? 'rgba(245,126,68,0.14)' : `${color}1f`,
            border: `1px solid ${complete ? 'rgba(245,126,68,0.4)' : `${color}44`}`,
            borderRadius: 999,
            padding: '2px 10px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {Math.round(displayPct)}%
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
        <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 36, color: 'var(--text)', lineHeight: 0.9 }}>
          {goal.current}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: 'var(--text-4)' }}>
          / {goal.target} {goal.unit}
        </span>
      </div>

      <ProgressBar pct={displayPct} height={6} color={complete ? '#f57e44' : color} />
    </div>
  )
}
