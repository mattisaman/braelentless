import type { ScheduleEvent } from '@/lib/types'

interface ScheduleCardProps {
  event: ScheduleEvent
  isUpcoming: boolean
}

const SPORT_COLORS: Record<string, string> = {
  soccer: '#4ade80',
  basketball: '#f57e44',
  track: '#60a5fa',
}

const TYPE_LABELS: Record<string, string> = {
  game: 'GAME',
  tournament: 'TOURNAMENT',
  practice: 'PRACTICE',
  meet: 'MEET',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function ScheduleCard({ event, isUpcoming }: ScheduleCardProps) {
  const color = SPORT_COLORS[event.sport] ?? '#f57e44'
  return (
    <div
      style={{
        background: 'var(--bg-2)',
        borderRadius: '8px',
        padding: '14px 16px',
        border: `1px solid ${isUpcoming ? color + '44' : 'var(--border)'}`,
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {/* Date badge */}
      <div
        style={{
          minWidth: '44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--surface)',
          borderRadius: '6px',
          padding: '6px 4px',
          border: `1px solid ${color}44`,
        }}
      >
        {(() => {
          const d = new Date(event.date + 'T12:00:00')
          return (
            <>
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '9px',
                  color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {d.toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span
                style={{
                  fontFamily: "'Teko', sans-serif",
                  fontWeight: 600,
                  fontSize: '22px',
                  color: 'var(--text-2)',
                  lineHeight: 1,
                }}
              >
                {d.getDate()}
              </span>
            </>
          )
        })()}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--text-2)',
              textTransform: 'uppercase',
            }}
          >
            {event.opponent}
          </div>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: '9px',
              color,
              letterSpacing: '0.1em',
              background: color + '22',
              padding: '2px 6px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              marginLeft: '8px',
            }}
          >
            {TYPE_LABELS[event.type] ?? event.type.toUpperCase()}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '12px',
            color: 'var(--text-3)',
            marginTop: '2px',
          }}
        >
          {formatTime(event.time)} · {event.location}
        </div>
        {event.result && (
          <div
            style={{
              marginTop: '6px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              color: '#f57e44',
            }}
          >
            {event.result}
          </div>
        )}
      </div>
    </div>
  )
}
