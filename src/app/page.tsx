import Image from 'next/image'
import Link from 'next/link'
import { SPORTS_DATA, DEFAULT_SCHEDULE } from '@/lib/data'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: '11px',
        color: '#6b5a50',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '10px',
      }}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const upcoming = DEFAULT_SCHEDULE
    .filter((e) => e.date >= todayKey)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 2)

  const SPORT_COLORS: Record<string, string> = {
    soccer: '#4ade80',
    basketball: '#f57e44',
    track: '#60a5fa',
  }

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Hero header */}
      <div
        style={{
          position: 'relative',
          height: '220px',
          overflow: 'hidden',
        }}
      >
        <div className="animate-kenburns" style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="/basketball-court.png"
            alt="Braelentless"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,7,6,0.4) 0%, rgba(10,7,6,0.9) 100%)',
          }}
        />
        {/* Logo + identity */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'flex-end',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #f57e44',
              flexShrink: 0,
            }}
          >
            <Image
              src="/wildcats-logo.jpeg"
              alt="Wildcats"
              width={56}
              height={56}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '26px',
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
                fontWeight: 500,
                fontSize: '12px',
                color: '#f57e44',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginTop: '2px',
              }}
            >
              Keshequa Wildcats · Class of 2027
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 500,
                fontSize: '11px',
                color: '#8a6a58',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Committed: Southeastern University
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats ribbon */}
      <div
        style={{
          background: '#f57e44',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {[
          { label: 'Sports', value: '3' },
          { label: 'PPG', value: '18.4' },
          { label: 'Goals', value: '14' },
          { label: 'Pent', value: '3240' },
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
                fontWeight: 600,
                fontSize: '22px',
                color: '#0a0706',
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '9px',
                color: '#7a3a10',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px 0' }}>
        {/* Sports quick access */}
        <SectionLabel>My Sports</SectionLabel>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {SPORTS_DATA.map((sport) => (
            <Link
              key={sport.key}
              href={`/sports/${sport.key}`}
              style={{
                flex: 1,
                position: 'relative',
                height: '80px',
                borderRadius: '10px',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div className="animate-kenburns" style={{ position: 'absolute', inset: 0 }}>
                <Image
                  src={sport.bgImage}
                  alt={sport.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(10,7,6,0.6)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '6px 8px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: '11px',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                  }}
                >
                  {sport.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 500,
                    fontSize: '9px',
                    color: '#f57e44',
                    textTransform: 'uppercase',
                  }}
                >
                  {sport.position}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Upcoming events */}
        <SectionLabel>Upcoming Events</SectionLabel>
        {upcoming.length === 0 ? (
          <div style={{ color: '#4a3a30', fontSize: '13px', marginBottom: '24px' }}>
            No upcoming events
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {upcoming.map((ev) => {
              const color = SPORT_COLORS[ev.sport] ?? '#f57e44'
              const d = new Date(ev.date + 'T12:00:00')
              return (
                <div
                  key={ev.id}
                  style={{
                    background: '#0f0b08',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    border: `1px solid ${color}44`,
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      borderRadius: '2px',
                      alignSelf: 'stretch',
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Saira Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#e8dcd4',
                        textTransform: 'uppercase',
                      }}
                    >
                      {ev.opponent}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: '12px',
                        color: '#6b5a50',
                      }}
                    >
                      {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {ev.location}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '9px',
                      color,
                      background: color + '22',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {ev.sport}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Quick links */}
        <SectionLabel>Quick Links</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          {[
            { label: 'Calendar', href: '/calendar', icon: '📅' },
            { label: 'Mind / R&R', href: '/mind', icon: '🧠' },
            { label: 'Train', href: '/train', icon: '💪' },
            { label: 'Fuel', href: '/fuel', icon: '🥗' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                background: '#0f0b08',
                border: '1px solid #1e1410',
                borderRadius: '10px',
                padding: '16px 14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '20px' }}>{link.icon}</span>
              <span
                style={{
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#e8dcd4',
                  textTransform: 'uppercase',
                }}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
