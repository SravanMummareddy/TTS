'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function Toggle({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!val)}
      style={{ width: '40px', height: '22px', borderRadius: '11px', background: val ? 'var(--purple)' : 'var(--surface3)', cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '3px', left: val ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'left 0.25s' }} />
    </div>
  )
}

const FIELDS = [
  { label: 'Display name', val: 'Sravan' },
  { label: 'Timezone', val: 'UTC−5 (EST)' },
]

export default function SettingsSection() {
  const [notif, setNotif] = useState(true)
  const [compact, setCompact] = useState(false)
  const router = useRouter()

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    color: 'var(--t1)',
    padding: '10px 14px',
    borderRadius: 'var(--rs)',
    fontFamily: 'var(--font)',
    fontSize: '13px',
    outline: 'none',
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      {/* Profile */}
      <div className="glass" style={{ padding: '28px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '20px' }}>Profile</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: 'white' }}>S</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--t1)', marginBottom: '2px' }}>Sravan</div>
            <div style={{ fontSize: '12px', color: 'var(--t3)' }}>harisravan9@gmail.com</div>
          </div>
        </div>
        {FIELDS.map((f, i) => (
          <div key={i} style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</label>
            <input defaultValue={f.val} style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--purple)'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border2)'} />
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="glass" style={{ padding: '28px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '20px' }}>Preferences</div>
        {[
          { label: 'Notifications', sub: 'Daily reminders and streaks', val: notif, fn: setNotif },
          { label: 'Compact mode',  sub: 'Reduce padding and type size',  val: compact, fn: setCompact },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 400, color: 'var(--t1)', marginBottom: '2px' }}>{p.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{p.sub}</div>
            </div>
            <Toggle val={p.val} onChange={p.fn} />
          </div>
        ))}
      </div>

      {/* Account */}
      <div className="glass" style={{ padding: '28px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '20px' }}>Account</div>
        <button
          onClick={() => router.push('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--rs)', color: '#ef4444', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 8H3m4-4-4 4 4 4m3-9h4v10h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Sign out
        </button>
      </div>
    </div>
  )
}
