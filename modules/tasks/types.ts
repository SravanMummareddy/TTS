export type Priority = 'high' | 'medium' | 'low' | 'none'

export type RepeatType = 'daily' | 'weekly' | 'monthly' | 'custom'

export interface RepeatRule {
  type: RepeatType
  days?: number[]       // weekly: 0=Sun,1=Mon... e.g. [1,3,5] for MWF
  weekOn?: number | 'last' // monthly: 1-4 or 'last' for nth weekday of month
  interval?: number      // every N days/weeks/months (default 1)
}

export interface TaskList {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  text: string
  notes: string
  done: boolean
  flagged: boolean
  priority: Priority
  dueDate: string | null   // 'YYYY-MM-DD'
  dueTime: string | null   // 'HH:MM'
  listId: string
  parentId: string | null
  createdAt: string
  repeatRule?: RepeatRule | null
  repeatUntil?: string | null
  lastGenerated?: string | null
}
