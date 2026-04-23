'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import BottomNav from './BottomNav'

const ACCENT_MAP: Record<string, { primary: string; dark: string; glow: string }> = {
  purple: { primary: '#7c5cfc', dark: '#5a3fd4', glow: 'rgba(124,92,252,0.28)' },
  green:  { primary: '#22c55e', dark: '#16a34a', glow: 'rgba(34,197,94,0.22)' },
  teal:   { primary: '#0ea5e9', dark: '#0284c7', glow: 'rgba(14,165,233,0.20)' },
  orange: { primary: '#f97316', dark: '#ea580c', glow: 'rgba(249,115,22,0.22)' },
}

interface Tweaks {
  accentColor: string
  sidebarWidth: number
  density: string
}

export function AppShellClient({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>({ accentColor: 'purple', sidebarWidth: 220, density: 'spacious' })
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setSidebarOpen(false)
    }
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const ac = ACCENT_MAP[tweaks.accentColor] || ACCENT_MAP.purple
    document.documentElement.style.setProperty('--purple', ac.primary)
    document.documentElement.style.setProperty('--purple-d', ac.dark)
    document.documentElement.style.setProperty('--purple-g', ac.glow)
    document.documentElement.style.setProperty('--sidebar-w', tweaks.sidebarWidth + 'px')
    // Keep compat aliases in sync
    document.documentElement.style.setProperty('--gold-400', ac.primary)
    document.documentElement.style.setProperty('--gold-glow', ac.glow)
  }, [tweaks])

  const handleTweak = (k: keyof Tweaks, v: string | number) => {
    setTweaks(prev => ({ ...prev, [k]: v }))
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="orb-layer" style={{ opacity: 0.45 }}><div className="orb orb-p" /><div className="orb orb-g" /></div>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 199, backdropFilter: 'blur(2px)' }}
        />
      )}

      <Sidebar
        onClose={() => setSidebarOpen(false)}
        style={isMobile ? {
          position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        } : undefined}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <Header onMenuClick={isMobile ? () => setSidebarOpen(o => !o) : undefined} />
        <main className="fade-in" style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '28px', paddingBottom: isMobile ? '80px' : '28px' }}>
          {children}
        </main>

        {/* Mobile bottom navigation */}
        {isMobile && <BottomNav />}
      </div>

      {/* Tweaks toggle */}
      <button onClick={() => setTweaksOpen(o => !o)}
        style={{ position: 'fixed', bottom: '24px', right: tweaksOpen ? '290px' : '24px', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--t2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, transition: 'right 0.3s' }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      </button>

      {/* Tweaks panel */}
      <div id="tweaks-panel" className={tweaksOpen ? 'active' : ''}>
        <div className="tw-title">Tweaks</div>
        <div className="tw-row">
          <div className="tw-label">Accent color</div>
          <select value={tweaks.accentColor} onChange={e => handleTweak('accentColor', e.target.value)}>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="teal">Teal</option>
            <option value="orange">Orange</option>
          </select>
        </div>
        <div className="tw-row">
          <div className="tw-label">Sidebar width</div>
          <select value={tweaks.sidebarWidth} onChange={e => handleTweak('sidebarWidth', +e.target.value)}>
            <option value="200">Compact</option>
            <option value="220">Default</option>
            <option value="260">Wide</option>
          </select>
        </div>
        <div className="tw-row">
          <div className="tw-label">Density</div>
          <select value={tweaks.density} onChange={e => handleTweak('density', e.target.value)}>
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </div>
    </div>
  )
}
