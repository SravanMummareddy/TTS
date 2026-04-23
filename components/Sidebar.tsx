'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Ico, ICON_PATHS } from './icons'

const NAV = [
  { group: '', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
  { group: 'Life', items: [{ id: 'journal', label: 'Journal', icon: 'journal' }, { id: 'notes', label: 'Notes', icon: 'notes' }, { id: 'gallery', label: 'Gallery', icon: 'gallery' }] },
  { group: 'Body', items: [{ id: 'fasting', label: 'Fasting', icon: 'fasting' }, { id: 'nutrition', label: 'Nutrition', icon: 'nutrition' }, { id: 'body', label: 'Measurements', icon: 'body' }] },
  { group: 'Mind', items: [{ id: 'tasks', label: 'Tasks', icon: 'tasks' }, { id: 'routines', label: 'Routines', icon: 'routines' }] },
  { group: 'System', items: [{ id: 'insights', label: 'Insights', icon: 'insights' }, { id: 'settings', label: 'Settings', icon: 'settings' }] },
]

export default function Sidebar({ onClose, style }: { onClose?: () => void; style?: React.CSSProperties }) {
  const pathname = usePathname()
  const router = useRouter()
  const [hov, setHov] = useState<string | null>(null)

  const active = pathname === '/dashboard' ? 'dashboard' : pathname.slice(1)

  return (
    <aside style={{ width: 'var(--sidebar-w)', height: '100vh', background: '#0e0e1c', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto', overflowX: 'hidden', ...style }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,var(--purple),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: 'white', flexShrink: 0 }}>P</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Personal OS</div>
            <div style={{ fontSize: '10px', color: 'var(--t3)', fontWeight: 500 }}>Your system</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: '6px' }}>
            {group && <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', color: 'var(--t3)', textTransform: 'uppercase', padding: '10px 8px 6px' }}>{group}</div>}
            {items.map(item => {
              const isActive = active === item.id
              const isHov = hov === item.id
              return (
                <Link key={item.id} href={`/${item.id}`}
                  onClick={() => onClose?.()}
                  onMouseEnter={() => setHov(item.id)}
                  onMouseLeave={() => setHov(null)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', background: isActive ? 'color-mix(in srgb, var(--purple) 15%, transparent)' : isHov ? 'rgba(255,255,255,0.04)' : 'transparent', border: `1px solid ${isActive ? 'color-mix(in srgb, var(--purple) 35%, transparent)' : 'transparent'}`, color: isActive ? 'var(--purple)' : 'var(--t2)', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: isActive ? 600 : 500, cursor: 'pointer', textDecoration: 'none', textAlign: 'left', transition: 'all 0.15s', marginBottom: '2px' }}>
                  <Ico d={ICON_PATHS[item.icon]} size={15} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--purple)', flexShrink: 0 }} />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', marginBottom: '4px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple),var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0 }}>S</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>Sravan</div>
            <div style={{ fontSize: '10px', color: 'var(--t3)' }}>Owner</div>
          </div>
        </div>
        <button onClick={() => router.push('/')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 10px', borderRadius: '10px', background: 'transparent', border: 'none', color: 'var(--t3)', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--t3)'}>
          <Ico d={ICON_PATHS.logout} size={13} /> Sign out
        </button>
      </div>
    </aside>
  )
}
