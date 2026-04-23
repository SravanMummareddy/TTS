import type { Note } from './types'

const API = '/api'

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API}/notes`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function createNote(note: { title: string; body: string }): Promise<Note> {
  const res = await fetch(`${API}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
  if (!res.ok) throw new Error('Failed to create note')
  return res.json()
}

export async function updateNote(id: string, data: { title?: string; body?: string }): Promise<Note> {
  const res = await fetch(`${API}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update note')
  return res.json()
}