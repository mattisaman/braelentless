'use client'

import { useState } from 'react'
import { DEFAULT_COLLEGES, DEFAULT_ELIGIBILITY } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import type { CollegeContact, EligibilityItem } from '@/lib/types'

const STATUS_ORDER: CollegeContact['status'][] = ['committed', 'offer', 'visit', 'contact', 'interest']
const STATUS_LABELS: Record<CollegeContact['status'], string> = {
  committed: 'Committed',
  offer: 'Offer',
  visit: 'Visit',
  contact: 'Contact',
  interest: 'Interest',
}
const STATUS_COLORS: Record<CollegeContact['status'], string> = {
  committed: '#4ade80',
  offer: '#f57e44',
  visit: '#fbbf24',
  contact: '#60a5fa',
  interest: '#a78bfa',
}

export default function RecruitPage() {
  const [colleges, setColleges] = useState<CollegeContact[]>(() =>
    loadData<CollegeContact[]>('braelentless_colleges', DEFAULT_COLLEGES)
  )
  const [eligibility, setEligibility] = useState<EligibilityItem[]>(() =>
    loadData<EligibilityItem[]>('braelentless_eligibility', DEFAULT_ELIGIBILITY)
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ school: '', coach: '', status: 'interest' as CollegeContact['status'], notes: '', date: '' })
  const [tab, setTab] = useState<'pipeline' | 'checklist'>('pipeline')

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

  const inputStyle = {
    width: '100%',
    background: '#1a1008',
    border: '1px solid #2a1f18',
    borderRadius: '6px',
    padding: '10px 12px',
    color: '#e8dcd4',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '13px',
    outline: 'none',
  }
  const labelStyle = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: '11px',
    color: '#6b5a50',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '32px', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1 }}>
          RECRUIT
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
          College Pipeline · Eligibility
        </div>
      </div>

      {/* Commitment banner */}
      <div style={{ margin: '16px 16px 0', background: 'linear-gradient(135deg, #1a3a1a, #0f2a0f)', borderRadius: '10px', padding: '16px', border: '1px solid #4ade8044' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
          Committed
        </div>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '22px', color: '#ffffff', letterSpacing: '0.04em' }}>
          Southeastern University
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Basketball · NLI November 2026
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e1410', margin: '16px 0 0' }}>
        {(['pipeline', 'checklist'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: tab === t ? '#f57e44' : '#4a3a30',
              borderBottom: tab === t ? '2px solid #f57e44' : '2px solid transparent',
            }}
          >
            {t === 'pipeline' ? 'Pipeline' : 'Eligibility'}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 16px' }}>
        {tab === 'pipeline' && (
          <>
            <button
              onClick={() => setShowForm((v) => !v)}
              style={{
                width: '100%', padding: '12px',
                background: showForm ? '#1e1410' : '#0f0b08',
                border: `1px solid ${showForm ? '#f57e44' : '#1e1410'}`,
                borderRadius: '8px', color: '#f57e44',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              {showForm ? '✕ Cancel' : '+ Add School'}
            </button>

            {showForm && (
              <div style={{ background: '#0f0b08', borderRadius: '10px', padding: '16px', border: '1px solid #2a1f18', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>School Name</label>
                  <input type="text" value={form.school} onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))} placeholder="University name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Coach Contact</label>
                  <input type="text" value={form.coach} onChange={(e) => setForm((f) => ({ ...f, coach: e.target.value }))} placeholder="Coach name" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                    <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Notes</label>
                  <input type="text" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Scholarship, coach contact, interest level..." style={inputStyle} />
                </div>
                <button
                  onClick={addCollege}
                  style={{
                    padding: '12px',
                    background: form.school ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : '#1e1410',
                    border: 'none', borderRadius: '8px',
                    color: form.school ? '#fff' : '#4a3a30',
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
            {STATUS_ORDER.filter((s) => grouped[s]).map((status) => (
              <div key={status} style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: STATUS_COLORS[status], textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>
                  {STATUS_LABELS[status]} ({grouped[status].length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {grouped[status].map((college) => (
                    <div
                      key={college.id}
                      style={{ background: '#0f0b08', borderRadius: '10px', padding: '14px 16px', border: `1px solid ${STATUS_COLORS[college.status]}44` }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '16px', color: '#e8dcd4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {college.school}
                        </div>
                        {college.date && (
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#4a3a30' }}>
                            {new Date(college.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      {college.coach && (
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '12px', color: '#6b5a50', marginBottom: '6px' }}>
                          {college.coach}
                        </div>
                      )}
                      {college.notes && (
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '12px', color: '#8a6a58', lineHeight: 1.5 }}>
                          {college.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {colleges.length === 0 && (
              <div style={{ textAlign: 'center', color: '#4a3a30', fontSize: '13px', padding: '32px 0' }}>
                No schools in pipeline yet.
              </div>
            )}
          </>
        )}

        {tab === 'checklist' && (
          <>
            {/* Progress */}
            <div style={{ background: '#0f0b08', borderRadius: '10px', padding: '16px', border: '1px solid #1e1410', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#8a6a58', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Eligibility Progress
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#f57e44' }}>
                  {completedCount}/{eligibility.length}
                </span>
              </div>
              <div style={{ height: '8px', background: '#1e1410', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${eligibilityPct}%`, height: '100%', background: 'linear-gradient(90deg, #e35d2a, #f57e44)', borderRadius: '8px', transition: 'width 0.3s' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {eligibility.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleEligibility(item.id)}
                  style={{
                    background: item.completed ? '#0d1a0d' : '#0f0b08',
                    border: `1px solid ${item.completed ? '#4ade8044' : '#1e1410'}`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '4px',
                      border: `2px solid ${item.completed ? '#4ade80' : '#2a1f18'}`,
                      background: item.completed ? '#4ade80' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.completed && <span style={{ color: '#0a0706', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '13px', color: item.completed ? '#8a6a58' : '#c8bab0', textDecoration: item.completed ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
