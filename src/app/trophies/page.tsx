import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AddAchievementButton from '@/components/AddAchievementButton'

const SPORT_COLORS: Record<string, string> = {
  basketball: '#f57e44',
  soccer: '#a8b0ba',
  track: '#a8b0ba',
}

const GOLD = '#f59e0b'
const GOLD_LIGHT = '#fcd34d'

export default async function TrophiesPage() {
  let achievements: any[] = []
  let schoolRecords: any[] = []

  if (supabase) {
    const [aRes, rRes] = await Promise.all([
      supabase.from('achievements').select('*').order('display_order'),
      supabase.from('school_records').select('*').order('sort_order'),
    ])
    achievements = aRes.data ?? []
    schoolRecords = rRes.data ?? []
  }

  const recordsHeld = schoolRecords.filter((r) => r.is_braelyn_record)
  const recordsChasing = schoolRecords.filter((r) => !r.is_braelyn_record)
  const championships = achievements.filter((a) => a.category === 'championship')
  const commitment = achievements.find((a) => a.category === 'commitment')
  const otherAchievements = achievements.filter(
    (a) => !['championship', 'commitment'].includes(a.category)
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '40px' }}>

      {/* ── Hero Header ── */}
      <div
        style={{
          position: 'relative',
          padding: '48px 20px 36px',
          background: 'linear-gradient(160deg, #0a0603 0%, #1a0e04 40%, #0f0804 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-20px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '10%',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,126,68,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '48px',
            letterSpacing: '0.06em',
            color: '#ffffff',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          TROPHY ROOM
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: '13px',
            color: GOLD,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginTop: '8px',
          }}
        >
          Keshequa Wildcats #10
        </div>
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '13px',
            color: 'var(--text-3)',
            marginTop: '6px',
            letterSpacing: '0.02em',
          }}
        >
          {achievements.length > 0
            ? `${achievements.length} achievements · ${recordsHeld.length} school records`
            : 'Loading legacy...'}
        </div>

        {/* 3D Hall entry */}
        <Link
          href="/trophies/3d"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '18px',
            background: 'linear-gradient(135deg, #f59e0b22, #f57e4415)',
            border: '1px solid #f59e0b55',
            borderRadius: '8px',
            padding: '10px 18px',
            textDecoration: 'none',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            color: GOLD,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ fontSize: '16px' }}>✦</span>
          Enter 3D Trophy Hall
        </Link>
      </div>

      {/* ── Commitment Banner ── */}
      {commitment && (
        <div
          style={{
            margin: '0',
            padding: '18px 20px',
            background: 'linear-gradient(135deg, #92400e 0%, #78350f 50%, #451a03 100%)',
            borderTop: `1px solid ${GOLD}40`,
            borderBottom: `1px solid ${GOLD}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '28px' }}>{commitment.emoji ?? '🦁'}</span>
          <div>
            <div
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '18px',
                letterSpacing: '0.08em',
                color: GOLD_LIGHT,
                lineHeight: 1,
              }}
            >
              COMMITTED: SOUTHEASTERN UNIVERSITY
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                color: '#d97706',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '4px',
              }}
            >
              {commitment.description ?? 'Division I Basketball'}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '0 16px' }}>

        {/* ── Championships Shelf ── */}
        {championships.length > 0 && (
          <section style={{ marginTop: '28px' }}>
            <SectionLabel label="CHAMPIONSHIPS" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: championships.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              {championships.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: 'linear-gradient(145deg, #1c1408 0%, #130e06 100%)',
                    border: `1.5px solid ${GOLD}60`,
                    borderRadius: '10px',
                    padding: '18px 14px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Corner shimmer */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '60px',
                      height: '60px',
                      background: `radial-gradient(circle at top right, ${GOLD}20, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />
                  <div style={{ fontSize: '32px', lineHeight: 1 }}>{c.emoji ?? '🏆'}</div>
                  <div
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: '15px',
                      letterSpacing: '0.05em',
                      color: GOLD_LIGHT,
                      marginTop: '10px',
                      lineHeight: 1.2,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: '11px',
                      color: GOLD,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginTop: '4px',
                    }}
                  >
                    {c.season}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: '11px',
                      color: 'var(--text-3)',
                      marginTop: '6px',
                    }}
                  >
                    {c.description ?? 'Section V Champions · NYS Tournament'}
                  </div>
                  <SportChip sport={c.sport} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── School Records Held ── */}
        {recordsHeld.length > 0 && (
          <section style={{ marginTop: '28px' }}>
            <SectionLabel label="SCHOOL RECORDS HELD" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                marginTop: '12px',
              }}
            >
              {recordsHeld.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${GOLD}35`,
                    borderRadius: '8px',
                    padding: '14px 12px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '9px',
                      color: GOLD,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: '6px',
                    }}
                  >
                    SCHOOL RECORD
                  </div>
                  <div style={{ fontSize: '20px', lineHeight: 1 }}>
                    {getCategoryEmoji(r.category, r.sport)}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      color: 'var(--text)',
                      marginTop: '6px',
                      lineHeight: 1.2,
                    }}
                  >
                    {r.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: '16px',
                      color: GOLD_LIGHT,
                      marginTop: '4px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {r.school_record_display ?? r.braelyn_current_display ?? '--'}
                  </div>
                  {r.set_season && (
                    <div
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: '10px',
                        color: 'var(--text-4)',
                        marginTop: '4px',
                      }}
                    >
                      {r.set_season}
                    </div>
                  )}
                  <SportChip sport={r.sport} small />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Records Being Chased ── */}
        {recordsChasing.length > 0 && (
          <section style={{ marginTop: '28px' }}>
            <SectionLabel label="RECORDS IN RANGE" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '12px',
              }}
            >
              {recordsChasing.map((r) => {
                const current = r.braelyn_current_value ?? 0
                const target = r.school_record_value ?? 1
                const pct = Math.min(100, Math.round((current / target) * 100))
                const isClose = pct >= 95

                return (
                  <div
                    key={r.id}
                    style={{
                      background: 'var(--surface)',
                      border: isClose
                        ? `1px solid ${'#f57e44'}60`
                        : '1px solid var(--border-2)',
                      borderRadius: '8px',
                      padding: '14px 14px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {isClose && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, #f57e44, #f59e0b)',
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '10px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 700,
                            fontSize: '13px',
                            color: 'var(--text)',
                            lineHeight: 1.2,
                          }}
                        >
                          {r.label}
                        </div>
                        {r.notes && (
                          <div
                            style={{
                              fontFamily: "'Barlow', sans-serif",
                              fontSize: '11px',
                              color: isClose ? '#f57e44' : 'var(--text-4)',
                              marginTop: '2px',
                            }}
                          >
                            {r.notes}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SportChip sport={r.sport} small />
                        {isClose && (
                          <span
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 700,
                              fontSize: '10px',
                              color: '#f57e44',
                              background: '#f57e4415',
                              border: '1px solid #f57e4440',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                            }}
                          >
                            SO CLOSE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div
                      style={{
                        background: 'var(--prog-track)',
                        borderRadius: '4px',
                        height: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: isClose
                            ? 'linear-gradient(90deg, #f57e44, #f59e0b)'
                            : 'linear-gradient(90deg, #f57e44, #e35d2a)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '6px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '11px',
                          color: 'var(--text-2)',
                        }}
                      >
                        {r.braelyn_current_display ?? current}{' '}
                        <span style={{ color: 'var(--text-4)' }}>
                          / {r.school_record_display ?? target}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          fontSize: '11px',
                          color: isClose ? GOLD : 'var(--text-4)',
                        }}
                      >
                        {pct}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Other Achievements ── */}
        {otherAchievements.length > 0 && (
          <section style={{ marginTop: '28px' }}>
            <SectionLabel label="ALL ACHIEVEMENTS" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                marginTop: '12px',
                background: 'var(--surface)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid var(--border-2)',
              }}
            >
              {otherAchievements.map((a, idx) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderBottom:
                      idx < otherAchievements.length - 1
                        ? '1px solid var(--border)'
                        : 'none',
                    background: 'transparent',
                  }}
                >
                  <span style={{ fontSize: '22px', flexShrink: 0, lineHeight: 1 }}>
                    {a.emoji ?? '🏅'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '13px',
                        color: 'var(--text)',
                        lineHeight: 1.2,
                      }}
                    >
                      {a.title}
                    </div>
                    {a.description && (
                      <div
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: '11px',
                          color: 'var(--text-3)',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {a.description}
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {a.season && (
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 600,
                          fontSize: '10px',
                          color: 'var(--text-4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {a.season}
                      </span>
                    )}
                    <SportChip sport={a.sport} small />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Add Achievement */}
        <section style={{ marginTop: '28px' }}>
          <SectionLabel label="Add Your Own" />
          <div style={{ marginTop: '12px' }}>
            <AddAchievementButton />
          </div>
        </section>

        {/* Empty state */}
        {achievements.length === 0 && schoolRecords.length === 0 && (
          <div
            style={{
              marginTop: '60px',
              textAlign: 'center',
              padding: '40px 20px',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
            <div
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '20px',
                color: 'var(--text-3)',
                letterSpacing: '0.06em',
              }}
            >
              TROPHY CASE LOADING
            </div>
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '13px',
                color: 'var(--text-4)',
                marginTop: '8px',
              }}
            >
              Connect Supabase to populate achievements and records.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ──

function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '11px',
          color: 'var(--text-4)',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--border-2)',
        }}
      />
    </div>
  )
}

function SportChip({ sport, small }: { sport?: string; small?: boolean }) {
  if (!sport) return null
  const color = SPORT_COLORS[sport.toLowerCase()] ?? 'var(--text-4)'
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: small ? '9px' : '10px',
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: '3px',
        padding: small ? '1px 5px' : '2px 7px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginTop: small ? '0' : '8px',
      }}
    >
      {sport}
    </span>
  )
}

function getCategoryEmoji(category?: string, sport?: string): string {
  if (sport === 'basketball') return '🏀'
  if (sport === 'soccer') return '⚽'
  if (sport === 'track') return '🏃'
  if (category === 'scoring') return '📈'
  if (category === 'assists') return '🎯'
  if (category === 'steals') return '🛡️'
  return '🏅'
}
