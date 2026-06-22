'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'SPORTS', href: '/sports' },
  { label: 'PENTATHLON', href: '/pent' },
  { label: 'TRAIN', href: '/train' },
  { label: 'FUEL', href: '/fuel' },
  { label: 'MIND', href: '/mind' },
  { label: 'CALENDAR', href: '/calendar' },
  { label: 'RECRUIT', href: '/recruit' },
]

export default function TopNav() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'var(--nav-bg)' : 'color-mix(in srgb, var(--nav-bg) 80%, transparent)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? 'var(--nav-border)' : 'transparent'}`,
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div className="nav-shell">
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0, marginRight: '6px' }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent)', flexShrink: 0, boxShadow: '0 0 14px rgba(245,126,68,0.4)', display: 'block' }}>
            <Image src="/wildcats-logo.jpeg" alt="Wildcats" width={32} height={32} style={{ objectFit: 'cover' }} />
          </span>
          <span className="hide-mobile" style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
            BRAEL<span style={{ color: 'var(--accent)' }}>ENTLESS</span>
          </span>
        </Link>

        {/* Links — scroll horizontally on small screens */}
        <nav
          style={{ flex: 1, minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none', whiteSpace: 'nowrap' } as React.CSSProperties}
        >
          <div style={{ display: 'inline-flex' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${isActive(link.href) ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
          aria-label="Toggle theme"
          style={{
            flexShrink: 0,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--nav-border)',
            background: 'var(--bg-2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'background 0.2s, border-color 0.2s',
            lineHeight: 1,
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
