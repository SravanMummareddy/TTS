'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Note } from '../types'
import { fetchNotes, createNote, updateNote } from '../api'

function formatDate(date: string): string {
  const d = new Date(date)
  const today = new Date()
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === -1) return 'Yesterday'
  if (diff > -7 && diff < 0) return d.toLocaleDateString('en-US', { weekday: 'short' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const load = useCallback(async () => {
    try {
      const n = await fetchNotes()
      setNotes(n)
      if (n.length > 0 && !active) {
        setActive(n[0])
        setTitle(n[0].title)
        setBody(n[0].body)
      }
    } catch (e) {
      console.error('Failed to load notes:', e)
    } finally {
      setLoading(false)
    }
  }, [active])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (active) {
      setTitle(active.title)
      setBody(active.body)
    }
  }, [active])

  const handleSave = async () => {
    if (!active) return
    try {
      const updated = await updateNote(active.id, { title, body })
      setNotes(notes.map(n => n.id === active.id ? updated : n))
      setActive(updated)
    } catch (e) {
      console.error('Failed to save note:', e)
    }
  }

  const handleCreate = async () => {
    try {
      const note = await createNote({ title: 'Untitled', body: '' })
      setNotes([note, ...notes])
      setActive(note)
      setTitle('Untitled')
      setBody('')
    } catch (e) {
      console.error('Failed to create note:', e)
    }
  }

  if (loading) {
    return <div style={{ padding: 20, color: 'var(--t3)' }}>Loading...</div>
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '0', height: 'calc(100vh - 130px)', background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border2)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
      <div style={{ borderRight: '1px solid var(--border2)', overflowY: 'auto', padding: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 12px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase' }}>Notes</div>
          <button onClick={handleCreate} style={{ background: 'none', border: 'none', color: 'var(--purple)', cursor: 'pointer', fontSize: '18px' }}>+</button>
        </div>
        {notes.map(n => (
          <div key={n.id} onClick={() => setActive(n)}
            style={{ padding: '14px 16px', cursor: 'pointer', background: active?.id === n.id ? 'rgba(255,255,255,0.04)' : 'transparent', borderLeft: `3px solid ${active?.id === n.id ? 'var(--purple)' : 'transparent'}`, transition: 'all 0.15s' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body.split('\n')[0] || '...'}</div>
            <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: '4px' }}>{formatDate(n.updatedAt)}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {active ? (
          <>
            <input value={title} onChange={e => setTitle(e.target.value)} onBlur={handleSave}
              style={{ background: 'transparent', border: 'none', fontSize: '28px', fontWeight: 700, color: 'var(--t1)', outline: 'none', marginBottom: '20px', fontFamily: 'var(--font)' }} />
            <textarea value={body} onChange={e => setBody(e.target.value)} onBlur={handleSave}
              style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '16px', fontWeight: 300, color: 'var(--t2)', outline: 'none', lineHeight: 1.8, resize: 'none', fontFamily: 'var(--font)' }} />
          </>
        ) : (
          <div style={{ color: 'var(--t3)', textAlign: 'center', marginTop: 100 }}>
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  )
}