export type Priority = 'high' | 'medium' | 'low' | 'none'

export type RepeatType = 'daily' | 'weekly' | 'monthly' | 'custom'

export type SortBy = 'dueDate' | 'priority' | 'createdAt' | 'manual'

export interface RepeatRule {
  type: RepeatType
  days?: number[]
  weekOn?: number | 'last'
  interval?: number
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
  dueDate: string | null
  dueTime: string | null
  listId: string
  parentId: string | null
  order?: number
  createdAt: string
  repeatRule?: RepeatRule | null
  repeatUntil?: string | null
  lastGenerated?: string | null
}
