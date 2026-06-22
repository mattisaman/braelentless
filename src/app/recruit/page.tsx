'use client'

import { useState } from 'react'
import { DEFAULT_COLLEGES, DEFAULT_ELIGIBILITY, DEFAULT_VIDEOS } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import VideoCard from '@/components/VideoCard'
import type { CollegeContact, EligibilityItem, VideoEntry } from '@/lib/types'

const STATUS_ORDER: CollegeContact['status'][] = ['committed', 'offer', 'visit', 'contact', 'interest']
const STATUS_LABELS: Record<CollegeContact['status'], string> = {
  committed: 'Committed',
  offer: 'Offer',
  visit: 'Visit',
  contact: 'Contact',
  interest: 'Interest',
}
const STATUS_COLORS: Record<CollegeContact['status'], string> = {
  committed: 'var(--accent-green)',
  offer: '#f57e44',
  visit: '#fbbf24',
  contact: 'var(--accent-blue)',
  interest: '#a78bfa',
}
// The recruiting funnel, low → high commitment
const PIPELINE_STAGES: CollegeContact['status'][] = ['interest', 'contact', 'visit', 'offer', 'committed']

type RecruitTab = 'pipeline' | 'checklist' | 'film'

export default function RecruitPage() {
  const [colleges, setColleges] = useState<CollegeContact[]>(() =>
    loadData<CollegeContact[]>('braelentless_colleges', DEFAULT_COLLEGES)
  )
  const [eligibility, setEligibility] = useState<EligibilityItem[]>(() =>
    loadData<EligibilityItem[]>('braelentless_eligibility', DEFAULT_ELIGIBILITY)
  )
  const [videos] = useState<VideoEntry[]>(() =>
    loadData<VideoEntry[]>('braelentless_videos', DEFAULT_VIDEOS)
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ school: '', coach: '', status: 'interest' as CollegeContact['status'], notes: '', date: '' })
  const [tab, setTab] = useState<RecruitTab>('pipeline')

  function addCollege() {
    if (!form.school) return
    const newContact: CollegeContact = {
      id: `c-${Date.now()}`,
      school: form.school,
      coach: form.coach,
      status: form.status,
      notes: form.notes,
      date: form.date,
    }
    const updated = [newContact, ...colleges]
    setColleges(updated)
    saveData('braelentless_colleges', updated)
    setForm({ school: '', coach: '', status: 'interest', notes: '', date: '' })
    setShowForm(false)
  }

  function toggleEligibility(id: string) {
    const updated = eligibility.map((e) => e.id === id ? { ...e, completed: !e.completed } : e)
    setEligibility(updated)
    saveData('braelentless_eligibility', updated)
  }

  const completedCount = eligibility.filter((e) => e.completed).length
  const eligibilityPct = eligibility.length > 0 ? (completedCount / eligibility.length) * 100 : 0

  // Group colleges by status
  const grouped = STATUS_ORDER.reduce((acc, status) => {
    const items = colleges.filter((c) => c.status === status)
    if (items.length > 0) acc[status] = items
    return acc
  }, {} as Record<string, CollegeContact[]>)

  const committed = colleges.find((c) => c.status === 'committed')
  const offerCount = colleges.filter((c) => c.status === 'offer').length
  const stageCount = (s: CollegeContact['status']) => colleges.filter((c) => c.status === s).length

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    padding: '11px 13px',
    color: 'var(--text-2)',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: '11px',
    color: 'var(--text-4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '6px',
    display: 'block',
  }

  const TABS: [RecruitTab, string][] = [
    ['pipeline', 'Pipeline'],
    ['checklist', 'Eligibility'],
    ['film', 'Highlights'],
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '48px', position: 'relative' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/basketball-court.png)',
        backgroundSize: 'cover', backgroundPosition: 'center top', backgroundAttachment: 'fixed',
        opacity: 0.05, pointerEvents: 'none',
      }} />

      {/* ── COMMITMENT HERO ── */}
      <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div className="animate-kenburns" style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/basketball-court.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(8,5,3,0.94) 0%, rgba(8,5,3,0.78) 50%, rgba(12,40,18,0.55) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-green) 20%, var(--accent-green) 80%, transparent)' }} />
        <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, paddingTop: '46px', paddingBottom: '30px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '8px' }}>
            Recruiting Command Center
          </div>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(34px, 6vw, 60px)', color: '#fff', letterSpacing: '0.03em', lineHeight: 0.92, textShadow: '0 2px 22px rgba(0,0,0,0.9)' }}>
            THE PROCESS
          </div>

          {/* Committed highlight */}
          {committed && (
            <div style={{ marginTop: '22px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(34,197,94,0.16)', border: '1px solid rgba(34,197,94,0.5)',
                borderRadius: '999px', padding: '6px 16px',
                boxShadow: '0 0 28px rgba(34,197,94,0.35)',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  Committed
                </span>
              </div>
              <div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(24px, 3.4vw, 38px)', color: '#fff', letterSpacing: '0.02em', lineHeight: 1, textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
                  {committed.school.toUpperCase()}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '13px', color: '#9fe3b4', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '5px' }}>
                  Basketball · NLI November 2026{committed.coach ? ` · ${committed.coach}` : ''}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── STATS RIBBON ── */}
      <div style={{ background: 'linear-gradient(90deg, #e35d2a, #f57e44, #e35d2a)', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="dashboard-content" style={{ display: 'flex', padding: 0 }}>
          {[
            { value: colleges.length, unit: 'Schools' },
            { value: offerCount, unit: 'Offers' },
            { value: `${Math.round(eligibilityPct)}%`, unit: 'Eligible' },
            { value: videos.length, unit: 'Films' },
          ].map((s, i) => (
            <div key={s.unit} style={{ flex: 1, padding: '14px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.2)' : 'none' }}>
              <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 36px)', color: '#0a0706', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(10,7,6,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="dashboard-content" style={{ display: 'flex', gap: '4px' }}>
          {TABS.map(([t, label]) => {
            const active = tab === t
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: '1 1 0', padding: '16px 8px', border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: active ? '3px solid #f57e44' : '3px solid transparent',
                  fontFamily: "'Anton', sans-serif", fontSize: '15px', letterSpacing: '0.05em',
                  color: active ? '#f57e44' : 'var(--text-3)', transition: 'all 0.2s',
                }}
              >
                {label.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, paddingTop: '24px' }}>

        {/* PIPELINE */}
        {tab === 'pipeline' && (
          <>
            {/* Funnel overview */}
            <div className="section-header" style={{ paddingTop: 0 }}>
              <div className="section-header-bar" />
              <div className="section-header-text">Recruiting Funnel</div>
            </div>
            <div className="recruit-funnel">
              {PIPELINE_STAGES.map((s) => {
                const count = stageCount(s)
                const color = STATUS_COLORS[s]
                const live = count > 0
                return (
                  <div key={s} className="tile-card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: `3px solid ${live ? color : 'var(--border-2)'}`, opacity: live ? 1 : 0.55 }}>
                    <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: '38px', color: live ? color : 'var(--text-4)', lineHeight: 1 }}>{count}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>
                      {STATUS_LABELS[s]}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="section-header">
              <div className="section-header-bar" />
              <div className="section-header-text">School Pipeline</div>
              <div style={{ marginLeft: 'auto' }}>
                <button
                  onClick={() => setShowForm((v) => !v)}
                  style={{
                    padding: '12px 22px',
                    background: showForm ? 'var(--border)' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
                    border: showForm ? '1px solid rgba(245,126,68,0.4)' : 'none',
                    borderRadius: '10px', color: showForm ? '#f57e44' : '#fff',
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                    textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {showForm ? '✕ Cancel' : '+ Add School'}
                </button>
              </div>
            </div>

            {showForm && (
              <div className="tile-card" style={{ padding: '20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>School Name</label>
                  <input type="text" value={form.school} onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))} placeholder="University name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Coach Contact</label>
                  <input type="text" value={form.coach} onChange={(e) => setForm((f) => ({ ...f, coach: e.target.value }))} placeholder="Coach name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CollegeContact['status'] }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="interest">Interest</option>
                    <option value="contact">Contact</option>
                    <option value="visit">Visit</option>
                    <option value="offer">Offer</option>
                    <option value="committed">Committed</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={{ ...inputStyle, colorScheme: 'light dark' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notes</label>
                  <input type="text" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Scholarship, coach contact, interest level..." style={inputStyle} />
                </div>
                <button
                  onClick={addCollege}
                  style={{
                    gridColumn: '1 / -1', padding: '13px',
                    background: form.school ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
                    border: 'none', borderRadius: '10px',
                    color: form.school ? '#fff' : 'var(--text-5)',
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    cursor: form.school ? 'pointer' : 'default',
                  }}
                >
                  Add to Pipeline
                </button>
              </div>
            )}

            {/* Grouped by status */}
            {STATUS_ORDER.filter((s) => grouped[s]).map((status) => {
              const color = STATUS_COLORS[status]
              return (
                <div key={status} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                      {STATUS_LABELS[status]}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-5)' }}>
                      {grouped[status].length}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  </div>
                  <div className="recruit-card-grid">
                    {grouped[status].map((college) => (
                      <div
                        key={college.id}
                        className="tile-card"
                        style={{ padding: '16px 18px', borderLeft: `3px solid ${color}` }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '4px' }}>
                          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: '18px', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                            {college.school}
                          </div>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color, background: `color-mix(in srgb, ${color} 15%, transparent)`, padding: '3px 8px', borderRadius: '5px', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, whiteSpace: 'nowrap' }}>
                            {STATUS_LABELS[college.status]}
                          </span>
                        </div>
                        {college.coach && (
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: 'var(--text-4)', marginBottom: '6px' }}>
                            {college.coach}
                          </div>
                        )}
                        {college.notes && (
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                            {college.notes}
                          </div>
                        )}
                        {college.date && (
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'var(--text-5)', marginTop: '10px' }}>
                            {new Date(college.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {colleges.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-5)', fontFamily: "'Barlow', sans-serif", fontSize: '14px', padding: '40px 0' }}>
                No schools in pipeline yet.
              </div>
            )}
          </>
        )}

        {/* CHECKLIST */}
        {tab === 'checklist' && (
          <div className="recruit-checklist-grid">
            {/* Progress hero */}
            <div className="tile-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '10px' }}>
                Eligibility Progress
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(56px, 9vw, 80px)', color: '#f57e44', lineHeight: 0.9 }}>
                  {Math.round(eligibilityPct)}
                </span>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '24px', color: '#f57e44' }}>%</span>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: 'var(--text-4)', margin: '6px 0 16px' }}>
                {completedCount} of {eligibility.length} complete
              </div>
              <div className="prog-track" style={{ height: 8 }}>
                <div className="prog-fill" style={{ width: `${eligibilityPct}%` }} />
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: '13px', color: 'var(--text-4)', lineHeight: 1.5, marginTop: '18px' }}>
                {eligibilityPct === 100
                  ? 'Fully cleared. Every box checked.'
                  : 'Close the remaining items to be fully cleared for signing day.'}
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {eligibility.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleEligibility(item.id)}
                  className="tile-card"
                  style={{
                    padding: '15px 17px',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    borderLeft: item.completed ? '3px solid var(--accent-green)' : '3px solid var(--border-2)',
                  }}
                >
                  <div className={`check-circle${item.completed ? ' done-green' : ''}`} style={{ width: 24, height: 24 }}>
                    {item.completed && <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '14px', color: item.completed ? 'var(--text-4)' : 'var(--text-2)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FILM */}
        {tab === 'film' && (
          <>
            <div className="section-header" style={{ paddingTop: '4px' }}>
              <div className="section-header-bar" />
              <div className="section-header-text">Recruiting Film</div>
              <div className="lead-sub" style={{ marginLeft: 'auto', marginTop: 0 }}>What coaches see</div>
            </div>
            <div className="recruit-film-grid">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            {videos.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-5)', fontFamily: "'Barlow', sans-serif", fontSize: '14px', padding: '40px 0' }}>
                No highlight film yet. Add videos from the Mind / R&amp;R film room.
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .recruit-funnel { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 8px; }
        @media (min-width: 768px) { .recruit-funnel { grid-template-columns: repeat(5, 1fr); } }
        .recruit-card-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 700px) { .recruit-card-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1100px) { .recruit-card-grid { grid-template-columns: repeat(3, 1fr); } }
        .recruit-checklist-grid { display: grid; grid-template-columns: 1fr; gap: 18px; align-items: start; }
        @media (min-width: 900px) { .recruit-checklist-grid { grid-template-columns: 0.85fr 1.15fr; } }
        .recruit-film-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 768px) { .recruit-film-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  )
}
