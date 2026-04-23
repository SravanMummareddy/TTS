'use client'

import { useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })
  const pathname = usePathname()
  const router = useRouter()
  const avatarRef = useRef<HTMLButtonElement>(null)

  const pageId = pathname === '/dashboard' ? 'dashboard' : pathname.slice(1)
  const label = PAGE_LABELS[pageId] || pageId

  const now = new Date('2026-04-22')
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const openDropdown = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    }
    setDropdownOpen(o => !o)
  }

  const close = () => setDropdownOpen(false)

  return (
    <>
      <header style={{ height: 'var(--header-h)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, background: 'rgba(12,12,22,0.8)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 10 }}>
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
          <div className="header-search" style={{ position: 'relative' }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--t1)', padding: '7px 12px 7px 34px', borderRadius: '22px', fontFamily: 'var(--font)', fontSize: '13px', outline: 'none', width: '180px', transition: 'width 0.3s, border-color 0.2s' }}
              onFocus={e => { (e.target as HTMLInputElement).style.width = '240px'; (e.target as HTMLInputElement).style.borderColor = 'var(--purple)'; }}
              onBlur={e => { (e.target as HTMLInputElement).style.width = '180px'; (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }} />
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }}>
              <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8.5 8.5L11.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <button className="header-bell" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t2)' }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 00-5 5v3l-1 2h12l-1-2V6a5 5 0 00-5-5zm0 13a2 2 0 01-2-2h4a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            ref={avatarRef}
            onClick={openDropdown}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple),var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer', border: dropdownOpen ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent', flexShrink: 0, transition: 'border-color 0.15s' }}>
            S
          </button>
        </div>
      </header>

      {/* Full-screen backdrop — closes dropdown when tapping anywhere else */}
      {dropdownOpen && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
        />
      )}

      {/* Dropdown — fixed so it escapes overflow:hidden */}
      {dropdownOpen && (
        <div style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right, width: '210px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '12px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 9999 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)', marginBottom: '2px' }}>Sravan</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)' }}>harisravan9@gmail.com</div>
          </div>
          <button
            onClick={() => { close(); router.push('/settings'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: 'var(--t2)', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s, color 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; (e.currentTarget as HTMLElement).style.color = 'var(--t1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--t2)'; }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.41 1.41M11.37 11.37l1.41 1.41M3.22 12.78l1.41-1.41M11.37 4.63l1.41-1.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Settings
          </button>
          <button
            onClick={() => { close(); router.push('/'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', background: 'transparent', border: 'none', color: '#ef4444', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 8H3m4-4-4 4 4 4m3-9h4v10h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sign out
          </button>
        </div>
      )}
    </>
  )
}
