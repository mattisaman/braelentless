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

  useEffect(() => {
    const d = new Date()
    const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    const mon = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    setDateLabel(`${day} · ${mon} ${d.getDate()}`)
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]

  const upcoming = DEFAULT_SCHEDULE
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 2)

  // Day label for section header
  const dayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

  return (
    <div style={{ paddingBottom: '8px', background: '#0a0706', minHeight: '100vh' }}>

      {/* A. Compact Athlete Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #111008 0%, #0f0b07 100%)',
          borderBottom: '1px solid #1e1410',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #f57e44',
            flexShrink: 0,
          }}
        >
          <Image
            src="/wildcats-logo.jpeg"
            alt="Wildcats"
            width={44}
            height={44}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '22px',
              color: '#ffffff',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            BRAELENTLESS
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: '11px',
              color: '#8a6a58',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '2px',
            }}
          >
            KESHEQUA WILDCATS · CLASS OF 2027
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: '11px',
              color: '#8a6a58',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            COMMITTED: SOUTHEASTERN UNIVERSITY
          </div>
        </div>

        {/* Date chip */}
        {dateLabel ? (
          <div
            style={{
              fontFamily: "'Teko', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              color: '#f57e44',
              flexShrink: 0,
              textAlign: 'right',
            }}
          >
            {dateLabel}
          </div>
        ) : null}
      </div>

      {/* B. Stats Ribbon */}
      <div
        style={{
          background: '#f57e44',
          display: 'flex',
          width: '100%',
        }}
      >
        {[
          { label: '3 SPORTS', value: '3', unit: 'SPORTS' },
          { label: '18.4 PPG', value: '18.4', unit: 'PPG' },
          { label: '14 GOALS', value: '14', unit: 'GOALS' },
          { label: '3240 PENT', value: '3240', unit: 'PENT' },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: '10px 6px',
              textAlign: 'center',
              borderLeft: i > 0 ? '1px solid #e35d2a' : 'none',
            }}
          >
            <div
              style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                color: '#0a0706',
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: '9px',
                color: '#7a3a1a',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {s.unit}
            </div>
          </div>
        ))}
      </div>

      {/* C. TODAY'S DASHBOARD */}
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0' }}>

        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            color: '#f57e44',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '16px 16px 8px',
            borderLeft: '2px solid #f57e44',
            marginLeft: '16px',
            paddingLeft: '10px',
          }}
        >
          TODAY · {dayLabel}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '0 16px',
          }}
        >
          <DailyWorkoutTile drills={DEFAULT_DRILLS} />
          <DailyHabitList habits={DEFAULT_HABITS} />
          <DailyMealTile meals={DEFAULT_DAILY_MEALS} />
        </div>

        {/* D. Upcoming Events */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            color: '#f57e44',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '20px 0 8px',
            borderLeft: '2px solid #f57e44',
            marginLeft: '16px',
            paddingLeft: '10px',
          }}
        >
          UPCOMING
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
          {upcoming.length === 0 ? (
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '13px',
                color: '#4a3a30',
              }}
            >
              No upcoming events
            </div>
          ) : (
            upcoming.map((ev) => {
              const d = new Date(ev.date + 'T12:00:00')
              const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
              const day = d.getDate()
              return (
                <div
                  key={ev.id}
                  style={{
                    background: '#0f0b08',
                    border: '1px solid #1e1410',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                {/* Date badge */}
                <div
                  style={{
                    background: '#1e1410',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Teko', sans-serif",
                      fontWeight: 600,
                      fontSize: '10px',
                      color: '#8a6a58',
                      lineHeight: 1,
                    }}
                  >
                    {month}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Teko', sans-serif",
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#e8dcd4',
                      lineHeight: 1,
                    }}
                  >
                    {day}
                  </div>
                </div>

                {/* Title + location */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      lineHeight: 1.2,
                    }}
                  >
                    {ev.opponent}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#6b5a50',
                      marginTop: '2px',
                    }}
                  >
                    {ev.location}
                  </div>
                </div>

                {/* Sport chip */}
                <div
                  style={{
                    background: '#f57e4422',
                    border: '1px solid #f57e4444',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '9px',
                      color: '#f57e44',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {ev.sport}
                  </span>
                </div>
                </div>
              )
            })
          )}
        </div>

        {/* E. My Sports — horizontal scroll strip */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            color: '#f57e44',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '20px 0 8px',
            borderLeft: '2px solid #f57e44',
            marginLeft: '16px',
            paddingLeft: '10px',
          }}
        >
          MY SPORTS
        </div>

        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '10px',
            padding: '0 16px 4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } as React.CSSProperties}
        >
          {SPORTS_DATA.map((sport) => (
            <div
              key={sport.key}
              onClick={() => router.push(`/sports/${sport.key}`)}
              style={{
                width: '140px',
                flexShrink: 0,
                height: '90px',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                backgroundImage: `url(${sport.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.55)',
                }}
              />
              {/* Content */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    textAlign: 'center',
                  }}
                >
                  {sport.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    color: '#f57e44',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {sport.position}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>{/* end centered container */}

    </div>
  )
}
