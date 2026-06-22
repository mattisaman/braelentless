import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SPORTS_DATA } from '@/lib/data'
import SportHero from '@/components/SportHero'
import StatGrid from '@/components/StatGrid'
import GoalCard from '@/components/GoalCard'
import type { SportKey } from '@/lib/types'

export default async function SportDetailPage({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport: sportKey } = await params
  const sport = SPORTS_DATA.find((s) => s.key === sportKey)
  if (!sport) notFound()

  return (
    <div>
      <SportHero
        bgImage={sport.bgImage}
        name={sport.name}
        number={sport.number}
        position={sport.position}
        height={220}
      />

      {/* Sub-nav */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
      >
        {[
          { label: 'Overview', href: `/sports/${sport.key}` },
          { label: 'Stats', href: `/sports/${sport.key}/stats` },
          { label: 'Schedule', href: `/sports/${sport.key}/schedule` },
          { label: 'Goals', href: `/sports/${sport.key}/goals` },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              padding: '12px 4px',
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: tab.label === 'Overview' ? '#f57e44' : 'var(--text-5)',
              borderBottom: tab.label === 'Overview' ? '2px solid #f57e44' : '2px solid transparent',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Motto */}
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-3)',
            textAlign: 'center',
            padding: '16px',
            borderRadius: '8px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            marginBottom: '20px',
            lineHeight: 1.5,
          }}
        >
          &ldquo;{sport.motto}&rdquo;
        </div>

        {/* Stats */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '10px',
          }}
        >
          Season Stats
        </div>
        <StatGrid stats={sport.stats} />

        {/* Goals */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '20px 0 10px',
          }}
        >
          Season Goals
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sport.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        {/* Milestones */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '20px 0 10px',
          }}
        >
          Milestones
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sport.milestones.map((m, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-2)',
                borderRadius: '8px',
                padding: '12px 16px',
                border: `1px solid ${m.achieved ? '#f57e4444' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${m.achieved ? '#f57e44' : 'var(--border-2)'}`,
                  background: m.achieved ? '#f57e44' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {m.achieved && (
                  <span style={{ color: '#0a0706', fontSize: '11px', fontWeight: 700 }}>✓</span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: m.achieved ? 'var(--text-2)' : 'var(--text-5)',
                  textDecoration: m.achieved ? 'none' : 'none',
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '24px' }}>
          <Link
            href={`/sports/${sport.key}/schedule`}
            style={{
              background: 'linear-gradient(135deg, #e35d2a, #f57e44)',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Schedule
          </Link>
          <Link
            href={`/sports/${sport.key}/stats`}
            style={{
              background: 'var(--border)',
              border: '1px solid var(--border-2)',
              borderRadius: '8px',
              padding: '14px',
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              color: '#f57e44',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Edit Stats
          </Link>
        </div>
      </div>
    </div>
  )
}
