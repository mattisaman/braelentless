import Image from 'next/image'

interface SportHeroProps {
  bgImage: string
  name: string
  number: string
  position: string
  height?: number
}

export default function SportHero({
  bgImage,
  name,
  number,
  position,
  height = 200,
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
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,7,6,0.3) 0%, rgba(10,7,6,0.85) 100%)',
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
        }}
      >
        {number && (
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '48px',
              color: '#f57e44',
              lineHeight: 1,
              opacity: 0.9,
            }}
          >
            {number}
          </div>
        )}
        <div
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '28px',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: '13px',
            color: '#f57e44',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: '2px',
          }}
        >
          {position}
        </div>
      </div>
    </div>
  )
}
