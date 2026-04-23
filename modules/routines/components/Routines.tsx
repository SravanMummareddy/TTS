'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Routine, RoutineVariant, RoutineItem, RoutineLog,
  CATEGORIES, ROUTINE_COLORS, TIME_SLOTS, SCHEDULE_DAY_LABELS,
  TimeSlot, ScheduleDay,
} from '../types'
import {
  getVariantForDay, isScheduledOnDay, calcStreak,
  scheduleLabel, timeEmoji, todayStr, uid,
} from '../utils'
import { SEED_ROUTINES, SEED_LOGS, SEED_TODAY_STATE } from '../data'

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'today' | 'library' | 'calendar'

type DraftItem = {
  id: string
  text: string
  optional: boolean
  order: number
  notes: string | null
}

type DraftVariant = {
  id: string
  days: ScheduleDay[]
  label: string | null
  items: DraftItem[]
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProgressRing({
  pct,
  size = 40,
  stroke = 3,
  color = 'var(--purple)',
}: {
  pct: number
  size?: number
  stroke?: number
  color?: string
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface3)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
      <text
        x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill="var(--t1)" style={{ fontSize: size * 0.24, fontWeight: 600, fontFamily: 'var(--font)' }}
      >
        {pct}
      </text>
    </svg>
  )
}

function ItemCheckRow({
  item,
  done,
  onToggle,
}: {
  item: RoutineItem
  done: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 0', cursor: 'pointer',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
        border: done ? 'none' : '1.5px solid var(--border2)',
        background: done ? 'var(--purple)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {done && <span style={{ color: '#fff', fontSize: '11px', lineHeight: 1 }}>✓</span>}
      </div>
      <span style={{
        fontSize: '14px', color: done ? 'var(--t3)' : 'var(--t1)',
        textDecoration: done ? 'line-through' : 'none',
        flex: 1, transition: 'color 0.15s',
      }}>
        {item.text}
      </span>
      {item.optional && (
        <span style={{
          fontSize: '10px', color: 'var(--t3)', background: 'var(--surface2)',
          padding: '2px 6px', borderRadius: '8px', flexShrink: 0,
        }}>
          optional
        </span>
      )}
    </div>
  )
}

function RoutineTodayCard({
  routine,
  variant,
  streak,
  expanded,
  onExpand,
  itemState,
  onToggleItem,
  onSkip,
  skipped,
}: {
  routine: Routine
  variant: RoutineVariant
  streak: number
  expanded: boolean
  onExpand: () => void
  itemState: Record<string, boolean>
  onToggleItem: (id: string) => void
  onSkip: () => void
  skipped: boolean
}) {
  const required = variant.items.filter(i => !i.optional)
  const doneCount = required.filter(i => itemState[i.id]).length
  const pct = required.length === 0 ? 0 : Math.round((doneCount / required.length) * 100)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        overflow: 'hidden',
        opacity: skipped ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div
        onClick={skipped ? undefined : onExpand}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px',
          cursor: skipped ? 'default' : 'pointer',
          background: hovered && !skipped ? 'var(--surface2)' : 'transparent',
          transition: 'background 0.15s',
        }}
      >
        <div style={{
          width: '4px', alignSelf: 'stretch', borderRadius: '2px',
          background: routine.color, flexShrink: 0,
        }} />
        <span style={{ fontSize: '20px', flexShrink: 0 }}>{routine.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', lineHeight: 1.3 }}>
            {routine.name}
          </div>
          {variant.label && routine.variants.length > 1 && (
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{variant.label}</div>
          )}
          {!skipped && (
            <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>
              {doneCount}/{required.length} required
              {variant.items.some(i => i.optional) && ` · ${variant.items.filter(i => i.optional).length} optional`}
            </div>
          )}
        </div>
        {streak > 0 && !skipped && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--t2)', flexShrink: 0 }}>
            <span>🔥</span><span style={{ fontWeight: 600 }}>{streak}</span>
          </div>
        )}
        {!skipped && <ProgressRing pct={pct} size={44} stroke={4} color={routine.color} />}
        {skipped ? (
          <span style={{ fontSize: '12px', color: 'var(--t3)' }}>Skipped</span>
        ) : (
          hovered && (
            <button
              onClick={e => { e.stopPropagation(); onSkip() }}
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: 'var(--rs)', padding: '4px 8px',
                fontSize: '11px', color: 'var(--t3)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              Skip
            </button>
          )
        )}
        {!skipped && (
          <span style={{
            color: 'var(--t3)', fontSize: '12px', flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}>▾</span>
        )}
      </div>

      {expanded && !skipped && (
        <div style={{ padding: '0 16px 12px 36px', borderTop: '1px solid var(--border)' }}>
          {variant.items.map(item => (
            <ItemCheckRow
              key={item.id}
              item={item}
              done={!!itemState[item.id]}
              onToggle={() => onToggleItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function RoutineLibraryCard({
  routine,
  streak,
  onEdit,
}: {
  routine: Routine
  streak: number
  onEdit: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const totalItems = routine.variants.reduce((s, v) => s + v.items.length, 0)

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: '16px', position: 'relative', cursor: 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: 'var(--rs)', flexShrink: 0,
          background: routine.color + '22', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px',
        }}>
          {routine.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', lineHeight: 1.3 }}>{routine.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>
            {scheduleLabel(routine)}
            {routine.timeSlot && ' · ' + routine.timeSlot.charAt(0).toUpperCase() + routine.timeSlot.slice(1)}
          </div>
        </div>
        {hovered && (
          <button
            onClick={onEdit}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 'var(--rs)', padding: '4px 10px',
              fontSize: '12px', color: 'var(--t2)', cursor: 'pointer',
            }}
          >
            Edit
          </button>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--t2)' }}>
            <span>🔥</span>
            <span style={{ fontWeight: 600 }}>{streak}</span>
            <span style={{ color: 'var(--t3)' }}>day streak</span>
          </div>
        )}
        <div style={{ fontSize: '12px', color: 'var(--t3)' }}>
          {totalItems} step{totalItems !== 1 ? 's' : ''}
        </div>
        {routine.variants.length > 1 && (
          <div style={{
            fontSize: '11px', color: 'var(--purple)', background: 'var(--purple)22',
            padding: '2px 7px', borderRadius: '8px',
          }}>
            {routine.variants.length} variants
          </div>
        )}
      </div>
    </div>
  )
}

// ── Routine Builder Modal ─────────────────────────────────────────────────────

const ICONS = ['✨', '🌙', '💆', '💪', '🧘', '🚿', '🥗', '📋', '🏃', '🛁', '💊', '🧴']

function RoutineBuilderModal({
  editRoutine,
  onSave,
  onDelete,
  onClose,
}: {
  editRoutine: Routine | null
  onSave: (r: Routine) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const [name, setName]         = useState(editRoutine?.name ?? '')
  const [category, setCategory] = useState(editRoutine?.category ?? 'skincare')
  const [color, setColor]       = useState(editRoutine?.color ?? ROUTINE_COLORS[0])
  const [icon, setIcon]         = useState(editRoutine?.icon ?? '✨')
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(editRoutine?.timeSlot ?? 'morning')
  const [variants, setVariants] = useState<DraftVariant[]>(() =>
    editRoutine
      ? editRoutine.variants.map(v => ({
          id: v.id, days: [...v.days], label: v.label,
          items: v.items.map(i => ({ ...i })),
        }))
      : [{ id: uid(), days: [], label: null, items: [] }]
  )
  const [newItemTexts, setNewItemTexts] = useState<Record<number, string>>({})

  const allClaimedDays = useMemo(
    () => new Set(variants.flatMap(v => v.days)),
    [variants]
  )

  const addVariant = () =>
    setVariants(vs => [...vs, { id: uid(), days: [], label: null, items: [] }])

  const removeVariant = (idx: number) =>
    setVariants(vs => vs.filter((_, i) => i !== idx))

  const toggleVariantDay = (idx: number, day: ScheduleDay) =>
    setVariants(vs => vs.map((v, i) => {
      if (i !== idx) return v
      const days = v.days.includes(day) ? v.days.filter(d => d !== day) : [...v.days, day]
      return { ...v, days }
    }))

  const setVariantLabel = (idx: number, label: string) =>
    setVariants(vs => vs.map((v, i) => i === idx ? { ...v, label: label || null } : v))

  const addItemToVariant = (idx: number) => {
    const text = (newItemTexts[idx] ?? '').trim()
    if (!text) return
    setVariants(vs => vs.map((v, i) => {
      if (i !== idx) return v
      return { ...v, items: [...v.items, { id: uid(), text, optional: false, order: v.items.length, notes: null }] }
    }))
    setNewItemTexts(t => ({ ...t, [idx]: '' }))
  }

  const toggleItemOptional = (vi: number, ii: number) =>
    setVariants(vs => vs.map((v, i) => {
      if (i !== vi) return v
      return { ...v, items: v.items.map((it, j) => j === ii ? { ...it, optional: !it.optional } : it) }
    }))

  const removeItem = (vi: number, ii: number) =>
    setVariants(vs => vs.map((v, i) => {
      if (i !== vi) return v
      return { ...v, items: v.items.filter((_, j) => j !== ii) }
    }))

  const save = () => {
    if (!name.trim() || variants.length === 0) return
    const routineId = editRoutine?.id ?? uid()
    const routine: Routine = {
      id: routineId,
      name: name.trim(),
      category, color, icon, timeSlot,
      customTime: null,
      active: true,
      createdAt: editRoutine?.createdAt ?? todayStr(),
      variants: variants.map((v, vi) => ({
        id: v.id, routineId, days: v.days, label: v.label, order: vi,
        items: v.items.map((it, ii) => ({
          id: it.id, variantId: v.id, text: it.text,
          optional: it.optional, order: ii, notes: it.notes,
        })),
      })),
    }
    onSave(routine)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r)', width: '100%', maxWidth: '560px',
          maxHeight: '90vh', overflowY: 'auto', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--t1)' }}>
            {editRoutine ? 'Edit Routine' : 'New Routine'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Name */}
        <div>
          <label style={{ fontSize: '12px', color: 'var(--t3)', display: 'block', marginBottom: '6px' }}>NAME</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Morning Skincare"
            style={{
              width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--rs)', padding: '10px 12px', fontSize: '14px',
              color: 'var(--t1)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: '12px', color: 'var(--t3)', display: 'block', marginBottom: '8px' }}>CATEGORY</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                  border: category === c.value ? '1.5px solid var(--purple)' : '1px solid var(--border)',
                  background: category === c.value ? 'var(--purple)22' : 'var(--surface2)',
                  color: category === c.value ? 'var(--purple)' : 'var(--t2)',
                }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color + Icon */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: 'var(--t3)', display: 'block', marginBottom: '8px' }}>COLOR</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ROUTINE_COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%', background: c, cursor: 'pointer',
                    outline: color === c ? `2.5px solid ${c}` : 'none', outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--t3)', display: 'block', marginBottom: '8px' }}>ICON</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '160px' }}>
              {ICONS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  style={{
                    width: '32px', height: '32px', borderRadius: 'var(--rs)',
                    border: icon === ic ? '1.5px solid var(--purple)' : '1px solid var(--border)',
                    background: icon === ic ? 'var(--purple)22' : 'var(--surface2)',
                    fontSize: '16px', cursor: 'pointer',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time slot */}
        <div>
          <label style={{ fontSize: '12px', color: 'var(--t3)', display: 'block', marginBottom: '8px' }}>TIME OF DAY</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {TIME_SLOTS.map(ts => (
              <button
                key={String(ts.value)}
                onClick={() => setTimeSlot(ts.value)}
                style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                  border: timeSlot === ts.value ? '1.5px solid var(--purple)' : '1px solid var(--border)',
                  background: timeSlot === ts.value ? 'var(--purple)22' : 'var(--surface2)',
                  color: timeSlot === ts.value ? 'var(--purple)' : 'var(--t2)',
                }}
              >
                {ts.emoji} {ts.label}
              </button>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', color: 'var(--t3)' }}>STEP VARIANTS</label>
            <button
              onClick={addVariant}
              style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--rs)',
                padding: '4px 10px', fontSize: '12px', color: 'var(--t2)', cursor: 'pointer',
              }}
            >
              + Day-specific variant
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {variants.map((v, vi) => (
              <div
                key={v.id}
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--rs)', padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: v.days.length === 0 ? '4px' : '10px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1 }}>
                    {(SCHEDULE_DAY_LABELS as string[]).map((label, day) => {
                      const d = day as ScheduleDay
                      const isSelected = v.days.includes(d)
                      const claimedByOther = !isSelected && allClaimedDays.has(d)
                      return (
                        <button
                          key={d}
                          onClick={() => !claimedByOther && toggleVariantDay(vi, d)}
                          disabled={claimedByOther}
                          style={{
                            width: '32px', height: '28px', borderRadius: '6px',
                            fontSize: '11px', fontWeight: 600,
                            cursor: claimedByOther ? 'not-allowed' : 'pointer',
                            border: isSelected ? '1.5px solid var(--purple)' : '1px solid var(--border)',
                            background: isSelected ? 'var(--purple)' : 'transparent',
                            color: isSelected ? '#fff' : claimedByOther ? 'var(--t3)' : 'var(--t2)',
                            opacity: claimedByOther ? 0.4 : 1,
                          }}
                        >
                          {label.slice(0, 2)}
                        </button>
                      )
                    })}
                  </div>
                  {variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(vi)}
                      style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: '14px', cursor: 'pointer', padding: '0 4px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {v.days.length === 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '10px' }}>
                    No days selected — this variant runs on all days not claimed above
                  </div>
                )}

                {v.days.length > 0 && (
                  <input
                    value={v.label ?? ''}
                    onChange={e => setVariantLabel(vi, e.target.value)}
                    placeholder="Label (optional, e.g. Heavy Day)"
                    style={{
                      width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: '6px', padding: '6px 10px', fontSize: '13px',
                      color: 'var(--t2)', outline: 'none', marginBottom: '10px', boxSizing: 'border-box',
                    }}
                  />
                )}

                <div style={{ marginBottom: '8px' }}>
                  {v.items.map((item, ii) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '5px 0', borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ flex: 1, fontSize: '13px', color: 'var(--t1)' }}>{item.text}</span>
                      <button
                        onClick={() => toggleItemOptional(vi, ii)}
                        style={{
                          background: item.optional ? 'var(--surface3)' : 'none',
                          border: '1px solid var(--border)', borderRadius: '6px',
                          padding: '2px 6px', fontSize: '10px', color: 'var(--t3)', cursor: 'pointer',
                        }}
                      >
                        opt
                      </button>
                      <button
                        onClick={() => removeItem(vi, ii)}
                        style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: '14px' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    value={newItemTexts[vi] ?? ''}
                    onChange={e => setNewItemTexts(t => ({ ...t, [vi]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addItemToVariant(vi)}
                    placeholder="Add a step…"
                    style={{
                      flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: '6px', padding: '6px 10px', fontSize: '13px',
                      color: 'var(--t1)', outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => addItemToVariant(vi)}
                    style={{
                      background: 'var(--surface3)', border: '1px solid var(--border)',
                      borderRadius: '6px', padding: '6px 12px', fontSize: '13px',
                      color: 'var(--t2)', cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
          {editRoutine && onDelete ? (
            <button
              onClick={onDelete}
              style={{
                background: 'none', border: '1px solid #ef4444', borderRadius: 'var(--rs)',
                padding: '8px 16px', fontSize: '13px', color: '#ef4444', cursor: 'pointer',
              }}
            >
              Delete
            </button>
          ) : <div />}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--rs)',
                padding: '8px 18px', fontSize: '13px', color: 'var(--t2)', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!name.trim()}
              style={{
                background: name.trim() ? 'var(--purple)' : 'var(--surface3)',
                border: 'none', borderRadius: 'var(--rs)', padding: '8px 20px',
                fontSize: '13px', color: name.trim() ? '#fff' : 'var(--t3)',
                cursor: name.trim() ? 'pointer' : 'not-allowed', fontWeight: 600,
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Calendar View ─────────────────────────────────────────────────────────────

function CalendarView({ routines, logs }: { routines: Routine[]; logs: RoutineLog[] }) {
  const today = todayStr()
  const days: string[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today + 'T12:00')
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }

  function dayStatus(date: string): 'complete' | 'partial' | 'missed' | 'skipped' | 'future' | 'none' {
    if (date > today) return 'future'
    const dow = new Date(date + 'T12:00').getDay()
    const scheduled = routines.filter(r => r.active && isScheduledOnDay(r, dow))
    if (scheduled.length === 0) return 'none'
    const dayLogs = logs.filter(l => l.date === date && scheduled.some(r => r.id === l.routineId))
    if (dayLogs.length > 0 && dayLogs.every(l => l.skipped)) return 'skipped'
    const completed = dayLogs.filter(l => !l.skipped && l.completionPct >= 100).length
    if (completed === scheduled.length) return 'complete'
    if (completed > 0 || dayLogs.some(l => l.completionPct > 0)) return 'partial'
    if (date < today) return 'missed'
    return 'none'
  }

  const statusColor: Record<string, string> = {
    complete: 'var(--purple)',
    partial:  '#f59e0b',
    missed:   '#ef444488',
    skipped:  'var(--surface3)',
    future:   'transparent',
    none:     'transparent',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t2)', marginBottom: '14px' }}>Last 14 Days</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--t3)', fontWeight: 600 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {days.map(date => {
            const status = dayStatus(date)
            const dayNum = new Date(date + 'T12:00').getDate()
            return (
              <div
                key={date}
                title={date}
                style={{
                  aspectRatio: '1', borderRadius: '6px',
                  background: status === 'future' || status === 'none' ? 'var(--surface2)' : statusColor[status],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 500,
                  color: status === 'complete' || status === 'partial' ? '#fff' : 'var(--t3)',
                  border: date === today ? '1.5px solid var(--purple)' : '1px solid var(--border)',
                }}
              >
                {dayNum}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '14px', marginTop: '14px', flexWrap: 'wrap' }}>
          {['complete', 'partial', 'missed', 'skipped'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: statusColor[s], border: '1px solid var(--border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'capitalize' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {routines.filter(r => r.active).map(routine => {
          const streak = calcStreak(routine, logs)
          const rl = logs.filter(l => l.routineId === routine.id && !l.skipped)
          const avg = rl.length === 0 ? 0 : Math.round(rl.reduce((s, l) => s + l.completionPct, 0) / rl.length)
          return (
            <div key={routine.id} className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: 'var(--rs)',
                  background: routine.color + '22', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px',
                }}>
                  {routine.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>{routine.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{scheduleLabel(routine)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>{streak}</div><div style={{ fontSize: '11px', color: 'var(--t3)' }}>streak</div></div>
                <div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>{avg}%</div><div style={{ fontSize: '11px', color: 'var(--t3)' }}>avg</div></div>
                <div><div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)' }}>{rl.length}</div><div style={{ fontSize: '11px', color: 'var(--t3)' }}>sessions</div></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function RoutinesSection() {
  const [routines,  setRoutines]  = useState<Routine[]>(SEED_ROUTINES)
  const [logs,      setLogs]      = useState<RoutineLog[]>(SEED_LOGS)
  const [itemState, setItemState] = useState<Record<string, boolean>>(SEED_TODAY_STATE)
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [view, setView]             = useState<View>('today')
  const [showModal, setShowModal]   = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [isMobile, setIsMobile]     = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const todayDow = useMemo(() => new Date().getDay(), [])
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    []
  )

  const todayRoutines = useMemo(
    () =>
      routines
        .filter(r => r.active)
        .map(r => {
          const variant = getVariantForDay(r, todayDow)
          return variant ? { routine: r, variant } : null
        })
        .filter((x): x is { routine: Routine; variant: RoutineVariant } => x !== null),
    [routines, todayDow]
  )

  const overallCompletion = useMemo(() => {
    const req = todayRoutines
      .filter(({ routine }) => !skippedIds.has(routine.id))
      .flatMap(({ variant }) => variant.items.filter(i => !i.optional))
    const done = req.filter(i => itemState[i.id]).length
    return req.length === 0 ? 0 : Math.round((done / req.length) * 100)
  }, [todayRoutines, itemState, skippedIds])

  const routinesBySlot = useMemo(() => {
    const order: (TimeSlot | null)[] = ['morning', 'afternoon', 'night', 'custom', null]
    return order
      .map(slot => ({
        slot,
        entries: todayRoutines.filter(({ routine }) => routine.timeSlot === slot),
      }))
      .filter(g => g.entries.length > 0)
  }, [todayRoutines])

  const toggleItem = (itemId: string) =>
    setItemState(s => ({ ...s, [itemId]: !s[itemId] }))

  const skipRoutineHandler = (routineId: string) =>
    setSkippedIds(s => { const n = new Set(s); n.add(routineId); return n })

  const saveRoutine = (routine: Routine) => {
    setRoutines(rs =>
      rs.some(r => r.id === routine.id)
        ? rs.map(r => r.id === routine.id ? routine : r)
        : [...rs, routine]
    )
    const newKeys: Record<string, boolean> = {}
    routine.variants.forEach(v =>
      v.items.forEach(i => { if (!(i.id in itemState)) newKeys[i.id] = false })
    )
    if (Object.keys(newKeys).length) setItemState(s => ({ ...s, ...newKeys }))
    setShowModal(false)
    setEditingRoutine(null)
  }

  const deleteRoutineHandler = (routineId: string) => {
    setRoutines(rs => rs.filter(r => r.id !== routineId))
    setShowModal(false)
    setEditingRoutine(null)
  }

  const openEdit = (routine: Routine) => { setEditingRoutine(routine); setShowModal(true) }
  const openNew  = () => { setEditingRoutine(null); setShowModal(true) }

  const NAV = [
    { id: 'today',    label: 'Today',   emoji: '☀️' },
    { id: 'library',  label: 'Library', emoji: '📋' },
    { id: 'calendar', label: 'History', emoji: '📅' },
  ] as const

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: isMobile ? '16px' : '0' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t3)', padding: '4px 8px', marginBottom: '4px', letterSpacing: '0.08em' }}>
        ROUTINES
      </div>
      {NAV.map(n => (
        <button
          key={n.id}
          onClick={() => { setView(n.id as View); setShowMobileSidebar(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: 'var(--rs)', border: 'none',
            background: view === n.id ? 'color-mix(in srgb, var(--purple) 12%, transparent)' : 'none',
            color: view === n.id ? 'var(--purple)' : 'var(--t2)',
            cursor: 'pointer', fontSize: '14px', fontWeight: view === n.id ? 600 : 400,
            textAlign: 'left', width: '100%',
          }}
        >
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{n.emoji}</span>
          {n.label}
        </button>
      ))}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={openNew}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
            borderRadius: 'var(--rs)', border: 'none', background: 'none',
            color: 'var(--t3)', cursor: 'pointer', fontSize: '13px', width: '100%', textAlign: 'left',
          }}
        >
          ＋ New Routine
        </button>
      </div>
    </div>
  )

  const todayView = (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--t3)', marginBottom: '4px' }}>{todayLabel}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--t1)' }}>Today</h1>
          {todayRoutines.length > 0 && (
            <span style={{ fontSize: '14px', color: 'var(--t3)' }}>
              {todayRoutines.filter(({ routine }) => !skippedIds.has(routine.id)).length}/{todayRoutines.length} · {overallCompletion}%
            </span>
          )}
        </div>
        {todayRoutines.length > 0 && (
          <div style={{ height: '4px', background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px', background: 'var(--purple)',
              width: `${overallCompletion}%`, transition: 'width 0.4s ease',
            }} />
          </div>
        )}
      </div>

      {todayRoutines.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--t3)', fontSize: '14px' }}>
          No routines scheduled today.{' '}
          <button onClick={openNew} style={{ background: 'none', border: 'none', color: 'var(--purple)', cursor: 'pointer', fontSize: '14px' }}>
            Create one
          </button>
        </div>
      ) : (
        routinesBySlot.map(({ slot, entries }) => (
          <div key={String(slot)} style={{ marginBottom: '20px' }}>
            {slot && (
              <div style={{
                fontSize: '11px', fontWeight: 700, color: 'var(--t3)',
                letterSpacing: '0.08em', marginBottom: '8px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span>{timeEmoji(slot)}</span>{slot.toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {entries.map(({ routine, variant }) => (
                <RoutineTodayCard
                  key={routine.id}
                  routine={routine}
                  variant={variant}
                  streak={calcStreak(routine, logs)}
                  expanded={expandedId === routine.id}
                  onExpand={() => setExpandedId(id => id === routine.id ? null : routine.id)}
                  itemState={itemState}
                  onToggleItem={toggleItem}
                  onSkip={() => skipRoutineHandler(routine.id)}
                  skipped={skippedIds.has(routine.id)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )

  const libraryView = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--t1)' }}>Library</h1>
        <button
          onClick={openNew}
          style={{
            background: 'var(--purple)', border: 'none', borderRadius: 'var(--rs)',
            padding: '8px 16px', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: 600,
          }}
        >
          + New Routine
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
        {routines.filter(r => r.active).map(routine => (
          <RoutineLibraryCard
            key={routine.id}
            routine={routine}
            streak={calcStreak(routine, logs)}
            onEdit={() => openEdit(routine)}
          />
        ))}
        <div
          onClick={openNew}
          className="card"
          style={{
            padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', cursor: 'pointer', color: 'var(--t3)', fontSize: '14px',
            border: '1.5px dashed var(--border)',
          }}
        >
          <span style={{ fontSize: '20px' }}>＋</span> New Routine
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      {isMobile && showMobileSidebar && (
        <div
          onClick={() => setShowMobileSidebar(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
        />
      )}

      {isMobile ? (
        showMobileSidebar && (
          <div style={{
            position: 'fixed', left: 0, top: 0, bottom: 0, width: '220px',
            background: 'var(--surface)', borderRight: '1px solid var(--border)',
            zIndex: 51, paddingTop: '60px',
          }}>
            {sidebar}
          </div>
        )
      ) : (
        <div style={{
          width: '180px', flexShrink: 0, borderRight: '1px solid var(--border)',
          padding: '20px 12px', overflowY: 'auto',
        }}>
          {sidebar}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px' }}>
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => setShowMobileSidebar(s => !s)}
              style={{ background: 'none', border: 'none', color: 'var(--t1)', fontSize: '20px', cursor: 'pointer', padding: 0 }}
            >
              ☰
            </button>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--t1)' }}>
              {NAV.find(n => n.id === view)?.label}
            </span>
          </div>
        )}
        {view === 'today'    && todayView}
        {view === 'library'  && libraryView}
        {view === 'calendar' && <CalendarView routines={routines} logs={logs} />}
      </div>

      {showModal && (
        <RoutineBuilderModal
          editRoutine={editingRoutine}
          onSave={saveRoutine}
          onDelete={editingRoutine ? () => deleteRoutineHandler(editingRoutine.id) : undefined}
          onClose={() => { setShowModal(false); setEditingRoutine(null) }}
        />
      )}
    </div>
  )
}
