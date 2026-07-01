'use client'

import { useState } from 'react'
import { DEFAULT_MEAL, DEFAULT_DAILY_MEALS } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import type { MealPlan } from '@/lib/types'

const SLEEP_DATA = [7.5, 9, 8.5, 9, 7, 8, 9.5, 8, 9, 8.5, 7, 9, 9, 8]

const MEAL_ICONS: Record<string, string> = {
  Breakfast: '🍳',
  Lunch: '🥗',
  Dinner: '🍽️',
  Snack: '🥤',
}

// Ring (SVG donut) — theme-aware via CSS vars
function Ring({ value, target, color, size = 132 }: { value: number; target: number; color: string; size?: number }) {
  const stroke = 11
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, target === 0 ? 0 : value / target))
  const offset = c * (1 - pct)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--prog-track)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 5px ${color}66)` }}
      />
    </svg>
  )
}

export default function FuelPage() {
  const [meal, setMeal] = useState<MealPlan>(() =>
    loadData<MealPlan>('braelentless_meal', DEFAULT_MEAL)
  )
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<MealPlan>(meal)
  const [water, setWater] = useState<number>(() => loadData<number>('braelentless_water_today', 0))

  function handleSave() {
    setMeal(form)
    saveData('braelentless_meal', form)
    setEditing(false)
  }

  const TARGETS = { calories: 2600, protein: 140, carbs: 300, fat: 85, water: 128 }

  const RINGS = [
    { label: 'Calories', value: meal.calories, target: TARGETS.calories, unit: 'kcal', color: '#f57e44' },
    { label: 'Protein', value: meal.protein, target: TARGETS.protein, unit: 'g', color: '#cbb89a' },
    { label: 'Carbs', value: meal.carbs, target: TARGETS.carbs, unit: 'g', color: '#8aa0b5' },
    { label: 'Fat', value: meal.fat, target: TARGETS.fat, unit: 'g', color: '#fbbf24' },
  ]

  const FORM_FIELDS = [
    { label: 'Calories', unit: 'kcal', key: 'calories' as const },
    { label: 'Protein', unit: 'g', key: 'protein' as const },
    { label: 'Carbs', unit: 'g', key: 'carbs' as const },
    { label: 'Fat', unit: 'g', key: 'fat' as const },
    { label: 'Water', unit: 'oz', key: 'water' as const },
  ]

  const macroCalBase = meal.carbs * 4 + meal.protein * 4 + meal.fat * 9 || 1
  const MACRO_SPLIT = [
    { label: 'Carbs', color: '#8aa0b5', cals: meal.carbs * 4 },
    { label: 'Protein', color: '#cbb89a', cals: meal.protein * 4 },
    { label: 'Fat', color: '#fbbf24', cals: meal.fat * 9 },
  ]

  const avgSleep = SLEEP_DATA.reduce((a, b) => a + b, 0) / SLEEP_DATA.length
  const maxSleep = Math.max(...SLEEP_DATA)
  const minSleep = Math.min(...SLEEP_DATA)

  // Hydration — track glasses (8oz) up to target
  const glassesTarget = Math.round(meal.water / 8)
  const waterPct = meal.water === 0 ? 0 : Math.min(100, (water / meal.water) * 100)
  function setWaterOz(oz: number) {
    const next = Math.max(0, oz)
    setWater(next)
    saveData('braelentless_water_today', next)
  }

  const mealTotal = DEFAULT_DAILY_MEALS.reduce((s, m) => s + m.calories, 0)

  const inputStyle: React.CSSProperties = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 8,
    padding: '10px 12px',
    color: 'var(--text)',
    fontFamily: "'Teko', sans-serif",
    fontWeight: 600,
    fontSize: 20,
    outline: 'none',
    width: '100%',
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '48px', position: 'relative' }}>
      {/* Cinematic ambient background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url(/soccer-field.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      />

      {/* ── HERO ── */}
      <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div
          className="animate-kenburns"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage: 'url(/soccer-field.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,7,6,0.42) 0%, rgba(10,7,6,0.82) 60%, rgba(8,5,3,1) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f57e44 20%, #f57e44 80%, transparent)' }} />

        <div
          className="dashboard-content"
          style={{ position: 'relative', zIndex: 1, paddingTop: '54px', paddingBottom: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '230px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginBottom: 16 }}>
            <span className="countdown-pill">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f57e44', boxShadow: '0 0 8px #f57e44', display: 'inline-block' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f57e44' }}>
                Fuel the machine
              </span>
            </span>
          </div>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(34px, 6.5vw, 60px)', color: '#ffffff', letterSpacing: '0.03em', lineHeight: 0.95, textShadow: '0 2px 22px rgba(0,0,0,0.9)' }}>
            FUEL
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '13px', color: '#c8a890', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '8px' }}>
            Macros · Meal Plan · Hydration · Recovery
          </div>
        </div>
      </div>

      {/* ── STATS RIBBON ── */}
      <div style={{ background: 'linear-gradient(90deg, #e35d2a, #f57e44, #e35d2a)', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="dashboard-content" style={{ display: 'flex', padding: 0 }}>
          {[
            { value: meal.calories, unit: 'KCAL' },
            { value: `${meal.protein}g`, unit: 'PROTEIN' },
            { value: `${meal.water}oz`, unit: 'WATER' },
            { value: avgSleep.toFixed(1), unit: 'AVG SLEEP' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.2)' : 'none' }}>
              <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(26px, 4vw, 34px)', color: '#0a0706', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(10,7,6,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── DAILY TARGETS ── */}
        <div className="section-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-header-bar" />
            <div className="section-header-text">DAILY TARGETS</div>
          </div>
          <button
            onClick={() => {
              if (editing) handleSave()
              else { setForm(meal); setEditing(true) }
            }}
            style={{
              padding: '7px 16px',
              background: editing ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'transparent',
              border: editing ? 'none' : '1px solid rgba(245,126,68,0.4)',
              borderRadius: 8,
              color: editing ? '#fff' : '#f57e44',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              cursor: 'pointer',
            }}
          >
            {editing ? 'Save' : 'Edit Targets'}
          </button>
        </div>

        {editing ? (
          <div className="tile-card" style={{ padding: '20px 22px', marginBottom: 8 }}>
            <div className="fuel-form-grid">
              {FORM_FIELDS.map((m) => (
                <div key={m.key}>
                  <label style={{ display: 'block', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
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
          <div className="fuel-ring-grid">
            {RINGS.map((m) => {
              const pct = Math.round(m.target === 0 ? 0 : (m.value / m.target) * 100)
              return (
                <div key={m.label} className="tile-card" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ring value={m.value} target={m.target} color={m.color} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 40, color: 'var(--text)', lineHeight: 0.85 }}>{m.value}</span>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: m.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.unit}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                  <div style={{ marginTop: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-4)' }}>
                    {pct}% · target {m.target}{m.unit === 'kcal' ? '' : m.unit}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── MEAL PLAN + MACRO SPLIT ── */}
        <div className="fuel-two-col">
          {/* Daily meal plan */}
          <div>
            <div className="section-header" style={{ paddingTop: 28, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="section-header-bar" />
                <div className="section-header-text">DAILY MEAL PLAN</div>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-4)' }}>{mealTotal} kcal</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEFAULT_DAILY_MEALS.map((m) => (
                <div key={m.id} className="tile-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,126,68,0.12)', border: '1px solid rgba(245,126,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                    {MEAL_ICONS[m.label] ?? '🍴'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{m.label}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.4, marginTop: 2 }}>{m.description}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 26, color: '#f57e44', lineHeight: 1 }}>{m.calories}</span>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9, color: 'var(--text-5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: macro split + hydration */}
          <div>
            <div className="section-header" style={{ paddingTop: 28 }}>
              <div className="section-header-bar" />
              <div className="section-header-text">MACRO SPLIT</div>
            </div>
            <div className="tile-card" style={{ padding: '18px 20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 16 }}>
                {MACRO_SPLIT.map((seg) => (
                  <div key={seg.label} style={{ width: `${(seg.cals / macroCalBase) * 100}%`, background: seg.color, height: '100%' }} title={`${seg.label} ${Math.round((seg.cals / macroCalBase) * 100)}%`} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {MACRO_SPLIT.map((m) => (
                  <div key={m.label} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</span>
                    </div>
                    <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 24, color: m.color, lineHeight: 1 }}>{Math.round((m.cals / macroCalBase) * 100)}%</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-5)' }}>{m.cals} cal</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hydration tracker */}
            <div className="section-header" style={{ paddingTop: 4 }}>
              <div className="section-header-bar" />
              <div className="section-header-text">HYDRATION</div>
            </div>
            <div className="tile-card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 46, color: '#8aa0b5', lineHeight: 0.9 }}>{water}</span>
                  <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 500, fontSize: 22, color: 'var(--text-4)' }}>/ {meal.water} oz</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#8aa0b5' }}>{Math.round(waterPct)}%</span>
              </div>
              <div className="prog-track" style={{ height: 8, marginBottom: 16 }}>
                <div className="prog-fill" style={{ width: `${waterPct}%`, background: 'linear-gradient(90deg, #6f889e, #8aa0b5)' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {Array.from({ length: glassesTarget }).map((_, i) => {
                  const filled = water >= (i + 1) * 8
                  return (
                    <button
                      key={i}
                      onClick={() => setWaterOz(filled ? i * 8 : (i + 1) * 8)}
                      title={`${(i + 1) * 8} oz`}
                      style={{
                        width: 30,
                        height: 38,
                        borderRadius: '5px 5px 8px 8px',
                        border: `1px solid ${filled ? '#8aa0b5' : 'var(--border-2)'}`,
                        background: filled ? 'rgba(138,160,181,0.25)' : 'var(--bg-3)',
                        boxShadow: filled ? '0 0 10px rgba(138,160,181,0.4)' : 'none',
                        cursor: 'pointer',
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {filled ? '💧' : ''}
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setWaterOz(water + 8)}
                  style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid rgba(138,160,181,0.4)', background: 'rgba(138,160,181,0.12)', color: '#8aa0b5', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                >
                  + Glass (8oz)
                </button>
                <button
                  onClick={() => setWaterOz(0)}
                  style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border-2)', background: 'var(--bg-3)', color: 'var(--text-4)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SLEEP & RECOVERY ── */}
        <div className="section-header" style={{ paddingTop: 30 }}>
          <div className="section-header-bar" />
          <div className="section-header-text">SLEEP · LAST {SLEEP_DATA.length} DAYS</div>
        </div>
        <div className="tile-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'Average', value: avgSleep.toFixed(1), color: '#f57e44' },
              { label: 'Best', value: maxSleep.toFixed(1), color: '#f57e44' },
              { label: 'Worst', value: minSleep.toFixed(1), color: 'var(--text-3)' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 36, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 9.5, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label} hrs</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 90 }}>
            {SLEEP_DATA.map((hrs, i) => {
              const pct = (hrs / 10) * 100
              const isGood = hrs >= 8
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }} title={`${hrs}h`}>
                  <div
                    style={{
                      height: `${pct}%`,
                      background: isGood ? 'linear-gradient(to top, #e35d2a, #f57e44)' : 'var(--border-2)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.3s',
                    }}
                  />
                </div>
              )
            })}
          </div>
          <div style={{ textAlign: 'right', marginTop: 6, fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-5)' }}>
            Target: 9 hrs · bars at 8h+ glow orange
          </div>
        </div>

        {/* ── NUTRITION TIPS ── */}
        <div className="section-header" style={{ paddingTop: 30 }}>
          <div className="section-header-bar" />
          <div className="section-header-text">PERFORMANCE NUTRITION TIPS</div>
        </div>
        <div className="fuel-tips-grid">
          {[
            { icon: '⏰', title: 'Refuel Window', tip: 'Eat within 30 min post-practice. Protein plus fast carbs jump-starts recovery.' },
            { icon: '💧', title: 'Stay Ahead of Thirst', tip: `Target ${meal.water}oz daily. Sip across the day in roughly ${glassesTarget} glasses, do not chug.` },
            { icon: '🥩', title: 'Spread the Protein', tip: `Hit ${meal.protein}g daily, split across 4-5 meals, not one big one, for steady muscle repair.` },
            { icon: '🌙', title: 'Overnight Repair', tip: 'Slow protein before bed (Greek yogurt, cottage cheese) feeds muscles while you sleep.' },
          ].map((item, i) => (
            <div key={i} className="tile-card" style={{ padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,126,68,0.1)', border: '1px solid rgba(245,126,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 19 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{item.tip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout helpers scoped to this page */}
      <style>{`
        .fuel-ring-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 900px) { .fuel-ring-grid { grid-template-columns: repeat(4, 1fr); } }

        .fuel-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (min-width: 700px) { .fuel-form-grid { grid-template-columns: repeat(5, 1fr); } }

        .fuel-two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px 28px;
        }
        @media (min-width: 980px) { .fuel-two-col { grid-template-columns: 1.1fr 1fr; align-items: start; } }

        .fuel-tips-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 700px) { .fuel-tips-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </div>
  )
}
