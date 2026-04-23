import type { FastingEntry, FastingStats } from './types'

const API = '/api'

export async function fetchActiveFast(): Promise<FastingEntry | null> {
  const res = await fetch(`${API}/fasting?type=active`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch active fast')
  return res.json()
}

export async function fetchFastingHistory(): Promise<FastingEntry[]> {
  const res = await fetch(`${API}/fasting`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch fasting history')
  return res.json()
}

export async function startFast(target: number = 16): Promise<FastingEntry> {
  const res = await fetch(`${API}/fasting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target }),
  })
  if (!res.ok) throw new Error('Failed to start fast')
  return res.json()
}

export async function endFast(id: string, completed: boolean = true): Promise<FastingEntry> {
  const res = await fetch(`${API}/fasting/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error('Failed to end fast')
  return res.json()
}