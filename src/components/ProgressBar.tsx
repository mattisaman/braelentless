interface ProgressBarProps {
  pct: number // 0–100
  height?: number
  showLabel?: boolean
}

export default function ProgressBar({ pct, height = 6, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: '#f57e44',
            textAlign: 'right',
            marginBottom: '4px',
          }}
        >
          {Math.round(clamped)}%
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          background: 'var(--border)',
          borderRadius: `${height}px`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #e35d2a, #f57e44)',
            borderRadius: `${height}px`,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
