'use client'

import dynamic from 'next/dynamic'

const TrophyRoom3D = dynamic(
  () => import('@/components/TrophyRoom3D'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        background: '#050302',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '24px',
          color: '#f59e0b',
          letterSpacing: '0.15em',
        }}>
          ENTERING TROPHY HALL
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '11px',
          color: 'rgba(245,158,11,0.4)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
        }}>
          Loading 3D environment...
        </div>
      </div>
    ),
  }
)

export default function TrophyRoom3DPage() {
  return <TrophyRoom3D />
}
