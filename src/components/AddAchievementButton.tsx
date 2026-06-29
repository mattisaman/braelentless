'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type FormState = {
  title: string
  description: string
  sport: string
  category: string
  season: string
  emoji: string
}

const BLANK: FormState = {
  title: '',
  description: '',
  sport: 'basketball',
  category: 'award',
  season: '2025-26',
  emoji: '🏆',
}

export default function AddAchievementButton() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!supabase) { setError('Not connected to database.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('achievements').insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      sport: form.sport,
      category: form.category,
      season: form.season || null,
      emoji: form.emoji || '🏆',
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setForm(BLANK)
    setTimeout(() => { setSuccess(false); setOpen(false); window.location.reload() }, 1200)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f57e4415',
          border: '1px solid #f57e4444',
          borderRadius: '10px',
          padding: '12px 16px',
          color: '#f57e44',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          width: '100%',
          marginTop: '8px',
        }}
      >
        <span style={{ fontSize: '16px' }}>+</span>
        Add Achievement
      </button>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '13px',
          color: 'var(--text-2)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          New Achievement
        </span>
        <button
          onClick={() => { setOpen(false); setForm(BLANK); setError('') }}
          style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Emoji + Title row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={form.emoji}
            onChange={(e) => set('emoji', e.target.value)}
            maxLength={4}
            style={{ ...inputStyle, width: '56px', textAlign: 'center', fontSize: '20px' }}
            placeholder="🏆"
          />
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Achievement title *"
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Barlow', sans-serif" }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div>
            <label style={labelStyle}>Sport</label>
            <select value={form.sport} onChange={(e) => set('sport', e.target.value)} style={inputStyle}>
              <option value="basketball">Basketball</option>
              <option value="soccer">Soccer</option>
              <option value="track">Track</option>
              <option value="all">All Sports</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} style={inputStyle}>
              <option value="award">Award</option>
              <option value="championship">Championship</option>
              <option value="record">Record</option>
              <option value="milestone">Milestone</option>
              <option value="honor">Honor</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Season</label>
            <input
              value={form.season}
              onChange={(e) => set('season', e.target.value)}
              placeholder="2025-26"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontFamily: "'Barlow', sans-serif", fontSize: '12px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: '#22c55e', fontFamily: "'Barlow', sans-serif", fontSize: '12px', fontWeight: 600 }}>
            Achievement saved!
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? 'var(--border)' : '#f57e44',
            color: saving ? 'var(--text-4)' : '#0a0706',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Achievement'}
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '9px 12px',
  color: 'var(--text-2)',
  fontFamily: "'Barlow', sans-serif",
  fontSize: '13px',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700,
  fontSize: '10px',
  color: 'var(--text-4)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: '4px',
}
