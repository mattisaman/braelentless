'use client'

import { useState } from 'react'
import type { VideoEntry } from '@/lib/types'

interface VideoCardProps {
  video: VideoEntry
}

function getEmbedUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.searchParams.get('v') || u.pathname.replace('/', '')
      return `https://www.youtube.com/embed/${id}`
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.replace('/', '')
      return `https://player.vimeo.com/video/${id}`
    }
  } catch {
    // not a valid URL
  }
  return url
}

const SPORT_COLORS: Record<string, string> = {
  soccer: 'var(--accent-green)',
  basketball: '#f57e44',
  track: 'var(--accent-blue)',
  general: '#a78bfa',
}

export default function VideoCard({ video }: VideoCardProps) {
  const color = SPORT_COLORS[video.sport] ?? '#f57e44'
  const embedUrl = getEmbedUrl(video.url)
  const [hover, setHover] = useState(false)

  return (
    <div
      className="tile-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        transform: hover ? 'translateY(-4px)' : 'none',
        boxShadow: hover ? '0 18px 44px rgba(0,0,0,0.28), 0 0 0 1px rgba(245,126,68,0.18)' : undefined,
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Embed frame */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
      {/* Meta */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '9px',
              color,
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              padding: '3px 8px',
              borderRadius: '5px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {video.sport}
          </span>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '9px',
              color: 'var(--text-3)',
              background: 'var(--border)',
              padding: '3px 8px',
              borderRadius: '5px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {video.type}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '17px',
            color: 'var(--text)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 1.15,
            marginBottom: '5px',
          }}
        >
          {video.title}
        </div>
        {video.notes && (
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '13px',
              color: 'var(--text-4)',
              lineHeight: 1.45,
            }}
          >
            {video.notes}
          </div>
        )}
      </div>
    </div>
  )
}
