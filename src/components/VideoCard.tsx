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
  soccer: '#4ade80',
  basketball: '#f57e44',
  track: '#60a5fa',
  general: '#a78bfa',
}

export default function VideoCard({ video }: VideoCardProps) {
  const color = SPORT_COLORS[video.sport] ?? '#f57e44'
  const embedUrl = getEmbedUrl(video.url)

  return (
    <div
      style={{
        background: '#0f0b08',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #1e1410',
      }}
    >
      {/* Embed frame */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
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
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '9px',
              color,
              background: color + '22',
              padding: '2px 7px',
              borderRadius: '4px',
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
              color: '#8a6a58',
              background: '#1e1410',
              padding: '2px 7px',
              borderRadius: '4px',
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
            fontWeight: 700,
            fontSize: '14px',
            color: '#e8dcd4',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          {video.title}
        </div>
        {video.notes && (
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '12px',
              color: '#6b5a50',
              lineHeight: 1.4,
            }}
          >
            {video.notes}
          </div>
        )}
      </div>
    </div>
  )
}
