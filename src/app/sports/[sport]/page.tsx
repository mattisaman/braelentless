import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SPORTS_DATA, DEFAULT_PRS, DEFAULT_SCHEDULE } from '@/lib/data'
import type { SportData } from '@/lib/types'
import SportHero from '@/components/SportHero'
import StatGrid from '@/components/StatGrid'
import GoalCard from '@/components/GoalCard'
import SeasonProgression from '@/components/SeasonProgression'
import JerseyUpload from '@/components/JerseyUpload'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#a8b0ba',
  basketball: '#f57e44',
  track: '#a8b0ba',
}

const SUB_TABS = ['Overview', 'Stats', 'Schedule', 'Goals'] as const

// ── Basketball performance rating (0–100) from per-game stats ──────────────────
function statVal(stats: SportData['stats'], label: string): number {
  const s = stats.find((x) => x.label === label)
  if (!s) return 0
  return typeof s.value === 'number' ? s.value : parseFloat(String(s.value)) || 0
}

function bballRating(stats: SportData['stats']): number {
  const ppg = statVal(stats, 'PPG')
  const rpg = statVal(stats, 'RPG')
  const apg = statVal(stats, 'APG')
  const spg = statVal(stats, 'SPG')
  const fgpct = statVal(stats, 'FG%') / 100
  const ftpct = statVal(stats, 'FT%') / 100
  const bpg = 0.6   // not surfaced as a tile; from season box score
  const topg = 3.2
  return Math.round(
    Math.min(ppg / 25, 1) * 30 + Math.min(apg / 8, 1) * 20 + Math.min(rpg / 12, 1) * 15 +
    Math.min(spg / 4, 1) * 15 + Math.min(fgpct / 0.5, 1) * 10 + Math.min(ftpct / 0.8, 1) * 5 +
    Math.min(bpg / 2, 1) * 3 + Math.max(0, 1 - topg / 5) * 2
  )
}

function ratingLabel(r: number): string {
  if (r >= 90) return 'D1 ELITE'
  if (r >= 80) return 'ALL-STATE'
  if (r >= 70) return 'ALL-CONFERENCE'
  if (r >= 60) return 'VARSITY STARTER'
  return 'DEVELOPING'
}

function ratingColor(r: number): string {
  if (r >= 90) return '#f59e0b'
  if (r >= 80) return '#f57e44'
  if (r >= 70) return '#fb923c'
  if (r >= 60) return '#a8b0ba'
  return '#94a3b8'
}

function SubNav({ sportKey, active }: { sportKey: string; active: string }) {
  const hrefFor = (label: string) =>
    label === 'Overview' ? `/sports/${sportKey}` : `/sports/${sportKey}/${label.toLowerCase()}`
  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div className="dashboard-content" style={{ display: 'flex', maxWidth: 640 }}>
        {SUB_TABS.map((label) => {
          const isActive = label === active
          return (
            <Link
              key={label}
              href={hrefFor(label)}
              style={{
                flex: 1,
                padding: '14px 4px',
                textAlign: 'center',
                textDecoration: 'none',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: isActive ? '#f57e44' : 'var(--text-4)',
                borderBottom: isActive ? '2px solid #f57e44' : '2px solid transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function SectionHeader({ text, sub, color = '#f57e44' }: { text: string; sub?: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, padding: '30px 0 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 24, background: `linear-gradient(180deg, ${color}, ${color})`, borderRadius: 2, flexShrink: 0, boxShadow: `0 0 12px ${color}80` }} />
        <div className="lead-head">{text}</div>
      </div>
      {sub && <div className="lead-sub" style={{ marginBottom: 2 }}>{sub}</div>}
    </div>
  )
}

export default async function SportDetailPage({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport: sportKey } = await params
  const sport = SPORTS_DATA.find((s) => s.key === sportKey)
  if (!sport) notFound()

  const color = SPORT_COLORS[sport.key] ?? '#f57e44'
  const isTrack = sport.key === 'track'
  const isBasketball = sport.key === 'basketball'
  const rating = isBasketball ? bballRating(sport.stats) : 0
  const pentPts = SPORTS_DATA.find((s) => s.key === 'track')?.stats.find((t) => t.label === 'Pent Pts')?.value ?? 2523

  // Recent form: this sport's PRs (most recent first)
  const prs = DEFAULT_PRS
    .filter((p) => p.sport === sport.key)
    .sort((a, b) => b.date.localeCompare(a.date))

  // Next event for this sport
  const todayStr = new Date().toISOString().split('T')[0]
  const nextEvent = DEFAULT_SCHEDULE
    .filter((e) => e.sport === sport.key && e.date >= todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]

  const achieved = sport.milestones.filter((m) => m.achieved).length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 56 }}>
      <SportHero
        bgImage={sport.bgImage}
        name={sport.name}
        number={sport.number}
        position={sport.position}
        color={color}
        motto={sport.motto}
        height={340}
      />

      <SubNav sportKey={sport.key} active="Overview" />

      {/* Stats ribbon */}
      <div style={{ background: `linear-gradient(90deg, ${color}, ${color}cc, ${color})`, width: '100%' }}>
        <div className="dashboard-content" style={{ display: 'flex', padding: 0 }}>
          {sport.stats.slice(0, 4).map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.18)' : 'none' }}>
              <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 4vw, 34px)', color: '#0a0706', lineHeight: 1 }}>
                {s.value}{s.unit}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(10,7,6,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-content">

        {/* Pentathlon CTA — track only */}
        {isTrack && (
          <div style={{ marginTop: 24 }}>
            <Link
              href="/pent"
              style={{
                display: 'block',
                textDecoration: 'none',
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1px solid ${color}55`,
                background: `linear-gradient(135deg, ${color}1f, var(--bg-2))`,
                padding: '22px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color, textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                    Pentathlon Calculator
                  </div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--text)', lineHeight: 1, marginTop: 6 }}>
                    SCORE ALL FIVE EVENTS
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13.5, color: 'var(--text-3)', marginTop: 8, maxWidth: 520, lineHeight: 1.5 }}>
                    Model 100mH, High Jump, Shot Put, Long Jump and 800m on the World Athletics tables. See where every mark moves the total.
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(48px, 8vw, 72px)', color, lineHeight: 0.85, textShadow: `0 0 40px ${color}55` }}>{pentPts}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: 2 }}>PB Points</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: color, borderRadius: 999, padding: '7px 16px', color: '#0a0706', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Open Calculator <span style={{ fontSize: 15, lineHeight: 1 }}>›</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Performance rating — basketball only */}
        {isBasketball && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                borderRadius: 16,
                border: `1px solid ${ratingColor(rating)}55`,
                background: `linear-gradient(135deg, ${ratingColor(rating)}1f, var(--bg-2))`,
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: ratingColor(rating), textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                    Performance Rating
                  </div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text)', lineHeight: 1, marginTop: 6 }}>
                    {ratingLabel(rating)}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-3)', marginTop: 8, maxWidth: 460, lineHeight: 1.5 }}>
                    A 0–100 composite of scoring, playmaking, rebounding, defense and efficiency from this season&apos;s per-game line.
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(48px, 8vw, 72px)', color: ratingColor(rating), lineHeight: 0.85, textShadow: `0 0 40px ${ratingColor(rating)}55` }}>{rating}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: 2 }}>out of 100</div>
                </div>
              </div>
              <div style={{ marginTop: 16, height: 8, borderRadius: 999, background: 'var(--bg-3, rgba(255,255,255,0.08))', overflow: 'hidden' }}>
                <div style={{ width: `${rating}%`, height: '100%', borderRadius: 999, background: ratingColor(rating) }} />
              </div>
            </div>
          </div>
        )}

        {/* Season stats */}
        <SectionHeader text="Season Stats" sub={`${sport.name} · 2025–26`} />
        <StatGrid stats={sport.stats} color={color} />

        {/* Season-by-season progression + charts */}
        <SeasonProgression sport={sport} color={color} />

        {/* Jersey */}
        <SectionHeader text="The Jersey" sub="Hangs in the Trophy Hall" />
        <div style={{ maxWidth: 420 }}>
          <JerseyUpload storageKey={`braelentless_jersey_${sport.key}`} caption={`${sport.name} Jersey`} color={color} />
        </div>


        {/* Goals + side rail (next event + milestones) */}
        <div className="overview-row">
          <div>
            <SectionHeader text="Season Goals" sub="Chase the number" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {sport.goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} color={color} />
              ))}
            </div>
          </div>

          <div>
            <SectionHeader text="On Deck" />
            {/* Next event */}
            {nextEvent ? (
              <Link href={`/sports/${sport.key}/schedule`} className="tile-card" style={{ display: 'block', textDecoration: 'none', padding: '16px 18px', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Next Up</div>
                <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--text)', textTransform: 'uppercase', marginTop: 6, lineHeight: 1.05 }}>{nextEvent.opponent}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
                  {new Date(nextEvent.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {nextEvent.location}
                </div>
              </Link>
            ) : (
              <div className="tile-card" style={{ padding: '16px 18px', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-4)' }}>No upcoming events scheduled.</div>
              </div>
            )}

            {/* Milestones */}
            <div className="tile-card" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Milestones</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color }}>{achieved}/{sport.milestones.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sport.milestones.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: `2px solid ${m.achieved ? color : 'var(--border-2)'}`,
                        background: m.achieved ? color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {m.achieved && <span style={{ color: '#0a0706', fontSize: 12, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 600,
                        fontSize: 13.5,
                        color: m.achieved ? 'var(--text-2)' : 'var(--text-4)',
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent form / PRs */}
        {prs.length > 0 && (
          <>
            <SectionHeader text="Recent Form" sub="New territory" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {prs.map((pr) => {
                const d = new Date(pr.date + 'T12:00:00')
                return (
                  <div key={pr.id} className="tile-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}1f`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 19 }}>🔥</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{pr.event}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11.5, color: 'var(--text-4)' }}>
                        {pr.prev ? `from ${pr.prev} · ` : ''}{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{pr.note ? ` · ${pr.note}` : ''}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 30, color, lineHeight: 0.9, flexShrink: 0 }}>{pr.value}</div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Quick actions */}
        <SectionHeader text="Quick Actions" />
        <div className="overview-actions">
          <Link href={`/sports/${sport.key}/schedule`} className="ov-action ov-action-primary">Schedule</Link>
          <Link href={`/sports/${sport.key}/stats`} className="ov-action">Edit Stats</Link>
          <Link href={`/sports/${sport.key}/goals`} className="ov-action">Set Goals</Link>
          {isTrack && <Link href="/pent" className="ov-action">Pentathlon</Link>}
        </div>
      </div>

      <style>{`
        .overview-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 980px) {
          .overview-row { grid-template-columns: 1.5fr 1fr; gap: 28px; align-items: start; }
        }
        .overview-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .overview-actions { grid-template-columns: repeat(4, 1fr); }
        }
        .ov-action {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: 12px;
          text-decoration: none;
          text-align: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: ${color};
          background: var(--bg-2);
          border: 1px solid var(--tile-border);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .ov-action:hover { border-color: ${color}66; transform: translateY(-2px); }
        .ov-action-primary {
          color: #0a0706;
          background: linear-gradient(135deg, #f57e44, #e35d2a);
          border: none;
        }
      `}</style>
    </div>
  )
}
