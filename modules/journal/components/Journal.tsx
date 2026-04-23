'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry, type JournalEntry } from '../api'

const TAG_COLORS: Record<string, string> = {
  Reflection: 'var(--gold-400)',
  Body:       'var(--violet-400)',
  Movement:   'oklch(0.68 0.14 165)',
  Systems:    'oklch(0.68 0.14 200)',
  Books:      'var(--rose-400)',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTagDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function calcReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 225))} min`
}

function buildExcerpt(body: string): string {
  const text = body.trim().replace(/\s+/g, ' ')
  return text.length > 180 ? `${text.slice(0, 177)}...` : text
}

const TAGS = ['Reflection', 'Body', 'Movement', 'Systems', 'Books']

export default function JournalSection() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'post' | 'editor'>('list')
  const [activePost, setActivePost] = useState<JournalEntry | null>(null)
  const [activeTag, setActiveTag] = useState('All')
  const [editorTitle, setEditorTitle] = useState('')
  const [editorBody, setEditorBody] = useState('')
  const [editorTag, setEditorTag] = useState('Reflection')
  const [editorDate, setEditorDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchJournalEntries()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const tags = useMemo(() => {
    const used = Array.from(new Set(entries.map(e => e.tag)))
    return used.length > 0 ? ['All', ...used] : ['All', ...TAGS]
  }, [entries])

  const featured = useMemo(() => entries.find(e => e.featured) ?? entries[0], [entries])
  const filtered = activeTag === 'All' ? entries : entries.filter(e => e.tag === activeTag)
  const rest = filtered.filter(e => e.id !== featured?.id)

  const openPost = (entry: JournalEntry) => { setActivePost(entry); setView('post') }

  const handleSave = async () => {
    if (!editorTitle.trim() || !editorBody.trim()) return
    setIsSubmitting(true)
    const body = editorBody.trim()
    try {
      const entry = await createJournalEntry({
        title: editorTitle.trim(),
        body,
        tag: editorTag,
        date: new Date(editorDate),
        featured: activeTag === 'All' && !entries.length,
      })
      setEntries(es => [entry, ...es])
      setView('list')
      setEditorTitle('')
      setEditorBody('')
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--t3)' }}>
        Loading...
      </div>
    )
  }

  if (view === 'post' && activePost) {
    return (
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <button onClick={() => setView('list')} style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontFamily: 'var(--font)', fontSize: '12px', letterSpacing: '0.06em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          All entries
        </button>

        <div style={{ borderRadius: 'var(--rs)', overflow: 'hidden', aspectRatio: '16/7', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--t3)' }}>[ post hero image ]</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.16em', color: TAG_COLORS[activePost.tag] || 'var(--gold-400)', textTransform: 'uppercase' }}>{activePost.tag}</span>
          <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{formatDate(activePost.date)}</span>
          <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{activePost.readTime} read</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.15, color: 'var(--t1)', marginBottom: '32px' }}>{activePost.title}</h1>

        <div style={{ fontFamily: 'var(--font)', fontSize: '18px', fontWeight: 300, lineHeight: 1.85, color: 'var(--t2)' }}>
          {activePost.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: '24px' }}>{para}</p>
          ))}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <button onClick={async () => {
            if (!confirm('Delete this entry?')) return
            await deleteJournalEntry(activePost.id)
            setEntries(es => es.filter(e => e.id !== activePost.id))
            setView('list')
          }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '6px', fontFamily: 'var(--font)', fontSize: '12px', cursor: 'pointer' }}>
            Delete entry
          </button>
        </div>
      </div>
    )
  }

  if (view === 'editor') {
    return (
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={() => setView('list')} style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontFamily: 'var(--font)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting || !editorTitle.trim() || !editorBody.trim()}
            style={{
              padding: '9px 20px',
              background: 'linear-gradient(135deg, var(--gold-400), var(--gold-500))',
              border: 'none',
              color: 'oklch(0.08 0.018 258)',
              borderRadius: '6px',
              fontFamily: 'var(--font)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isSubmitting || !editorTitle.trim() ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
            }}>
            {isSubmitting ? 'Publishing…' : 'Publish'}
          </button>
        </div>
        <input
          value={editorTitle}
          onChange={e => setEditorTitle(e.target.value)}
          placeholder="Entry title…"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            fontFamily: 'var(--font)',
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 300,
            color: 'var(--t1)',
            outline: 'none',
            marginBottom: '12px',
            lineHeight: 1.1,
          }}
        />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={editorDate}
            onChange={e => setEditorDate(e.target.value)}
            style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--t1)', borderRadius: '6px', padding: '5px 10px', fontFamily: 'var(--font)', fontSize: '12px', outline: 'none' }}
          />
          {TAGS.map(t => (
            <button key={t} onClick={() => setEditorTag(t)} style={{
              padding: '4px 12px',
              background: editorTag === t ? TAG_COLORS[t] ?? 'var(--gold-400)' : 'transparent',
              border: `1px solid ${editorTag === t ? (TAG_COLORS[t] ?? 'var(--gold-400)') : 'var(--border)'}`,
              color: editorTag === t ? 'oklch(0.08 0.018 258)' : 'var(--t3)',
              borderRadius: '20px',
              fontFamily: 'var(--font)',
              fontSize: '11px',
              cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>
        <textarea
          value={editorBody}
          onChange={e => setEditorBody(e.target.value)}
          placeholder="Begin writing…"
          style={{
            width: '100%',
            minHeight: '480px',
            background: 'transparent',
            border: 'none',
            fontFamily: 'var(--font)',
            fontSize: '18px',
            fontWeight: 300,
            color: 'var(--t2)',
            outline: 'none',
            lineHeight: 1.85,
            resize: 'none',
          }}
        />
      </div>
    )
  }

  // List view
  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tags.map(t => (
            <button key={t} onClick={() => setActiveTag(t)}
              style={{
                padding: '6px 14px',
                background: activeTag === t ? 'var(--gold-400)' : 'transparent',
                border: `1px solid ${activeTag === t ? 'var(--gold-400)' : 'var(--border)'}`,
                color: activeTag === t ? 'oklch(0.08 0.018 258)' : 'var(--t3)',
                borderRadius: '20px',
                fontFamily: 'var(--font)',
                fontSize: '11px',
                fontWeight: activeTag === t ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>{t}</button>
          ))}
        </div>
        <button onClick={() => { setActiveTag('All'); setView('editor') }}
          style={{
            padding: '9px 20px',
            background: 'linear-gradient(135deg, var(--gold-400), var(--gold-500))',
            border: 'none',
            color: 'oklch(0.08 0.018 258)',
            borderRadius: '6px',
            fontFamily: 'var(--font)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
          + New entry
        </button>
      </div>

      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--t3)' }}>
          No journal entries yet. Start writing!
        </div>
      )}

      {activeTag === 'All' && featured && (
        <div onClick={() => openPost(featured)} style={{
          padding: 0,
          marginBottom: '20px',
          cursor: 'pointer',
          overflow: 'hidden',
          background: 'var(--surface1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--rs)',
          transition: 'transform 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
            <div style={{ padding: '36px 40px 36px 36px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '16px' }}>Featured · {featured.tag}</div>
              <h2 style={{ fontFamily: 'var(--font)', fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 400, lineHeight: 1.15, color: 'var(--t1)', marginBottom: '16px' }}>{featured.title}</h2>
              <p style={{ fontSize: '14px', color: 'var(--t3)', lineHeight: 1.7, marginBottom: '24px', fontWeight: 300 }}>{featured.excerpt}</p>
              <div style={{ fontSize: '11px', color: 'var(--t3)', display: 'flex', gap: '16px' }}>
                <span>{formatDate(featured.date)}</span>
                <span>{featured.readTime} read</span>
              </div>
            </div>
            <div style={{ background: 'var(--surface2)', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--t3)' }}>[ cover image ]</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {rest.map(entry => (
          <div key={entry.id} onClick={() => openPost(entry)} style={{
            padding: '26px',
            cursor: 'pointer',
            background: 'var(--surface1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--rs)',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-3px)'
              el.style.borderColor = 'var(--border2)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'none'
              el.style.borderColor = 'var(--border)'
            }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: TAG_COLORS[entry.tag] || 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '12px' }}>{entry.tag}</div>
            <h3 style={{ fontFamily: 'var(--font)', fontSize: '20px', fontWeight: 400, lineHeight: 1.3, color: 'var(--t1)', marginBottom: '12px' }}>{entry.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--t3)', lineHeight: 1.65, marginBottom: '18px', fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{entry.excerpt}</p>
            <div style={{ fontSize: '11px', color: 'var(--t3)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{formatTagDate(entry.date)}</span>
              <span>{entry.readTime} read</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}