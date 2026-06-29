import type { SportData, SportKey, SeasonStat } from '@/lib/types'

/* ── chart config per sport ───────────────────────────────────────────────── */

type MetricDef = { key: string; label: string; unit?: string; decimals?: number; compute?: (m: Record<string, number>) => number }

const CONFIG: Partial<Record<SportKey, { marquee: MetricDef; cards: MetricDef[]; table: MetricDef[] }>> = {
  basketball: {
    marquee: { key: 'ppg', label: 'Points per game', decimals: 1 },
    cards: [
      { key: 'pts', label: 'Total Points' },
      { key: 'rpg', label: 'Rebounds / game', decimals: 1 },
      { key: 'apg', label: 'Assists / game', decimals: 1 },
      { key: 'spg', label: 'Steals / game', decimals: 1 },
    ],
    table: [
      { key: 'ppg', label: 'PPG', decimals: 1 },
      { key: 'rpg', label: 'RPG', decimals: 1 },
      { key: 'apg', label: 'APG', decimals: 1 },
      { key: 'spg', label: 'SPG', decimals: 1 },
      { key: 'fg', label: 'FG%', unit: '%', decimals: 1 },
    ],
  },
  soccer: {
    marquee: { key: 'goals', label: 'Goals' },
    cards: [
      { key: 'assists', label: 'Assists' },
      { key: 'ga', label: 'Goals + Assists', compute: (m) => (m.goals ?? 0) + (m.assists ?? 0) },
    ],
    table: [
      { key: 'goals', label: 'Goals' },
      { key: 'assists', label: 'Assists' },
    ],
  },
}

const val = (s: SeasonStat, d: MetricDef): number => (d.compute ? d.compute(s.metrics) : s.metrics[d.key] ?? 0)
const fmt = (n: number, d?: MetricDef) => {
  const dec = d?.decimals ?? 0
  const v = dec ? n.toFixed(dec) : Math.round(n).toString()
  return `${v}${d?.unit ?? ''}`
}

/* ── line chart (pure SVG) ────────────────────────────────────────────────── */

function LineChart({ id, data, color, height = 240 }: { id: string; data: { x: string; sub: string; y: number }[]; color: string; height?: number }) {
  const W = 640, H = height, padX = 30, padTop = 40, padBot = 46
  const ys = data.map((d) => d.y)
  const min = Math.min(...ys), max = Math.max(...ys)
  const lo = min - (max - min) * 0.3
  const hi = max + (max - min) * 0.22
  const span = hi - lo || 1
  const innerW = W - padX * 2, innerH = H - padTop - padBot
  const px = (i: number) => padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
  const py = (v: number) => padTop + innerH - ((v - lo) / span) * innerH
  const line = data.map((d, i) => `${px(i)},${py(d.y)}`).join(' ')
  const area = `${px(0)},${padTop + innerH} ${line} ${px(data.length - 1)},${padTop + innerH}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* faint baseline */}
      <line x1={padX} y1={padTop + innerH} x2={W - padX} y2={padTop + innerH} stroke="var(--border-2)" strokeWidth="1" />
      <polygon points={area} fill={`url(#area-${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={px(i)} cy={py(d.y)} r="5.5" fill="var(--bg)" stroke={color} strokeWidth="3" />
          <text x={px(i)} y={py(d.y) - 16} textAnchor="middle" style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 26, fill: 'var(--text)' }}>
            {d.y % 1 ? d.y.toFixed(1) : d.y}
          </text>
          <text x={px(i)} y={H - 22} textAnchor="middle" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, fill: 'var(--text-2)', letterSpacing: '0.08em' }}>
            {d.x}
          </text>
          <text x={px(i)} y={H - 6} textAnchor="middle" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fill: 'var(--text-4)' }}>
            {d.sub}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 120, H = 34
  const min = Math.min(...values), max = Math.max(...values)
  const span = max - min || 1
  const px = (i: number) => (i / (values.length - 1)) * W
  const py = (v: number) => H - 4 - ((v - min) / span) * (H - 8)
  const pts = values.map((v, i) => `${px(i)},${py(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={px(values.length - 1)} cy={py(values[values.length - 1])} r="3" fill={color} />
    </svg>
  )
}

/* ── main ─────────────────────────────────────────────────────────────────── */

export default function SeasonProgression({ sport, color }: { sport: SportData; color: string }) {
  const seasons = sport.seasons
  const cfg = CONFIG[sport.key]
  if (!seasons || seasons.length < 2 || !cfg) return null

  const first = seasons[0], last = seasons[seasons.length - 1]
  const mFirst = val(first, cfg.marquee), mLast = val(last, cfg.marquee)
  const pct = mFirst ? Math.round(((mLast - mFirst) / mFirst) * 100) : 0
  const chartData = seasons.map((s) => ({ x: s.season, sub: s.year, y: val(s, cfg.marquee) }))

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0 14px' }}>
        <div style={{ width: 4, height: 18, background: '#f57e44', borderRadius: 2, boxShadow: '0 0 12px rgba(245,126,68,0.5)' }} />
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Career Progression</div>
      </div>

      {/* marquee chart card */}
      <div className="tile-card" style={{ padding: '22px 24px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color, textTransform: 'uppercase', letterSpacing: '0.16em' }}>
              {cfg.marquee.label}
            </div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(24px, 4vw, 34px)', color: 'var(--text)', lineHeight: 1.05, marginTop: 4 }}>
              {fmt(mFirst, cfg.marquee)} <span style={{ color: 'var(--text-4)' }}>→</span> {fmt(mLast, cfg.marquee)}
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${color}1f`, border: `1px solid ${color}55`, borderRadius: 999, padding: '6px 14px' }}>
            <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 22, color, lineHeight: 1 }}>{pct >= 0 ? '↑' : '↓'} {Math.abs(pct)}%</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>over {seasons.length} seasons</span>
          </div>
        </div>
        <LineChart id={sport.key} data={chartData} color={color} />
      </div>

      {/* per-metric trend cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 12 }}>
        {cfg.cards.map((d) => {
          const series = seasons.map((s) => val(s, d))
          const f = series[0], l = series[series.length - 1]
          const delta = l - f
          const up = delta >= 0
          return (
            <div key={d.key} className="tile-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{d.label}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
                <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 34, color: 'var(--text)', lineHeight: 0.9 }}>{fmt(l, d)}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: up ? color : '#fb7185', whiteSpace: 'nowrap' }}>
                  {up ? '+' : ''}{d.decimals ? delta.toFixed(d.decimals) : Math.round(delta)}
                </div>
              </div>
              <div style={{ marginTop: 8 }}><Sparkline values={series} color={color} /></div>
            </div>
          )
        })}
      </div>

      {/* season table */}
      <div className="tile-card" style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 360 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-2)' }}>
              {['Season', ...cfg.table.map((t) => t.label)].map((h, i) => (
                <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '12px 16px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...seasons].reverse().map((s, ri) => (
              <tr key={s.season} style={{ borderBottom: ri === seasons.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ textAlign: 'left', padding: '11px 16px' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{s.season}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-4)', marginLeft: 6 }}>{s.year}</span>
                </td>
                {cfg.table.map((t) => (
                  <td key={t.key} style={{ textAlign: 'right', padding: '11px 16px', fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: 19, color: 'var(--text-2)' }}>
                    {s.metrics[t.key] != null ? fmt(val(s, t), t) : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
