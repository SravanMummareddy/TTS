'use client'

import { useState } from 'react'

const NOTES = [
  { id: 1, title: 'Daily affirmations',       preview: 'I am capable of growth…',              date: 'Today' },
  { id: 2, title: 'Book highlights — Range',   preview: 'Breadth beats depth in complex domains…', date: 'Apr 19' },
  { id: 3, title: 'Goals Q2 2026',            preview: 'Ship personal OS, run 5k sub 25min…',   date: 'Apr 15' },
  { id: 4, title: 'Supplement stack',          preview: 'Creatine 5g, Magnesium glycinate…',    date: 'Apr 12' },
]

type Note = typeof NOTES[0]

export default function NotesSection() {
  const [active, setActive] = useState<Note>(NOTES[0])
  const [body, setBody] = useState('I am capable of growth. I am consistent. I choose discomfort over stagnation.\n\nToday I will do what yesterday-me could not.')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '0', height: 'calc(100vh - 130px)', background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border2)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
      {/* Note list */}
      <div style={{ borderRight: '1px solid var(--border2)', overflowY: 'auto', padding: '16px 0' }}>
        <div style={{ padding: '0 16px 12px', fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase' }}>Notes</div>
        {NOTES.map(n => (
          <div key={n.id} onClick={() => setActive(n)}
            style={{ padding: '14px 16px', cursor: 'pointer', background: active.id === n.id ? 'rgba(255,255,255,0.04)' : 'transparent', borderLeft: `3px solid ${active.id === n.id ? 'var(--purple)' : 'transparent'}`, transition: 'all 0.15s' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)', marginBottom: '4px' }}>{n.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.preview}</div>
            <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: '4px' }}>{n.date}</div>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div style={{ padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <input defaultValue={active.title} key={active.id}
          style={{ background: 'transparent', border: 'none', fontSize: '28px', fontWeight: 700, color: 'var(--t1)', outline: 'none', marginBottom: '20px', fontFamily: 'var(--font)' }} />
        <textarea value={body} onChange={e => setBody(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '16px', fontWeight: 300, color: 'var(--t2)', outline: 'none', lineHeight: 1.8, resize: 'none', fontFamily: 'var(--font)' }} />
      </div>
    </div>
  )
}
