'use client'

import { useState, useEffect } from 'react'
import { fetchActiveFast, fetchFastingHistory, startFast, endFast } from '../api'
import type { FastingEntry, FastingStats } from '../types'

function formatDuration(ms: number): { h: number; m: number; s: number } {
  const totalSeconds = Math.floor(ms / 1000)
  return {
    h: Math.floor(totalSeconds / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  }
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function FastingSection() {
  const [activeFast, setActiveFast] = useState<FastingEntry | null>(null)
  const [history, setHistory] = useState<FastingEntry[]>([])
  const [stats, setStats] = useState<FastingStats | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [targetHours, setTargetHours] = useState(16)

  useEffect(() => {
    async function load() {
      try {
        const [fast, entries] = await Promise.all([fetchActiveFast(), fetchFastingHistory()])
        setActiveFast(fast)
        setHistory(entries.filter(e => e.endTime))
        if (fast) {
          setElapsed(Date.now() - new Date(fast.startTime).getTime())
        }
        setStats(computeStats(entries))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeFast) return
    const t = setInterval(() => setElapsed(Date.now() - new Date(activeFast.startTime).getTime()), 1000)
    return () => clearInterval(t)
  }, [activeFast])

  function computeStats(entries: FastingEntry[]): FastingStats {
    const completed = entries.filter(e => e.endTime)
    const withDurations = completed.map(e => ({
      ms: new Date(e.endTime!).getTime() - new Date(e.startTime).getTime(),
      date: e.startTime.split('T')[0],
    }))
    const longest = withDurations.reduce((best, d) => d.ms > best.ms ? d : best, { ms: 0, date: '' })
    const avgMs = withDurations.length > 0 ? withDurations.reduce((s, d) => s + d.ms, 0) / withDurations.length : 0
    return {
      longestFast: {
        hours: Math.floor(longest.ms / 3600000),
        minutes: Math.floor((longest.ms % 3600000) / 60000),
        date: longest.date,
      },
      averageHours: Math.round((avgMs / 3600000) * 10) / 10,
      complianceRate: entries.length > 0 ? Math.round((completed.length / entries.length) * 100) : 0,
      totalFasts: entries.length,
      completedFasts: completed.length,
    }
  }

  const { h, m, s } = formatDuration(elapsed)
  const target = activeFast?.target ?? targetHours
  const pct = Math.min(elapsed / (target * 3600000), 1)
  const circ = 2 * Math.PI * 68
  const remaining = Math.max(0, target * 3600 - elapsed / 1000)
  const remH = Math.floor(remaining / 3600)
  const remM = Math.floor((remaining % 3600) / 60)

  const handleStart = async () => {
    try {
      const entry = await startFast(targetHours)
      setActiveFast(entry)
      setElapsed(0)
    } catch (e) {
      console.error(e)
    }
  }

  const handleEnd = async () => {
    if (!activeFast) return
    try {
      const completed = elapsed >= target * 3600000
      const entry = await endFast(activeFast.id, completed)
      setHistory(prev => [entry, ...prev])
      setActiveFast(null)
      setElapsed(0)
      setStats(computeStats([...history, entry]))
    } catch (e) {
      console.error(e)
    }
  }

  const handleExtend = () => {
    if (!activeFast) return
    setTargetHours(t => t + 1)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--t3)' }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        <div style={{ padding: '40px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '28px' }}>
            {activeFast ? 'Active fast' : 'Start a fast'}
          </div>

          {activeFast ? (
            <>
              <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '24px' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="68" stroke="var(--surface3)" strokeWidth="6" fill="none" />
                  <circle cx="80" cy="80" r="68" stroke="var(--purple)" strokeWidth="6" fill="none"
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease', filter: 'drop-shadow(0 0 10px var(--purple-g))' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>{h}:{pad2(m)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>{pad2(s)}s · {Math.round(pct * 100)}%</div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '4px' }}>{remH}h {pad2(remM)}m remaining</div>
              <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '24px' }}>Target: {target}h · Started {new Date(activeFast.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleExtend} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--t2)', borderRadius: '6px', fontFamily: 'var(--font)', fontSize: '12px', cursor: 'pointer' }}>+1h</button>
                <button onClick={handleEnd} style={{ padding: '9px 22px', background: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Break Fast</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '24px' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="68" stroke="var(--surface3)" strokeWidth="6" fill="none" />
                  <circle cx="80" cy="80" r="68" stroke="var(--purple)" strokeWidth="6" fill="none"
                    strokeDasharray={circ} strokeDashoffset={circ} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>0:00</div>
                  <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>Not started</div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '12px' }}>Select your target</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {[12, 16, 18, 20, 24].map(h => (
                  <button key={h} onClick={() => setTargetHours(h)} style={{
                    padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: '12px',
                    background: targetHours === h ? 'var(--purple)' : 'var(--surface2)',
                    border: `1px solid ${targetHours === h ? 'var(--purple)' : 'var(--border)'}`,
                    color: targetHours === h ? 'white' : 'var(--t2)',
                    transition: 'all 0.15s',
                  }}>{h}h</button>
                ))}
              </div>
              <button onClick={handleStart} style={{ padding: '10px 28px', background: 'var(--purple)', border: 'none', color: 'white', borderRadius: '6px', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Start Fasting</button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stats ? (
            <>
              <div style={{ padding: '20px 24px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', flex: 1 }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>Longest fast</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1, marginBottom: '4px' }}>{stats.longestFast.hours}h {stats.longestFast.minutes}m</div>
                <div style={{ fontSize: '11px', color: 'var(--t2)' }}>{stats.longestFast.date || 'No data yet'}</div>
              </div>
              <div style={{ padding: '20px 24px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', flex: 1 }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>Average (30d)</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1, marginBottom: '4px' }}>{stats.averageHours}h</div>
                <div style={{ fontSize: '11px', color: 'var(--t2)' }}>Out of {targetHours}h target</div>
              </div>
              <div style={{ padding: '20px 24px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', flex: 1 }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>Compliance</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1, marginBottom: '4px' }}>{stats.complianceRate}%</div>
                <div style={{ fontSize: '11px', color: 'var(--t2)' }}>{stats.completedFasts} of {stats.totalFasts} fasts</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '20px 24px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', flex: 1 }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>Longest fast</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1, marginBottom: '4px' }}>—</div>
              </div>
              <div style={{ padding: '20px 24px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', flex: 1 }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>Average (30d)</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1, marginBottom: '4px' }}>—</div>
              </div>
              <div style={{ padding: '20px 24px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', flex: 1 }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>Compliance</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple)', lineHeight: 1, marginBottom: '4px' }}>—</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: '24px', background: 'var(--surface1)', border: '1px solid var(--border)', borderRadius: 'var(--rs)' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '16px' }}>Recent fasts</div>
        {history.length === 0 ? (
          <div style={{ color: 'var(--t3)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No completed fasts yet</div>
        ) : (
          history.map((f, i) => {
            const ms = new Date(f.endTime!).getTime() - new Date(f.startTime).getTime()
            const hours = ms / 3600000
            const p = hours / f.target
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '70px', fontSize: '11px', color: 'var(--t2)' }}>{formatDate(f.startTime)}</div>
                <div style={{ flex: 1, height: '6px', background: 'var(--surface3)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(p * 100, 100)}%`, background: p >= 1 ? 'var(--purple)' : 'var(--teal)', borderRadius: '3px' }} />
                </div>
                <div style={{ width: '52px', textAlign: 'right', fontSize: '16px', fontWeight: 800, color: p >= 1 ? 'var(--purple)' : 'var(--t2)' }}>{hours.toFixed(1)}h</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}