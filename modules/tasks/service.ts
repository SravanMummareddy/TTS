import { prisma } from '@/lib/prisma'
import type { Task, TaskList } from './types'

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
    },
  })
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } })
}