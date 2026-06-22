import Image from 'next/image'
import Link from 'next/link'
import { SPORTS_DATA } from '@/lib/data'

export default function SportsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px 16px 16px' }}>
        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '32px',
            color: 'var(--text)',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          SPORTS
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: '13px',
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: '4px',
          }}
        >
          3 Active Sports · Season Overview
        </div>
      </div>

      {/* Sport cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {SPORTS_DATA.map((sport) => (
          <Link
            key={sport.key}
            href={`/sports/${sport.key}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                position: 'relative',
                height: '180px',
                overflow: 'hidden',
                marginBottom: '2px',
              }}
            >
              <div
                className="animate-kenburns"
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image
                  src={sport.bgImage}
                  alt={sport.name}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(10,7,6,0.9) 0%, rgba(10,7,6,0.5) 60%, rgba(10,7,6,0.2) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {sport.number && (
                  <div
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: '40px',
                      color: '#f57e44',
                      lineHeight: 1,
                      opacity: 0.8,
                    }}
                  >
                    {sport.number}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: '30px',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  {sport.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#f57e44',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginTop: '4px',
                  }}
                >
                  {sport.position}
                </div>
                <div
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  {sport.stats.slice(0, 3).map((stat, i) => (
                    <div key={i}>
                      <div
                        style={{
                          fontFamily: "'Teko', sans-serif",
                          fontWeight: 600,
                          fontSize: '20px',
                          color: '#e8dcd4',
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                        {stat.unit && (
                          <span style={{ fontSize: '12px', color: '#8a6a58' }}>
                            {stat.unit}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 600,
                          fontSize: '9px',
                          color: '#6b5a50',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Arrow */}
              <div
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#f57e44',
                  fontSize: '24px',
                  opacity: 0.7,
                }}
              >
                ›
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
