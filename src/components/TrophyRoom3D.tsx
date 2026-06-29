'use client'

import { Suspense, useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
  MeshReflectorMaterial,
  Sparkles,
  Html,
  RoundedBox,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing'
import * as THREE from 'three'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Achievement = {
  id: string
  title: string
  description?: string | null
  sport: string
  category: string
  season?: string | null
  emoji?: string | null
}

const CAT_COLOR: Record<string, string> = {
  championship: '#f5b942',
  record: '#f57e44',
  commitment: '#22c55e',
  award: '#c084fc',
  milestone: '#60a5fa',
  honor: '#fb7185',
}

// ── Room constants ──────────────────────────────────────────────────────────
const WALL_X = 6.9        // left/right walls at ∓ / ±
const WALL_Z = 6.9        // back wall at -WALL_Z
const ROOM_H = 5.2
const SHELF_Y = [1.2, 2.35, 3.5]            // three shelf heights
const SHELF_Z = [-4.4, -1.5, 1.5, 4.4]      // positions along left/right walls

// ── Procedural textures ───────────────────────────────────────────────────────

function useHerringbone() {
  return useMemo(() => {
    if (typeof document === 'undefined') return { map: null as THREE.Texture | null, bump: null as THREE.Texture | null }
    const S = 1024
    const c = document.createElement('canvas')
    c.width = c.height = S
    const ctx = c.getContext('2d')!
    // warm base
    ctx.fillStyle = '#3a2616'
    ctx.fillRect(0, 0, S, S)

    const planks = ['#6b4a2c', '#5c3f25', '#74512f', '#553a22', '#664628', '#4d3420']
    const pL = 150, pW = 38
    let ci = 0

    // draw one plank with grain
    const plank = (cx: number, cy: number, ang: number) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(ang)
      ctx.fillStyle = planks[ci++ % planks.length]
      ctx.fillRect(-pL / 2, -pW / 2, pL, pW)
      // grain lines
      ctx.strokeStyle = 'rgba(0,0,0,0.16)'
      ctx.lineWidth = 0.7
      for (let g = -pW / 2 + 4; g < pW / 2; g += 5) {
        ctx.beginPath()
        ctx.moveTo(-pL / 2 + 4, g + (Math.sin(g) * 1.2))
        ctx.lineTo(pL / 2 - 4, g + (Math.cos(g) * 1.2))
        ctx.stroke()
      }
      // edge bevel
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      ctx.lineWidth = 1.4
      ctx.strokeRect(-pL / 2, -pW / 2, pL, pW)
      ctx.strokeStyle = 'rgba(255,210,150,0.05)'
      ctx.lineWidth = 0.8
      ctx.strokeRect(-pL / 2 + 1.5, -pW / 2 + 1.5, pL - 3, pW - 3)
      ctx.restore()
    }

    // herringbone: pairs of perpendicular planks tiling the canvas
    const step = pL / Math.SQRT2
    for (let row = -1; row < S / step + 1; row++) {
      for (let col = -1; col < S / step + 1; col++) {
        const ox = col * step + (row % 2) * (step / 2)
        const oy = row * step
        plank(ox, oy, Math.PI / 4)
        plank(ox + step / 2, oy + step / 2, -Math.PI / 4)
      }
    }

    const map = new THREE.CanvasTexture(c)
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.repeat.set(3, 3)
    map.anisotropy = 8
    map.colorSpace = THREE.SRGBColorSpace
    const bump = map.clone()
    bump.colorSpace = THREE.NoColorSpace
    return { map, bump }
  }, [])
}

// Returns { color, bump } canvases. Color = pebbled leather; bump = grain + grooves.
function useBasketball() {
  return useMemo(() => {
    if (typeof document === 'undefined') return { color: null as THREE.Texture | null, bump: null as THREE.Texture | null }
    const S = 1024
    const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; return c }

    // ── color map ──
    const cc = mk(); const cx = cc.getContext('2d')!
    // deep authentic basketball orange with subtle large-scale mottling
    cx.fillStyle = '#b0531c'; cx.fillRect(0, 0, S, S)
    for (let i = 0; i < 240; i++) {
      cx.fillStyle = `rgba(${Math.random() > 0.5 ? '150,75,30' : '90,42,14'},0.05)`
      cx.beginPath(); cx.arc(Math.random() * S, Math.random() * S, 30 + Math.random() * 90, 0, Math.PI * 2); cx.fill()
    }
    // fine pebble grain (tight dots, both lighter and darker)
    for (let i = 0; i < 70000; i++) {
      const dark = Math.random() > 0.5
      cx.fillStyle = dark ? `rgba(70,33,10,${Math.random() * 0.22})` : `rgba(245,170,105,${Math.random() * 0.16})`
      cx.beginPath(); cx.arc(Math.random() * S, Math.random() * S, Math.random() * 1.2 + 0.3, 0, Math.PI * 2); cx.fill()
    }

    // ── bump map (grey: pebble + black grooves) ──
    const bc = mk(); const bx = bc.getContext('2d')!
    bx.fillStyle = '#8a8a8a'; bx.fillRect(0, 0, S, S)
    for (let i = 0; i < 70000; i++) {
      const v = Math.random() > 0.5 ? 255 : 60
      bx.fillStyle = `rgba(${v},${v},${v},${Math.random() * 0.5})`
      bx.beginPath(); bx.arc(Math.random() * S, Math.random() * S, Math.random() * 1.3 + 0.3, 0, Math.PI * 2); bx.fill()
    }

    // seams on BOTH maps (color = dark line, bump = deep black groove)
    const seams = (ctx: CanvasRenderingContext2D, col: string, w: number) => {
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(S / 2, 0); ctx.lineTo(S / 2, S); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, S / 2); ctx.lineTo(S, S / 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(S * 0.15, 0); ctx.quadraticCurveTo(S * 0.40, S / 2, S * 0.15, S); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(S * 0.85, 0); ctx.quadraticCurveTo(S * 0.60, S / 2, S * 0.85, S); ctx.stroke()
    }
    seams(cx, '#1f0e03', S * 0.013)
    seams(bx, '#000000', S * 0.02)

    const color = new THREE.CanvasTexture(cc)
    color.colorSpace = THREE.SRGBColorSpace; color.anisotropy = 8
    const bump = new THREE.CanvasTexture(bc); bump.anisotropy = 8
    return { color, bump }
  }, [])
}

function useSoccer() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null
    const S = 512
    const c = document.createElement('canvas')
    c.width = c.height = S
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#f2f2f2'
    ctx.fillRect(0, 0, S, S)
    ctx.fillStyle = '#15171c'
    // scatter pentagon-ish dark patches
    const pent = (cx: number, cy: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath(); ctx.fill()
    }
    for (let y = 60; y < S; y += 150) {
      for (let x = 60; x < S; x += 150) {
        pent(x + (Math.random() * 30 - 15), y + (Math.random() * 30 - 15), 34)
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'
    ctx.lineWidth = 3
    for (let y = 0; y <= S; y += 75) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke() }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

// ── Materials ──────────────────────────────────────────────────────────────────

function GoldMat({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={0.24}
      clearcoat={0.5}
      clearcoatRoughness={0.16}
      envMapIntensity={2.4}
    />
  )
}

// ── Trophy / object geometries ──────────────────────────────────────────────────

function CupTrophy({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.42, 0.1, 0.42]} />
        <meshStandardMaterial color="#15100a" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.08, 24]} />
        <GoldMat color={color} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.28, 20]} />
        <GoldMat color={color} />
      </mesh>
      <mesh position={[0, 0.56, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.12, 0.42, 32, 1, true]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.16} side={THREE.DoubleSide} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <torusGeometry args={[0.26, 0.035, 10, 36]} />
        <GoldMat color={color} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.32, 0.6, 0]} rotation={[Math.PI / 2, 0, s * -0.4]} castShadow>
          <torusGeometry args={[0.1, 0.02, 8, 18, Math.PI * 1.2]} />
          <GoldMat color={color} />
        </mesh>
      ))}
    </group>
  )
}

function StarTrophy({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.26, 0.1, 28]} />
        <meshStandardMaterial color="#15100a" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.32, 16]} />
        <GoldMat color={color} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <octahedronGeometry args={[0.26, 0]} />
        <GoldMat color={color} />
      </mesh>
      <mesh position={[0, 0.86, 0]} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#fff" metalness={1} roughness={0} emissive={color} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

type RoomTex = { bb: { color: THREE.Texture | null; bump: THREE.Texture | null }; soc: THREE.Texture | null }

function Basketball({ tex }: { tex: RoomTex['bb'] }) {
  return (
    <mesh position={[0, 0.3, 0]} castShadow>
      <sphereGeometry args={[0.32, 64, 64]} />
      <meshPhysicalMaterial
        map={tex.color ?? undefined}
        color={tex.color ? '#ffffff' : '#b0531c'}
        roughness={0.82}
        metalness={0}
        bumpMap={tex.bump ?? undefined}
        bumpScale={0.025}
        clearcoat={0.18}
        clearcoatRoughness={0.6}
        sheen={0.3}
        sheenColor="#3a1c08"
      />
    </mesh>
  )
}

function SoccerBall({ tex }: { tex: THREE.Texture | null }) {
  return (
    <mesh position={[0, 0.28, 0]} castShadow>
      <sphereGeometry args={[0.28, 48, 48]} />
      <meshStandardMaterial map={tex ?? undefined} color={tex ? '#ffffff' : '#eeeeee'} roughness={0.5} metalness={0.04} />
    </mesh>
  )
}

function Medal({ color }: { color: string }) {
  return (
    <group>
      {/* ribbon */}
      <mesh position={[-0.07, 0.55, 0]} rotation={[0, 0, 0.32]} castShadow>
        <boxGeometry args={[0.07, 0.5, 0.012]} />
        <meshStandardMaterial color="#b3122b" roughness={0.6} />
      </mesh>
      <mesh position={[0.07, 0.55, 0]} rotation={[0, 0, -0.32]} castShadow>
        <boxGeometry args={[0.07, 0.5, 0.012]} />
        <meshStandardMaterial color="#1b3fae" roughness={0.6} />
      </mesh>
      {/* disc */}
      <mesh position={[0, 0.27, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 40]} />
        <GoldMat color={color} />
      </mesh>
      <mesh position={[0, 0.27, 0.037]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </group>
  )
}

// Engraved metal nameplate — the title is rendered into the plate texture
// (with a highlight+shadow offset so it reads as cut into the metal).
function usePlaqueTexture(label: string) {
  return useMemo(() => {
    if (typeof document === 'undefined') return null
    const W = 512, H = 680
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const ctx = c.getContext('2d')!
    // brushed gold field
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#c8a049'); g.addColorStop(0.5, '#eccd83'); g.addColorStop(1, '#b07f2c')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    for (let i = 0; i < 600; i++) {
      ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? '255,244,210' : '110,72,18'},${Math.random() * 0.05})`
      const y = Math.random() * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }
    // inset border
    ctx.strokeStyle = 'rgba(70,44,8,0.55)'; ctx.lineWidth = 5; ctx.strokeRect(26, 26, W - 52, H - 52)
    ctx.strokeStyle = 'rgba(255,245,215,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, W - 60, H - 60)

    // wrap the title
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const fontSize = label.length > 22 ? 46 : 56
    ctx.font = `bold ${fontSize}px "Arial Narrow", Arial, sans-serif`
    const words = label.toUpperCase().split(/\s+/)
    const lines: string[] = []; let cur = ''
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w
      if (ctx.measureText(t).width > W - 110 && cur) { lines.push(cur); cur = w } else cur = t
    }
    if (cur) lines.push(cur)
    const lh = fontSize * 1.22
    let y = H / 2 - ((lines.length - 1) * lh) / 2
    for (const ln of lines) {
      // engraved illusion: bright lower-right highlight, dark fill on top
      ctx.fillStyle = 'rgba(255,247,220,0.5)'; ctx.fillText(ln, W / 2 + 1.5, y + 1.5)
      ctx.fillStyle = 'rgba(38,24,5,0.92)'; ctx.fillText(ln, W / 2, y)
      y += lh
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8
    return tex
  }, [label])
}

function Plaque({ color, label }: { color: string; label: string }) {
  const tex = usePlaqueTexture(label)
  return (
    <group>
      {/* dark frame */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.62, 0.82, 0.05]} />
        <meshStandardMaterial color="#241608" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* thin gold bezel */}
      <mesh position={[0, 0.5, 0.026]}>
        <boxGeometry args={[0.54, 0.7, 0.01]} />
        <GoldMat color={color} />
      </mesh>
      {/* engraved nameplate face */}
      <mesh position={[0, 0.5, 0.033]}>
        <planeGeometry args={[0.48, 0.64]} />
        <meshStandardMaterial map={tex ?? undefined} color={tex ? '#ffffff' : color} metalness={0.55} roughness={0.42} />
      </mesh>
    </group>
  )
}

function ObjectForAchievement({ a, tex }: { a: Achievement; tex: RoomTex }) {
  const color = CAT_COLOR[a.category] ?? '#f5b942'
  switch (a.category) {
    case 'championship': return <CupTrophy color={color} />
    case 'commitment': return <CupTrophy color="#22c55e" />
    case 'milestone': return <StarTrophy color={color} />
    case 'record':
      return a.sport === 'basketball'
        ? <Basketball tex={tex.bb} />
        : a.sport === 'soccer'
          ? <SoccerBall tex={tex.soc} />
          : <StarTrophy color={color} />
    case 'honor': return <Medal color={color} />
    default: return <Plaque color={color} label={a.title} />
  }
}

// ── Decorative filler objects for empty shelf slots ─────────────────────────────

function Filler({ i, tex }: { i: number; tex: RoomTex }) {
  const kind = i % 4
  if (kind === 0) return <Basketball tex={tex.bb} />
  if (kind === 1) return <SoccerBall tex={tex.soc} />
  if (kind === 2) return <CupTrophy color="#caa24a" />
  return <Medal color="#d9b24a" />
}

// ── A single display slot on a wall shelf ───────────────────────────────────────

type Slot = { pos: [number, number, number]; normal: [number, number, number]; key: string }

function DisplaySlot({
  slot, achievement, selected, dim, onClick, tex,
}: {
  slot: Slot
  achievement: Achievement | null
  selected: boolean
  dim: boolean
  onClick: () => void
  tex: RoomTex
}) {
  const ref = useRef<THREE.Group>(null!)
  const color = achievement ? (CAT_COLOR[achievement.category] ?? '#f5b942') : '#caa24a'

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * (selected ? 0.5 : 0.18)
  })

  const interactive = !!achievement

  return (
    <group position={slot.pos}>
      {/* spinning object */}
      <group
        ref={ref}
        onClick={interactive ? (e) => { e.stopPropagation(); onClick() } : undefined}
        onPointerOver={interactive ? (e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' } : undefined}
        onPointerOut={interactive ? () => { document.body.style.cursor = 'auto' } : undefined}
      >
        {achievement
          ? <ObjectForAchievement a={achievement} tex={tex} />
          : <Filler i={Math.round(slot.pos[2] * 7 + slot.pos[1] * 3)} tex={tex} />}
      </group>

      {/* glowing base disc */}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 36]} />
        <meshStandardMaterial
          color={color} emissive={color}
          emissiveIntensity={selected ? 1.6 : 0.3}
          transparent opacity={selected ? 0.6 : dim ? 0.08 : 0.2}
        />
      </mesh>

      {selected && (
        <>
          <Sparkles count={26} scale={[0.8, 1.1, 0.8]} position={[0, 0.6, 0]} size={3.2} speed={0.5} color={color} opacity={0.8} />
          <pointLight position={[0, 0.9, 0.3]} color={color} intensity={5} distance={2.6} decay={2} />
        </>
      )}

    </group>
  )
}

// ── Glass wall cabinet (frames a column of shelves on one wall) ──────────────────

function WallCabinet({ wall }: { wall: 'left' | 'right' | 'back' }) {
  const isSide = wall !== 'back'
  const x = wall === 'left' ? -WALL_X + 0.1 : wall === 'right' ? WALL_X - 0.1 : 0
  const z = wall === 'back' ? -WALL_Z + 0.1 : 0
  const along = isSide ? 11.4 : 6.5            // length of the cabinet
  // local frame: cabinet faces +X; we rotate the group to face into the room
  const groupRot: [number, number, number] = wall === 'left'
    ? [0, 0, 0]
    : wall === 'right'
      ? [0, Math.PI, 0]
      : [0, -Math.PI / 2, 0]

  return (
    <group position={[x, 0, z]} rotation={groupRot}>
      {/* back wood panel */}
      <mesh position={[-0.06, 2.4, 0]} receiveShadow>
        <boxGeometry args={[0.12, 4.6, along]} />
        <meshStandardMaterial color="#120c08" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* shelves with lit front edge */}
      {SHELF_Y.map((sy, i) => (
        <group key={i} position={[0.34, sy - 0.16, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.72, 0.05, along - 0.3]} />
            <meshStandardMaterial color="#1c130b" roughness={0.6} metalness={0.3} />
          </mesh>
          {/* warm LED strip under each shelf */}
          <mesh position={[0.34, 0.02, 0]}>
            <boxGeometry args={[0.04, 0.02, along - 0.5]} />
            <meshStandardMaterial color="#ffe6ad" emissive="#ffd98a" emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* top + bottom frame */}
      <mesh position={[0.34, 4.7, 0]} castShadow>
        <boxGeometry args={[0.8, 0.12, along]} />
        <meshStandardMaterial color="#1a120a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.34, 0.06, 0]}>
        <boxGeometry args={[0.8, 0.12, along]} />
        <meshStandardMaterial color="#1a120a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* open shelves — no glass, trophies are touchable and better lit */}
    </group>
  )
}

// ── Back feature wall: monogram · framed jerseys · dream wall ────────────────────

function canvasTex(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

function makeJerseyTex(name: string, num: string, accent: string) {
  if (typeof document === 'undefined') return null
  const W = 420, H = 540, c = document.createElement('canvas'); c.width = W; c.height = H
  const x = c.getContext('2d')!
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#16243f'); g.addColorStop(1, '#0a1126')
  x.fillStyle = g; x.fillRect(0, 0, W, H)
  x.fillStyle = 'rgba(255,255,255,0.05)'; x.fillRect(0, 0, W, 130)        // shoulder yoke
  x.fillStyle = accent; x.fillRect(46, 104, W - 92, 7)                    // accent stripe
  x.textAlign = 'center'
  x.fillStyle = 'rgba(255,255,255,0.9)'; x.font = 'bold 38px "Arial Narrow", Arial, sans-serif'
  x.fillText('KESHEQUA', W / 2, 78)
  x.textBaseline = 'middle'
  x.font = 'bold 250px "Arial Narrow", Arial, sans-serif'
  x.fillStyle = '#ffffff'; x.fillText(num, W / 2, H / 2 + 28)
  x.lineWidth = 7; x.strokeStyle = accent; x.strokeText(num, W / 2, H / 2 + 28)
  x.textBaseline = 'alphabetic'; x.font = 'bold 32px "Arial Narrow", Arial, sans-serif'
  x.fillStyle = 'rgba(255,255,255,0.82)'; x.fillText(name, W / 2, H - 36)
  return canvasTex(c)
}

function makeDreamTex(label: string, title: string, sub: string, accent: string) {
  if (typeof document === 'undefined') return null
  const W = 520, H = 250, c = document.createElement('canvas'); c.width = W; c.height = H
  const x = c.getContext('2d')!
  x.fillStyle = '#16120c'; x.fillRect(0, 0, W, H)
  x.fillStyle = accent; x.fillRect(0, 0, 9, H)                           // accent spine
  x.textAlign = 'left'
  x.fillStyle = accent; x.font = 'bold 26px "Barlow Condensed", Arial, sans-serif'
  x.fillText(label.toUpperCase(), 40, 56)
  // title (wrap to 2 lines)
  x.fillStyle = 'rgba(255,255,255,0.95)'; x.font = 'bold 42px "Arial Narrow", Arial, sans-serif'
  const words = title.split(' '); const lines: string[] = []; let cur = ''
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > W - 70 && cur) { lines.push(cur); cur = w } else cur = t }
  if (cur) lines.push(cur)
  lines.slice(0, 2).forEach((ln, i) => x.fillText(ln, 40, 110 + i * 48))
  x.fillStyle = 'rgba(255,255,255,0.45)'; x.font = '24px "Barlow Condensed", Arial, sans-serif'
  x.fillText(sub, 40, H - 30)
  return canvasTex(c)
}

const JERSEYS = [
  { name: 'BASKETBALL', num: '10', accent: '#f57e44', x: -3.15 },
  { name: 'SOCCER', num: '7', accent: '#22c55e', x: 3.15 },
]

const DREAM_WALL = [
  { label: 'Achieved', title: '1,000 Career Points', sub: 'Joined the 1K club', accent: '#22c55e' },
  { label: 'Achieved', title: 'Single-Season Record', sub: '436 points · 2025–26', accent: '#22c55e' },
  { label: 'The Climb', title: 'Section VI Champion', sub: 'This season', accent: '#f5b942' },
  { label: 'The Climb', title: 'Score in College', sub: 'Southeastern · committed', accent: '#f5b942' },
]

function FeatureWall() {
  const jerseyTex = useMemo(() => JERSEYS.map((j) => makeJerseyTex(j.name, j.num, j.accent)), [])
  const dreamTex = useMemo(() => DREAM_WALL.map((d) => makeDreamTex(d.label, d.title, d.sub, d.accent)), [])

  return (
    <group position={[0, 0, -WALL_Z + 0.08]}>
      {/* wall panel */}
      <mesh position={[0, 2.5, -0.06]}>
        <boxGeometry args={[9.2, 4.6, 0.06]} />
        <meshStandardMaterial color="#1a140d" roughness={0.94} />
      </mesh>

      {/* monogram + motto */}
      <Html position={[0, 4.0, 0.04]} center transform distanceFactor={7} occlude pointerEvents="none">
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 92, color: 'rgba(245,185,66,0.12)', lineHeight: 1, userSelect: 'none' }}>K</div>
      </Html>
      <Html position={[0, 3.28, 0.04]} center transform distanceFactor={7} occlude pointerEvents="none">
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, color: 'rgba(245,185,66,0.34)', letterSpacing: '0.24em', textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none' }}>
          Be Relentless · Be Precise · Be Feared
        </div>
      </Html>

      {/* framed jerseys flanking the monogram */}
      {JERSEYS.map((j, i) => (
        <group key={j.num} position={[j.x, 2.2, 0]}>
          <mesh position={[0, 0, -0.02]} castShadow>
            <boxGeometry args={[1.52, 1.96, 0.07]} />
            <meshStandardMaterial color="#241a0e" roughness={0.42} metalness={0.55} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.36, 1.8]} />
            <meshStandardMaterial map={jerseyTex[i] ?? undefined} color={jerseyTex[i] ? '#ffffff' : '#13203f'} roughness={0.7} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* dream wall */}
      <Html position={[0, 1.3, 0.04]} center transform distanceFactor={8} occlude pointerEvents="none">
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none' }}>
          The Dream Wall
        </div>
      </Html>
      {DREAM_WALL.map((d, i) => {
        const xs = [-3.45, -1.15, 1.15, 3.45]
        return (
          <group key={i} position={[xs[i], 0.58, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <boxGeometry args={[1.92, 0.92, 0.05]} />
              <meshStandardMaterial color="#241a0e" roughness={0.45} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.8, 0.8]} />
              <meshStandardMaterial map={dreamTex[i] ?? undefined} color={dreamTex[i] ? '#ffffff' : '#16120c'} roughness={0.6} metalness={0.1} />
            </mesh>
          </group>
        )
      })}

      {/* gold trim lines */}
      {[0.05, 4.55].map((y, i) => (
        <mesh key={i} position={[0, y, 0.02]}>
          <boxGeometry args={[8.8, 0.016, 0.005]} />
          <meshStandardMaterial color="#f5b942" emissive="#f5b942" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

// ── Ceiling with recessed cans ───────────────────────────────────────────────────

function Ceiling() {
  const cans = useMemo(() => {
    const out: [number, number][] = []
    for (const x of [-4, 0, 4]) for (const z of [-4, 0, 4]) out.push([x, z])
    return out
  }, [])
  return (
    <group>
      <mesh position={[0, ROOM_H, 0]}>
        <boxGeometry args={[WALL_X * 2 + 1, 0.2, WALL_Z * 2 + 1]} />
        <meshStandardMaterial color="#17130d" roughness={0.95} />
      </mesh>
      {/* cove perimeter glow */}
      <mesh position={[0, ROOM_H - 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[WALL_X - 0.5, WALL_X - 0.35, 4, 1]} />
        <meshStandardMaterial color="#ffcaa0" emissive="#ffb877" emissiveIntensity={0.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {cans.map(([x, z], i) => (
        <group key={i} position={[x, ROOM_H - 0.12, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.1, 20]} />
            <meshStandardMaterial color="#fff4cc" emissive="#fff0c0" emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Floor + walls shell ──────────────────────────────────────────────────────────

function Shell() {
  const { map, bump } = useHerringbone()
  return (
    <group>
      {/* reflective herringbone floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[WALL_X * 2 + 2, WALL_Z * 2 + 2]} />
        <MeshReflectorMaterial
          map={map ?? undefined}
          bumpMap={bump ?? undefined}
          bumpScale={0.04}
          resolution={1024}
          mixBlur={0.8}
          mixStrength={4}
          blur={[300, 90]}
          mirror={0.35}
          depthScale={1.0}
          minDepthThreshold={0.25}
          maxDepthThreshold={1.3}
          color="#2e1f12"
          metalness={0.6}
          roughness={0.42}
          envMapIntensity={0.7}
        />
      </mesh>

      {/* baseboards (anchor the floor-to-wall seam near the viewer) */}
      <mesh position={[-WALL_X, 0.11, 0]}><boxGeometry args={[0.1, 0.22, WALL_Z * 2]} /><meshStandardMaterial color="#1a120b" roughness={0.5} metalness={0.4} /></mesh>
      <mesh position={[WALL_X, 0.11, 0]}><boxGeometry args={[0.1, 0.22, WALL_Z * 2]} /><meshStandardMaterial color="#1a120b" roughness={0.5} metalness={0.4} /></mesh>
      <mesh position={[0, 0.11, -WALL_Z]}><boxGeometry args={[WALL_X * 2, 0.22, 0.1]} /><meshStandardMaterial color="#1a120b" roughness={0.5} metalness={0.4} /></mesh>

      {/* walls */}
      <mesh position={[-WALL_X - 0.15, 2.6, 0]}><boxGeometry args={[0.3, ROOM_H, WALL_Z * 2 + 1]} /><meshStandardMaterial color="#1a140d" roughness={0.92} /></mesh>
      <mesh position={[WALL_X + 0.15, 2.6, 0]}><boxGeometry args={[0.3, ROOM_H, WALL_Z * 2 + 1]} /><meshStandardMaterial color="#1a140d" roughness={0.92} /></mesh>
      <mesh position={[0, 2.6, -WALL_Z - 0.15]}><boxGeometry args={[WALL_X * 2 + 1, ROOM_H, 0.3]} /><meshStandardMaterial color="#1a140d" roughness={0.92} /></mesh>

      {/* front: a soft window glow (sunset, like the reference) on the open side */}
      <mesh position={[WALL_X - 0.4, 2.4, WALL_Z - 0.2]} rotation={[0, -Math.PI / 4, 0]}>
        <planeGeometry args={[2.4, 3.0]} />
        <meshStandardMaterial color="#ff9b5c" emissive="#ff8c42" emissiveIntensity={0.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <Ceiling />
    </group>
  )
}

// ── Center bench + rug ───────────────────────────────────────────────────────────

function CenterPiece() {
  return (
    <group position={[0, 0, 0]}>
      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#2a2622" roughness={0.95} />
      </mesh>
      {/* tufted leather ottoman */}
      <RoundedBox args={[1.9, 0.5, 1.0]} radius={0.08} smoothness={4} position={[0, 0.28, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#15110d" roughness={0.5} metalness={0.1} />
      </RoundedBox>
      {/* base glow strip */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[1.7, 0.02, 0.85]} />
        <meshStandardMaterial color="#ffcf8a" emissive="#ffcf8a" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  )
}

// ── Camera rig: orbit from center + fly-to-inspect ──────────────────────────────

const OVERVIEW_POS = new THREE.Vector3(0, 2.7, 6.4)
const OVERVIEW_TGT = new THREE.Vector3(0, 1.6, -1)

function CameraRig({ focus }: { focus: Slot | null }) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as any
  const goalPos = useRef(OVERVIEW_POS.clone())
  const goalTgt = useRef(OVERVIEW_TGT.clone())
  const flying = useRef(false)

  useEffect(() => {
    if (focus) {
      const n = new THREE.Vector3(...focus.normal)
      const p = new THREE.Vector3(...focus.pos)
      goalTgt.current.copy(p)
      goalPos.current.copy(p).addScaledVector(n, 1.7)
      goalPos.current.y = p.y + 0.15
    } else {
      goalPos.current.copy(OVERVIEW_POS)
      goalTgt.current.copy(OVERVIEW_TGT)
    }
    flying.current = true
    if (controls) controls.enabled = false
  }, [focus, controls])

  useFrame(() => {
    if (!flying.current) return
    camera.position.lerp(goalPos.current, 0.08)
    if (controls) {
      controls.target.lerp(goalTgt.current, 0.08)
      controls.update()
    } else {
      camera.lookAt(goalTgt.current)
    }
    if (camera.position.distanceTo(goalPos.current) < 0.06) {
      flying.current = false
      if (controls) { controls.target.copy(goalTgt.current); controls.enabled = true; controls.update() }
    }
  })

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={9}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2.05}
      target={OVERVIEW_TGT}
    />
  )
}

// ── Scene ────────────────────────────────────────────────────────────────────────

function Scene({
  achievements, selected, onSelect,
}: {
  achievements: Achievement[]
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  const bb = useBasketball()
  const soc = useSoccer()
  const tex = useMemo(() => ({ bb, soc }), [bb, soc])

  // Build wall slots, interleaving left/right so achievements (which fill the
  // first N slots) spread across BOTH walls instead of filling one side.
  const slots = useMemo<Slot[]>(() => {
    const out: Slot[] = []
    for (const z of SHELF_Z) for (const y of SHELF_Y) {
      out.push({ pos: [-WALL_X + 0.75, y, z], normal: [1, 0, 0], key: `L-${y}-${z}` })
      out.push({ pos: [WALL_X - 0.75, y, z], normal: [-1, 0, 0], key: `R-${y}-${z}` })
    }
    return out
  }, [])

  // Map achievements onto slots; remaining slots get decorative fillers
  const slotMap = useMemo(() => {
    return slots.map((slot, i) => ({ slot, achievement: achievements[i] ?? null }))
  }, [slots, achievements])

  const focus = useMemo(() => {
    if (!selected) return null
    const hit = slotMap.find((s) => s.achievement?.id === selected)
    return hit ? hit.slot : null
  }, [selected, slotMap])

  return (
    <>
      <fog attach="fog" args={['#0a0604', 14, 34]} />
      <color attach="background" args={['#080503']} />

      <ambientLight intensity={0.45} color="#ffceA0" />
      {/* broad soft fill from above to ground the room (no shadow cost) */}
      <hemisphereLight args={['#ffe6c4', '#3a2a1c', 0.5]} />
      {/* Custom studio environment: bright soft sources that streak across the
          gold/glass as real reflections (the fix for "plastic" looking metal). */}
      <Environment resolution={256} environmentIntensity={0.9}>
        <Lightformer intensity={2.2} color="#fff2dd" form="rect" position={[0, 6, 1]} scale={[12, 8, 1]} rotation={[Math.PI / 2, 0, 0]} />
        <Lightformer intensity={3} color="#ffe0ad" form="rect" position={[-7, 3.5, 3]} scale={[1.5, 7, 1]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer intensity={3} color="#ffe0ad" form="rect" position={[7, 3.5, 3]} scale={[1.5, 7, 1]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer intensity={1.6} color="#ffd9a0" form="rect" position={[0, 3.5, -8]} scale={[10, 5, 1]} />
        <Lightformer intensity={1.2} color="#9bb8ff" form="circle" position={[0, 5, 8]} scale={[4, 4, 1]} rotation={[-Math.PI / 2, 0, 0]} />
      </Environment>

      {/* key spot from ceiling, the only shadow caster */}
      <spotLight position={[0, ROOM_H - 0.3, 2.5]} angle={0.72} penumbra={0.85} intensity={42} distance={18} decay={2} color="#fff0d6" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      {/* warm wall-wash spots that give the metals something bright to reflect */}
      <spotLight position={[-4, ROOM_H - 0.3, -3]} angle={0.85} penumbra={1} intensity={20} distance={15} decay={2} color="#ffd9a6" />
      <spotLight position={[4, ROOM_H - 0.3, -3]} angle={0.85} penumbra={1} intensity={20} distance={15} decay={2} color="#ffd9a6" />
      <spotLight position={[-6, 3, 4]} angle={1.1} penumbra={1} intensity={10} distance={16} decay={2} color="#ffe8c4" />
      <spotLight position={[6, 3, 4]} angle={1.1} penumbra={1} intensity={10} distance={16} decay={2} color="#ffe8c4" />

      <Shell />
      <WallCabinet wall="left" />
      <WallCabinet wall="right" />
      <FeatureWall />
      <CenterPiece />

      <ContactShadows position={[0, 0.02, 0]} scale={20} blur={2.4} far={6} opacity={0.55} resolution={1024} color="#000000" />

      {slotMap.map(({ slot, achievement }) => (
        <DisplaySlot
          key={slot.key}
          slot={slot}
          achievement={achievement}
          selected={!!achievement && achievement.id === selected}
          dim={!!selected && achievement?.id !== selected}
          onClick={() => onSelect(achievement!.id === selected ? null : achievement!.id)}
          tex={tex}
        />
      ))}

      <CameraRig focus={focus} />
    </>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function TrophyRoom3D() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return }
      const { data } = await supabase.from('achievements').select('*').order('display_order')
      setAchievements(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const sel = achievements.find((a) => a.id === selected)
  const catColor = sel ? (CAT_COLOR[sel.category] ?? '#f5b942') : '#f5b942'

  const FULL: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 100, background: '#080503', overflow: 'hidden' }

  if (loading) {
    return (
      <div style={{ ...FULL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, color: '#f5b942', letterSpacing: '0.15em' }}>ENTERING TROPHY HALL</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: 'rgba(245,185,66,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading achievements...</div>
      </div>
    )
  }

  return (
    <div style={FULL}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes panelRise { from { opacity:0; transform:translateY(18px);} to {opacity:1; transform:translateY(0);} }
        .tp-panel-inner { animation: panelRise 0.48s cubic-bezier(.22,1,.36,1) both; }
      `}} />

      {/* top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'linear-gradient(to bottom, rgba(8,5,3,0.92) 0%, transparent 100%)', pointerEvents: 'none' }}>
        <Link href="/trophies" style={{ pointerEvents: 'all', color: 'rgba(255,255,255,0.45)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase', background: 'rgba(0,0,0,0.55)', padding: '7px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>← Trophy Room</Link>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, color: '#f5b942', letterSpacing: '0.15em' }}>TROPHY HALL</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{achievements.length} achievements · Tap to inspect</div>
        </div>
        <div style={{ width: 90 }} />
      </div>

      <Canvas
        camera={{ position: [0, 2.7, 6.4], fov: 55 }}
        shadows
        gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.18 }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
        onPointerMissed={() => setSelected(null)}
      >
        <Suspense fallback={null}>
          <Scene achievements={achievements} selected={selected} onSelect={setSelected} />
          <EffectComposer multisampling={4}>
            <N8AO aoRadius={1.3} intensity={2.6} distanceFalloff={1} quality="medium" />
            <Bloom mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0.25} intensity={1.0} radius={0.75} />
            <Vignette eskil={false} offset={0.3} darkness={0.72} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* detail panel */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, transition: 'transform 0.4s cubic-bezier(.22,1,.36,1)', transform: sel ? 'translateY(0)' : 'translateY(110%)', pointerEvents: sel ? 'all' : 'none' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(to top, rgba(8,5,3,0.99) 0%, rgba(8,5,3,0.96) 40%, rgba(8,5,3,0.78) 68%, transparent 100%)', pointerEvents: 'none' }} />
        {sel && (
          <div className="tp-panel-inner" style={{ position: 'relative', maxWidth: 680, margin: '0 auto', padding: '0 28px 52px' }}>
            <div style={{ position: 'absolute', left: 28, top: 0, width: 3, height: 'calc(100% - 52px)', background: `linear-gradient(to bottom, ${catColor}, ${catColor}00)`, borderRadius: 2 }} />
            <div style={{ paddingLeft: 22 }}>
              <div style={{ fontSize: 68, lineHeight: 1, marginBottom: 16, filter: `drop-shadow(0 0 28px ${catColor}99) drop-shadow(0 0 10px ${catColor}55)` }}>{sel.emoji ?? '🏆'}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: catColor, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
                {[sel.category, sel.sport !== 'all' ? sel.sport : null, sel.season].filter(Boolean).join(' · ')}
              </div>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(26px, 5vw, 40px)', color: '#fff', letterSpacing: '0.035em', lineHeight: 1.05, marginBottom: 16 }}>{sel.title}</div>
              <div style={{ height: 1, maxWidth: 380, background: `linear-gradient(to right, ${catColor}77, transparent)`, marginBottom: 14 }} />
              {sel.description && (
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.68, maxWidth: 520 }}>{sel.description}</div>
              )}
            </div>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: -52, right: 28, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.1em', padding: '8px 14px', textTransform: 'uppercase' }}>ESC ✕</button>
          </div>
        )}
      </div>

      {!selected && (
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'none', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Drag to orbit · Pinch / scroll to zoom · Tap a trophy</div>
        </div>
      )}
    </div>
  )
}
