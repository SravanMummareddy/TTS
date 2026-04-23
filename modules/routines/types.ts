export type ScheduleDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type TimeSlot = 'morning' | 'afternoon' | 'night' | 'custom'

export interface RoutineVariant {
  id: string
  routineId: string
  days: ScheduleDay[]  // [] = default variant (fires on all days not claimed by other variants)
  label: string | null
  order: number
  items: RoutineItem[]
}

export interface RoutineItem {
  id: string
  variantId: string
  text: string
  optional: boolean
  order: number
  notes: string | null
}

export interface Routine {
  id: string
  name: string
  category: string
  color: string
  icon: string
  timeSlot: TimeSlot | null
  customTime: string | null
  active: boolean
  variants: RoutineVariant[]
  createdAt: string
}

export interface RoutineItemLog {
  id: string
  logId: string
  itemId: string
  done: boolean
}

export interface RoutineLog {
  id: string
  routineId: string
  variantId: string
  date: string
  completionPct: number
  skipped: boolean
  notes: string | null
  itemLogs: RoutineItemLog[]
}

export interface RoutineInput {
  name: string
  category: string
  color: string
  icon: string
  timeSlot: TimeSlot | null
  customTime: string | null
}

export interface VariantInput {
  days: ScheduleDay[]
  label?: string | null
  order?: number
  items: ItemInput[]
}

export interface ItemInput {
  text: string
  optional?: boolean
  order: number
  notes?: string | null
}

export const CATEGORIES = [
  { value: 'skincare',    label: 'Skincare',    icon: '✨' },
  { value: 'fitness',     label: 'Fitness',     icon: '💪' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
  { value: 'hygiene',     label: 'Hygiene',     icon: '🚿' },
  { value: 'nutrition',   label: 'Nutrition',   icon: '🥗' },
  { value: 'hair',        label: 'Hair Care',   icon: '💆' },
  { value: 'custom',      label: 'Custom',      icon: '📋' },
]

export const ROUTINE_COLORS = [
  '#7c5cfc', '#22c55e', '#0ea5e9', '#f97316', '#ec4899',
  '#a855f7', '#14b8a6', '#ef4444', '#f59e0b', '#6366f1',
]

export const TIME_SLOTS: { value: TimeSlot | null; label: string; emoji: string }[] = [
  { value: null,        label: 'Any time',  emoji: '⏱' },
  { value: 'morning',   label: 'Morning',   emoji: '🌅' },
  { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { value: 'night',     label: 'Night',     emoji: '🌙' },
  { value: 'custom',    label: 'Custom',    emoji: '⏰' },
]

export const SCHEDULE_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
