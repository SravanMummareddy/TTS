'use client'

const METRICS = [
  { label: 'Weight',   value: '178.4', unit: 'lbs', trend: '↓ 2.1',  positive: false },
  { label: 'Body Fat', value: '14.2',  unit: '%',   trend: '↓ 0.8%', positive: false },
  { label: 'Waist',    value: '32.0',  unit: 'in',  trend: '↓ 0.5',  positive: false },
  { label: 'Chest',    value: '41.5',  unit: 'in',  trend: '→',      positive: null },
]

const PHOTO_DATES = ['Jan 1', 'Feb 1', 'Mar 1', 'Apr 1']
const PHOTO_GRADS = [
  'oklch(0.24 0.04 84)',
  'oklch(0.22 0.05 285)',
  'oklch(0.20 0.04 165)',
  'oklch(0.22 0.05 84)',
]

export default function BodySection() {
  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        {METRICS.map((m, i) => (
          <div key={i} className="glass" style={{ padding: '22px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px' }}>{m.label}</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--t1)', lineHeight: 1, marginBottom: '4px' }}>
              {m.value}<span style={{ fontSize: '12px', color: 'var(--t3)', marginLeft: '4px', fontWeight: 400 }}>{m.unit}</span>
            </div>
            <div style={{ fontSize: '12px', color: m.positive === false ? 'oklch(0.68 0.14 165)' : m.positive === true ? '#ef4444' : 'var(--t3)' }}>{m.trend}</div>
          </div>
        ))}
      </div>

      {/* Progress photos */}
      <div className="glass" style={{ padding: '24px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '16px' }}>Progress photos</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {PHOTO_DATES.map((d, i) => (
            <div key={i} style={{ borderRadius: 'var(--rs)', aspectRatio: '3/4', background: PHOTO_GRADS[i], border: '1px solid var(--border2)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 16px,rgba(0,0,0,0.1) 16px,rgba(0,0,0,0.1) 17px)' }} />
              <div style={{ padding: '8px', fontSize: '10px', color: 'var(--t2)', position: 'relative', background: 'rgba(5,5,15,0.7)', width: '100%', textAlign: 'center' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
