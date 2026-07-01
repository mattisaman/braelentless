'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  SPORTS_DATA,
  DEFAULT_SCHEDULE,
  DEFAULT_HABITS,
  DEFAULT_DRILLS,
  DEFAULT_DAILY_MEALS,
  DEFAULT_DREAMS,
  DEFAULT_PRS,
  MOTIVATION_QUOTES,
} from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import DailyWorkoutTile from '@/components/DailyWorkoutTile'
import DailyMealTile from '@/components/DailyMealTile'
import DailyHabitList from '@/components/DailyHabitList'
import DreamCard from '@/components/DreamCard'

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
  soccer: '#a8b0ba',
  basketball: '#f57e44',
  track: '#a8b0ba',
  life: '#f57e44',
}

const SECTION_HEADER = (text: string, sub?: string) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, padding: '28px 0 14px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 4, height: 26, background: 'linear-gradient(180deg, #f57e44, #e35d2a)', borderRadius: 2, flexShrink: 0, boxShadow: '0 0 12px rgba(245,126,68,0.5)' }} />
      <div className="lead-head">{text}</div>
    </div>
    {sub && <div className="lead-sub" style={{ marginBottom: 2 }}>{sub}</div>}
  </div>
)

export default function HomePage() {
  const router = useRouter()
  const [dateLabel, setDateLabel] = useState('')
  const [dayLabel, setDayLabel] = useState('')
  const [countdown, setCountdown] = useState<{ days: number; opponent: string; sport: string } | null>(null)
  const [quote, setQuote] = useState(MOTIVATION_QUOTES[MOTIVATION_QUOTES.length - 1])

  // Hero profile state
  const [profile, setProfile] = useState<HeroProfile>(DEFAULT_PROFILE)
  const [profileImg, setProfileImg] = useState('/wildcats-logo.jpeg')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<HeroProfile>(DEFAULT_PROFILE)
  const imgInputRef = useRef<HTMLInputElement>(null)

  const todayStr = new Date().toISOString().split('T')[0]
  const upcoming = DEFAULT_SCHEDULE
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3)

  useEffect(() => {
    const d = new Date()
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    const mon = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    setDateLabel(`${mon} ${d.getDate()}`)
    setDayLabel(weekday)

    // Next-event countdown
    const next = DEFAULT_SCHEDULE
      .filter((e) => e.date >= d.toISOString().split('T')[0])
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]
    if (next) {
      const target = new Date(next.date + 'T' + (next.time || '00:00'))
      const diff = Math.ceil((target.getTime() - d.getTime()) / 86400000)
      setCountdown({ days: Math.max(0, diff), opponent: next.opponent, sport: next.sport })
    }

    // Quote of the day (stable per day, no hydration mismatch)
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(MOTIVATION_QUOTES[dayOfYear % MOTIVATION_QUOTES.length])

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

  // Aggregate goals across sports for the snapshot
  const allGoals = SPORTS_DATA.flatMap((s) =>
    s.goals.map((g) => ({ ...g, sportKey: s.key, sportName: s.name }))
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '40px', position: 'relative' }}>

      {/* Cinematic ambient background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: 'url(/basketball-court.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
        opacity: 0.06,
        pointerEvents: 'none',
      }} />

      {/* ── HERO ── */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: editing ? 'auto' : '300px', overflow: 'hidden' }}>
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
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,7,6,0.35) 0%, rgba(10,7,6,0.78) 55%, rgba(10,7,6,0.97) 100%)' }} />
        )}
        {!editing && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f57e44 20%, #f57e44 80%, transparent)' }} />
        )}

        {/* Edit button — top right of hero */}
        {!editing && (
          <button onClick={openEdit} style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            background: 'rgba(10,7,6,0.75)',
            border: '1px solid rgba(245,126,68,0.4)',
            borderRadius: '8px', padding: '6px 12px',
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
          <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '60px', paddingBottom: '24px' }}>
            {/* Countdown chip */}
            {countdown && (
              <div style={{ marginBottom: 18 }}>
                <div className="countdown-pill">
                  <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#f57e44', boxShadow: '0 0 8px #f57e44', display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f57e44' }}>
                    {countdown.days === 0 ? 'Game day' : `${countdown.days} day${countdown.days === 1 ? '' : 's'}`} · {countdown.opponent}
                  </span>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              {/* Profile image */}
              <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid #f57e44', flexShrink: 0, boxShadow: '0 0 28px rgba(245,126,68,0.5)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(30px, 6vw, 56px)', color: '#ffffff', letterSpacing: '0.03em', lineHeight: 0.95, textShadow: '0 2px 22px rgba(0,0,0,0.9)' }}>
                  {profile.name}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '13px', color: '#c8a890', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '6px' }}>
                  {profile.school}
                </div>
                {profile.commit && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '8px', background: 'rgba(245,126,68,0.14)', border: '1px solid rgba(245,126,68,0.35)', borderRadius: '6px', padding: '3px 10px' }}>
                    <span style={{ fontSize: '9px', color: '#f57e44' }}>✓</span>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{profile.commit}</span>
                  </div>
                )}
              </div>
              {dateLabel && (
                <div className="hide-mobile" style={{ flexShrink: 0, textAlign: 'right', paddingBottom: '4px' }}>
                  <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '13px', color: '#c8a890', lineHeight: 1, letterSpacing: '0.1em' }}>{dayLabel}</div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px', color: '#f57e44', lineHeight: 1, marginTop: 2 }}>{dateLabel}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EDIT MODE ── */}
        {editing && (
          <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '20px 16px', maxWidth: 640 }}>
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
                <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Braelentless" style={INPUT_STYLE} />
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>School · Class Year</div>
                <input value={draft.school} onChange={e => setDraft({ ...draft, school: e.target.value })} placeholder="Keshequa Wildcats · Class of 2027" style={INPUT_STYLE} />
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
          {[
            { value: '3', unit: 'SPORTS' },
            { value: String(SPORTS_DATA.find(s => s.key === 'basketball')?.stats[0]?.value ?? '17.4'), unit: 'PPG' },
            { value: String(SPORTS_DATA.find(s => s.key === 'soccer')?.stats[0]?.value ?? '28'), unit: 'GOALS' },
            { value: String(SPORTS_DATA.find(s => s.key === 'track')?.stats.find(t => t.label === 'Pent Pts')?.value ?? '2523'), unit: 'PENT' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.2)' : 'none' }}>
              <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(26px, 4vw, 34px)', color: '#0a0706', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(10,7,6,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SPORT CARDS STRIP ── */}
      <div style={{ padding: '18px 0 4px', position: 'relative', zIndex: 1 }}>
        <div className="dashboard-content">
          <div className="sports-grid">
            {SPORTS_DATA.map((sport) => {
              const color = SPORT_COLORS[sport.key] ?? '#f57e44'
              return (
                <div
                  key={sport.key}
                  onClick={() => router.push(`/sports/${sport.key}`)}
                  style={{
                    minWidth: '180px',
                    flexShrink: 0,
                    height: '150px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: `2px solid ${color}55`,
                    boxShadow: `0 0 24px ${color}22`,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 14px 40px ${color}44` }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 0 24px ${color}22` }}
                >
                  <div
                    className="animate-kenburns"
                    style={{ position: 'absolute', inset: 0, backgroundImage: `url(${sport.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.78) 100%)' }} />
                  <div style={{ position: 'absolute', top: 12, right: 14, fontFamily: "'Anton', sans-serif", fontSize: 22, color: color, opacity: 0.9, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{sport.number}</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: '21px', color: '#fff', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.05 }}>{sport.name}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{sport.position}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* TODAY */}
        <div className="section-header">
          <div className="section-header-bar" />
          <div className="section-header-text">TODAY{dayLabel ? ` · ${dayLabel}` : ''}</div>
        </div>
        <div className="dashboard-tiles">
          <div className="tile-workout">
            <DailyWorkoutTile drills={DEFAULT_DRILLS} />
          </div>
          <div className="tile-right-col">
            <DailyHabitList habits={DEFAULT_HABITS} />
            <DailyMealTile meals={DEFAULT_DAILY_MEALS} />
          </div>
        </div>

        {/* THE DREAM BOARD */}
        {SECTION_HEADER('The Dream Board', 'Why the work matters')}
        <div className="dream-grid">
          {DEFAULT_DREAMS.map((dream) => {
            const color = SPORT_COLORS[dream.sport ?? 'life'] ?? '#f57e44'
            return <DreamCard key={dream.id} dream={dream} color={color} />
          })}
        </div>

        {/* SEASON GOALS + RECENT PRs */}
        <div className="home-row two">
          {/* Season goals */}
          <div>
            {SECTION_HEADER('Season Goals')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {allGoals.map((g) => {
                const color = SPORT_COLORS[g.sportKey] ?? '#f57e44'
                const pct = g.lowerBetter
                  ? (g.current <= g.target ? 100 : Math.max(0, 100 - ((g.current - g.target) / g.target) * 100))
                  : (g.target === 0 ? 0 : Math.min(100, (g.current / g.target) * 100))
                return (
                  <Link key={g.id} href={`/sports/${g.sportKey}/goals`} className="tile-card" style={{ display: 'block', padding: '13px 16px', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.label}</span>
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color, flexShrink: 0 }}>{g.current} / {g.target} {g.unit}</span>
                    </div>
                    <div className="prog-track"><div className="prog-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }} /></div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent PRs */}
          <div>
            {SECTION_HEADER('Recent PRs', 'New territory')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEFAULT_PRS.map((pr) => {
                const color = SPORT_COLORS[pr.sport] ?? '#f57e44'
                const d = new Date(pr.date + 'T12:00:00')
                return (
                  <div key={pr.id} className="pr-row">
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}1f`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 18 }}>🔥</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{pr.event}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11.5, color: 'var(--text-4)' }}>
                        {pr.prev ? `from ${pr.prev} · ` : ''}{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{pr.note ? ` · ${pr.note}` : ''}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: 26, color, lineHeight: 1, flexShrink: 0 }}>{pr.value}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* UPCOMING */}
        <div className="section-header">
          <div className="section-header-bar" />
          <div className="section-header-text">UPCOMING</div>
        </div>
        <div className="dashboard-lower" style={{ marginTop: 0 }}>
          {upcoming.length === 0 ? (
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', color: 'var(--text-5)' }}>No upcoming events</div>
          ) : upcoming.map((ev) => {
            const d = new Date(ev.date + 'T12:00:00')
            const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
            const sc = SPORT_COLORS[ev.sport] ?? '#f57e44'
            return (
              <div key={ev.id} className="tile-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'var(--border)', borderRadius: '10px', padding: '8px 12px', textAlign: 'center', flexShrink: 0, borderLeft: `3px solid ${sc}` }}>
                  <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '11px', color: 'var(--text-3)', lineHeight: 1 }}>{month}</div>
                  <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: '24px', color: 'var(--text-2)', lineHeight: 1 }}>{d.getDate()}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: 'var(--text)', textTransform: 'uppercase' }}>{ev.opponent}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: 'var(--text-4)', marginTop: '2px' }}>{ev.location}</div>
                </div>
                <div style={{ background: `${sc}22`, border: `1px solid ${sc}44`, borderRadius: '4px', padding: '3px 8px', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: sc, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ev.sport}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* QUOTE BAND */}
        <div style={{ marginTop: 32 }}>
          <div className="quote-band">
            <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontStyle: 'italic', fontSize: 'clamp(17px, 2.4vw, 23px)', color: 'var(--text)', lineHeight: 1.45, maxWidth: 760 }}>
              {quote.text}
            </div>
            <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f57e44', marginTop: 14 }}>
              — {quote.author}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
