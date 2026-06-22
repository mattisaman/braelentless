import type {
  SportData,
  ScheduleEvent,
  JournalEntry,
  Book,
  VideoEntry,
  HabitEntry,
  Drill,
  MealPlan,
  CollegeContact,
  EligibilityItem,
  DailyMealEntry,
} from './types'

export const SPORTS_DATA: SportData[] = [
  {
    key: 'soccer',
    name: 'Soccer',
    number: '#7',
    position: 'Forward',
    bgImage: '/soccer-field.png',
    stats: [
      { label: 'Goals', value: 14, unit: '' },
      { label: 'Assists', value: 9, unit: '' },
      { label: 'Shots', value: 47, unit: '' },
      { label: 'Shot %', value: 29.8, unit: '%' },
      { label: 'Games', value: 18, unit: '' },
      { label: 'Min/Game', value: 72, unit: '' },
    ],
    goals: [
      { id: 'soc-g1', label: 'Season Goals', current: 14, target: 20, unit: 'goals' },
      { id: 'soc-g2', label: 'Assists', current: 9, target: 15, unit: 'assists' },
      { id: 'soc-g3', label: 'Shot Accuracy', current: 29.8, target: 35, unit: '%' },
    ],
    milestones: [
      { label: '10-Goal Season', achieved: true },
      { label: 'All-Conference Selection', achieved: false },
    ],
    motto: 'Be relentless. Be precise. Be feared.',
  },
  {
    key: 'basketball',
    name: 'Basketball',
    number: '#10',
    position: 'Guard',
    bgImage: '/basketball-court.png',
    stats: [
      { label: 'PPG', value: 18.4, unit: '' },
      { label: 'RPG', value: 6.2, unit: '' },
      { label: 'APG', value: 4.1, unit: '' },
      { label: '3PT%', value: 38.5, unit: '%' },
      { label: 'FT%', value: 82.3, unit: '%' },
      { label: 'SPG', value: 2.3, unit: '' },
    ],
    goals: [
      { id: 'bball-g1', label: 'Points Per Game', current: 18.4, target: 22, unit: 'ppg' },
      { id: 'bball-g2', label: '3PT Percentage', current: 38.5, target: 42, unit: '%' },
      { id: 'bball-g3', label: 'Free Throw %', current: 82.3, target: 88, unit: '%' },
    ],
    milestones: [
      { label: '1,000 Career Points', achieved: false },
      { label: 'All-State Honorable Mention', achieved: true },
    ],
    motto: 'Every shot is earned. Every rep compounds.',
  },
  {
    key: 'track',
    name: 'Track & Field',
    number: '',
    position: 'Pentathlon',
    bgImage: '/track-night.png',
    stats: [
      { label: '100m H', value: '14.2', unit: 's' },
      { label: 'High Jump', value: "5'4\"", unit: '' },
      { label: 'Shot Put', value: '32.1', unit: 'ft' },
      { label: '200m', value: '25.8', unit: 's' },
      { label: '800m', value: '2:28', unit: '' },
      { label: 'Pent Pts', value: 3240, unit: '' },
    ],
    goals: [
      { id: 'track-g1', label: 'Pentathlon Score', current: 3240, target: 3600, unit: 'pts' },
      { id: 'track-g2', label: '100m Hurdles', current: 14.2, target: 13.8, unit: 's', lowerBetter: true },
      { id: 'track-g3', label: 'High Jump', current: 64, target: 67, unit: 'in' },
    ],
    milestones: [
      { label: 'Section VI Champion', achieved: false },
      { label: 'PR in All 5 Events', achieved: false },
    ],
    motto: 'Five events. One champion. No excuses.',
  },
]

export const DEFAULT_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'sch-1',
    sport: 'basketball',
    opponent: 'Letchworth',
    date: '2026-07-05',
    time: '18:00',
    location: 'Keshequa High School',
    type: 'game',
    result: '',
  },
  {
    id: 'sch-2',
    sport: 'basketball',
    opponent: 'Avoca',
    date: '2026-07-12',
    time: '16:30',
    location: 'Avoca High School',
    type: 'game',
    result: 'W 58-41',
  },
  {
    id: 'sch-3',
    sport: 'soccer',
    opponent: 'Genesee Valley',
    date: '2026-07-08',
    time: '17:00',
    location: 'Home Field',
    type: 'game',
    result: '',
  },
  {
    id: 'sch-4',
    sport: 'track',
    opponent: 'Section VI Qualifier',
    date: '2026-07-19',
    time: '09:00',
    location: 'Letchworth Athletic Complex',
    type: 'meet',
    result: '',
  },
  {
    id: 'sch-5',
    sport: 'basketball',
    opponent: 'Team Practice',
    date: '2026-07-03',
    time: '15:00',
    location: 'Keshequa Gym',
    type: 'practice',
    result: '',
  },
]

export const DEFAULT_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    date: '2026-06-20',
    type: 'reflect',
    prompt: 'What went well this week and what would you do differently?',
    content:
      'Had a great practice Wednesday, my shot selection was really dialed in. Need to work on left hand drive-and-finish — kept getting blocked. Would spend more time on film review.',
  },
  {
    id: 'j-2',
    date: '2026-06-15',
    type: 'forward',
    prompt: 'What is one skill you want to master this month?',
    content:
      'I want to master the mid-range pull-up jumper off the dribble. Going to rep it 200 times every practice.',
  },
]

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'b-1',
    title: 'The Mamba Mentality',
    author: 'Kobe Bryant',
    status: 'reading',
    note: 'Obsession with craft. Take something from every session.',
    pct: 68,
  },
  {
    id: 'b-2',
    title: 'Grit',
    author: 'Angela Duckworth',
    status: 'completed',
    note: 'Passion + perseverance over raw talent. The science behind sustained effort.',
    pct: 100,
  },
  {
    id: 'b-3',
    title: 'The Score Takes Care of Itself',
    author: 'Bill Walsh',
    status: 'want-to-read',
    note: 'Process-first philosophy from one of the greatest coaches ever.',
    pct: 0,
  },
]

export const DEFAULT_VIDEOS: VideoEntry[] = [
  {
    id: 'v-1',
    title: 'Braelyn — Basketball Highlights 2025-26',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'Highlight',
    sport: 'basketball',
    notes: 'Full season cut for college recruiters',
  },
  {
    id: 'v-2',
    title: 'Section VI Pentathlon 2026',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'Footage',
    sport: 'track',
    notes: 'Raw footage from all 5 events',
  },
]

export const DEFAULT_HABITS: HabitEntry[] = [
  { id: 'h-1', label: 'Morning Mobility (15 min)', streak: 12, completedToday: true },
  { id: 'h-2', label: '200 Shot Reps', streak: 8, completedToday: false },
  { id: 'h-3', label: 'Film Review', streak: 5, completedToday: true },
  { id: 'h-4', label: 'Protein Goal (120g+)', streak: 14, completedToday: false },
  { id: 'h-5', label: 'Sleep 9hrs', streak: 3, completedToday: true },
]

export const DEFAULT_DRILLS: Drill[] = [
  {
    id: 'd-1',
    title: 'Mikan Drill',
    sport: 'basketball',
    duration: '10 min',
    description: 'Alternate-hand layups from close range. 20 makes each side.',
  },
  {
    id: 'd-2',
    title: 'Ball Mastery Circuit',
    sport: 'soccer',
    duration: '15 min',
    description: 'Toe taps, inside-outside, scissors, roll-overs. 3 rounds.',
  },
  {
    id: 'd-3',
    title: 'Hurdle Drills',
    sport: 'track',
    duration: '20 min',
    description: '3-step approach, trail leg mechanics, lead leg lift drills.',
  },
  {
    id: 'd-4',
    title: 'Defensive Slide',
    sport: 'basketball',
    duration: '8 min',
    description: 'Full-court defensive slides in athletic stance. Stay low, no crossing feet.',
  },
  {
    id: 'd-5',
    title: 'Finishing Package',
    sport: 'basketball',
    duration: '12 min',
    description: 'Left-hand layup, euro step, reverse, floater. 10 makes each.',
  },
]

export const DEFAULT_MEAL: MealPlan = {
  calories: 2400,
  protein: 130,
  carbs: 280,
  fat: 75,
  water: 96,
}

export const DEFAULT_COLLEGES: CollegeContact[] = [
  {
    id: 'c-1',
    school: 'Southeastern University',
    coach: 'Coach Riddle',
    status: 'committed',
    notes: 'Official commitment made. NLI signing November 2026.',
    date: '2026-05-15',
  },
  {
    id: 'c-2',
    school: 'Roberts Wesleyan',
    coach: 'Coach Williams',
    status: 'offer',
    notes: 'Full scholarship offer received April 2026.',
    date: '2026-04-10',
  },
  {
    id: 'c-3',
    school: 'SUNY Cortland',
    coach: 'Coach Park',
    status: 'visit',
    notes: 'Campus visit completed. Good program, strong academics.',
    date: '2026-03-22',
  },
]

export const DEFAULT_ELIGIBILITY: EligibilityItem[] = [
  { id: 'e-1', label: 'NCAA/NAIA Eligibility Center Registration', completed: true },
  { id: 'e-2', label: 'SAT/ACT Score Submitted', completed: true },
  { id: 'e-3', label: 'Official Transcript Sent', completed: false },
  { id: 'e-4', label: 'Amateurism Certification', completed: false },
  { id: 'e-5', label: 'Highlight Video Uploaded to Hudl', completed: true },
  { id: 'e-6', label: 'Athletic Resume Updated', completed: false },
  { id: 'e-7', label: 'NLI Paperwork Ready', completed: false },
  { id: 'e-8', label: 'Financial Aid / FAFSA Filed', completed: false },
]

export const DEFAULT_DAILY_MEALS: DailyMealEntry[] = [
  { id: 'meal-b', label: 'Breakfast', description: 'Eggs, oats, banana, protein shake', calories: 650 },
  { id: 'meal-l', label: 'Lunch', description: 'Grilled chicken, brown rice, veggies', calories: 750 },
  { id: 'meal-d', label: 'Dinner', description: 'Salmon, sweet potato, salad', calories: 700 },
  { id: 'meal-s', label: 'Snack', description: 'Greek yogurt, almonds, fruit', calories: 300 },
]

export const JOURNAL_PROMPTS = {
  reflect: [
    'What went well this week and what would you do differently?',
    'Describe a moment this week where you pushed past your limit.',
    'What is one mistake you made and what did it teach you?',
    'Who helped you grow this week? How can you pay it forward?',
  ],
  forward: [
    'What is one skill you want to master this month?',
    'What does your best possible season look like?',
    'What habit would change your game most if you locked it in?',
    'Write a letter to yourself one year from today.',
  ],
}
