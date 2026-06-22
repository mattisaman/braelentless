'use client'

import { useState } from 'react'
import { DEFAULT_MEAL } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import type { MealPlan } from '@/lib/types'

const SLEEP_DATA = [7.5, 9, 8.5, 9, 7, 8, 9.5, 8, 9, 8.5, 7, 9, 9, 8]

export default function FuelPage() {
  const [meal, setMeal] = useState<MealPlan>(() =>
    loadData<MealPlan>('braelentless_meal', DEFAULT_MEAL)
  )
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<MealPlan>(meal)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setMeal(form)
    saveData('braelentless_meal', form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const MACROS = [
    { label: 'Calories', value: meal.calories, target: 2600, unit: 'kcal', color: '#f57e44', key: 'calories' as const },
    { label: 'Protein', value: meal.protein, target: 140, unit: 'g', color: '#4ade80', key: 'protein' as const },
    { label: 'Carbs', value: meal.carbs, target: 300, unit: 'g', color: '#60a5fa', key: 'carbs' as const },
    { label: 'Fat', value: meal.fat, target: 85, unit: 'g', color: '#fbbf24', key: 'fat' as const },
    { label: 'Water', value: meal.water, target: 128, unit: 'oz', color: '#818cf8', key: 'water' as const },
  ]

  const avgSleep = SLEEP_DATA.reduce((a, b) => a + b, 0) / SLEEP_DATA.length
  const maxSleep = Math.max(...SLEEP_DATA)
  const minSleep = Math.min(...SLEEP_DATA)

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    padding: '8px 10px',
    color: 'var(--text-2)',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '32px', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
          FUEL
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
          Nutrition & Recovery
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Macros header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Daily Targets
          </div>
          <button
            onClick={() => {
              if (editing) {
                handleSave()
              } else {
                setForm(meal)
                setEditing(true)
              }
            }}
            style={{
              padding: '6px 14px',
              background: editing ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
              border: 'none',
              borderRadius: '6px',
              color: editing ? '#fff' : '#f57e44',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border)', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {MACROS.map((m) => (
                <div key={m.key}>
                  <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>
                    {m.label} ({m.unit})
                  </label>
                  <input
                    type="number"
                    value={form[m.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [m.key]: parseFloat(e.target.value) || 0 }))}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {MACROS.map((macro) => {
              const pct = Math.min(100, (macro.value / macro.target) * 100)
              return (
                <div key={macro.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '13px', color: 'var(--text-2)' }}>
                      {macro.label}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: macro.color }}>
                      {macro.value} / {macro.target} {macro.unit}
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: macro.color, borderRadius: '6px', transition: 'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Macro split pie-like display */}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
          Macro Split
        </div>
        <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border)', marginBottom: '24px' }}>
          {/* Visual bar */}
          <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
            {[
              { color: '#60a5fa', pct: (meal.carbs * 4 / (meal.carbs * 4 + meal.protein * 4 + meal.fat * 9)) * 100 },
              { color: '#4ade80', pct: (meal.protein * 4 / (meal.carbs * 4 + meal.protein * 4 + meal.fat * 9)) * 100 },
              { color: '#fbbf24', pct: (meal.fat * 9 / (meal.carbs * 4 + meal.protein * 4 + meal.fat * 9)) * 100 },
            ].map((seg, i) => (
              <div key={i} style={{ width: `${seg.pct}%`, background: seg.color, height: '100%' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { label: 'Carbs', color: '#60a5fa', cals: meal.carbs * 4 },
              { label: 'Protein', color: '#4ade80', cals: meal.protein * 4 },
              { label: 'Fat', color: '#fbbf24', cals: meal.fat * 9 },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color }} />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {m.label}
                  </span>
                </div>
                <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '18px', color: m.color }}>
                  {m.cals}
                </span>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '10px', color: 'var(--text-5)', marginLeft: '2px' }}>cal</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep chart */}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
          Sleep — Last {SLEEP_DATA.length} Days
        </div>
        <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border)', marginBottom: '16px' }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {[
              { label: 'Average', value: avgSleep.toFixed(1) },
              { label: 'Best', value: maxSleep.toFixed(1) },
              { label: 'Worst', value: minSleep.toFixed(1) },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '24px', color: '#f57e44', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '9px', color: 'var(--text-5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label} hrs</div>
              </div>
            ))}
          </div>
          {/* Bar chart */}
          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '60px' }}>
            {SLEEP_DATA.map((hrs, i) => {
              const pct = (hrs / 10) * 100
              const isGood = hrs >= 8
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${pct}%`,
                    background: isGood ? 'linear-gradient(to top, #e35d2a, #f57e44)' : 'var(--border-2)',
                    borderRadius: '2px 2px 0 0',
                    position: 'relative',
                  }}
                  title={`${hrs}h`}
                />
              )
            })}
          </div>
          {/* Goal line label */}
          <div style={{ textAlign: 'right', marginTop: '4px', fontFamily: "'Space Mono', monospace", fontSize: '9px', color: 'var(--text-5)' }}>
            Target: 9 hrs
          </div>
        </div>

        {/* Meal plan tips */}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
          Performance Nutrition Tips
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: '⏰', tip: 'Eat within 30 min post-practice — protein + fast carbs for recovery.' },
            { icon: '💧', tip: `Target ${meal.water}oz water daily. Divide into ${Math.round(meal.water / 8)} glasses.` },
            { icon: '🥩', tip: `Hit ${meal.protein}g protein daily. Spread across 4-5 meals, not one big one.` },
            { icon: '🌙', tip: 'Casein protein before bed (Greek yogurt, cottage cheese) supports overnight recovery.' },
          ].map((item, i) => (
            <div
              key={i}
              style={{ background: 'var(--bg-2)', borderRadius: '8px', padding: '12px 14px', border: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5 }}>{item.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
