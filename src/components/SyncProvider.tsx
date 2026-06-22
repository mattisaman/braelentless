'use client'

import { useEffect, useState } from 'react'
import { hydrateFromSupabase } from '@/lib/storage'

/**
 * Pulls saved state from Supabase into localStorage before the app's
 * pages read it, so edits made on any device show up here. Shows a brief
 * branded splash while hydrating; falls through fast if Supabase is
 * unconfigured or slow (see hydrateFromSupabase timeout).
 */
export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    hydrateFromSupabase().finally(() => {
      if (mounted) setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          background: 'var(--bg)',
        }}
      >
        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '30px',
            letterSpacing: '0.04em',
            color: 'var(--text)',
          }}
        >
          BRAEL<span style={{ color: 'var(--accent)' }}>ENTLESS</span>
        </div>
        <div
          style={{
            width: '120px',
            height: '3px',
            borderRadius: '3px',
            overflow: 'hidden',
            background: 'var(--prog-track)',
          }}
        >
          <div className="sync-bar" />
        </div>
        <style>{`
          .sync-bar {
            height: 100%;
            width: 40%;
            border-radius: 3px;
            background: linear-gradient(90deg, #e35d2a, #f57e44);
            animation: syncSlide 1s ease-in-out infinite;
          }
          @keyframes syncSlide {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(320%); }
          }
          @media (prefers-reduced-motion: reduce) { .sync-bar { animation: none; width: 100%; } }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}
