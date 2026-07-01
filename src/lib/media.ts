// Client-side media helpers.
// Images are downscaled to a data URL (kept small enough for localStorage +
// the Supabase app_state sync, and CORS-free for use as WebGL textures).
// Short videos go to Supabase Storage (too large for a data URL).
import { supabase } from './supabase'

export async function fileToResizedDataUrl(file: File, maxDim = 900, quality = 0.82): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as string)
    r.onerror = rej
    r.readAsDataURL(file)
  })
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = dataUrl
  })
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale), h = Math.round(img.height * scale)
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  c.getContext('2d')!.drawImage(img, 0, 0, w, h)
  return c.toDataURL('image/jpeg', quality)
}

const BUCKET = 'media'

// Upload a (short) video to Supabase Storage; returns a public URL or null.
export async function uploadVideo(file: File): Promise<string | null> {
  if (!supabase) return null
  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase()
  const path = `dreams/${Date.now()}-${Math.round(performance.now())}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type || 'video/mp4',
  })
  if (error) return null
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
