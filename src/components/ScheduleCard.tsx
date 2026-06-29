import type { ScheduleEvent } from '@/lib/types'

interface ScheduleCardProps {
  event: ScheduleEvent
  isUpcoming: boolean
}

const SPORT_COLORS: Record<string, string> = {
  soccer: '#a8b0ba',
  basketball: '#f57e44',
  track: '#a8b0ba',
}

const TYPE_LABELS: Record<string, string> = {
  game: 'GAME',
  tournament: 'TOURNAMENT',
  practice: 'PRACTICE',
  meet: 'MEET',
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function ScheduleCard({ event, isUpcoming }: ScheduleCardProps) {
  const color = SPORT_COLORS[event.sport] ?? '#f57e44'
  const d = new Date(event.date + 'T12:00:00')
  const isWin = /^w/i.test(event.result?.trim() ?? '')
  const isLoss = /^l/i.test(event.result?.trim() ?? '')

  return (
    <div
      className="tile-card"
      style={{
        padding: '16px 18px',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        opacity: isUpcoming ? 1 : 0.86,
        borderColor: isUpcoming ? `${color}3a` : undefined,
      }}
    >
      {/* Date block */}
      <div
        style={{
          minWidth: 58,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--bg-3)',
          borderRadius: 10,
          padding: '8px 6px',
          borderLeft: `3px solid ${color}`,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '10px',
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          {d.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: '30px', color: 'var(--text)', lineHeight: 1 }}>
          {d.getDate()}
        </span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {d.toLocaleDateString('en-US', { weekday: 'short' })}
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '19px',
              color: 'var(--text)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 1.05,
            }}
          >
            {event.opponent}
          </div>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '9px',
              color,
              letterSpacing: '0.12em',
              background: `${color}22`,
              border: `1px solid ${color}44`,
              padding: '3px 8px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {TYPE_LABELS[event.type] ?? event.type.toUpperCase()}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '13px',
            color: 'var(--text-3)',
            marginTop: 4,
          }}
        >
          {formatTime(event.time)} · {event.location}
        </div>
        {event.result && (
          <div
            style={{
              marginTop: 8,
              display: 'inline-block',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '12px',
              color: isWin ? '#22c55e' : isLoss ? '#ef4444' : '#f57e44',
              background: isWin ? 'rgba(34,197,94,0.12)' : isLoss ? 'rgba(239,68,68,0.12)' : 'rgba(245,126,68,0.12)',
              border: `1px solid ${isWin ? 'rgba(34,197,94,0.35)' : isLoss ? 'rgba(239,68,68,0.35)' : 'rgba(245,126,68,0.3)'}`,
              borderRadius: 6,
              padding: '2px 10px',
            }}
          >
            {event.result}
          </div>
        )}
      </div>
    </div>
  )
}
