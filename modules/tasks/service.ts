import { prisma } from '@/lib/prisma'
import type { Task, TaskList, RepeatRule } from './types'
import type { Prisma } from '@prisma/client'

export async function listTaskLists() {
  return prisma.taskList.findMany({ orderBy: { name: 'asc' } })
}

export async function listTasks(listId?: string) {
  return prisma.task.findMany({
    where: listId ? { listId } : undefined,
    orderBy: [
      { done: 'asc' },
      { flagged: 'desc' },
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
  })
}

export async function createTaskList(data: Omit<TaskList, 'id'>) {
  return prisma.taskList.create({ data })
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt'>) {
  return prisma.task.create({
    data: {
      text: data.text,
      notes: data.notes ?? '',
      done: data.done ?? false,
      flagged: data.flagged ?? false,
      priority: data.priority ?? 'none',
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      listId: data.listId,
      parentId: data.parentId,
      order: data.order ?? 0,
      repeatRule: (data.repeatRule as unknown as Prisma.InputJsonValue) ?? undefined,
      repeatUntil: data.repeatUntil ?? undefined,
      lastGenerated: data.lastGenerated ?? undefined,
    },
  })
}

export async function updateTask(id: string, data: Partial<Task>) {
  return prisma.task.update({
    where: { id },
    data: {
      ...(data.text !== undefined && { text: data.text }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.done !== undefined && { done: data.done }),
      ...(data.flagged !== undefined && { flagged: data.flagged }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.dueTime !== undefined && { dueTime: data.dueTime }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.repeatRule !== undefined && { repeatRule: data.repeatRule as unknown as Prisma.InputJsonValue }),
      ...(data.repeatUntil !== undefined && { repeatUntil: data.repeatUntil }),
      ...(data.lastGenerated !== undefined && { lastGenerated: data.lastGenerated }),
    },
  })
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } })
}

export async function reorderTasks(taskIds: string[]) {
  await prisma.$transaction(
    taskIds.map((id, index) =>
      prisma.task.update({ where: { id }, data: { order: index } })
    )
  )
}

// ── Recurrence helpers ────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export function getNextOccurrence(rule: RepeatRule, fromDate: string): string | null {
  const today = new Date(fromDate + 'T12:00')
  today.setDate(today.getDate() + 1) // start from next day
  const interval = rule.interval ?? 1

  switch (rule.type) {
    case 'daily':
      return addDays(today, interval).toISOString().split('T')[0]

    case 'weekly': {
      if (!rule.days?.length) return addDays(today, interval * 7).toISOString().split('T')[0]
      const currentDow = today.getDay()
      for (let i = 0; i < 7; i++) {
        const d = addDays(today, i)
        if (rule.days.includes(d.getDay())) {
          return d.toISOString().split('T')[0]
        }
      }
      return addDays(today, (7 - currentDow) + interval * 7 - 7).toISOString().split('T')[0]
    }

    case 'monthly': {
      if (rule.weekOn !== undefined) {
        const targetDow = rule.days?.[0] ?? today.getDay()
        const nthWeek = rule.weekOn === 'last' ? null : (rule.weekOn as number)
        let d = addMonths(today, interval)
        d.setDate(1)
        if (rule.weekOn === 'last') {
          d = addMonths(d, 1)
          d.setDate(0)
          while (d.getDay() !== targetDow) d.setDate(d.getDate() - 1)
        } else {
          while (d.getDay() !== targetDow) d.setDate(d.getDate() + 1)
          d.setDate(d.getDate() + (nthWeek! - 1) * 7)
        }
        if (d <= today) {
          d = addMonths(d, interval)
          d.setDate(1)
          while (d.getDay() !== targetDow) d.setDate(d.getDate() + 1)
          d.setDate(d.getDate() + (nthWeek! - 1) * 7)
        }
        return d.toISOString().split('T')[0]
      }
      return addMonths(today, interval).toISOString().split('T')[0]
    }

    case 'custom':
      if (rule.days?.length && rule.interval) {
        const totalDays = rule.interval
        return addDays(today, totalDays).toISOString().split('T')[0]
      }
      return null

    default:
      return null
  }
}