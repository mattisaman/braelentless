import Image from 'next/image'

interface SportHeroProps {
  bgImage: string
  name: string
  number: string
  position: string
  height?: number
  /** sport accent color — defaults to orange */
  color?: string
  /** optional motto rendered beneath the title */
  motto?: string
}

export default function SportHero({
  bgImage,
  name,
  number,
  position,
  height = 320,
  color = '#f57e44',
  motto,
}: SportHeroProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        overflow: 'hidden',
      }}
    >
      {/* Kenburns background */}
      <div className="animate-kenburns" style={{ position: 'absolute', inset: 0 }}>
        <Image
          src={bgImage}
          alt={name}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>

      {/* Cinematic overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(8,5,3,0.30) 0%, rgba(8,5,3,0.72) 58%, rgba(8,5,3,0.96) 100%)',
        }}
      />
      {/* Colored vignette tint from the sport */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 90% at 12% 100%, ${color}26 0%, transparent 60%)`,
        }}
      />
      {/* Accent base line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color} 18%, ${color} 82%, transparent)`,
        }}
      />

      {/* Content */}
      <div
        className="dashboard-content"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 22,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
          {number && (
            <div
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(54px, 9vw, 92px)',
                color,
                lineHeight: 0.82,
                opacity: 0.95,
                textShadow: `0 0 36px ${color}66`,
                flexShrink: 0,
              }}
            >
              {number}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(34px, 6vw, 60px)',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                lineHeight: 0.95,
                textShadow: '0 2px 22px rgba(0,0,0,0.85)',
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 10,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: color,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                }}
              >
                {position}
              </span>
            </div>
            {motto && (
              <div
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: 'clamp(13px, 1.6vw, 16px)',
                  color: '#d8c8bc',
                  marginTop: 8,
                  maxWidth: 560,
                  lineHeight: 1.4,
                  textShadow: '0 1px 12px rgba(0,0,0,0.7)',
                }}
              >
                &ldquo;{motto}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
