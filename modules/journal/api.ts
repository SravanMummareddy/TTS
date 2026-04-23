import type { JournalEntryInput, JournalEntryUpdateInput } from './types'

const API = '/api'

export interface JournalEntry {
  id: string
  title: string
  body: string
  tag: string
  date: string
  excerpt: string
  readTime: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  const res = await fetch(`${API}/journal`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch journal entries')
  return res.json()
}

export async function createJournalEntry(data: Omit<JournalEntryInput, 'date'> & { date: Date }): Promise<JournalEntry> {
  const res = await fetch(`${API}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, date: data.date.toISOString() }),
  })
  if (!res.ok) throw new Error('Failed to create journal entry')
  return res.json()
}

export async function updateJournalEntry(id: string, data: Partial<JournalEntryUpdateInput>): Promise<JournalEntry> {
  const res = await fetch(`${API}/journal/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update journal entry')
  return res.json()
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const res = await fetch(`${API}/journal/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete journal entry')
}