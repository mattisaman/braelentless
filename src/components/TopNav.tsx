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
        background: '#060403',
        borderBottom: '1px solid #1e1410',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        whiteSpace: 'nowrap',
      } as React.CSSProperties}
    >
      <div
        style={{
          display: 'inline-flex',
          gap: 0,
          padding: '10px 16px',
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
                borderBottom: active ? '2px solid #f57e44' : '2px solid transparent',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 11,
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
