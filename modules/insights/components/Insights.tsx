'use client'

const WEIGHTS = [178.4, 179.1, 178.8, 179.5, 180.2, 180.0, 179.3, 178.9, 179.6, 178.4, 177.8, 178.1, 177.5, 178.4]

const STAT_CARDS = [
  { label: 'Journal entries', value: '47',    sub: 'this year',     color: 'var(--purple)' },
  { label: 'Avg fast length', value: '21.4h', sub: 'last 30 days',  color: 'var(--teal)' },
  { label: 'Tasks completed', value: '312',   sub: 'this month',    color: 'oklch(0.68 0.14 165)' },
  { label: 'Streak record',   value: '18d',   sub: 'routines',      color: '#ef4444' },
]

export default function InsightsSection() {
  const maxW = Math.max(...WEIGHTS), minW = Math.min(...WEIGHTS) - 1
  const W = 400, H = 80
  const toY = (w: number) => H - ((w - minW) / (maxW - minW)) * (H - 16) - 8
  const pts = WEIGHTS.map((w, i) => `${(i / (WEIGHTS.length - 1)) * W},${toY(w)}`).join(' ')

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Weight trend */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '4px' }}>Weight trend</div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--t1)', marginBottom: '4px' }}>
            178.4<span style={{ fontSize: '14px', color: 'var(--t3)', marginLeft: '4px', fontWeight: 400 }}>lbs</span>
          </div>
          <div style={{ fontSize: '12px', color: 'oklch(0.68 0.14 165)', marginBottom: '20px' }}>↓ 2.1 lbs this week</div>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--purple)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--purple)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#wg)" />
            <polyline points={pts} fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px var(--purple-g))' }} />
          </svg>
        </div>

        {/* Fasting compliance */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '4px' }}>Fasting compliance</div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--teal)', marginBottom: '16px' }}>87%</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Array.from({ length: 30 }, (_, i) => i < 26).map((done, i) => (
              <div key={i} style={{ width: '20px', height: '20px', borderRadius: '3px', background: done ? 'var(--teal)' : 'var(--surface3)', opacity: done ? 0.9 : 0.5 }} />
            ))}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '10px' }}>26 of 30 days this month</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} className="glass" style={{ padding: '20px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--t2)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
