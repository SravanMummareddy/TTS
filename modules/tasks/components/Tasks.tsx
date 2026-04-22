'use client'

import { useState } from 'react'

interface Task {
  id: number
  done: boolean
  text: string
  priority: 'high' | 'medium' | 'low'
}

const INITIAL_TASKS: Task[] = [
  { id: 1, done: true,  text: 'Morning meditation — 15 min', priority: 'high' },
  { id: 2, done: true,  text: 'Cold shower', priority: 'medium' },
  { id: 3, done: true,  text: 'Journal entry', priority: 'high' },
  { id: 4, done: true,  text: 'Protein target ≥ 160g', priority: 'medium' },
  { id: 5, done: false, text: 'Evening walk — 30 min', priority: 'high' },
  { id: 6, done: false, text: 'Read — 30 min', priority: 'medium' },
  { id: 7, done: false, text: 'Mobility session', priority: 'low' },
]

const PRIORITY_COLOR = { high: 'var(--rose-400)', medium: 'var(--purple)', low: 'var(--t3)' }

export default function TasksSection() {
  const [tab, setTab] = useState('today')
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [newTask, setNewTask] = useState('')

  const toggle = (id: number) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks(ts => [...ts, { id: Date.now(), done: false, text: newTask, priority: 'medium' }])
    setNewTask('')
  }

  const tabs = ['today', 'inbox', 'projects']
  const done = tasks.filter(t => t.done).length

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '7px 18px', background: tab === t ? 'var(--surface)' : 'transparent', border: `1px solid ${tab === t ? 'var(--border2)' : 'transparent'}`, color: tab === t ? 'var(--t1)' : 'var(--t3)', borderRadius: '20px', fontFamily: 'var(--font)', fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--t3)', alignSelf: 'center' }}>{done}/{tasks.length} complete</div>
      </div>

      {/* Progress */}
      <div style={{ height: '3px', background: 'var(--surface3)', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(done / tasks.length) * 100}%`, background: 'linear-gradient(to right, var(--purple), var(--teal))', transition: 'width 0.4s ease' }} />
      </div>

      {/* Task list */}
      <div className="glass" style={{ padding: '8px 0', marginBottom: '16px' }}>
        {tasks.map((t, i) => (
          <div key={t.id} onClick={() => toggle(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 20px', cursor: 'pointer', borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${t.done ? 'var(--purple)' : 'var(--surface3)'}`, background: t.done ? 'var(--purple)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {t.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.8 3L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span style={{ flex: 1, fontSize: '14px', color: t.done ? 'var(--t3)' : 'var(--t1)', textDecoration: t.done ? 'line-through' : 'none', fontWeight: 300 }}>{t.text}</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: PRIORITY_COLOR[t.priority], flexShrink: 0, opacity: t.done ? 0.3 : 0.8 }} />
          </div>
        ))}
      </div>

      {/* Add task */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add a task…"
          style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--t1)', padding: '11px 14px', borderRadius: 'var(--rs)', fontFamily: 'var(--font)', fontSize: '13px', outline: 'none' }}
          onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--purple)'}
          onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border2)'} />
        <button onClick={addTask} style={{ padding: '11px 20px', background: 'linear-gradient(135deg, var(--purple), var(--purple-d))', border: 'none', color: 'white', borderRadius: 'var(--rs)', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
      </div>
    </div>
  )
}
