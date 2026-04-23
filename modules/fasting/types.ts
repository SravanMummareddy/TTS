export interface FastingEntry {
  id: string
  startTime: string
  endTime: string | null
  target: number
  completed: boolean
  createdAt: string
}

export interface FastingStats {
  longestFast: { hours: number; minutes: number; date: string }
  averageHours: number
  complianceRate: number
  totalFasts: number
  completedFasts: number
}