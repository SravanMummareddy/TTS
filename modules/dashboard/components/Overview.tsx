'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchRoutines, fetchTodayLogs } from '@/modules/routines/api'
import type { Routine, RoutineLog, RoutineVariant } from '@/modules/routines/types'
import { getVariantForDay } from '@/modules/routines/utils'

// ── SPARKLINE ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color, w = 80, h = 32 }: { data: number[]; color: string; w?: number; h?: number }) {
  const max = Math.max(...data)
  const min = Math.min(...data) - 0.5
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ')
  const area = `0,${h} ${pts} ${w},${h}`
  const id = `sg${color.replace(/[^a-z0-9]/gi, '')}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── WEEKLY CHART ──────────────────────────────────────────────────────────────
function WeeklyChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const series = [
    { label: 'Tasks',    color: '#7c5cfc', data: [5, 7, 4, 8, 6, 3, 4] },
    { label: 'Calories', color: '#f97316', data: [1800, 2100, 1650, 2200, 1900, 2300, 1700] },
    { label: 'Fast hrs', color: '#22c55e', data: [22, 24, 20, 24, 22, 18, 22] },
  ]
  const W = 400, H = 120

  const renderLine = (s: typeof series[0], idx: number) => {
    const max = Math.max(...s.data), min = Math.min(...s.data) - 0.5
    const pts = s.data.map((v, i) => {
      const x = 40 + (i / (s.data.length - 1)) * (W - 40)
      const y = 8 + (1 - (v - min) / (max - min)) * (H - 16)
      return `${x},${y}`
    })
    return (
      <g key={idx}>
        <polyline points={pts.join(' ')} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
        {pts.map((p, i) => {
          const [px, py] = p.split(',')
          return <circle key={i} cx={px} cy={py} r="3" fill={s.color} opacity="0.85" />
        })}
      </g>
    )
  }

  return (
    <div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {[0, 0.33, 0.66, 1].map((t, i) => (
          <line key={i} x1={40} y1={8 + t * (H - 16)} x2={W} y2={8 + t * (H - 16)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        {days.map((d, i) => (
          <text key={i} x={40 + (i / 6) * (W - 40)} y={H} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="var(--font)">{d}</text>
        ))}
        {series.map(renderLine)}
      </svg>
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '20px', height: '3px', borderRadius: '2px', background: s.color }} />
            <span style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  unit?: string
  sub: string
  subColor?: string
  sparkData?: number[]
  sparkColor?: string
  icon: string
  progress?: number
}

function StatCard({ label, value, unit, sub, subColor, sparkData, sparkColor, icon, progress }: StatCardProps) {
  return (
    <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '6px' }}>
        <span style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t3)' }}>{unit}</span>}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: subColor || 'var(--t2)', marginBottom: sparkData ? '12px' : '0' }}>{sub}</div>
      {progress !== undefined && (
        <div style={{ height: '4px', background: 'var(--surface3)', borderRadius: '2px', overflow: 'hidden', marginBottom: sparkData ? '10px' : '0' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: sparkColor || 'var(--purple)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
        </div>
      )}
      {sparkData && <Sparkline data={sparkData} color={sparkColor || 'var(--purple)'} w={140} h={36} />}
    </div>
  )
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
export default function OverviewSection() {
  const [secs, setSecs] = useState(22 * 3600 + 14 * 60 + 33)
  const router = useRouter()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [todayLogs, setTodayLogs] = useState<RoutineLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    Promise.all([fetchRoutines(), fetchTodayLogs()])
      .then(([r, l]) => {
        setRoutines(r)
        setTodayLogs(l.filter((entry): entry is { routine: Routine; variant: RoutineVariant; log: RoutineLog | null } => entry !== null).map(entry => entry.log).filter(Boolean) as RoutineLog[])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fh = Math.floor(secs / 3600)
  const fm = Math.floor((secs % 3600) / 60)
  const fs = secs % 60
  const f2 = (n: number) => String(n).padStart(2, '0')
  const target = 24
  const pct = Math.min(fh / target, 1)
  const circ = 2 * Math.PI * 52

  const plans = [
    { done: true,  text: 'Morning Skincare Routine', tag: 'Routine', sub: '5/7 tasks' },
    { done: true,  text: 'Meditation',               tag: 'Habit',   sub: '15 min' },
    { done: false, text: 'Work on Project',           tag: 'Task',    sub: 'High priority' },
    { done: false, text: 'Evening Walk',              tag: 'Habit',   sub: '30 min' },
  ]

  const photos = [
    { label: 'Apr 21', grad: 'linear-gradient(135deg,oklch(0.28 0.08 280),oklch(0.18 0.05 255))' },
    { label: 'Apr 20', grad: 'linear-gradient(135deg,oklch(0.26 0.07 165),oklch(0.18 0.05 185))' },
    { label: 'Apr 18', grad: 'linear-gradient(135deg,oklch(0.30 0.09 55),oklch(0.20 0.06 70))' },
    { label: 'Apr 15', grad: 'linear-gradient(135deg,oklch(0.25 0.08 18),oklch(0.18 0.05 30))' },
  ]

  const journalEntry = {
    title: 'Grateful for another beautiful morning.',
    date: 'May 12, 2025',
    preview: 'Every morning is a new opportunity to become a better version of myself. Grateful for the little things, the big lessons, and the journey that shapes me every day.',
  }

  return (
    <div style={{ maxWidth: '1280px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--t1)', lineHeight: 1 }}>
          Good morning, Jamie 👋
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 500, marginTop: '5px' }}>
          Here is your overview for today · Tuesday, April 22
        </p>
      </div>

      {/* Stat cards row */}
      <div className="stat-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '16px' }}>
        <StatCard label="Fasting" value={`${fh}:${f2(fm)}`} unit="h" sub={`In Progress · ${target}h goal`} subColor="var(--purple)"
          sparkColor="var(--purple)" sparkData={[18, 22, 24, 20, 24, 22, 24, 22]} progress={Math.round(pct * 100)} icon="⏱" />
        <StatCard label="Steps" value="8,979" unit="steps" sub="Goal: 10,000" subColor="var(--teal)"
          sparkColor="var(--teal)" sparkData={[7200, 9100, 8400, 10200, 7800, 9500, 8979]} icon="🚶" />
        <StatCard label="Calories" value="1,420" unit="kcal" sub="Goal: 2,000 kcal" subColor="var(--orange)"
          sparkColor="var(--orange)" sparkData={[1800, 2100, 1650, 1950, 1720, 2050, 1420]} progress={71} icon="🔥" />
        <StatCard label="Weight" value="178.4" unit="lbs" sub="↓ 2.1 lbs this week" subColor="var(--green)"
          sparkColor="var(--green)" sparkData={[182, 181, 180.5, 179.8, 179.2, 178.8, 178.4]} icon="⚖" />
      </div>

      {/* Main grid */}
      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '14px', marginBottom: '14px' }}>

        {/* Today's plan */}
        <div className="dashboard-left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Routines */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Routines</div>
              <button onClick={() => router.push('/routines')} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>View all</button>
            </div>
            {routines.filter(r => r.active).slice(0, 2).map((r, i) => {
              const dow = new Date().getDay()
              const variant = getVariantForDay(r, dow)
              if (!variant) return null
              const log = todayLogs.find(l => l.routineId === r.id)
              const required = variant.items.filter(item => !item.optional)
              const doneCount = log?.itemLogs.filter(il => il.done && required.some(item => item.id === il.itemId)).length ?? 0
              const pct = Math.round((doneCount / required.length) * 100)
              return (
                <div key={i} 
                  onClick={() => router.push('/routines')}
                  style={{ padding: '10px', background: 'var(--surface2)', borderRadius: 'var(--rs)', marginBottom: i < 1 ? '10px' : 0, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{r.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)', flex: 1 }}>{r.name}</span>
                    <span style={{ fontSize: '11px', color: pct === 100 ? 'var(--green)' : 'var(--t3)', fontWeight: 600 }}>{pct === 100 ? '✓' : `${doneCount}/${required.length}`}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--surface3)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tasks */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Tasks</div>
              <button onClick={() => router.push('/tasks')} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>View all</button>
            </div>
            {plans.filter(p => p.tag === 'Task').slice(0, 3).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${p.done ? 'var(--green)' : 'var(--border2)'}`, background: p.done ? 'var(--green)' : 'transparent', flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: p.done ? 'var(--t3)' : 'var(--t1)', textDecoration: p.done ? 'line-through' : 'none' }}>{p.text}</div>
                  <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Habits */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Habits</div>
            </div>
            {plans.filter(p => p.tag === 'Habit').map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', padding: '8px 0', borderBottom: i < plans.filter(h => h.tag === 'Habit').length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${p.done ? 'var(--green)' : 'var(--border2)'}`, background: p.done ? 'var(--green)' : 'transparent', flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: p.done ? 'var(--t3)' : 'var(--t1)', textDecoration: p.done ? 'line-through' : 'none' }}>{p.text}</div>
                  <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Fasting + Journal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Fasting timer */}
          <div className="card fasting-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div className="fasting-timer" style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" stroke="var(--surface3)" strokeWidth="7" fill="none" />
                <circle cx="60" cy="60" r="52" stroke="var(--purple)" strokeWidth="7" fill="none"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 8px var(--purple-g))', transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', lineHeight: 1 }}>{fh}:{f2(fm)}</div>
                <div style={{ fontSize: '10px', color: 'var(--t3)', fontWeight: 500, marginTop: '2px' }}>{f2(fs)}s</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>Fasting Timer</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t1)', marginBottom: '4px' }}>You&apos;re fasting</div>
              <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '4px' }}>Elapsed Time</div>
              <div style={{ fontSize: '13px', color: 'var(--t3)', marginBottom: '16px' }}>16:8 Intermittent · Started 8:00 PM</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => router.push('/fasting')} style={{ padding: '8px 18px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>End Fast</button>
                <button style={{ padding: '8px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--t2)', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>+1h</button>
              </div>
            </div>
          </div>

          {/* Recent journal */}
          <div className="card" style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onClick={() => router.push('/journal')}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,92,252,0.4)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Recent Journal Entry</div>
              <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{journalEntry.date}</div>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px', lineHeight: 1.3 }}>{journalEntry.title}</div>
            <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.65, fontWeight: 400, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{journalEntry.preview}</p>
            <div style={{ marginTop: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--purple)' }}>Read full entry →</div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="dashboard-right-panel card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Weekly Activity</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', background: 'var(--surface2)', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }}>Apr 14–22</div>
          </div>
          <WeeklyChart />
        </div>
      </div>

      {/* Today's Routines */}
      <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Today&apos;s Routines</div>
          <button onClick={() => router.push('/routines')} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>View all</button>
        </div>
        <div className="routines-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
          {(() => {
            const dow = new Date().getDay()
            return (loading ? [] : routines)
              .filter(r => r.active)
              .map(r => {
                const variant = getVariantForDay(r, dow)
                if (!variant) return null
                const log = todayLogs.find(l => l.routineId === r.id)
                const required = variant.items.filter(i => !i.optional)
                const doneCount = log?.itemLogs.filter(il => il.done && required.some(i => i.id === il.itemId)).length ?? 0
                return { name: r.name, color: r.color, icon: r.icon, done: doneCount, total: required.length }
              })
              .filter((r): r is { name: string; color: string; icon: string; done: number; total: number } => r !== null)
          })().map((r, i) => {
            const pct = Math.round((r.done / r.total) * 100)
            return (
              <div key={i} onClick={() => router.push('/routines')}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'var(--surface2)', borderRadius: 'var(--rs)', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${r.color}22`, border: `1px solid ${r.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                  <div style={{ height: '3px', background: 'var(--surface3)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: pct === 100 ? r.color : 'var(--t3)', fontWeight: 600, flexShrink: 0 }}>
                  {pct === 100 ? '✓' : `${r.done}/${r.total}`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Photos */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t1)' }}>Recent Photos</div>
          <button onClick={() => router.push('/gallery')} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>View all</button>
        </div>
        <div className="photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {photos.map((p, i) => (
            <div key={i} style={{ borderRadius: '10px', aspectRatio: '1/1', background: p.grad, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 16px,rgba(255,255,255,0.02) 16px,rgba(255,255,255,0.02) 17px)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', background: 'linear-gradient(to top,rgba(0,0,0,0.7),transparent)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{p.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
