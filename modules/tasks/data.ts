import type { Task, TaskList } from './types'

const d = (offset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

const today = d(0)
const tomorrow = d(1)
const in3 = d(3)
const in7 = d(7)

export const SEED_LISTS: TaskList[] = [
  { id: 'inbox',    name: 'Inbox',    color: '#7c5cfc' },
  { id: 'health',   name: 'Health',   color: '#f97316' },
  { id: 'personal', name: 'Personal', color: '#22c55e' },
  { id: 'work',     name: 'Work',     color: '#0ea5e9' },
]

export const SEED_TASKS: Task[] = [
  // Health — today
  { id: 't1',  text: 'Morning meditation — 15 min', notes: 'Use Calm app, 15 min focus session', done: true,  flagged: false, priority: 'high',   dueDate: today,    dueTime: '07:00', listId: 'health',   parentId: null,  createdAt: today },
  { id: 't2',  text: 'Cold shower',                 notes: '',                                   done: true,  flagged: false, priority: 'medium', dueDate: today,    dueTime: '07:30', listId: 'health',   parentId: null,  createdAt: today },
  { id: 't3',  text: 'Protein target ≥ 160g',       notes: 'Track in MyFitnessPal',              done: true,  flagged: false, priority: 'medium', dueDate: today,    dueTime: null,    listId: 'health',   parentId: null,  createdAt: today },
  { id: 't4',  text: 'Evening walk — 30 min',       notes: '',                                   done: false, flagged: true,  priority: 'high',   dueDate: today,    dueTime: '19:00', listId: 'health',   parentId: null,  createdAt: today },
  { id: 't4a', text: 'Stretch 10 min after walk',   notes: '',                                   done: false, flagged: false, priority: 'none',   dueDate: null,     dueTime: null,    listId: 'health',   parentId: 't4',  createdAt: today },
  { id: 't4b', text: 'Log steps in Health app',     notes: '',                                   done: false, flagged: false, priority: 'none',   dueDate: null,     dueTime: null,    listId: 'health',   parentId: 't4',  createdAt: today },
  { id: 't5',  text: 'Mobility session',            notes: 'Hip flexors + thoracic spine',       done: false, flagged: false, priority: 'low',    dueDate: today,    dueTime: '20:00', listId: 'health',   parentId: null,  createdAt: today },

  // Personal
  { id: 't6',  text: 'Read — 30 min',               notes: 'Current: Atomic Habits ch. 12',      done: false, flagged: false, priority: 'medium', dueDate: today,    dueTime: '21:00', listId: 'personal', parentId: null,  createdAt: today },
  { id: 't7',  text: 'Schedule dentist appointment', notes: '',                                   done: false, flagged: false, priority: 'medium', dueDate: tomorrow, dueTime: null,    listId: 'personal', parentId: null,  createdAt: today },
  { id: 't8',  text: 'Reply to lease renewal email', notes: 'Landlord wants answer by end of week', done: false, flagged: true, priority: 'high',  dueDate: in3,      dueTime: null,    listId: 'personal', parentId: null,  createdAt: today },
  { id: 't9',  text: 'Research new running shoes',   notes: 'Budget ~$150, Brooks or ASICS',     done: true,  flagged: false, priority: 'low',    dueDate: null,     dueTime: null,    listId: 'personal', parentId: null,  createdAt: today },

  // Work
  { id: 't10',  text: 'Wire Journal CRUD routes',     notes: 'API route + service.ts stub first', done: false, flagged: true,  priority: 'high',   dueDate: in3,      dueTime: null,    listId: 'work',     parentId: null,  createdAt: today },
  { id: 't10a', text: 'Create /api/journal/route.ts', notes: '',                                  done: false, flagged: false, priority: 'none',   dueDate: null,     dueTime: null,    listId: 'work',     parentId: 't10', createdAt: today },
  { id: 't10b', text: 'Create modules/journal/service.ts', notes: '',                             done: false, flagged: false, priority: 'none',   dueDate: null,     dueTime: null,    listId: 'work',     parentId: 't10', createdAt: today },
  { id: 't11',  text: 'Mobile responsive layout pass', notes: 'Sidebar collapses at <768px',     done: false, flagged: false, priority: 'medium', dueDate: in7,      dueTime: null,    listId: 'work',     parentId: null,  createdAt: today },
  { id: 't12',  text: 'Deploy to Vercel',              notes: '',                                 done: false, flagged: false, priority: 'medium', dueDate: in7,      dueTime: null,    listId: 'work',     parentId: null,  createdAt: today },

  // Inbox
  { id: 't13', text: 'Buy groceries',   notes: 'Protein bars, eggs, Greek yogurt, spinach', done: true,  flagged: false, priority: 'low',  dueDate: today, dueTime: null,    listId: 'inbox', parentId: null, createdAt: today },
  { id: 't14', text: 'Journal entry',   notes: '',                                           done: true,  flagged: false, priority: 'high', dueDate: today, dueTime: '22:00', listId: 'inbox', parentId: null, createdAt: today },
]
