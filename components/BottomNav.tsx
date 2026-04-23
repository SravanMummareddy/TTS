'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Ico, ICON_PATHS } from './icons'

const MOBILE_NAV = [
  { id: 'dashboard', icon: 'dashboard', label: 'Home' },
  { id: 'tasks', icon: 'tasks', label: 'Tasks' },
  { id: 'routines', icon: 'routines', label: 'Routines' },
  { id: 'journal', icon: 'journal', label: 'Journal' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const active = pathname === '/dashboard' ? 'dashboard' : pathname.slice(1)

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100,
    }}>
      {MOBILE_NAV.map(item => {
        const isActive = active === item.id
        return (
          <Link key={item.id} href={`/${item.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              minWidth: '56px',
              minHeight: '44px',
              borderRadius: '12px',
              background: isActive ? 'color-mix(in srgb, var(--purple) 15%, transparent)' : 'transparent',
              color: isActive ? 'var(--purple)' : 'var(--t3)',
              textDecoration: 'none',
              gap: '4px',
            }}>
            <Ico d={ICON_PATHS[item.icon]} size={20} />
            <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}