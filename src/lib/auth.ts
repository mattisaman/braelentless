// Who is allowed into Braelentless.
// Enforced in two places:
//   1. The UI gate (AuthProvider) — for a clean signed-out / denied experience.
//   2. Supabase RLS on app_state (the real lock) — see
//      supabase/migrations/003_auth_allowlist.sql
// Keep this list in sync with the RLS policy.
export const ALLOWED_EMAILS = [
  'mattisaman@gmail.com',
  'tisaman07@gmail.com',
  'bisaman07@gmail.com',
] as const

export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  return (ALLOWED_EMAILS as readonly string[]).includes(email.toLowerCase())
}
