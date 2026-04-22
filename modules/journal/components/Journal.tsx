'use client'

import { useState } from 'react'

const JOURNAL_ENTRIES = [
  { id: 1, title: 'On solitude and the quiet architecture of the mind', date: 'April 18, 2026', tag: 'Reflection', readTime: '4 min', excerpt: 'There is a particular quality to early morning silence — before the world asserts itself, before the phone demands attention. In those minutes I find something that resembles clarity…', featured: true },
  { id: 2, title: 'Six months of intermittent fasting: what actually changed', date: 'April 12, 2026', tag: 'Body', readTime: '7 min', excerpt: 'I did not expect the mental clarity. The hunger was predictable. The discipline required was known in advance. But the quality of thought in a fasted state — that surprised me.' },
  { id: 3, title: 'Notes from an early morning run in the fog', date: 'April 9, 2026', tag: 'Movement', readTime: '3 min', excerpt: 'The fog erases the city. For forty minutes the world contracts to the sound of footfall and breath.' },
  { id: 4, title: 'On the compounding nature of small habits', date: 'March 30, 2026', tag: 'Systems', readTime: '5 min', excerpt: 'Compound interest applies to behaviour as much as capital. The gains are invisible at first. Then one day they are not.' },
  { id: 5, title: 'Reading notes: range by David Epstein', date: 'March 22, 2026', tag: 'Books', readTime: '6 min', excerpt: "Epstein's central argument is that breadth — not depth — produces the most creative and adaptive thinkers. The generalist, not the specialist, is built for complexity." },
]

type Entry = typeof JOURNAL_ENTRIES[0]

const TAG_COLORS: Record<string, string> = {
  Reflection: 'var(--gold-400)',
  Body:       'var(--violet-400)',
  Movement:   'oklch(0.68 0.14 165)',
  Systems:    'oklch(0.68 0.14 200)',
  Books:      'var(--rose-400)',
}

export default function JournalSection() {
  const [view, setView] = useState<'list' | 'post' | 'editor'>('list')
  const [activePost, setActivePost] = useState<Entry | null>(null)
  const [activeTag, setActiveTag] = useState('All')
  const [editorTitle, setEditorTitle] = useState('')
  const [editorBody, setEditorBody] = useState('')

  const tags = ['All', ...Array.from(new Set(JOURNAL_ENTRIES.map(e => e.tag)))]
  const filtered = activeTag === 'All' ? JOURNAL_ENTRIES : JOURNAL_ENTRIES.filter(e => e.tag === activeTag)
  const featured = JOURNAL_ENTRIES[0]
  const rest = filtered.filter(e => !e.featured || activeTag !== 'All')

  const openPost = (entry: Entry) => { setActivePost(entry); setView('post') }

  if (view === 'post' && activePost) {
    return (
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <button onClick={() => setView('list')} style={{ background: 'transparent', border: 'none', color: 'var(--text-400)', fontFamily: 'var(--font-ui)', fontSize: '12px', letterSpacing: '0.06em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          All entries
        </button>

        {/* Hero image placeholder */}
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '16/7', background: 'var(--bg-700)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 24px, oklch(0.15 0.01 258 / 0.3) 24px, oklch(0.15 0.01 258 / 0.3) 25px)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-400)', position: 'relative' }}>[ post hero image ]</span>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.16em', color: TAG_COLORS[activePost.tag] || 'var(--gold-400)', textTransform: 'uppercase' }}>{activePost.tag}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-400)' }}>{activePost.date}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-400)' }}>{activePost.readTime} read</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-100)', marginBottom: '32px' }}>{activePost.title}</h1>

        {/* Body */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, lineHeight: 1.85, color: 'var(--text-200)' }}>
          <p style={{ marginBottom: '28px' }}>{activePost.excerpt}</p>
          <p style={{ marginBottom: '28px' }}>There is a discipline in returning to the same practice each day. Not the discipline of force, but the discipline of familiarity — the way a musician returns to scales not because they are required, but because the scales have become a kind of home.</p>

          {/* Pull quote */}
          <blockquote style={{ borderLeft: '3px solid var(--gold-400)', paddingLeft: '28px', margin: '40px 0', fontStyle: 'italic', fontSize: '24px', color: 'var(--gold-400)', lineHeight: 1.5 }}>
            &ldquo;The gains are invisible at first. Then, one day, they are not.&rdquo;
          </blockquote>

          <p style={{ marginBottom: '28px' }}>What I have learned is that the environment matters more than intention. Change the context, change the behaviour. The self is more plastic than we are told, and more stubborn than we hope.</p>

          {/* Inline image placeholder */}
          <div style={{ borderRadius: 'var(--radius-sm)', aspectRatio: '16/9', background: 'var(--bg-700)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '36px 0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 24px, oklch(0.15 0.01 258 / 0.3) 24px, oklch(0.15 0.01 258 / 0.3) 25px)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-400)', position: 'relative' }}>[ inline image ]</span>
          </div>

          <p>There are still mornings when none of it feels like enough. That is the point, I think. Not the performance of growth, but the practice of it.</p>
        </div>
      </div>
    )
  }

  if (view === 'editor') {
    return (
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={() => setView('list')} style={{ background: 'transparent', border: 'none', color: 'var(--text-400)', fontFamily: 'var(--font-ui)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Discard
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '8px 18px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-300)', borderRadius: '6px', fontFamily: 'var(--font-ui)', fontSize: '12px', cursor: 'pointer' }}>Save draft</button>
            <button style={{ padding: '8px 20px', background: 'linear-gradient(135deg, var(--gold-400), var(--gold-500))', border: 'none', color: 'oklch(0.08 0.018 258)', borderRadius: '6px', fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Publish</button>
          </div>
        </div>
        <input value={editorTitle} onChange={e => setEditorTitle(e.target.value)} placeholder="Entry title…"
          style={{ width: '100%', background: 'transparent', border: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: 'var(--text-100)', outline: 'none', marginBottom: '12px', lineHeight: 1.1 }} />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {tags.filter(t => t !== 'All').map(t => (
            <button key={t} style={{ padding: '4px 12px', background: activeTag === t ? 'var(--gold-400)' : 'transparent', border: `1px solid ${activeTag === t ? 'var(--gold-400)' : 'var(--glass-border)'}`, color: activeTag === t ? 'oklch(0.08 0.018 258)' : 'var(--text-300)', borderRadius: '20px', fontFamily: 'var(--font-ui)', fontSize: '11px', cursor: 'pointer' }}
              onClick={() => setActiveTag(t)}>{t}</button>
          ))}
        </div>
        <textarea value={editorBody} onChange={e => setEditorBody(e.target.value)} placeholder="Begin writing…"
          style={{ width: '100%', minHeight: '480px', background: 'transparent', border: 'none', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, color: 'var(--text-200)', outline: 'none', lineHeight: 1.85, resize: 'none' }} />
      </div>
    )
  }

  // List view
  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tags.map(t => (
            <button key={t} onClick={() => setActiveTag(t)}
              style={{ padding: '6px 14px', background: activeTag === t ? 'var(--gold-400)' : 'transparent', border: `1px solid ${activeTag === t ? 'var(--gold-400)' : 'var(--glass-border)'}`, color: activeTag === t ? 'oklch(0.08 0.018 258)' : 'var(--text-300)', borderRadius: '20px', fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: activeTag === t ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>{t}</button>
          ))}
        </div>
        <button onClick={() => { setActiveTag('All'); setView('editor') }}
          style={{ padding: '9px 20px', background: 'linear-gradient(135deg, var(--gold-400), var(--gold-500))', border: 'none', color: 'oklch(0.08 0.018 258)', borderRadius: '6px', fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.06em' }}>
          + New entry
        </button>
      </div>

      {/* Featured post */}
      {activeTag === 'All' && (
        <div className="glass" onClick={() => openPost(featured)} style={{ padding: 0, marginBottom: '20px', cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px' }}>
            <div style={{ padding: '36px 40px 36px 36px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '16px' }}>Featured · {featured.tag}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.8vw, 38px)', fontWeight: 400, lineHeight: 1.15, color: 'var(--text-100)', marginBottom: '16px' }}>{featured.title}</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-300)', lineHeight: 1.7, marginBottom: '24px', fontWeight: 300 }}>{featured.excerpt}</p>
              <div style={{ fontSize: '11px', color: 'var(--text-400)', display: 'flex', gap: '16px' }}>
                <span>{featured.date}</span>
                <span>{featured.readTime} read</span>
              </div>
            </div>
            <div style={{ background: 'var(--bg-700)', borderLeft: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 24px, oklch(0.15 0.01 258 / 0.3) 24px, oklch(0.15 0.01 258 / 0.3) 25px)' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--text-400)', position: 'relative' }}>[ cover image ]</span>
            </div>
          </div>
        </div>
      )}

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {rest.map(entry => (
          <div key={entry.id} className="glass" onClick={() => openPost(entry)} style={{ padding: '26px', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.35 0.008 258 / 0.55)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: TAG_COLORS[entry.tag] || 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '12px' }}>{entry.tag}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 400, lineHeight: 1.3, color: 'var(--text-100)', marginBottom: '12px' }}>{entry.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-300)', lineHeight: 1.65, marginBottom: '18px', fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{entry.excerpt}</p>
            <div style={{ fontSize: '11px', color: 'var(--text-400)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{entry.date}</span>
              <span>{entry.readTime} read</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
