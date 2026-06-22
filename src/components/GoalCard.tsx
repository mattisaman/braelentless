import type { Goal } from '@/lib/types'
import ProgressBar from './ProgressBar'

interface GoalCardProps {
  goal: Goal
}

export default function GoalCard({ goal }: GoalCardProps) {
  const { current, target, lowerBetter } = goal
  const pct = lowerBetter
    ? target === 0 ? 100 : Math.max(0, Math.min(100, ((target - (current - target)) / target) * 100))
    : target === 0 ? 100 : Math.min(100, (current / target) * 100)

  // Simpler approach for lowerBetter: 100 when at target, 0 when way above
  const displayPct = lowerBetter
    ? current <= target
      ? 100
      : Math.max(0, 100 - ((current - target) / target) * 100)
    : target === 0 ? 0 : Math.min(100, (current / target) * 100)

  return (
    <div
      style={{
        background: '#0f0b08',
        borderRadius: '8px',
        padding: '14px 16px',
        border: '1px solid #1e1410',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
            fontSize: '13px',
            color: '#e8dcd4',
          }}
        >
          {goal.label}
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: '#f57e44',
          }}
        >
          {goal.current} / {goal.target} {goal.unit}
        </span>
      </div>
      <ProgressBar pct={displayPct} height={5} />
    </div>
  )
}
