interface ProgressBarProps {
  pct: number // 0–100
  height?: number
  showLabel?: boolean
  /** override the fill color (otherwise the orange gradient) */
  color?: string
}

export default function ProgressBar({ pct, height = 6, showLabel = false, color }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: color ?? '#f57e44',
            textAlign: 'right',
            marginBottom: '4px',
          }}
        >
          {Math.round(clamped)}%
        </div>
      )}
      <div className="prog-track" style={{ height: `${height}px`, borderRadius: height }}>
        <div
          className="prog-fill"
          style={{
            width: `${clamped}%`,
            borderRadius: height,
            ...(color ? { background: `linear-gradient(90deg, ${color}aa, ${color})` } : {}),
          }}
        />
      </div>
    </div>
  )
}
