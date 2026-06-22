'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { SPORTS_DATA } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import ProgressBar from '@/components/ProgressBar'
import type { Goal } from '@/lib/types'

const SPORT_COLORS: Record<string, string> = {
  soccer: '#22c55e',
  basketball: '#f57e44',
  track: '#60a5fa',
}

const SUB_TABS = ['Overview', 'Stats', 'Schedule', 'Goals'] as const

export default function GoalsPage({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport: sportKey } = use(params)
  const sportData = SPORTS_DATA.find((s) => s.key === sportKey)
  const color = SPORT_COLORS[sportKey] ?? '#f57e44'

  const STORAGE_KEY = `braelentless_goals_${sportKey}`

  const [goals, setGoals] = useState<Goal[]>(() =>
    loadData<Goal[]>(STORAGE_KEY, sportData?.goals ?? [])
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ label: '', current: '', target: '', unit: '', lowerBetter: false })
  const [saved, setSaved] = useState(false)

  function calcPct(goal: Goal) {
    if (goal.lowerBetter) {
      if (goal.current <= goal.target) return 100
      return Math.max(0, 100 - ((goal.current - goal.target) / goal.target) * 100)
    }
    return goal.target === 0 ? 0 : Math.min(100, (goal.current / goal.target) * 100)
  }

  function handleAddGoal() {
    if (!form.label || !form.target) return
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      label: form.label,
      current: parseFloat(form.current) || 0,
      target: parseFloat(form.target) || 0,
      unit: form.unit,
      lowerBetter: form.lowerBetter,
    }
    const updated = [...goals, newGoal]
    setGoals(updated)
    saveData(STORAGE_KEY, updated)
    setForm({ label: '', current: '', target: '', unit: '', lowerBetter: false })
    setShowForm(false)
  }

  function handleUpdateGoal(id: string, field: 'current' | 'target', value: string) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: parseFloat(value) || 0 } : g))
    )
    setSaved(false)
  }

  function handleSaveAll() {
    saveData(STORAGE_KEY, goals)
    setSaved(true)
    setEditingId(null)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleDelete(id: string) {
    const updated = goals.filter((g) => g.id !== id)
    setGoals(updated)
    saveData(STORAGE_KEY, updated)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 8,
    padding: '9px 11px',
    color: 'var(--text-2)',
    fontFamily: "'Barlow', sans-serif",
    fontSize: 14,
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: 11,
    color: 'var(--text-4)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 6,
    display: 'block',
  }

  const hrefFor = (label: string) =>
    label === 'Overview' ? `/sports/${sportKey}` : `/sports/${sportKey}/${label.toLowerCase()}`

  const completed = goals.filter((g) => calcPct(g) >= 100).length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 56 }}>
      <div className="dashboard-content" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href={`/sports/${sportKey}`} style={{ color, textDecoration: 'none', fontSize: 26, lineHeight: 1 }}>‹</Link>
            <div>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text)', lineHeight: 1, letterSpacing: '0.03em' }}>
                GOALS
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 4 }}>
                {sportData?.name ?? sportKey}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 36, color, lineHeight: 0.9 }}>
              {completed}<span style={{ color: 'var(--text-4)', fontSize: 22 }}>/{goals.length}</span>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Goals Hit</div>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ borderBottom: '1px solid var(--border)', marginTop: 16 }}>
        <div className="dashboard-content" style={{ display: 'flex', maxWidth: 640 }}>
          {SUB_TABS.map((label) => {
            const isActive = label === 'Goals'
            return (
              <Link key={label} href={hrefFor(label)} style={{
                flex: 1, padding: '14px 4px', textAlign: 'center', textDecoration: 'none',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: isActive ? '#f57e44' : 'var(--text-4)',
                borderBottom: isActive ? '2px solid #f57e44' : '2px solid transparent',
              }}>
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="dashboard-content" style={{ paddingTop: 22 }}>
        {/* Goals grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 18 }}>
          {goals.map((goal) => {
            const pct = calcPct(goal)
            const isEditing = editingId === goal.id
            const complete = pct >= 100
            return (
              <div key={goal.id} className="tile-card" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 }}>
                  <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {goal.label}
                    {goal.lowerBetter && (
                      <span style={{ fontSize: 10, color: 'var(--text-4)', marginLeft: 6, fontFamily: "'Barlow', sans-serif", fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(lower is better)</span>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setEditingId(isEditing ? null : goal.id)}
                      style={{ background: 'none', border: 'none', color: '#f57e44', cursor: 'pointer', fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-5)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={labelStyle}>Current</label>
                      <input type="number" value={goal.current} onChange={(e) => handleUpdateGoal(goal.id, 'current', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Target</label>
                      <input type="number" value={goal.target} onChange={(e) => handleUpdateGoal(goal.id, 'target', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 34, color: 'var(--text)', lineHeight: 0.9 }}>{goal.current}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: 'var(--text-4)' }}>/ {goal.target} {goal.unit}</span>
                  </div>
                )}

                <ProgressBar pct={pct} height={6} color={complete ? '#22c55e' : color} />
                <div style={{ textAlign: 'right', marginTop: 5, fontFamily: "'Space Mono', monospace", fontSize: 10, color: complete ? '#22c55e' : 'var(--text-4)' }}>
                  {Math.round(pct)}%
                </div>
              </div>
            )
          })}
        </div>

        {goals.length > 0 && (
          <button
            onClick={handleSaveAll}
            style={{
              width: '100%', padding: 14,
              background: saved ? '#1e3a1e' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
              border: 'none', borderRadius: 10,
              color: saved ? '#4ade80' : '#fff',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer',
              transition: 'all 0.3s', marginBottom: 16,
            }}
          >
            {saved ? '✓ Saved!' : 'Save All Goals'}
          </button>
        )}

        {/* Add goal toggle */}
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            width: '100%', padding: 13,
            background: 'var(--bg-2)',
            border: `1px solid ${showForm ? '#f57e44' : 'var(--border-2)'}`,
            borderRadius: 10,
            color: '#f57e44',
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14,
            textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Goal'}
        </button>

        {showForm && (
          <div className="tile-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
            <div>
              <label style={labelStyle}>Goal Label</label>
              <input type="text" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="e.g. Points Per Game" style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Current Value</label>
                <input type="number" value={form.current} onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))} placeholder="0" style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={labelStyle}>Target Value</label>
                <input type="number" value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))} placeholder="0" style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Unit (optional)</label>
              <input type="text" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="pts, %, goals..." style={{ ...inputStyle, width: '100%' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.lowerBetter}
                onChange={(e) => setForm((f) => ({ ...f, lowerBetter: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: '#f57e44' }}
              />
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-3)' }}>Lower value is better (e.g. time, errors)</span>
            </label>
            <button
              onClick={handleAddGoal}
              style={{
                padding: 13,
                background: form.label && form.target ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
                border: 'none', borderRadius: 8,
                color: form.label && form.target ? '#fff' : 'var(--text-5)',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                cursor: form.label && form.target ? 'pointer' : 'default',
              }}
            >
              Add Goal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
