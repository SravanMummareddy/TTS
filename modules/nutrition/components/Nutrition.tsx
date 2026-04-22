'use client'

const MACROS = [
  { label: 'Protein', cur: 142, target: 160, color: 'var(--purple)' },
  { label: 'Carbs',   cur: 180, target: 200, color: 'var(--teal)' },
  { label: 'Fat',     cur: 68,  target: 80,  color: '#ef4444' },
]

const MEALS = [
  { name: 'Breakfast', cals: 520, items: ['Greek yogurt 200g', 'Blueberries 80g', 'Oats 40g', 'Honey 15g'] },
  { name: 'Lunch',     cals: 680, items: ['Chicken breast 180g', 'Brown rice 120g', 'Broccoli 150g', 'Olive oil 10ml'] },
  { name: 'Snack',     cals: 220, items: ['Almonds 30g', 'Banana 1 medium'] },
]

export default function NutritionSection() {
  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Calorie + Macros */}
      <div className="glass" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '16px' }}>Today — 1,420 / 2,200 kcal</div>
        <div style={{ height: '8px', background: 'var(--surface3)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ height: '100%', width: `${(1420 / 2200) * 100}%`, background: 'linear-gradient(to right, var(--purple), var(--teal))', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {MACROS.map((m, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--t2)' }}>{m.label}</span>
                <span style={{ fontSize: '12px', color: m.color }}>{m.cur}g / {m.target}g</span>
              </div>
              <div style={{ height: '5px', background: 'var(--surface3)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(m.cur / m.target) * 100}%`, background: m.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MEALS.map((meal, i) => (
          <div key={i} className="glass" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--t1)' }}>{meal.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--purple)' }}>{meal.cals} kcal</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {meal.items.map((item, j) => (
                <span key={j} style={{ fontSize: '11px', color: 'var(--t2)', background: 'var(--surface2)', padding: '4px 10px', borderRadius: '20px' }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
