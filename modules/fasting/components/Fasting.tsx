'use client'

import { useState, useEffect } from 'react'

const HISTORY = [
  { date: 'Apr 20', hours: 24, target: 24 },
  { date: 'Apr 19', hours: 20, target: 24 },
  { date: 'Apr 18', hours: 24, target: 24 },
  { date: 'Apr 17', hours: 18, target: 24 },
  { date: 'Apr 16', hours: 22, target: 24 },
]

const STATS = [
  { label: 'Longest fast', value: '27h 14m', sub: 'April 3' },
  { label: 'Average (30d)', value: '21.4h', sub: 'Out of 24h target' },
  { label: 'Compliance', value: '87%', sub: '13 of 15 days' },
]

export default function FastingSection() {
  const [secs, setSecs] = useState(22 * 3600 + 14 * 60 + 33)
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const f2 = (n: number) => String(n).padStart(2, '0')
  const target = 24
  const pct = Math.min(h / target, 1)
  const circ = 2 * Math.PI * 68

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Active timer */}
        <div className="glass" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '28px' }}>Active fast</div>
          <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '24px' }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="68" stroke="var(--surface3)" strokeWidth="6" fill="none" />
              <circle cx="80" cy="80" r="68" stroke="var(--purple)" strokeWidth="6" fill="none"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease', filter: 'drop-shadow(0 0 10px var(--purple-g))' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>{h}:{f2(m)}</div>
              <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>{f2(s)}s · {Math.round(pct * 100)}%</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '4px' }}>{target - h}h {f2(60 - m)}m remaining</div>
          <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '24px' }}>Target: {target}h · Started 8:00 PM</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--t2)', borderRadius: '6px', fontFamily: 'var(--font)', fontSize: '12px', cursor: 'pointer' }}>+1h</button>
            <button style={{ padding: '9px 22px', background: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Break Fast</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STATS.map((stat, i) => (
            <div key={i} className="glass" style={{ padding: '20px 24px', flex: 1 }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--t2)' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="glass" style={{ padding: '24px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '16px' }}>Recent fasts</div>
        {HISTORY.map((f, i) => {
          const p = f.hours / f.target
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0', borderBottom: i < HISTORY.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: '70px', fontSize: '11px', color: 'var(--t2)' }}>{f.date}</div>
              <div style={{ flex: 1, height: '6px', background: 'var(--surface3)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p * 100}%`, background: p >= 1 ? 'var(--purple)' : 'var(--teal)', borderRadius: '3px' }} />
              </div>
              <div style={{ width: '52px', textAlign: 'right', fontSize: '16px', fontWeight: 800, color: p >= 1 ? 'var(--purple)' : 'var(--t2)' }}>{f.hours}h</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
