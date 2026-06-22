'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'HOME', href: '/' },
  { label: 'SPORTS', href: '/sports' },
  { label: 'TRAIN', href: '/train' },
  { label: 'FUEL', href: '/fuel' },
  { label: 'RECRUIT', href: '/recruit' },
]

export default function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--nav-bg)',
        borderTop: '1px solid var(--nav-border)',
        display: 'flex',
        zIndex: 50,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '11px 4px 13px',
              textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--text-3)',
              borderTop: active ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'color 0.15s',
            }}
          >
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.1em',
                textShadow: active ? '0 0 12px rgba(245,126,68,0.5)' : 'none',
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
