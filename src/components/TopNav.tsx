'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'CALENDAR', href: '/calendar' },
  { label: 'PENTATHLON', href: '/pent' },
  { label: 'MIND / R&R', href: '/mind' },
  { label: 'RECRUITING', href: '/recruit' },
  { label: 'FUEL', href: '/fuel' },
  { label: 'TRAIN', href: '/train' },
]

export default function TopNav() {
  const pathname = usePathname()

  return (
    <div
      style={{
        maxWidth: 440,
        margin: '0 auto',
        width: '100%',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingBottom: 2,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '8px 12px',
          width: 'max-content',
        }}
      >
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href + link.label}
              href={link.href}
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: 20,
                border: `1px solid ${active ? '#f57e44' : '#2a1f18'}`,
                background: '#0f0b08',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: active ? '#f57e44' : '#6b5a50',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
