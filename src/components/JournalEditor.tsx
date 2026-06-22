'use client'

import { useState, useEffect } from 'react'
import type { JournalEntry } from '@/lib/types'
import { JOURNAL_PROMPTS, DEFAULT_JOURNAL } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'

const STORAGE_KEY = 'braelentless_journal'

function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

function getPrompt(type: 'reflect' | 'forward', index: number) {
  const prompts = JOURNAL_PROMPTS[type]
  return prompts[index % prompts.length]
}

export default function JournalEditor() {
  const [entries, setEntries] = useState<JournalEntry[]>(() =>
    loadData<JournalEntry[]>(STORAGE_KEY, DEFAULT_JOURNAL)
  )
  const [entryType, setEntryType] = useState<'reflect' | 'forward'>('reflect')
  // Use a fixed index initially to avoid hydration mismatch; randomize after mount
  const [promptIndex, setPromptIndex] = useState(0)
  const [content, setContent] = useState('')
  const [activePrompt, setActivePrompt] = useState(getPrompt('reflect', 0))

  useEffect(() => {
    // Randomize prompt only on the client after hydration
    const idx = Math.floor(Math.random() * JOURNAL_PROMPTS['reflect'].length)
    setPromptIndex(idx)
    setActivePrompt(getPrompt('reflect', idx))
  }, [])

  function handleTypeChange(type: 'reflect' | 'forward') {
    setEntryType(type)
    const idx = Math.floor(Math.random() * JOURNAL_PROMPTS[type].length)
    setPromptIndex(idx)
    setActivePrompt(getPrompt(type, idx))
  }

  function shufflePrompt() {
    const prompts = JOURNAL_PROMPTS[entryType]
    const idx = (promptIndex + 1) % prompts.length
    setPromptIndex(idx)
    setActivePrompt(getPrompt(entryType, idx))
  }

  function handleSubmit() {
    if (!content.trim()) return
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: getTodayISO(),
      type: entryType,
      prompt: activePrompt,
      content: content.trim(),
    }
    const updated = [newEntry, ...entries]
    setEntries(updated)
    saveData(STORAGE_KEY, updated)
    setContent('')
  }

  const accent = entryType === 'reflect' ? 'var(--accent-blue)' : '#f57e44'

  return (
    <div>
      {/* Type toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {(['reflect', 'forward'] as const).map((t) => {
          const active = entryType === t
          const c = t === 'reflect' ? 'var(--accent-blue)' : '#f57e44'
          return (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              style={{
                flex: 1,
                padding: '13px',
                borderRadius: '10px',
                border: `1px solid ${active ? c : 'var(--border)'}`,
                background: active ? `color-mix(in srgb, ${c} 14%, transparent)` : 'var(--bg-2)',
                color: active ? c : 'var(--text-4)',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >
              {t === 'reflect' ? 'Looking Back' : 'Looking Forward'}
            </button>
          )
        })}
      </div>

      {/* Prompt card */}
      <div
        style={{
          position: 'relative',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${accent}`,
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', color: accent, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '5px' }}>
            Prompt
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.45 }}>
            {activePrompt}
          </div>
        </div>
        <button
          onClick={shufflePrompt}
          title="New prompt"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-2)',
            borderRadius: '8px',
            color: 'var(--text-4)',
            cursor: 'pointer',
            padding: '8px 12px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-4)' }}
        >
          ↻ New
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder="Write your thoughts..."
        style={{
          width: '100%',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '14px',
          color: 'var(--text-2)',
          fontFamily: "'Barlow', sans-serif",
          fontSize: '15px',
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
          marginBottom: '12px',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '13px',
          background: content.trim() ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
          border: 'none',
          borderRadius: '10px',
          color: content.trim() ? '#fff' : 'var(--text-5)',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          cursor: content.trim() ? 'pointer' : 'default',
          transition: 'background 0.2s',
          marginBottom: '28px',
        }}
      >
        Save Entry
      </button>

      {/* Past entries */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
          }}
        >
          Past Entries
        </span>
        {entries.length > 0 && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-5)' }}>
            {entries.length} logged
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {entries.length === 0 && (
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '13px',
              color: 'var(--text-5)',
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            No entries yet. Write your first one above.
          </div>
        )}
        {entries.map((entry) => {
          const c = entry.type === 'reflect' ? 'var(--accent-blue)' : '#f57e44'
          return (
            <div
              key={entry.id}
              style={{
                background: 'var(--bg-2)',
                borderRadius: '10px',
                padding: '15px 17px',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${c}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '10px',
                    color: c,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}
                >
                  {entry.type === 'reflect' ? 'Looking Back' : 'Looking Forward'}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '10px',
                    color: 'var(--text-5)',
                  }}
                >
                  {new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontStyle: 'italic',
                  fontSize: '12px',
                  color: 'var(--text-4)',
                  marginBottom: '7px',
                }}
              >
                {entry.prompt}
              </div>
              <div
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '14px',
                  color: 'var(--text-2)',
                  lineHeight: 1.55,
                }}
              >
                {entry.content}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
