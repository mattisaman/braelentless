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
