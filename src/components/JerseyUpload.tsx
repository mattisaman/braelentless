'use client'

import { useState, useEffect, useRef } from 'react'
import { loadData, saveData } from '@/lib/storage'
import { fileToResizedDataUrl } from '@/lib/media'

export default function JerseyUpload({
  storageKey,
  caption,
  color = '#f57e44',
  height = 300,
}: {
  storageKey: string
  caption: string
  color?: string
  height?: number
}) {
  const [img, setImg] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setImg(loadData<string>(storageKey, '')) }, [storageKey])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    try {
      const url = await fileToResizedDataUrl(f, 1100, 0.85)
      setImg(url)
      saveData(storageKey, url)
    } finally { setBusy(false) }
  }

  return (
    <div
      className="tile-card"
      style={{ position: 'relative', height, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-2)' }}
    >
      {img ? (
        <img src={img} alt={caption} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0b0908' }} />
      ) : (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 34, marginBottom: 10, opacity: 0.5 }}>👕</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{caption}</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'var(--text-4)', marginTop: 4 }}>Upload a photo to hang it here + in the Trophy Hall</div>
        </div>
      )}

      {/* caption + control overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 12px', background: 'linear-gradient(to top, rgba(8,5,3,0.9), transparent)' }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{caption}</span>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}66`, color, borderRadius: 6, padding: '5px 11px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {busy ? 'Saving…' : img ? 'Replace' : 'Upload'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
    </div>
  )
}
