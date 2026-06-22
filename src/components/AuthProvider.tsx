'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { isAllowed } from '@/lib/auth'

type Status = 'loading' | 'signedOut' | 'denied' | 'authorized' | 'unconfigured'

interface AuthCtx {
  email: string | null
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({ email: null, signOut: async () => {} })
export function useAuth() {
  return useContext(Ctx)
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '22px',
      padding: '24px',
      textAlign: 'center',
      background: 'var(--bg)',
    }}
  >
    <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '34px', letterSpacing: '0.04em', color: 'var(--text)' }}>
      BRAEL<span style={{ color: 'var(--accent)' }}>ENTLESS</span>
    </div>
    {children}
  </div>
)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setStatus('unconfigured')
      return
    }
    const sb = supabase

    function apply(session: Session | null) {
      const em = session?.user?.email?.toLowerCase() ?? null
      setEmail(em)
      if (!session) setStatus('signedOut')
      else if (isAllowed(em)) setStatus('authorized')
      else setStatus('denied')
    }

    sb.auth.getSession().then(({ data }) => apply(data.session))
    const { data } = sb.auth.onAuthStateChange((_event, session) => apply(session))
    return () => data.subscription.unsubscribe()
  }, [])

  async function signIn() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  if (status === 'loading') {
    return (
      <Shell>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
          Checking access…
        </div>
      </Shell>
    )
  }

  if (status === 'unconfigured') {
    return (
      <Shell>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'var(--text-3)', maxWidth: 420, lineHeight: 1.6 }}>
          Authentication is not configured. Set <code style={{ color: 'var(--accent)' }}>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code style={{ color: 'var(--accent)' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment.
        </div>
      </Shell>
    )
  }

  if (status === 'signedOut' || status === 'denied') {
    return (
      <Shell>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
          {status === 'denied' ? 'Access restricted' : 'Athlete platform · Private'}
        </div>

        {status === 'denied' ? (
          <>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'var(--text-3)', maxWidth: 420, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-2)' }}>{email}</strong> isn’t on the access list. Sign in with an approved account.
            </div>
            <button onClick={signOut} className="auth-btn">Use a different account</button>
          </>
        ) : (
          <button onClick={signIn} className="auth-btn auth-btn-primary">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.1-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.1 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.7 0 19.5-7.7 19.5-19.5 0-1.3-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.1 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 43.5c5.2 0 9.6-1.7 12.9-4.6l-6-5.1c-1.9 1.4-4.4 2.2-6.9 2.2-5.3 0-9.7-3.1-11.3-7.4l-6.6 5.1C9.6 39.1 16.2 43.5 24 43.5z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6 5.1c-.4.4 6.3-4.6 6.3-14.4 0-1.3-.1-2.3-.4-3.5z"/>
            </svg>
            Sign in with Google
          </button>
        )}

        <style>{`
          .auth-btn {
            display: inline-flex; align-items: center; gap: 10px;
            font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
            font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase;
            padding: 12px 22px; border-radius: 12px; cursor: pointer;
            background: var(--bg-2); color: var(--text-2);
            border: 1px solid var(--border-2); transition: border-color .2s, transform .1s;
          }
          .auth-btn:hover { border-color: var(--accent); }
          .auth-btn:active { transform: scale(.98); }
          .auth-btn-primary {
            background: linear-gradient(135deg, #e35d2a, #f57e44);
            color: #fff; border: none; padding: 14px 26px;
            box-shadow: 0 8px 30px -8px rgba(245,126,68,.6);
          }
        `}</style>
      </Shell>
    )
  }

  return <Ctx.Provider value={{ email, signOut }}>{children}</Ctx.Provider>
}
