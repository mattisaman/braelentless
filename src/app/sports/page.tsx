'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SPORTS_DATA } from '@/lib/data'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#22c55e',
  basketball: '#f57e44',
  track: '#60a5fa',
}

export default function SportsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 48 }}>
      <div className="dashboard-content" style={{ paddingTop: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(34px, 6vw, 56px)',
                color: 'var(--text)',
                letterSpacing: '0.03em',
                lineHeight: 0.95,
              }}
            >
              SPORTS
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                color: 'var(--text-4)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginTop: 6,
              }}
            >
              Three sports · One relentless season
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {[
              { v: '3', l: 'Sports' },
              { v: '14', l: 'Goals' },
              { v: '3461', l: 'Pent Pts' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 34, color: '#f57e44', lineHeight: 0.9 }}>{s.v}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sport cards */}
        <div className="sports-list-grid" style={{ marginTop: 24 }}>
          {SPORTS_DATA.map((sport) => {
            const color = SPORT_COLORS[sport.key] ?? '#f57e44'
            return (
              <Link
                key={sport.key}
                href={`/sports/${sport.key}`}
                className="sport-list-card"
                style={{
                  textDecoration: 'none',
                  position: 'relative',
                  display: 'block',
                  height: 300,
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: `1px solid ${color}40`,
                  boxShadow: `0 0 30px ${color}1f`,
                }}
              >
                <div className="animate-kenburns" style={{ position: 'absolute', inset: 0 }}>
                  <Image src={sport.bgImage} alt={sport.name} fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(8,5,3,0.25) 0%, rgba(8,5,3,0.55) 45%, rgba(8,5,3,0.95) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(120% 80% at 12% 100%, ${color}33 0%, transparent 55%)`,
                  }}
                />

                {/* Number badge */}
                {sport.number && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 20,
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 40,
                      color,
                      opacity: 0.9,
                      textShadow: `0 0 24px ${color}66`,
                    }}
                  >
                    {sport.number}
                  </div>
                )}

                {/* Bottom content */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22 }}>
                  <div
                    style={{
                      fontFamily: "'Saira Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: 38,
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      lineHeight: 0.95,
                      textShadow: '0 2px 18px rgba(0,0,0,0.8)',
                    }}
                  >
                    {sport.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      marginTop: 4,
                    }}
                  >
                    {sport.position}
                  </div>

                  {/* Top 3 stats */}
                  <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
                    {sport.stats.slice(0, 3).map((stat, i) => (
                      <div key={i}>
                        <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 28, color: '#fff', lineHeight: 0.9 }}>
                          {stat.value}
                          {stat.unit && <span style={{ fontSize: 14, color: '#c8a890' }}>{stat.unit}</span>}
                        </div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, color: '#c8a890', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 16,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 12,
                      color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                    }}
                  >
                    View season <span style={{ fontSize: 16, lineHeight: 1 }}>›</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        .sports-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .sports-list-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .sport-list-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .sport-list-card:hover {
          transform: translateY(-6px);
        }
      `}</style>
    </div>
  )
}
