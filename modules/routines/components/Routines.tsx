'use client'

type RoutineItem = string | { done: boolean; t: string }

const ROUTINES: { name: string; items: RoutineItem[]; streak: number }[] = [
  { name: 'Morning',  items: ['5:30 Wake', { done: true, t: 'Hydrate 500ml' }, { done: true, t: 'Cold shower' }, { done: true, t: 'Meditate 15m' }, { done: false, t: 'Journal' }], streak: 12 },
  { name: 'Movement', items: [{ done: true, t: 'Mobility warmup' }, { done: false, t: 'Workout / run' }, { done: false, t: 'Stretch cooldown' }], streak: 8 },
  { name: 'Evening',  items: [{ done: false, t: 'No screens 9pm' }, { done: false, t: 'Read 30m' }, { done: false, t: 'Reflect + tomorrow plan' }], streak: 5 },
]

const DOTS = Array.from({ length: 14 }, (_, i) => ({ day: i + 1, done: i < 12 }))

export default function RoutinesSection() {
  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Streak heatmap */}
      <div className="glass" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '16px' }}>Last 14 days</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {DOTS.map(d => (
            <div key={d.day} title={`Day ${d.day}`}
              style={{ width: '28px', height: '28px', borderRadius: '6px', background: d.done ? 'var(--purple)' : 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: d.done ? 'white' : 'var(--t3)' }}>{d.day}</div>
          ))}
          <div style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '32px', fontWeight: 800, color: 'var(--purple)' }}>
            12<span style={{ fontSize: '14px', color: 'var(--t3)', marginLeft: '4px', fontWeight: 300 }}>day streak</span>
          </div>
        </div>
      </div>

      {/* Routine blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
        {ROUTINES.map((r, i) => (
          <div key={i} className="glass" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--t1)' }}>{r.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--purple)' }}>{r.streak}d</div>
            </div>
            {r.items.map((item, j) => {
              const isObj = typeof item === 'object'
              const done = isObj ? (item as { done: boolean; t: string }).done : false
              const text = isObj ? (item as { done: boolean; t: string }).t : item as string
              return (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: j < r.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  {isObj && (
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: `1.5px solid ${done ? 'var(--purple)' : 'var(--surface3)'}`, background: done ? 'var(--purple)' : 'transparent', flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: '12px', color: done ? 'var(--t3)' : 'var(--t2)', textDecoration: done ? 'line-through' : 'none', fontWeight: 300 }}>{text}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
