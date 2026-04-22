'use client'

import { useState, useMemo, useEffect } from 'react'
import type { Task, TaskList, Priority } from '../types'
import { SEED_TASKS, SEED_LISTS } from '../data'

// ─── helpers ─────────────────────────────────────────────────────────────────

const todayStr = () => new Date().toISOString().split('T')[0]

function formatDue(dueDate: string | null, dueTime: string | null): { label: string; overdue: boolean } {
  if (!dueDate) return { label: '', overdue: false }
  const today = todayStr()
  if (dueDate < today) return { label: 'Overdue', overdue: true }
  const diff = Math.round(
    (new Date(dueDate + 'T12:00').getTime() - new Date(today + 'T12:00').getTime()) / 86400000
  )
  const label =
    diff === 0 ? (dueTime || 'Today') :
    diff === 1 ? 'Tomorrow' :
    diff < 7   ? new Date(dueDate + 'T12:00').toLocaleDateString('en-US', { weekday: 'short' }) :
                 new Date(dueDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return { label, overdue: false }
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'var(--rose-400)', medium: 'var(--purple)', low: 'var(--t3)', none: 'transparent',
}

const SMART = [
  { id: 'today',     label: 'Today',     icon: '☀' },
  { id: 'scheduled', label: 'Scheduled', icon: '◷' },
  { id: 'all',       label: 'All',       icon: '⊞' },
  { id: 'flagged',   label: 'Flagged',   icon: '★' },
]

// ─── task row ────────────────────────────────────────────────────────────────

function TaskRow({
  task, subtasks, isExpanded, onExpand, onToggle, onDelete, onUpdate, onAddSubtask, onDeleteSubtask, onToggleSubtask,
}: {
  task: Task
  subtasks: Task[]
  isExpanded: boolean
  onExpand: () => void
  onToggle: () => void
  onDelete: () => void
  onUpdate: (u: Partial<Task>) => void
  onAddSubtask: (text: string) => void
  onDeleteSubtask: (id: string) => void
  onToggleSubtask: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [subInput, setSubInput] = useState('')
  const { label: dueLabel, overdue } = formatDue(task.dueDate, task.dueTime)

  return (
    <div style={{ marginBottom: '2px' }}>
      {/* Main row */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
          borderRadius: 'var(--rs)', cursor: 'default', transition: 'background 0.15s',
          background: isExpanded ? 'var(--surface2)' : hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
        }}>
        {/* Checkbox */}
        <div onClick={onToggle} style={{
          width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          border: `1.5px solid ${task.done ? 'var(--purple)' : 'var(--surface3)'}`,
          background: task.done ? 'var(--purple)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
        }}>
          {task.done && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Text */}
        <span onClick={e => { e.stopPropagation(); onExpand() }} style={{
          flex: 1, fontSize: '14px', fontWeight: 300, cursor: 'pointer',
          color: task.done ? 'var(--t3)' : 'var(--t1)',
          textDecoration: task.done ? 'line-through' : 'none',
        }}>
          {task.text}
          {subtasks.length > 0 && (
            <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--t3)' }}>
              {subtasks.filter(s => s.done).length}/{subtasks.length}
            </span>
          )}
        </span>

        {/* Due label */}
        {dueLabel && (
          <span style={{ fontSize: '11px', flexShrink: 0, color: overdue ? 'var(--rose-400)' : 'var(--t3)' }}>
            {dueLabel}
          </span>
        )}

        {/* Flag */}
        <span onClick={e => { e.stopPropagation(); onUpdate({ flagged: !task.flagged }) }} style={{
          fontSize: '13px', cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.15s',
          color: task.flagged ? '#f59e0b' : 'var(--t3)',
          opacity: task.flagged || hovered ? 1 : 0,
        }}>★</span>

        {/* Priority dot */}
        {task.priority !== 'none' && (
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
            background: PRIORITY_COLOR[task.priority], opacity: task.done ? 0.3 : 0.8,
          }} />
        )}

        {/* Delete */}
        <button onClick={e => { e.stopPropagation(); onDelete() }} style={{
          background: 'none', border: 'none', color: 'var(--t3)', fontSize: '16px',
          cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0, transition: 'opacity 0.15s',
          opacity: hovered ? 1 : 0,
        }}>×</button>
      </div>

      {/* Inline detail */}
      {isExpanded && (
        <div onClick={e => e.stopPropagation()} style={{
          marginLeft: '44px', marginBottom: '8px', padding: '14px 16px',
          background: 'var(--surface2)', borderRadius: 'var(--rs)', border: '1px solid var(--border)',
        }}>
          {/* Notes */}
          <textarea value={task.notes} onChange={e => onUpdate({ notes: e.target.value })}
            placeholder="Add notes…" rows={2}
            style={{
              width: '100%', background: 'transparent', border: 'none', resize: 'none', outline: 'none',
              color: 'var(--t2)', fontFamily: 'var(--font)', fontSize: '13px', lineHeight: 1.6,
              marginBottom: '12px',
            }} />

          {/* Due date + time */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--t3)', width: '52px' }}>Due</span>
            <input type="date" value={task.dueDate || ''} onChange={e => onUpdate({ dueDate: e.target.value || null })}
              style={{
                background: 'var(--surface3)', border: '1px solid var(--border2)', color: 'var(--t1)',
                borderRadius: 'var(--rs)', padding: '5px 10px', fontFamily: 'var(--font)', fontSize: '12px', outline: 'none',
              }} />
            <input type="time" value={task.dueTime || ''} onChange={e => onUpdate({ dueTime: e.target.value || null })}
              style={{
                background: 'var(--surface3)', border: '1px solid var(--border2)', color: 'var(--t1)',
                borderRadius: 'var(--rs)', padding: '5px 10px', fontFamily: 'var(--font)', fontSize: '12px', outline: 'none',
              }} />
            {task.dueDate && (
              <button onClick={() => onUpdate({ dueDate: null, dueTime: null })}
                style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: '14px' }}>×</button>
            )}
          </div>

          {/* Priority + Flag */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--t3)', width: '52px' }}>Priority</span>
            {(['none', 'low', 'medium', 'high'] as Priority[]).map(p => (
              <button key={p} onClick={() => onUpdate({ priority: p })} style={{
                padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', textTransform: 'capitalize',
                fontFamily: 'var(--font)', fontSize: '11px', transition: 'all 0.15s',
                background: task.priority === p ? 'var(--surface3)' : 'transparent',
                border: `1px solid ${task.priority === p ? 'var(--border2)' : 'transparent'}`,
                color: task.priority === p ? PRIORITY_COLOR[p] === 'transparent' ? 'var(--t2)' : PRIORITY_COLOR[p] : 'var(--t3)',
              }}>{p}</button>
            ))}
            <button onClick={() => onUpdate({ flagged: !task.flagged })} style={{
              marginLeft: 'auto', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: '11px', transition: 'all 0.15s',
              background: task.flagged ? 'rgba(245,158,11,0.12)' : 'transparent',
              border: `1px solid ${task.flagged ? 'rgba(245,158,11,0.35)' : 'var(--border)'}`,
              color: task.flagged ? '#f59e0b' : 'var(--t3)',
            }}>★ Flag</button>
          </div>

          {/* Subtasks */}
          <div>
            <div style={{ fontSize: '10px', color: 'var(--t3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Subtasks
            </div>
            {subtasks.map(sub => (
              <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' }}>
                <div onClick={() => onToggleSubtask(sub.id)} style={{
                  width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                  border: `1.5px solid ${sub.done ? 'var(--purple)' : 'var(--surface3)'}`,
                  background: sub.done ? 'var(--purple)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {sub.done && (
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                      <path d="M1 2.5l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  flex: 1, fontSize: '13px', fontWeight: 300,
                  color: sub.done ? 'var(--t3)' : 'var(--t2)',
                  textDecoration: sub.done ? 'line-through' : 'none',
                }}>{sub.text}</span>
                <button onClick={() => onDeleteSubtask(sub.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: '14px', padding: 0 }}>×</button>
              </div>
            ))}
            {/* Add subtask input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px dashed var(--surface3)', flexShrink: 0 }} />
              <input value={subInput} onChange={e => setSubInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && subInput.trim()) { onAddSubtask(subInput.trim()); setSubInput('') }
                }}
                placeholder="Add subtask…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', color: 'var(--t2)',
                  fontFamily: 'var(--font)', fontSize: '13px', outline: 'none',
                }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function TasksSection() {
  const [lists, setLists] = useState<TaskList[]>(SEED_LISTS)
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [selected, setSelected] = useState('today')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState('')
  const [newListName, setNewListName] = useState('')
  const [addingList, setAddingList] = useState(false)
  const [showDone, setShowDone] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const roots = useMemo(() => tasks.filter(t => !t.parentId), [tasks])
  const subtasksOf = (id: string) => tasks.filter(t => t.parentId === id)

  const visibleTasks = useMemo(() => {
    const today = todayStr()
    switch (selected) {
      case 'today':     return roots.filter(t => t.dueDate === today)
      case 'scheduled': return roots.filter(t => !!t.dueDate)
      case 'all':       return roots
      case 'flagged':   return roots.filter(t => t.flagged)
      default:          return roots.filter(t => t.listId === selected)
    }
  }, [roots, selected])

  const pendingCount = (listId: string) => {
    const today = todayStr()
    switch (listId) {
      case 'today':     return roots.filter(t => !t.done && t.dueDate === today).length
      case 'scheduled': return roots.filter(t => !t.done && !!t.dueDate).length
      case 'all':       return roots.filter(t => !t.done).length
      case 'flagged':   return roots.filter(t => !t.done && t.flagged).length
      default:          return roots.filter(t => !t.done && t.listId === listId).length
    }
  }

  const updateTask = (id: string, updates: Partial<Task>) =>
    setTasks(ts => ts.map(t => t.id === id ? { ...t, ...updates } : t))

  const deleteTask = (id: string) =>
    setTasks(ts => ts.filter(t => t.id !== id && t.parentId !== id))

  const addTask = () => {
    if (!newTask.trim()) return
    const today = todayStr()
    const smartLists = ['today', 'scheduled', 'all', 'flagged']
    const listId = smartLists.includes(selected) ? 'inbox' : selected
    const dueDate = selected === 'today' ? today : selected === 'scheduled' ? today : null
    setTasks(ts => [...ts, {
      id: Date.now().toString(), text: newTask.trim(), notes: '',
      done: false, flagged: selected === 'flagged', priority: 'none',
      dueDate, dueTime: null, listId, parentId: null, createdAt: today,
    }])
    setNewTask('')
  }

  const addSubtask = (parentId: string, text: string) => {
    const parent = tasks.find(t => t.id === parentId)
    if (!parent) return
    setTasks(ts => [...ts, {
      id: Date.now().toString(), text, notes: '', done: false, flagged: false,
      priority: 'none', dueDate: null, dueTime: null, listId: parent.listId,
      parentId, createdAt: todayStr(),
    }])
  }

  const addList = () => {
    if (!newListName.trim()) return
    const colors = ['#7c5cfc', '#0ea5e9', '#22c55e', '#f97316', '#ec4899', '#a855f7', '#14b8a6']
    setLists(ls => [...ls, {
      id: Date.now().toString(), name: newListName.trim(), color: colors[ls.length % colors.length],
    }])
    setNewListName('')
    setAddingList(false)
  }

  const activeTasks = showDone ? visibleTasks : visibleTasks.filter(t => !t.done)
  const selectedName = SMART.find(s => s.id === selected)?.label ?? lists.find(l => l.id === selected)?.name ?? ''
  const selectedColor = lists.find(l => l.id === selected)?.color ?? 'var(--purple)'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', height: 'calc(100vh - 130px)' }}>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      {(!isMobile || showMobileSidebar) && (
      <div style={{ padding: '8px', borderRight: isMobile ? 'none' : '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>

        {/* Smart lists */}
        {SMART.map(s => {
          const count = pendingCount(s.id)
          return (
            <button key={s.id} onClick={() => { setSelected(s.id); setExpandedId(null) }} style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '8px 10px', borderRadius: 'var(--rs)', border: 'none', textAlign: 'left',
              background: selected === s.id ? 'rgba(124,92,252,0.12)' : 'transparent',
              color: selected === s.id ? 'var(--purple)' : 'var(--t2)',
              fontFamily: 'var(--font)', fontSize: '13px', cursor: 'pointer',
            }}>
              <span style={{ width: '16px', textAlign: 'center', fontSize: '13px' }}>{s.icon}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {count > 0 && <span style={{ fontSize: '11px', color: selected === s.id ? 'var(--purple)' : 'var(--t3)' }}>{count}</span>}
            </button>
          )
        })}

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

        {/* My Lists label */}
        <div style={{ fontSize: '10px', color: 'var(--t3)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 10px 4px' }}>
          My Lists
        </div>

        {lists.map(list => {
          const count = pendingCount(list.id)
          return (
            <button key={list.id} onClick={() => { setSelected(list.id); setExpandedId(null) }} style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '8px 10px', borderRadius: 'var(--rs)', border: 'none', textAlign: 'left',
              background: selected === list.id ? `${list.color}1a` : 'transparent',
              color: selected === list.id ? list.color : 'var(--t2)',
              fontFamily: 'var(--font)', fontSize: '13px', cursor: 'pointer',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: list.color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{list.name}</span>
              {count > 0 && <span style={{ fontSize: '11px', color: selected === list.id ? list.color : 'var(--t3)' }}>{count}</span>}
            </button>
          )
        })}

        {/* Add list */}
        {addingList ? (
          <div style={{ padding: '4px 8px' }}>
            <input autoFocus value={newListName} onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addList(); if (e.key === 'Escape') setAddingList(false) }}
              onBlur={() => { if (!newListName.trim()) setAddingList(false) }}
              placeholder="List name…"
              style={{
                width: '100%', background: 'var(--surface2)', border: '1px solid var(--purple)',
                color: 'var(--t1)', padding: '6px 8px', borderRadius: 'var(--rs)',
                fontFamily: 'var(--font)', fontSize: '12px', outline: 'none',
              }} />
          </div>
        ) : (
          <button onClick={() => setAddingList(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
            padding: '8px 10px', background: 'none', border: 'none',
            color: 'var(--t3)', fontFamily: 'var(--font)', fontSize: '13px', cursor: 'pointer',
          }}>
            <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> New List
          </button>
        )}
      </div>
      )}

      {/* ── Task panel ────────────────────────────────────────────────── */}
      {(!isMobile || !showMobileSidebar) && (
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Panel header */}
        <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setShowMobileSidebar(true)} style={{ background: 'none', border: 'none', color: 'var(--purple)', fontFamily: 'var(--font)', fontSize: '13px', cursor: 'pointer', padding: '0 8px 0 0', flexShrink: 0 }}>
              ≡ Lists
            </button>
          )}
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: selectedColor }}>{selectedName}</h2>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowDone(v => !v)} style={{
            padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--t3)', borderRadius: '20px', fontFamily: 'var(--font)', fontSize: '11px', cursor: 'pointer',
          }}>{showDone ? 'Hide' : 'Show'} completed</button>
        </div>

        {/* Task list */}
        <div onClick={() => setExpandedId(null)} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {activeTasks.length === 0 && (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--t3)', fontSize: '14px' }}>
              No tasks here
            </div>
          )}
          {activeTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              subtasks={subtasksOf(task.id)}
              isExpanded={expandedId === task.id}
              onExpand={() => setExpandedId(expandedId === task.id ? null : task.id)}
              onToggle={() => updateTask(task.id, { done: !task.done })}
              onDelete={() => { deleteTask(task.id); if (expandedId === task.id) setExpandedId(null) }}
              onUpdate={u => updateTask(task.id, u)}
              onAddSubtask={text => addSubtask(task.id, text)}
              onDeleteSubtask={id => setTasks(ts => ts.filter(t => t.id !== id))}
              onToggleSubtask={id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))}
            />
          ))}
        </div>

        {/* Add task */}
        <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={newTask} onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder={`Add to ${selectedName}…`}
              style={{
                flex: 1, background: 'var(--surface2)', border: '1px solid var(--border2)',
                color: 'var(--t1)', padding: '10px 14px', borderRadius: 'var(--rs)',
                fontFamily: 'var(--font)', fontSize: '13px', outline: 'none',
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--purple)'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border2)'} />
            <button onClick={addTask} style={{
              padding: '10px 20px', background: 'linear-gradient(135deg, var(--purple), var(--purple-d))',
              border: 'none', color: 'white', borderRadius: 'var(--rs)',
              fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>Add</button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
