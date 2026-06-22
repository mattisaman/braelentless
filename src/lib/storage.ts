import { supabase } from './supabase'

// ─────────────────────────────────────────────────────────────
// Persistence layer
//
// localStorage is the synchronous source for instant reads/writes.
// When Supabase is configured, every write is mirrored to the
// `app_state` table (key → jsonb) and, on app boot, all rows are
// pulled back into localStorage so edits "hold" across devices and
// sessions. If Supabase is unreachable, the app keeps working purely
// from localStorage.
// ─────────────────────────────────────────────────────────────

const TABLE = 'app_state'

export function loadData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return (JSON.parse(raw) as T) ?? fallback
  } catch {
    return fallback
  }
}

export function saveData<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota / serialization — ignore */
    }
  }
  // Mirror to Supabase (fire-and-forget; never block or throw to the UI).
  void pushRemote(key, value)
}

async function pushRemote<T>(key: string, value: T): Promise<void> {
  if (!supabase) return
  try {
    await supabase
      .from(TABLE)
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  } catch {
    /* offline / table missing — localStorage still holds the value */
  }
}

let hydrated = false
let hydrating: Promise<void> | null = null

/**
 * Pull every saved key from Supabase into localStorage once per page load.
 * Remote is treated as the source of truth so the latest edit from any
 * device wins. Resolves quickly even if Supabase is slow/unavailable.
 */
export function hydrateFromSupabase(timeoutMs = 2500): Promise<void> {
  if (hydrated || typeof window === 'undefined' || !supabase) {
    hydrated = true
    return Promise.resolve()
  }
  if (hydrating) return hydrating

  hydrating = (async () => {
    try {
      const timeout = new Promise<{ timedOut: true }>((resolve) =>
        setTimeout(() => resolve({ timedOut: true }), timeoutMs)
      )
      const query = supabase!.from(TABLE).select('key,value')
      const result = (await Promise.race([query, timeout])) as
        | { timedOut: true }
        | { data: { key: string; value: unknown }[] | null; error: unknown }

      if (!('timedOut' in result) && result.data) {
        for (const row of result.data) {
          try {
            localStorage.setItem(row.key, JSON.stringify(row.value))
          } catch {
            /* ignore individual key failures */
          }
        }
      }
    } catch {
      /* ignore — fall back to whatever localStorage already has */
    } finally {
      hydrated = true
    }
  })()

  return hydrating
}
