'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  journal: 'Journal',
  notes: 'Notes',
  gallery: 'Gallery',
  tasks: 'Tasks',
  routines: 'Routines',
  fasting: 'Fasting',
  nutrition: 'Nutrition',
  body: 'Measurements',
  insights: 'Insights',
  settings: 'Settings',
}

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [q, setQ] = useState('')
  const pathname = usePathname()

  const pageId = pathname === '/dashboard' ? 'dashboard' : pathname.slice(1)
  const label = PAGE_LABELS[pageId] || pageId

  const now = new Date('2026-04-22')
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <header style={{ height: 'var(--header-h)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, background: 'rgba(12,12,22,0.8)', backdropFilter: 'blur(12px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onMenuClick && (
          <button onClick={onMenuClick} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t2)', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
        )}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: 500, marginBottom: '2px' }}>{dateStr}</div>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--t1)', lineHeight: 1 }}>{label}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--t1)', padding: '7px 12px 7px 34px', borderRadius: '22px', fontFamily: 'var(--font)', fontSize: '13px', outline: 'none', width: '180px', transition: 'width 0.3s, border-color 0.2s' }}
            onFocus={e => { (e.target as HTMLInputElement).style.width = '240px'; (e.target as HTMLInputElement).style.borderColor = 'var(--purple)'; }}
            onBlur={e => { (e.target as HTMLInputElement).style.width = '180px'; (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }} />
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }}>
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8.5 8.5L11.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        {/* Bell */}
        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t2)' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 00-5 5v3l-1 2h12l-1-2V6a5 5 0 00-5-5zm0 13a2 2 0 01-2-2h4a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple),var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer' }}>J</div>
      </div>
    </header>
  )
}
