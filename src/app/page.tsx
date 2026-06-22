'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SPORTS_DATA, DEFAULT_SCHEDULE, DEFAULT_HABITS, DEFAULT_DRILLS, DEFAULT_DAILY_MEALS } from '@/lib/data'
import DailyWorkoutTile from '@/components/DailyWorkoutTile'
import DailyMealTile from '@/components/DailyMealTile'
import DailyHabitList from '@/components/DailyHabitList'

export default function HomePage() {
  const router = useRouter()
  const [dateLabel, setDateLabel] = useState('')
  const [dayLabel, setDayLabel] = useState('')

  useEffect(() => {
    const d = new Date()
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    const mon = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    setDateLabel(`${mon} ${d.getDate()}`)
    setDayLabel(weekday)
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]
  const upcoming = DEFAULT_SCHEDULE
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 2)

  return (
    <div style={{ background: '#0a0706', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── HERO: full-bleed with court bg ── */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {/* Background */}
        <div
          className="animate-kenburns"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/basketball-court.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,7,6,0.55) 0%, rgba(10,7,6,0.92) 100%)',
        }} />
        {/* Bottom orange edge */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '2px', background: '#f57e44',
        }} />

        {/* Content */}
        <div className="app-shell" style={{
          position: 'relative', zIndex: 1,
          height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'flex-end',
          paddingBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
            {/* Logo */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
              border: '2px solid #f57e44', flexShrink: 0,
              boxShadow: '0 0 16px rgba(245,126,68,0.4)',
            }}>
              <Image src="/wildcats-logo.jpeg" alt="Wildcats" width={52} height={52} style={{ objectFit: 'cover' }} />
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '30px', color: '#ffffff',
                letterSpacing: '0.04em', lineHeight: 1,
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              }}>
                BRAELENTLESS
              </div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600, fontSize: '11px',
                color: '#9a7a68', textTransform: 'uppercase',
                letterSpacing: '0.1em', marginTop: '3px',
              }}>
                KESHEQUA WILDCATS · CLASS OF 2027
              </div>
              {/* Commit badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                marginTop: '5px',
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '4px', padding: '2px 8px',
              }}>
                <span style={{ fontSize: '9px', color: '#22c55e' }}>✓</span>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: '10px',
                  color: '#22c55e', textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  Committed · Southeastern University
                </span>
              </div>
            </div>

            {/* Date */}
            {dateLabel && (
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{
                  fontFamily: "'Teko', sans-serif",
                  fontWeight: 600, fontSize: '14px',
                  color: '#f57e44', lineHeight: 1,
                }}>
                  {dateLabel}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS RIBBON ── */}
      <div style={{ background: '#f57e44', width: '100%' }}>
        <div className="app-shell" style={{ display: 'flex', padding: '0' }}>
          {[
            { value: '3', unit: 'SPORTS' },
            { value: '18.4', unit: 'PPG' },
            { value: '14', unit: 'GOALS' },
            { value: '3240', unit: 'PENT' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 6px', textAlign: 'center',
              borderLeft: i > 0 ? '1px solid #e35d2a' : 'none',
            }}>
              <div style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 700, fontSize: '24px',
                color: '#0a0706', lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600, fontSize: '9px',
                color: '#7a3a1a', textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {s.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DAILY DASHBOARD ── */}
      <div className="app-shell">

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 0 10px',
        }}>
          <div style={{ width: '3px', height: '16px', background: '#f57e44', borderRadius: '2px', flexShrink: 0 }} />
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: '12px',
            color: '#f57e44', textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}>
            TODAY{dayLabel ? ` · ${dayLabel}` : ''}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <DailyWorkoutTile drills={DEFAULT_DRILLS} />
          <DailyHabitList habits={DEFAULT_HABITS} />
          <DailyMealTile meals={DEFAULT_DAILY_MEALS} />
        </div>

        {/* ── UPCOMING ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '22px 0 10px',
        }}>
          <div style={{ width: '3px', height: '16px', background: '#f57e44', borderRadius: '2px', flexShrink: 0 }} />
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: '12px',
            color: '#f57e44', textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}>
            UPCOMING
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {upcoming.length === 0 ? (
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '13px', color: '#4a3a30',
            }}>
              No upcoming events
            </div>
          ) : (
            upcoming.map((ev) => {
              const d = new Date(ev.date + 'T12:00:00')
              const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
              return (
                <div key={ev.id} style={{
                  background: '#0f0b08',
                  border: '1px solid #1e1410',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    background: '#1e1410', borderRadius: '6px',
                    padding: '4px 10px', textAlign: 'center', flexShrink: 0,
                  }}>
                    <div style={{
                      fontFamily: "'Teko', sans-serif", fontWeight: 600,
                      fontSize: '10px', color: '#8a6a58', lineHeight: 1,
                    }}>{month}</div>
                    <div style={{
                      fontFamily: "'Teko', sans-serif", fontWeight: 600,
                      fontSize: '20px', color: '#e8dcd4', lineHeight: 1,
                    }}>{d.getDate()}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700, fontSize: '14px',
                      color: '#ffffff', textTransform: 'uppercase',
                    }}>{ev.opponent}</div>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '12px', color: '#6b5a50', marginTop: '1px',
                    }}>{ev.location}</div>
                  </div>
                  <div style={{
                    background: '#f57e4422', border: '1px solid #f57e4444',
                    borderRadius: '4px', padding: '3px 8px', flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700, fontSize: '9px',
                      color: '#f57e44', textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>{ev.sport}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── MY SPORTS ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '22px 0 10px',
        }}>
          <div style={{ width: '3px', height: '16px', background: '#f57e44', borderRadius: '2px', flexShrink: 0 }} />
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: '12px',
            color: '#f57e44', textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}>
            MY SPORTS
          </div>
        </div>

      </div>

      {/* Sport cards — full-width scroll, inner shell alignment */}
      <div style={{
        display: 'flex', overflowX: 'auto', gap: '10px',
        padding: '0 16px 4px',
        scrollbarWidth: 'none',
      } as React.CSSProperties}>
        {SPORTS_DATA.map((sport) => (
          <div
            key={sport.key}
            onClick={() => router.push(`/sports/${sport.key}`)}
            style={{
              width: '150px', flexShrink: 0, height: '100px',
              borderRadius: '10px', overflow: 'hidden',
              position: 'relative', cursor: 'pointer',
              backgroundImage: `url(${sport.bgImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '1px solid #2a1f18',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '8px', display: 'flex',
              flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 700, fontSize: '16px',
                color: '#ffffff', textTransform: 'uppercase',
                letterSpacing: '0.04em', lineHeight: 1.1, textAlign: 'center',
              }}>{sport.name}</div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600, fontSize: '11px',
                color: '#f57e44', textTransform: 'uppercase',
              }}>{sport.position}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
