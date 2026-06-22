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

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <div className="animate-kenburns" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/basketball-court.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,7,6,0.45) 0%, rgba(10,7,6,0.95) 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f57e44 20%, #f57e44 80%, transparent)' }} />

        <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid #f57e44', flexShrink: 0, boxShadow: '0 0 20px rgba(245,126,68,0.45)' }}>
              <Image src="/wildcats-logo.jpeg" alt="Wildcats" width={56} height={56} style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(24px, 5vw, 36px)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
                BRAELENTLESS
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', color: '#9a7a68', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                KESHEQUA WILDCATS · CLASS OF 2027
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '5px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '4px', padding: '2px 8px' }}>
                <span style={{ fontSize: '9px', color: '#22c55e' }}>✓</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Committed · Southeastern University</span>
              </div>
            </div>
            {dateLabel && (
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '15px', color: '#f57e44', lineHeight: 1 }}>{dateLabel}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS RIBBON ── */}
      <div style={{ background: 'linear-gradient(90deg, #e35d2a, #f57e44, #e35d2a)', width: '100%' }}>
        <div className="dashboard-content" style={{ display: 'flex', padding: '0' }}>
          {[{ value: '3', unit: 'SPORTS' }, { value: '18.4', unit: 'PPG' }, { value: '14', unit: 'GOALS' }, { value: '3240', unit: 'PENT' }].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '10px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.2)' : 'none' }}>
              <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: '26px', color: '#0a0706', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(10,7,6,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="dashboard-content">

        {/* Today header */}
        <div className="section-header">
          <div className="section-header-bar" />
          <div className="section-header-text">TODAY{dayLabel ? ` · ${dayLabel}` : ''}</div>
        </div>

        {/* 2-col grid */}
        <div className="dashboard-tiles">
          <div className="tile-workout">
            <DailyWorkoutTile drills={DEFAULT_DRILLS} />
          </div>
          <div className="tile-right-col">
            <DailyHabitList habits={DEFAULT_HABITS} />
            <DailyMealTile meals={DEFAULT_DAILY_MEALS} />
          </div>
        </div>

        {/* Lower row: Upcoming + Sports */}
        <div className="dashboard-lower">
          {/* Upcoming */}
          <div>
            <div className="section-header">
              <div className="section-header-bar" />
              <div className="section-header-text">UPCOMING</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcoming.length === 0 ? (
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', color: '#4a3a30' }}>No upcoming events</div>
              ) : upcoming.map((ev) => {
                const d = new Date(ev.date + 'T12:00:00')
                const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const SPORT_COLORS: Record<string, string> = { basketball: '#f57e44', soccer: '#22c55e', track: '#60a5fa' }
                const sc = SPORT_COLORS[ev.sport] ?? '#f57e44'
                return (
                  <div key={ev.id} className="tile-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#1e1410', borderRadius: '8px', padding: '6px 10px', textAlign: 'center', flexShrink: 0, borderLeft: `3px solid ${sc}` }}>
                      <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '10px', color: '#8a6a58', lineHeight: 1 }}>{month}</div>
                      <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: '22px', color: '#e8dcd4', lineHeight: 1 }}>{d.getDate()}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#ffffff', textTransform: 'uppercase' }}>{ev.opponent}</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: '#6b5a50', marginTop: '2px' }}>{ev.location}</div>
                    </div>
                    <div style={{ background: `${sc}22`, border: `1px solid ${sc}44`, borderRadius: '4px', padding: '3px 8px', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: sc, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ev.sport}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* My Sports */}
          <div>
            <div className="section-header">
              <div className="section-header-bar" />
              <div className="section-header-text">MY SPORTS</div>
            </div>
            <div className="sports-grid">
              {SPORTS_DATA.map((sport) => (
                <div key={sport.key} onClick={() => router.push(`/sports/${sport.key}`)}
                  style={{ minWidth: '150px', flexShrink: 0, height: '110px', borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer', backgroundImage: `url(${sport.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #2a1f18' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '17px', color: '#fff', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.1 }}>{sport.name}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', color: '#f57e44', textTransform: 'uppercase' }}>{sport.position}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
