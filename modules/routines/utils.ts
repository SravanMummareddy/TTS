import type { Routine, RoutineVariant, RoutineLog, TimeSlot, ScheduleDay } from './types'
import { SCHEDULE_DAY_LABELS } from './types'

export function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

// Returns the variant that applies on a given day-of-week (0=Sun…6=Sat).
// Priority: explicit day match → default variant (days: []) → null.
export function getVariantForDay(
  routine: Routine,
  dow: number
): RoutineVariant | null {
  const explicit = routine.variants.find(v =>
    (v.days as number[]).includes(dow)
  )
  if (explicit) return explicit
  return routine.variants.find(v => v.days.length === 0) ?? null
}

export function isScheduledOnDay(routine: Routine, dow: number): boolean {
  return getVariantForDay(routine, dow) !== null
}

// Counts consecutive fully-completed scheduled days backwards from yesterday.
export function calcStreak(routine: Routine, logs: RoutineLog[]): number {
  const today = todayStr()
  const completedDates = new Set(
    logs
      .filter(
        l =>
          l.routineId === routine.id &&
          !l.skipped &&
          l.completionPct >= 100 &&
          l.date < today
      )
      .map(l => l.date)
  )

  let streak = 0
  const cursor = new Date(today + 'T12:00')
  cursor.setDate(cursor.getDate() - 1)

  for (let i = 0; i < 365; i++) {
    const ds = cursor.toISOString().split('T')[0]
    const dow = cursor.getDay()
    if (isScheduledOnDay(routine, dow)) {
      if (completedDates.has(ds)) streak++
      else break
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// Human-readable schedule summary for a routine based on its variants.
export function scheduleLabel(routine: Routine): string {
  const hasDefault = routine.variants.some(v => v.days.length === 0)
  if (hasDefault) return 'Daily'

  const allDays = Array.from(
    new Set(routine.variants.flatMap(v => v.days as number[]))
  ).sort()

  if (allDays.length === 0) return 'Not scheduled'

  const weekdays = [1, 2, 3, 4, 5]
  if (
    weekdays.every(d => allDays.includes(d)) &&
    allDays.length === 5 &&
    !allDays.includes(0) &&
    !allDays.includes(6)
  ) {
    return 'Weekdays'
  }

  return allDays.map(d => SCHEDULE_DAY_LABELS[d]).join(' · ')
}

export function timeLabel(slot: TimeSlot | null): string {
  switch (slot) {
    case 'morning':   return 'Morning'
    case 'afternoon': return 'Afternoon'
    case 'night':     return 'Night'
    case 'custom':    return 'Custom'
    default:          return ''
  }
}

export function timeEmoji(slot: TimeSlot | null): string {
  switch (slot) {
    case 'morning':   return '🌅'
    case 'afternoon': return '☀️'
    case 'night':     return '🌙'
    case 'custom':    return '⏰'
    default:          return '⏱'
  }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// Returns the union of all days claimed across all variants of a routine.
export function claimedDays(routine: Routine): ScheduleDay[] {
  return Array.from(
    new Set(routine.variants.flatMap(v => v.days as ScheduleDay[]))
  ).sort((a, b) => a - b)
}
