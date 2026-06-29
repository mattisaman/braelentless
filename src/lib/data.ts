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
  Dream,
  PersonalRecord,
  Quote,
} from './types'

export const SPORTS_DATA: SportData[] = [
  {
    key: 'soccer',
    name: 'Soccer',
    number: '#7',
    position: 'Forward',
    bgImage: '/soccer-field.png',
    stats: [
      { label: 'Goals', value: 28, unit: '' },
      { label: 'Assists', value: 20, unit: '' },
      { label: 'Career G', value: 84, unit: '' },
      { label: 'Career A', value: 57, unit: '' },
      { label: 'Seasons', value: 4, unit: '' },
      { label: 'State Poll', value: '#12', unit: '' },
    ],
    goals: [
      { id: 'soc-g1', label: 'Season Goals', current: 28, target: 35, unit: 'goals' },
      { id: 'soc-g2', label: 'Career Goals', current: 84, target: 96, unit: 'goals' },
      { id: 'soc-g3', label: 'Career Assists', current: 57, target: 57, unit: 'assists' },
    ],
    milestones: [
      { label: '10-Goal Season', achieved: true },
      { label: '20+ Goals in a Season', achieved: true },
      { label: 'Section Champions', achieved: true },
      { label: 'All-Star 4 Years', achieved: true },
      { label: 'NYS State Appearance', achieved: true },
      { label: 'Career Goals Record (96)', achieved: false },
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
      { label: 'PPG', value: 17.4, unit: '' },
      { label: 'RPG', value: 9.7, unit: '' },
      { label: 'APG', value: 6.8, unit: '' },
      { label: 'FG%', value: 50.0, unit: '%' },
      { label: 'FT%', value: 60.6, unit: '%' },
      { label: 'SPG', value: 5.2, unit: '' },
    ],
    goals: [
      { id: 'bball-g1', label: 'Points Per Game', current: 17.4, target: 22, unit: 'ppg' },
      { id: 'bball-g2', label: 'FG Percentage', current: 50.0, target: 55, unit: '%' },
      { id: 'bball-g3', label: 'Free Throw %', current: 60.6, target: 75, unit: '%' },
    ],
    milestones: [
      { label: '1,000 Career Points', achieved: true },
      { label: '1,280 Career Points (Active Record Chase)', achieved: true },
      { label: 'All-State Selection', achieved: true },
      { label: 'Broke Single-Season Scoring Record (436 pts)', achieved: true },
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
      { label: '100m H', value: '20.0', unit: 's' },
      { label: 'High Jump', value: "4'5\"", unit: '' },
      { label: 'Shot Put', value: "31'6\"", unit: '' },
      { label: 'Long Jump', value: "15'11\"", unit: '' },
      { label: '800m', value: '2:26.6', unit: '' },
      { label: 'Pent Pts', value: 2523, unit: '' },
    ],
    goals: [
      { id: 'track-g1', label: 'Pentathlon Score', current: 2523, target: 2800, unit: 'pts' },
      { id: 'track-g2', label: '100m Hurdles', current: 20.0, target: 18.0, unit: 's', lowerBetter: true },
      { id: 'track-g3', label: 'Long Jump', current: 191, target: 204, unit: 'in' },
    ],
    milestones: [
      { label: 'Scored 5 Pentathlon Events (PBs set)', achieved: true },
      { label: 'Reach D2/D3 Tier (2,800 pts)', achieved: false },
      { label: 'Section VI Champion', achieved: false },
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

export const DEFAULT_DREAMS: Dream[] = [
  {
    id: 'dream-1',
    title: 'Score in college',
    detail: 'Play meaningful minutes and contribute as a freshman at Southeastern.',
    horizon: 'By freshman year',
    sport: 'basketball',
    progress: 45,
  },
  {
    id: 'dream-2',
    title: 'Section VI Pentathlon Champion',
    detail: 'Win the sectional title and PR in all five events the same day.',
    horizon: 'This season',
    sport: 'track',
    progress: 60,
  },
  {
    id: 'dream-3',
    title: '1,000 career points',
    detail: 'Join the Keshequa 1K club before graduation.',
    horizon: 'By senior year',
    sport: 'basketball',
    progress: 72,
  },
  {
    id: 'dream-4',
    title: 'Lead by example',
    detail: 'Be the teammate everyone trusts. Relentless effort, every rep, every day.',
    horizon: 'Lifetime',
    sport: 'life',
    progress: 80,
  },
]

export const DEFAULT_PRS: PersonalRecord[] = [
  { id: 'pr-1', sport: 'track', event: '100m Hurdles', value: '20.0s', date: '2026-05-30', note: 'First attempt' },
  { id: 'pr-2', sport: 'track', event: 'High Jump', value: "4'5\"", date: '2026-05-16' },
  { id: 'pr-3', sport: 'basketball', event: 'Points (game)', value: '31', date: '2026-02-04', prev: '27', note: 'vs. Letchworth' },
  { id: 'pr-4', sport: 'track', event: 'Long Jump', value: "15'11.5\"", date: '2026-05-09' },
  { id: 'pr-6', sport: 'track', event: 'Shot Put', value: "31'6\"", date: '2026-05-23' },
  { id: 'pr-7', sport: 'track', event: '800m', value: '2:26.6', date: '2026-05-30' },
  { id: 'pr-5', sport: 'soccer', event: 'Goals (game)', value: '3', date: '2025-10-11', prev: '2', note: 'Hat trick vs. Genesee Valley' },
]

export const MOTIVATION_QUOTES: Quote[] = [
  { text: "Everything negative — pressure, challenges — is all an opportunity for me to rise.", author: 'Kobe Bryant' },
  { text: "It's not about perfect. It's about effort.", author: 'Jillian Michaels' },
  { text: "Hard work beats talent when talent doesn't work hard.", author: 'Tim Notke' },
  { text: "You miss 100% of the shots you don't take.", author: 'Wayne Gretzky' },
  { text: "Champions keep playing until they get it right.", author: 'Billie Jean King' },
  { text: "The will to win means nothing without the will to prepare.", author: 'Juma Ikangaa' },
  { text: "Relentless is a decision you make every single day.", author: 'Braelentless' },
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
