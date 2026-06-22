'use client'

import { useState } from 'react'
import { DEFAULT_BOOKS, DEFAULT_VIDEOS, DEFAULT_JOURNAL } from '@/lib/data'
import { loadData, saveData } from '@/lib/storage'
import JournalEditor from '@/components/JournalEditor'
import VideoCard from '@/components/VideoCard'
import ProgressBar from '@/components/ProgressBar'
import type { Book, VideoEntry } from '@/lib/types'

type MindTab = 'reflect' | 'read' | 'watch'

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

  const STATUS_LABELS: Record<Book['status'], string> = {
    reading: 'Reading',
    completed: 'Done',
    'want-to-read': 'Want to Read',
  }
  const STATUS_COLORS: Record<Book['status'], string> = {
    reading: '#f57e44',
    completed: '#4ade80',
    'want-to-read': '#60a5fa',
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    padding: '10px 12px',
    color: 'var(--text-2)',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '13px',
    outline: 'none',
  }
  const labelStyle = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: '11px',
    color: 'var(--text-4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '32px', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
          MIND / R&amp;R
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: '12px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
          Reflect · Read · Watch
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', margin: '16px 0 0' }}>
        {([['reflect', 'REFLECT'], ['read', 'READ'], ['watch', 'WATCH']] as [MindTab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px 4px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: tab === t ? '#f57e44' : 'var(--text-5)',
              borderBottom: tab === t ? '2px solid #f57e44' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* REFLECT TAB */}
        {tab === 'reflect' && <JournalEditor />}

        {/* READ TAB */}
        {tab === 'read' && (
          <>
            <button
              onClick={() => setShowBookForm((v) => !v)}
              style={{
                width: '100%', padding: '12px',
                background: showBookForm ? 'var(--border)' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
                border: 'none', borderRadius: '8px',
                color: showBookForm ? '#f57e44' : '#fff',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              {showBookForm ? '✕ Cancel' : '+ Add Book'}
            </button>

            {showBookForm && (
              <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-2)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input type="text" value={bookForm.title} onChange={(e) => setBookForm((f) => ({ ...f, title: e.target.value }))} placeholder="Book title" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Author</label>
                  <input type="text" value={bookForm.author} onChange={(e) => setBookForm((f) => ({ ...f, author: e.target.value }))} placeholder="Author name" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                </div>
                <div>
                  <label style={labelStyle}>Note</label>
                  <input type="text" value={bookForm.note} onChange={(e) => setBookForm((f) => ({ ...f, note: e.target.value }))} placeholder="Key takeaway or reason to read..." style={inputStyle} />
                </div>
                <button
                  onClick={addBook}
                  style={{
                    padding: '12px',
                    background: bookForm.title ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
                    border: 'none', borderRadius: '8px',
                    color: bookForm.title ? '#fff' : 'var(--text-5)',
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    cursor: bookForm.title ? 'pointer' : 'default',
                  }}
                >
                  Add to Reading List
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {books.map((book) => {
                const color = STATUS_COLORS[book.status]
                return (
                  <div key={book.id} style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '14px 16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {book.title}
                        </div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '12px', color: 'var(--text-4)' }}>
                          {book.author}
                        </div>
                      </div>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', color, background: color + '22', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
                        {STATUS_LABELS[book.status]}
                      </span>
                    </div>
                    {book.note && (
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontStyle: 'italic', fontSize: '12px', color: 'var(--text-4)', marginBottom: '8px', lineHeight: 1.5 }}>
                        &ldquo;{book.note}&rdquo;
                      </div>
                    )}
                    {book.pct > 0 && <ProgressBar pct={book.pct} height={4} showLabel />}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* WATCH TAB */}
        {tab === 'watch' && (
          <>
            <button
              onClick={() => setShowVideoForm((v) => !v)}
              style={{
                width: '100%', padding: '12px',
                background: showVideoForm ? 'var(--border)' : 'linear-gradient(135deg, #e35d2a, #f57e44)',
                border: 'none', borderRadius: '8px',
                color: showVideoForm ? '#f57e44' : '#fff',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              {showVideoForm ? '✕ Cancel' : '+ Add Video'}
            </button>

            {showVideoForm && (
              <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-2)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input type="text" value={videoForm.title} onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))} placeholder="Video title" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>YouTube / Vimeo URL</label>
                  <input type="url" value={videoForm.url} onChange={(e) => setVideoForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                </div>
                <div>
                  <label style={labelStyle}>Notes</label>
                  <input type="text" value={videoForm.notes} onChange={(e) => setVideoForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Notes for recruiters..." style={inputStyle} />
                </div>
                <button
                  onClick={addVideo}
                  style={{
                    padding: '12px',
                    background: videoForm.title && videoForm.url ? 'linear-gradient(135deg, #e35d2a, #f57e44)' : 'var(--border)',
                    border: 'none', borderRadius: '8px',
                    color: videoForm.title && videoForm.url ? '#fff' : 'var(--text-5)',
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    cursor: videoForm.title && videoForm.url ? 'pointer' : 'default',
                  }}
                >
                  Add Video
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
              {videos.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-5)', fontSize: '13px', padding: '32px 0' }}>
                  No videos yet. Add one above.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
