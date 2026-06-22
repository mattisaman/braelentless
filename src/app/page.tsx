'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SPORTS_DATA, DEFAULT_SCHEDULE, DEFAULT_HABITS, DEFAULT_DRILLS, DEFAULT_DAILY_MEALS } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import DailyWorkoutTile from '@/components/DailyWorkoutTile'
import DailyMealTile from '@/components/DailyMealTile'
import DailyHabitList from '@/components/DailyHabitList'

interface HeroProfile {
  name: string
  school: string
  commit: string
}

const DEFAULT_PROFILE: HeroProfile = {
  name: 'BRAELENTLESS',
  school: 'KESHEQUA WILDCATS · CLASS OF 2027',
  commit: 'Committed · Southeastern University',
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(245,126,68,0.3)',
  borderRadius: '6px',
  padding: '9px 12px',
  color: 'var(--text)',
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: '14px',
  letterSpacing: '0.06em',
  outline: 'none',
  boxSizing: 'border-box',
}

const SPORT_COLORS: Record<string, string> = {
  soccer: '#22c55e',
  basketball: '#f57e44',
  track: '#60a5fa',
}

export default function HomePage() {
  const router = useRouter()
  const [dateLabel, setDateLabel] = useState('')
  const [dayLabel, setDayLabel] = useState('')

  // Hero profile state
  const [profile, setProfile] = useState<HeroProfile>(DEFAULT_PROFILE)
  const [profileImg, setProfileImg] = useState('/wildcats-logo.jpeg')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<HeroProfile>(DEFAULT_PROFILE)
  const imgInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const d = new Date()
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    const mon = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    setDateLabel(`${mon} ${d.getDate()}`)
    setDayLabel(weekday)

    const saved = loadData<HeroProfile>('braelentless_hero', DEFAULT_PROFILE)
    setProfile(saved)
    const savedImg = loadData<string>('braelentless_profile_img', '')
    if (savedImg) setProfileImg(savedImg)
  }, [])

  function openEdit() {
    setDraft({ ...profile })
    setEditing(true)
  }

  function saveHero() {
    saveData('braelentless_hero', draft)
    setProfile(draft)
    setEditing(false)
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setProfileImg(url)
      saveData('braelentless_profile_img', url)
    }
    reader.readAsDataURL(file)
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const upcoming = DEFAULT_SCHEDULE
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 2)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '80px', position: 'relative' }}>

      {/* Cinematic ambient background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: 'url(/basketball-court.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
        opacity: 0.07,
        pointerEvents: 'none',
      }} />

      {/* ── HERO ── */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: editing ? 'auto' : '220px', overflow: 'hidden' }}>
        {/* Background */}
        <div className="animate-kenburns" style={{
          position: editing ? 'fixed' : 'absolute',
          inset: 0, zIndex: 0,
          backgroundImage: 'url(/basketball-court.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: editing ? 0 : 1,
          height: editing ? 0 : undefined,
        }} />
        {!editing && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,7,6,0.45) 0%, rgba(10,7,6,0.95) 100%)' }} />
        )}
        {!editing && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f57e44 20%, #f57e44 80%, transparent)' }} />
        )}

        {/* Edit button — top right of hero */}
        {!editing && (
          <button onClick={openEdit} style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            background: 'rgba(10,7,6,0.75)',
            border: '1px solid rgba(245,126,68,0.4)',
            borderRadius: '6px', padding: '5px 10px',
            color: '#c8a080', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '5px',
            backdropFilter: 'blur(4px)',
            transition: 'border-color 0.15s, color 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,126,68,0.6)'; (e.currentTarget as HTMLButtonElement).style.color = '#f57e44' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,126,68,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#c8a080' }}
          >
            <span style={{ fontSize: '11px' }}>✏</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em' }}>EDIT PROFILE</span>
          </button>
        )}

        {/* ── VIEW MODE ── */}
        {!editing && (
          <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
              {/* Profile image */}
              <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid #f57e44', flexShrink: 0, boxShadow: '0 0 20px rgba(245,126,68,0.45)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(24px, 5vw, 36px)', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1, textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
                  {profile.name}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', color: '#9a7a68', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                  {profile.school}
                </div>
                {profile.commit && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '5px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '4px', padding: '2px 8px' }}>
                    <span style={{ fontSize: '9px', color: '#22c55e' }}>✓</span>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{profile.commit}</span>
                  </div>
                )}
              </div>
              {dateLabel && (
                <div style={{ flexShrink: 0, textAlign: 'right', paddingBottom: '4px' }}>
                  <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '15px', color: '#f57e44', lineHeight: 1 }}>{dateLabel}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EDIT MODE ── */}
        {editing && (
          <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '20px 16px' }}>
            {/* Edit header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '14px', color: '#f57e44', letterSpacing: '0.06em' }}>EDIT PROFILE</span>
              <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-4)', fontSize: '18px', cursor: 'pointer', padding: '0 4px' }}>✕</button>
            </div>

            {/* Profile image upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
              <div
                onClick={() => imgInputRef.current?.click()}
                style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(245,126,68,0.5)', cursor: 'pointer', flexShrink: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '20px' }}>📷</span>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Profile Photo</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '11px', color: 'var(--text-4)', marginTop: '2px' }}>Tap to upload a new image</div>
              </div>
              <input ref={imgInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Name / Handle</div>
                <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="BRAELENTLESS" style={{ ...INPUT_STYLE, textTransform: 'uppercase' }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>School · Class Year</div>
                <input value={draft.school} onChange={e => setDraft({ ...draft, school: e.target.value })} placeholder="KESHEQUA WILDCATS · CLASS OF 2027" style={INPUT_STYLE} />
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Commitment (leave blank to hide)</div>
                <input value={draft.commit} onChange={e => setDraft({ ...draft, commit: e.target.value })} placeholder="Committed · School Name" style={INPUT_STYLE} />
              </div>
            </div>

            {/* Save button */}
            <button onClick={saveHero} style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #e35d2a, #f57e44)',
              border: 'none', borderRadius: '8px',
              color: '#fff', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: '14px',
              textTransform: 'uppercase', letterSpacing: '0.12em',
            }}>
              SAVE PROFILE
            </button>
          </div>
        )}
      </div>

      {/* ── STATS RIBBON ── */}
      <div style={{ background: 'linear-gradient(90deg, #e35d2a, #f57e44, #e35d2a)', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="dashboard-content" style={{ display: 'flex', padding: '0' }}>
          {[{ value: '3', unit: 'SPORTS' }, { value: '18.4', unit: 'PPG' }, { value: '14', unit: 'GOALS' }, { value: '3240', unit: 'PENT' }].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '10px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.2)' : 'none' }}>
              <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: '26px', color: '#0a0706', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(10,7,6,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SPORT CARDS STRIP (between stats ribbon and TODAY) ── */}
      <div style={{ padding: '16px 0 4px', position: 'relative', zIndex: 1 }}>
        <div className="dashboard-content">
          <div className="sports-grid">
            {SPORTS_DATA.map((sport) => {
              const color = SPORT_COLORS[sport.key] ?? '#f57e44'
              return (
                <div
                  key={sport.key}
                  onClick={() => router.push(`/sports/${sport.key}`)}
                  style={{
                    minWidth: '160px',
                    flexShrink: 0,
                    height: '120px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: `2px solid ${color}55`,
                    boxShadow: `0 0 20px ${color}22`,
                  }}
                >
                  {/* Background with kenburns */}
                  <div
                    className="animate-kenburns"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${sport.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {/* Dark gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 100%)' }} />
                  {/* Text */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '18px', color: '#fff', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.1 }}>{sport.name}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', color: color, textTransform: 'uppercase' }}>{sport.position}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1 }}>

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

        {/* Lower row: Upcoming only */}
        <div className="dashboard-lower">
          <div>
            <div className="section-header">
              <div className="section-header-bar" />
              <div className="section-header-text">UPCOMING</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcoming.length === 0 ? (
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', color: 'var(--text-5)' }}>No upcoming events</div>
              ) : upcoming.map((ev) => {
                const d = new Date(ev.date + 'T12:00:00')
                const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const sc = SPORT_COLORS[ev.sport] ?? '#f57e44'
                return (
                  <div key={ev.id} className="tile-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--border)', borderRadius: '8px', padding: '6px 10px', textAlign: 'center', flexShrink: 0, borderLeft: `3px solid ${sc}` }}>
                      <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '10px', color: 'var(--text-3)', lineHeight: 1 }}>{month}</div>
                      <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: '22px', color: 'var(--text-2)', lineHeight: 1 }}>{d.getDate()}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: 'var(--text)', textTransform: 'uppercase' }}>{ev.opponent}</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: 'var(--text-4)', marginTop: '2px' }}>{ev.location}</div>
                    </div>
                    <div style={{ background: `${sc}22`, border: `1px solid ${sc}44`, borderRadius: '4px', padding: '3px 8px', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: sc, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ev.sport}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
