import type { Routine, RoutineLog, RoutineVariant } from './types'
import type { TimeSlot, ScheduleDay } from './types'

const API = '/api'

export async function fetchRoutines(): Promise<Routine[]> {
  const res = await fetch(`${API}/routines`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch routines')
  return res.json()
}

export async function fetchTodayLogs(): Promise<{ routine: Routine; variant: RoutineVariant; log: RoutineLog | null }[]> {
  const res = await fetch(`${API}/routines/today`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch today logs')
  return res.json()
}

export async function fetchRoutineHistory(days = 30): Promise<RoutineLog[]> {
  const res = await fetch(`${API}/routines/history?days=${days}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch routine history')
  return res.json()
}

export async function createRoutine(routine: unknown): Promise<Routine> {
  const res = await fetch(`${API}/routines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(routine),
  })
  if (!res.ok) throw new Error('Failed to create routine')
  return res.json()
}

export async function updateRoutine(id: string, routine: unknown): Promise<Routine> {
  const res = await fetch(`${API}/routines/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(routine),
  })
  if (!res.ok) throw new Error('Failed to update routine')
  return res.json()
}

export async function deleteRoutine(id: string): Promise<void> {
  const res = await fetch(`${API}/routines/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete routine')
}

export async function toggleItem(routineId: string, itemId: string): Promise<RoutineLog> {
  const res = await fetch(`${API}/routines/${routineId}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'toggle-item', itemId }),
  })
  if (!res.ok) throw new Error('Failed to toggle item')
  return res.json()
}

export async function skipRoutine(routineId: string, skipped = true): Promise<RoutineLog> {
  const res = await fetch(`${API}/routines/${routineId}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'skip', skipped }),
  })
  if (!res.ok) throw new Error('Failed to skip routine')
  return res.json()
}
