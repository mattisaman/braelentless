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
    setActivePrompt(getPrompt(type, idx))
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

  return (
    <div>
      {/* Type toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['reflect', 'forward'] as const).map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: `1px solid ${entryType === t ? '#f57e44' : 'var(--border)'}`,
              background: entryType === t ? '#f57e4422' : 'var(--bg-2)',
              color: entryType === t ? '#f57e44' : 'var(--text-4)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            {t === 'reflect' ? 'Looking Back' : 'Looking Forward'}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontStyle: 'italic',
          fontSize: '13px',
          color: '#a08070',
          marginBottom: '10px',
          lineHeight: 1.5,
        }}
      >
        {activePrompt}
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="Write your thoughts..."
        style={{
          width: '100%',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px',
          color: 'var(--text-2)',
          fontFamily: "'Barlow', sans-serif",
          fontSize: '14px',
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
          marginBottom: '10px',
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '12px',
          background: content.trim() ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
          border: 'none',
          borderRadius: '8px',
          color: content.trim() ? '#fff' : 'var(--text-5)',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: content.trim() ? 'pointer' : 'default',
          transition: 'background 0.2s',
          marginBottom: '24px',
        }}
      >
        Save Entry
      </button>

      {/* Past entries */}
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '11px',
          color: 'var(--text-4)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '10px',
        }}
      >
        Past Entries
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
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              background: 'var(--bg-2)',
              borderRadius: '8px',
              padding: '14px 16px',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
              }}
            >
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '10px',
                  color: entry.type === 'reflect' ? '#60a5fa' : '#f57e44',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
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
                fontSize: '11px',
                color: 'var(--text-5)',
                marginBottom: '6px',
              }}
            >
              {entry.prompt}
            </div>
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '13px',
                color: 'var(--text-2)',
                lineHeight: 1.5,
              }}
            >
              {entry.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
