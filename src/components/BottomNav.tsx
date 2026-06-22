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
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '440px',
        background: '#0d0b09',
        borderTop: '1px solid #2a1f18',
        display: 'flex',
        zIndex: 50,
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
              padding: '10px 4px 12px',
              textDecoration: 'none',
              color: active ? '#f57e44' : '#6b5a50',
              borderTop: active ? '2px solid #f57e44' : '2px solid transparent',
              transition: 'color 0.15s',
            }}
          >
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
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
