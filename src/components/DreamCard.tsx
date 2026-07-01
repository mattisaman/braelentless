'use client'

import { useState, useEffect, useRef } from 'react'
import type { Dream } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'
import { fileToResizedDataUrl, uploadVideo } from '@/lib/media'

type Media = { type: 'image' | 'video'; url: string } | null

export default function DreamCard({ dream, color }: { dream: Dream; color: string }) {
  const key = `braelentless_dream_media_${dream.id}`
  const [media, setMedia] = useState<Media>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMedia(loadData<Media>(key, null)) }, [key])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    try {
      if (f.type.startsWith('video/')) {
        const url = await uploadVideo(f)
        if (url) { const m: Media = { type: 'video', url }; setMedia(m); saveData(key, m) }
        else alert('Video upload needs you to be signed in. Try on the live site.')
      } else {
        const url = await fileToResizedDataUrl(f, 1000, 0.82)
        const m: Media = { type: 'image', url }; setMedia(m); saveData(key, m)
      }
    } finally { setBusy(false) }
  }

  const hasMedia = !!media
  return (
    <div className="dream-card" style={{ position: 'relative', overflow: 'hidden', minHeight: hasMedia ? 220 : undefined }}>
      {/* media background */}
      {media?.type === 'image' && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${media.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}
      {media?.type === 'video' && (
        <video src={media.url} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      {hasMedia && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,5,3,0.94) 0%, rgba(8,5,3,0.55) 55%, rgba(8,5,3,0.35) 100%)' }} />
      )}

      {/* content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: hasMedia ? 'flex-end' : 'flex-start' }}>
        <div style={{ position: 'absolute', top: -18, left: -18, right: -18, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>{dream.horizon}</div>
        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 800, fontSize: 19, color: 'var(--text)', textTransform: 'uppercase', lineHeight: 1.05, margin: '8px 0 6px' }}>{dream.title}</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5, minHeight: hasMedia ? undefined : 56 }}>{dream.detail}</div>
        {typeof dream.progress === 'number' && (
          <div style={{ marginTop: 14 }}>
            <div className="prog-track"><div className="prog-fill" style={{ width: `${dream.progress}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }} /></div>
          </div>
        )}
      </div>

      {/* upload control */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title="Add a photo or short looping video"
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, width: 28, height: 28, borderRadius: 8, border: `1px solid ${color}66`, background: 'rgba(0,0,0,0.55)', color, cursor: 'pointer', fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {busy ? '…' : hasMedia ? '↻' : '+'}
      </button>
      <input ref={inputRef} type="file" accept="image/*,video/*" onChange={onFile} style={{ display: 'none' }} />
    </div>
  )
}
