'use client'

import { useState } from 'react'

const FILTERS = ['All', 'Body', 'Food', 'Journal', 'Progress', 'Routine']

const GRADIENTS = [
  ['oklch(0.30 0.06 84)', 'oklch(0.18 0.03 84)'],
  ['oklch(0.28 0.06 285)', 'oklch(0.16 0.04 285)'],
  ['oklch(0.26 0.05 165)', 'oklch(0.16 0.03 165)'],
  ['oklch(0.30 0.05 18)', 'oklch(0.18 0.03 18)'],
  ['oklch(0.28 0.04 220)', 'oklch(0.16 0.03 220)'],
  ['oklch(0.26 0.06 84)', 'oklch(0.16 0.04 84)'],
]

const ITEMS = [
  { id: 1, tag: 'Body',     label: 'Morning — Apr 21', aspect: '1/1' },
  { id: 2, tag: 'Food',     label: 'Breakfast plate',  aspect: '4/3' },
  { id: 3, tag: 'Progress', label: '12-week check',    aspect: '3/4' },
  { id: 4, tag: 'Routine',  label: 'Morning stack',    aspect: '1/1' },
  { id: 5, tag: 'Journal',  label: 'Desk setup',       aspect: '16/9' },
  { id: 6, tag: 'Body',     label: 'Post-run',         aspect: '4/3' },
  { id: 7, tag: 'Food',     label: 'Dinner prep',      aspect: '1/1' },
  { id: 8, tag: 'Progress', label: '8-week check',     aspect: '3/4' },
]

type Item = typeof ITEMS[0]

export default function GallerySection() {
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState<Item | null>(null)

  const shown = filter === 'All' ? ITEMS : ITEMS.filter(i => i.tag === filter)

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', background: filter === f ? 'var(--purple)' : 'transparent', border: `1px solid ${filter === f ? 'var(--purple)' : 'var(--border2)'}`, color: filter === f ? 'white' : 'var(--t2)', borderRadius: '20px', fontFamily: 'var(--font)', fontSize: '11px', fontWeight: filter === f ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>{f}</button>
        ))}
      </div>

      {/* Masonry grid */}
      <div style={{ columns: '3 240px', gap: '12px' }}>
        {shown.map((item, i) => {
          const [c1, c2] = GRADIENTS[i % GRADIENTS.length]
          return (
            <div key={item.id} onClick={() => setModal(item)}
              style={{ breakInside: 'avoid', marginBottom: '12px', borderRadius: 'var(--r)', overflow: 'hidden', background: `linear-gradient(135deg, ${c1}, ${c2})`, aspectRatio: item.aspect, cursor: 'pointer', position: 'relative', border: '1px solid var(--border2)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 18px,rgba(0,0,0,0.08) 18px,rgba(0,0,0,0.08) 19px)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(to top, rgba(5,5,15,0.8), transparent)' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--purple)', textTransform: 'uppercase', marginBottom: '2px' }}>{item.tag}</div>
                <div style={{ fontSize: '12px', color: 'var(--t1)', fontWeight: 300 }}>{item.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,15,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
          <div onClick={e => e.stopPropagation()} className="glass" style={{ width: '540px', maxWidth: '90vw', padding: '0', overflow: 'hidden', borderRadius: 'var(--r)' }}>
            <div style={{ aspectRatio: '4/3', background: `linear-gradient(135deg, ${GRADIENTS[modal.id % GRADIENTS.length][0]}, ${GRADIENTS[modal.id % GRADIENTS.length][1]})`, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 18px,rgba(0,0,0,0.08) 18px,rgba(0,0,0,0.08) 19px)' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <button onClick={() => setModal(null)} style={{ background: 'rgba(5,5,15,0.7)', border: 'none', color: 'var(--t1)', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--purple)', textTransform: 'uppercase', marginBottom: '6px' }}>{modal.tag}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--t1)' }}>{modal.label}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
