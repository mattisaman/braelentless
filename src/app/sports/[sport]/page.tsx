import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SPORTS_DATA, DEFAULT_PRS, DEFAULT_SCHEDULE } from '@/lib/data'
import SportHero from '@/components/SportHero'
import StatGrid from '@/components/StatGrid'
import GoalCard from '@/components/GoalCard'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#22c55e',
  basketball: '#f57e44',
  track: '#60a5fa',
}

const SUB_TABS = ['Overview', 'Stats', 'Schedule', 'Goals'] as const

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

function SectionHeader({ text, sub }: { text: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, padding: '30px 0 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 4, height: 24, background: 'linear-gradient(180deg, #f57e44, #e35d2a)', borderRadius: 2, flexShrink: 0, boxShadow: '0 0 12px rgba(245,126,68,0.5)' }} />
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
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(48px, 8vw, 72px)', color, lineHeight: 0.85, textShadow: `0 0 40px ${color}55` }}>3461</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: 2 }}>Current Points</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: color, borderRadius: 999, padding: '7px 16px', color: '#0a0706', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Open Calculator <span style={{ fontSize: 15, lineHeight: 1 }}>›</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Season stats */}
        <SectionHeader text="Season Stats" sub={`${sport.name} · 2025–26`} />
        <StatGrid stats={sport.stats} color={color} />

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
          color: #f57e44;
          background: var(--bg-2);
          border: 1px solid var(--tile-border);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .ov-action:hover { border-color: rgba(245,126,68,0.4); transform: translateY(-2px); }
        .ov-action-primary {
          color: #fff;
          background: linear-gradient(135deg, #e35d2a, #f57e44);
          border: none;
        }
      `}</style>
    </div>
  )
}
