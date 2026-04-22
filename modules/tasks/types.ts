export type Priority = 'high' | 'medium' | 'low' | 'none'

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
}
