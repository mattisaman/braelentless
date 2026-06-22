'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'CALENDAR', href: '/calendar' },
  { label: 'PENTATHLON', href: '/pent' },
  { label: 'MIND / R&R', href: '/mind' },
  { label: 'RECRUITING', href: '/recruit' },
  { label: 'FUEL', href: '/fuel' },
  { label: 'TRAIN', href: '/train' },
]

export default function TopNav() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div style={{ flex: 1, overflowX: 'auto', scrollbarWidth: 'none', whiteSpace: 'nowrap' } as React.CSSProperties}>
        <div style={{ display: 'inline-flex', gap: 0, padding: '0 12px' }}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                style={{
                  display: 'inline-block',
                  padding: '11px 14px',
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--accent)' : 'var(--text-3)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        title={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
        style={{
          flexShrink: 0,
          marginRight: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid var(--nav-border)',
          background: 'var(--bg-2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '15px',
          transition: 'background 0.2s, border-color 0.2s',
          lineHeight: 1,
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
