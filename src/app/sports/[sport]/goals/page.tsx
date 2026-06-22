'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { SPORTS_DATA } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import ProgressBar from '@/components/ProgressBar'
import type { Goal, SportKey } from '@/lib/types'

export default function GoalsPage({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport: sportKey } = use(params)
  const sportData = SPORTS_DATA.find((s) => s.key === sportKey)

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

  const inputStyle = {
    background: '#1a1008',
    border: '1px solid #2a1f18',
    borderRadius: '6px',
    padding: '8px 10px',
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
      <div style={{ padding: '20px 16px 0', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href={`/sports/${sportKey}`} style={{ color: '#f57e44', textDecoration: 'none', fontSize: '20px' }}>‹</Link>
          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '24px', color: '#ffffff', lineHeight: 1, letterSpacing: '0.04em' }}>
              GOALS
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: '#6b5a50', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {sportData?.name ?? sportKey}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e1410', marginTop: '12px' }}>
        {[
          { label: 'Overview', href: `/sports/${sportKey}` },
          { label: 'Stats', href: `/sports/${sportKey}/stats` },
          { label: 'Schedule', href: `/sports/${sportKey}/schedule` },
          { label: 'Goals', href: `/sports/${sportKey}/goals` },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1, padding: '12px 4px', textAlign: 'center', textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: tab.label === 'Goals' ? '#f57e44' : '#4a3a30',
              borderBottom: tab.label === 'Goals' ? '2px solid #f57e44' : '2px solid transparent',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Goals list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {goals.map((goal) => {
            const pct = calcPct(goal)
            const isEditing = editingId === goal.id
            return (
              <div
                key={goal.id}
                style={{ background: '#0f0b08', borderRadius: '10px', padding: '14px 16px', border: '1px solid #1e1410' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '13px', color: '#e8dcd4' }}>
                    {goal.label}
                    {goal.lowerBetter && (
                      <span style={{ fontSize: '10px', color: '#6b5a50', marginLeft: '6px' }}>(lower is better)</span>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingId(isEditing ? null : goal.id)}
                      style={{ background: 'none', border: 'none', color: '#f57e44', cursor: 'pointer', fontSize: '11px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      style={{ background: 'none', border: 'none', color: '#4a3a30', cursor: 'pointer', fontSize: '14px' }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={labelStyle}>Current</label>
                      <input
                        type="number"
                        value={goal.current}
                        onChange={(e) => handleUpdateGoal(goal.id, 'current', e.target.value)}
                        style={{ ...inputStyle, width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Target</label>
                      <input
                        type="number"
                        value={goal.target}
                        onChange={(e) => handleUpdateGoal(goal.id, 'target', e.target.value)}
                        style={{ ...inputStyle, width: '100%' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#f57e44', marginBottom: '8px' }}>
                    {goal.current} / {goal.target} {goal.unit}
                  </div>
                )}

                <ProgressBar pct={pct} height={5} />
                <div style={{ textAlign: 'right', marginTop: '4px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#4a3a30' }}>
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
              width: '100%', padding: '12px',
              background: saved ? '#1e3a1e' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
              border: 'none', borderRadius: '8px',
              color: saved ? '#4ade80' : '#fff',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
              textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
              transition: 'all 0.3s', marginBottom: '20px',
            }}
          >
            {saved ? 'Saved!' : 'Save All Goals'}
          </button>
        )}

        {/* Add goal toggle */}
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            width: '100%', padding: '12px',
            background: showForm ? '#1e1410' : '#0f0b08',
            border: `1px solid ${showForm ? '#f57e44' : '#1e1410'}`,
            borderRadius: '8px',
            color: '#f57e44',
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
            textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Goal'}
        </button>

        {showForm && (
          <div style={{ background: '#0f0b08', borderRadius: '10px', padding: '16px', border: '1px solid #2a1f18', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Goal Label</label>
              <input type="text" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="e.g. Points Per Game" style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.lowerBetter}
                onChange={(e) => setForm((f) => ({ ...f, lowerBetter: e.target.checked }))}
                style={{ width: '16px', height: '16px', accentColor: '#f57e44' }}
              />
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: '#8a6a58' }}>Lower value is better (e.g. time, errors)</span>
            </label>
            <button
              onClick={handleAddGoal}
              style={{
                padding: '12px',
                background: form.label && form.target ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : '#1e1410',
                border: 'none', borderRadius: '8px',
                color: form.label && form.target ? '#fff' : '#4a3a30',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                textTransform: 'uppercase', letterSpacing: '0.1em',
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
