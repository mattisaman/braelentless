export type SportKey = 'soccer' | 'basketball' | 'track'

export interface StatEntry {
  label: string
  value: string | number
  unit?: string
}

export interface Goal {
  id: string
  label: string
  current: number
  target: number
  unit: string
  lowerBetter?: boolean
}

export interface Milestone {
  label: string
  achieved: boolean
}

export interface ScheduleEvent {
  id: string
  sport: SportKey
  opponent: string
  date: string // ISO date string YYYY-MM-DD
  time: string // HH:MM
  location: string
  type: 'game' | 'tournament' | 'practice' | 'meet'
  result?: string
}

// One row of season-by-season history for progression charts.
export interface SeasonStat {
  season: string                 // short label, e.g. '8th'
  year: string                   // e.g. "'22–23"
  metrics: Record<string, number> // keyed by metric, e.g. { ppg: 10.1, pts: 252 }
}

export interface SportData {
  key: SportKey
  name: string
  number: string
  position: string
  bgImage: string
  stats: StatEntry[]
  goals: Goal[]
  milestones: Milestone[]
  motto: string
  seasons?: SeasonStat[]         // oldest → newest; powers career progression
}

export interface JournalEntry {
  id: string
  date: string // ISO date string
  type: 'reflect' | 'forward'
  prompt: string
  content: string
}

export interface Book {
  id: string
  title: string
  author: string
  status: 'reading' | 'completed' | 'want-to-read'
  note: string
  pct: number
}

export interface VideoEntry {
  id: string
  title: string
  url: string
  type: 'Footage' | 'Highlight'
  sport: SportKey | 'general'
  notes: string
}

export interface HabitEntry {
  id: string
  label: string
  streak: number
  completedToday: boolean
}

export interface Drill {
  id: string
  title: string
  sport: SportKey | 'general'
  duration: string
  description: string
}

export interface MealPlan {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

export interface CollegeContact {
  id: string
  school: string
  coach: string
  status: 'interest' | 'contact' | 'visit' | 'offer' | 'committed'
  notes: string
  date?: string
}

export interface EligibilityItem {
  id: string
  label: string
  completed: boolean
}

export interface DailyMealEntry {
  id: string
  label: string      // 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  description: string
  calories: number
}

export interface Dream {
  id: string
  title: string
  detail: string
  horizon: string   // e.g. 'This season', 'By senior year', 'Lifetime'
  sport?: SportKey | 'life'
  progress?: number // 0–100, optional sense of momentum
}

export interface PersonalRecord {
  id: string
  sport: SportKey
  event: string     // e.g. '100m Hurdles', 'Vertical Jump'
  value: string     // formatted, e.g. '14.2s', "5'4\""
  date: string      // ISO
  prev?: string     // previous best, for "improved from"
  note?: string
}

export interface Quote {
  text: string
  author: string
}
