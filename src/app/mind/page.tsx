'use client'

import { useState } from 'react'
import { DEFAULT_BOOKS, DEFAULT_VIDEOS, DEFAULT_HABITS, MOTIVATION_QUOTES } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import JournalEditor from '@/components/JournalEditor'
import VideoCard from '@/components/VideoCard'
import type { Book, VideoEntry } from '@/lib/types'

type MindTab = 'reflect' | 'read' | 'watch'

const TABS: [MindTab, string, string][] = [
  ['reflect', 'Reflect', 'Journal'],
  ['read', 'Read', 'Library'],
  ['watch', 'Watch', 'Film'],
]

const STATUS_LABELS: Record<Book['status'], string> = {
  reading: 'Reading',
  completed: 'Done',
  'want-to-read': 'Want to Read',
}
const STATUS_COLORS: Record<Book['status'], string> = {
  reading: '#f57e44',
  completed: 'var(--accent-green)',
  'want-to-read': 'var(--accent-blue)',
}

export default function MindPage() {
  const [tab, setTab] = useState<MindTab>('reflect')
  const [books, setBooks] = useState<Book[]>(() =>
    loadData<Book[]>('braelentless_books', DEFAULT_BOOKS)
  )
  const [videos, setVideos] = useState<VideoEntry[]>(() =>
    loadData<VideoEntry[]>('braelentless_videos', DEFAULT_VIDEOS)
  )

  // Book form
  const [showBookForm, setShowBookForm] = useState(false)
  const [bookForm, setBookForm] = useState({ title: '', author: '', status: 'want-to-read' as Book['status'], note: '', pct: '' })

  // Video form
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [videoForm, setVideoForm] = useState({ title: '', url: '', type: 'Highlight' as VideoEntry['type'], sport: 'basketball' as VideoEntry['sport'], notes: '' })

  // Quote of the day (stable index, no hydration concern — no Date used)
  const quote = MOTIVATION_QUOTES[MOTIVATION_QUOTES.length - 1]

  function addBook() {
    if (!bookForm.title) return
    const newBook: Book = {
      id: `b-${Date.now()}`,
      title: bookForm.title,
      author: bookForm.author,
      status: bookForm.status,
      note: bookForm.note,
      pct: parseFloat(bookForm.pct) || 0,
    }
    const updated = [newBook, ...books]
    setBooks(updated)
    saveData('braelentless_books', updated)
    setBookForm({ title: '', author: '', status: 'want-to-read', note: '', pct: '' })
    setShowBookForm(false)
  }

  function addVideo() {
    if (!videoForm.title || !videoForm.url) return
    const newVideo: VideoEntry = {
      id: `v-${Date.now()}`,
      title: videoForm.title,
      url: videoForm.url,
      type: videoForm.type,
      sport: videoForm.sport,
      notes: videoForm.notes,
    }
    const updated = [newVideo, ...videos]
    setVideos(updated)
    saveData('braelentless_videos', updated)
    setVideoForm({ title: '', url: '', type: 'Highlight', sport: 'basketball', notes: '' })
    setShowVideoForm(false)
  }

  // Reading-list aggregates
  const readingCount = books.filter((b) => b.status === 'reading').length
  const doneCount = books.filter((b) => b.status === 'completed').length
  const queueCount = books.filter((b) => b.status === 'want-to-read').length
  const avgProgress = books.length
    ? Math.round(books.reduce((s, b) => s + b.pct, 0) / books.length)
    : 0

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
  const addBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '12px 22px',
    background: active ? 'var(--border)' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
    border: active ? '1px solid rgba(245,126,68,0.4)' : 'none',
    borderRadius: '10px',
    color: active ? '#f57e44' : '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '48px', position: 'relative' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/track-night.png)',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        opacity: 0.05, pointerEvents: 'none',
      }} />

      {/* ── HERO BAND ── */}
      <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div className="animate-kenburns" style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/track-night.png)',
          backgroundSize: 'cover', backgroundPosition: 'center 35%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(8,5,3,0.92) 0%, rgba(8,5,3,0.72) 55%, rgba(8,5,3,0.55) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f57e44 20%, #f57e44 80%, transparent)' }} />
        <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, paddingTop: '46px', paddingBottom: '28px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: '#f57e44', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '8px' }}>
            Mental Performance &amp; Recovery
          </div>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(34px, 6vw, 60px)', color: '#fff', letterSpacing: '0.03em', lineHeight: 0.92, textShadow: '0 2px 22px rgba(0,0,0,0.9)' }}>
            MIND / R&amp;R
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: 'clamp(14px, 1.8vw, 18px)', color: '#c8a890', marginTop: '12px', maxWidth: '620px', lineHeight: 1.5 }}>
            The work between the work. Reflect with intent, feed the mind, study the film. This is where the edge is built.
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="dashboard-content" style={{ display: 'flex', gap: '4px' }}>
          {TABS.map(([t, label, sub]) => {
            const active = tab === t
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: '1 1 0', padding: '15px 8px', border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: active ? '3px solid #f57e44' : '3px solid transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '16px', letterSpacing: '0.05em', color: active ? '#f57e44' : 'var(--text-3)', transition: 'color 0.2s' }}>
                  {label.toUpperCase()}
                </span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: active ? '#f57e44' : 'var(--text-5)' }}>
                  {sub}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="dashboard-content" style={{ position: 'relative', zIndex: 1, paddingTop: '24px' }}>

        {/* REFLECT */}
        {tab === 'reflect' && (
          <div className="mind-reflect-grid">
            <div>
              <div className="section-header" style={{ paddingTop: 0 }}>
                <div className="section-header-bar" />
                <div className="section-header-text">Today&apos;s Reflection</div>
              </div>
              <JournalEditor />
            </div>
            <div className="mind-reflect-aside">
              <div className="quote-band">
                <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontStyle: 'italic', fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text)', lineHeight: 1.45 }}>
                  {quote.text}
                </div>
                <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f57e44', marginTop: 14 }}>
                  — {quote.author}
                </div>
              </div>

              <div className="tile-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  WHY YOU JOURNAL
                </div>
                {[
                  ['Looking Back', 'Audit the reps. Name what worked and what broke down.', 'var(--accent-blue)'],
                  ['Looking Forward', 'Set the target. Decide who you become this week.', '#f57e44'],
                ].map(([h, d, c]) => (
                  <div key={h} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '4px', alignSelf: 'stretch', borderRadius: '2px', background: c, flexShrink: 0, minHeight: '38px' }} />
                    <div>
                      <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: 'var(--text-4)', lineHeight: 1.5, marginTop: '2px' }}>{d}</div>
                    </div>
                  </div>
                ))}
                <div style={{ fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: '12.5px', color: 'var(--text-4)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '2px' }}>
                  Clarity compounds. Two minutes a day keeps the mind as sharp as the body.
                </div>
              </div>

              {/* Mind & recovery habits */}
              <div className="tile-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  RECOVERY RHYTHMS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {DEFAULT_HABITS.map((h) => (
                    <div key={h.id} className="checklist-row" style={{ padding: '10px 0' }}>
                      <div className={`check-circle${h.completedToday ? ' done-green' : ''}`} style={{ width: 22, height: 22, cursor: 'default' }}>
                        {h.completedToday && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '13px', color: 'var(--text-2)' }}>{h.label}</span>
                      <span style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600, fontSize: '17px', color: '#f57e44', lineHeight: 1 }}>
                        {h.streak}<span style={{ fontSize: '10px', color: 'var(--text-5)', marginLeft: '3px', fontFamily: "'Barlow Condensed', sans-serif" }}>DAY</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* READ */}
        {tab === 'read' && (
          <>
            {/* Reading stats ribbon */}
            <div className="mind-stat-row">
              {[
                { value: readingCount, label: 'Reading', color: '#f57e44' },
                { value: doneCount, label: 'Finished', color: 'var(--accent-green)' },
                { value: queueCount, label: 'In Queue', color: 'var(--accent-blue)' },
                { value: `${avgProgress}%`, label: 'Avg Progress', color: 'var(--text-2)' },
              ].map((s) => (
                <div key={s.label} className="tile-card" style={{ padding: '16px 18px' }}>
                  <div style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 'clamp(30px, 4vw, 42px)', color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="section-header">
              <div className="section-header-bar" />
              <div className="section-header-text">The Reading List</div>
              <div style={{ marginLeft: 'auto' }}>
                <button onClick={() => setShowBookForm((v) => !v)} style={addBtnStyle(showBookForm)}>
                  {showBookForm ? '✕ Cancel' : '+ Add Book'}
                </button>
              </div>
            </div>

            {showBookForm && (
              <div className="tile-card" style={{ padding: '20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input type="text" value={bookForm.title} onChange={(e) => setBookForm((f) => ({ ...f, title: e.target.value }))} placeholder="Book title" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Author</label>
                  <input type="text" value={bookForm.author} onChange={(e) => setBookForm((f) => ({ ...f, author: e.target.value }))} placeholder="Author name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={bookForm.status} onChange={(e) => setBookForm((f) => ({ ...f, status: e.target.value as Book['status'] }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Progress (%)</label>
                  <input type="number" min="0" max="100" value={bookForm.pct} onChange={(e) => setBookForm((f) => ({ ...f, pct: e.target.value }))} placeholder="0" style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Note</label>
                  <input type="text" value={bookForm.note} onChange={(e) => setBookForm((f) => ({ ...f, note: e.target.value }))} placeholder="Key takeaway or reason to read..." style={inputStyle} />
                </div>
                <button onClick={addBook} style={{ ...addBtnStyle(false), gridColumn: '1 / -1', padding: '13px', background: bookForm.title ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)', color: bookForm.title ? '#fff' : 'var(--text-5)', cursor: bookForm.title ? 'pointer' : 'default' }}>
                  Add to Reading List
                </button>
              </div>
            )}

            <div className="mind-book-grid">
              {books.map((book) => {
                const color = STATUS_COLORS[book.status]
                return (
                  <div key={book.id} className="tile-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: '19px', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                          {book.title}
                        </div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: 'var(--text-4)', marginTop: '2px' }}>
                          {book.author}
                        </div>
                      </div>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color, background: `color-mix(in srgb, ${color} 15%, transparent)`, padding: '3px 9px', borderRadius: '5px', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {STATUS_LABELS[book.status]}
                      </span>
                    </div>
                    {book.note && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: '13px', color: 'var(--text-3)', marginBottom: '14px', lineHeight: 1.5, flex: 1 }}>
                        &ldquo;{book.note}&rdquo;
                      </div>
                    )}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Progress</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color }}>{Math.round(book.pct)}%</span>
                      </div>
                      <div className="prog-track">
                        <div className={`prog-fill${book.status === 'completed' ? ' prog-fill-green' : ''}`} style={{ width: `${Math.min(100, Math.max(0, book.pct))}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* WATCH */}
        {tab === 'watch' && (
          <>
            <div className="section-header" style={{ paddingTop: '4px' }}>
              <div className="section-header-bar" />
              <div className="section-header-text">Film Room</div>
              <div style={{ marginLeft: 'auto' }}>
                <button onClick={() => setShowVideoForm((v) => !v)} style={addBtnStyle(showVideoForm)}>
                  {showVideoForm ? '✕ Cancel' : '+ Add Video'}
                </button>
              </div>
            </div>

            {showVideoForm && (
              <div className="tile-card" style={{ padding: '20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'end' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Title</label>
                  <input type="text" value={videoForm.title} onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))} placeholder="Video title" style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>YouTube / Vimeo URL</label>
                  <input type="url" value={videoForm.url} onChange={(e) => setVideoForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={videoForm.type} onChange={(e) => setVideoForm((f) => ({ ...f, type: e.target.value as VideoEntry['type'] }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="Highlight">Highlight</option>
                    <option value="Footage">Footage</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Sport</label>
                  <select value={videoForm.sport} onChange={(e) => setVideoForm((f) => ({ ...f, sport: e.target.value as VideoEntry['sport'] }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="basketball">Basketball</option>
                    <option value="soccer">Soccer</option>
                    <option value="track">Track</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notes</label>
                  <input type="text" value={videoForm.notes} onChange={(e) => setVideoForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Notes for recruiters..." style={inputStyle} />
                </div>
                <button onClick={addVideo} style={{ ...addBtnStyle(false), gridColumn: '1 / -1', padding: '13px', background: videoForm.title && videoForm.url ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)', color: videoForm.title && videoForm.url ? '#fff' : 'var(--text-5)', cursor: videoForm.title && videoForm.url ? 'pointer' : 'default' }}>
                  Add Video
                </button>
              </div>
            )}

            <div className="mind-video-grid">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            {videos.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-5)', fontFamily: "'Barlow', sans-serif", fontSize: '14px', padding: '48px 0' }}>
                No videos yet. Add one above.
              </div>
            )}
          </>
        )}
      </div>

      {/* Layout styles (scoped, reuse design-system tokens) */}
      <style>{`
        .mind-reflect-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }
        .mind-reflect-aside { display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 980px) {
          .mind-reflect-grid { grid-template-columns: 1.5fr 1fr; align-items: start; }
        }
        .mind-stat-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 4px; }
        @media (min-width: 768px) { .mind-stat-row { grid-template-columns: repeat(4, 1fr); } }
        .mind-book-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) { .mind-book-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1100px) { .mind-book-grid { grid-template-columns: repeat(3, 1fr); } }
        .mind-video-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 768px) { .mind-video-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  )
}
