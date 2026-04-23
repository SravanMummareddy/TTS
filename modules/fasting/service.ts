import { prisma } from '@/lib/prisma'
import type { FastingEntry, FastingStats } from './types'

export async function getActiveFast(): Promise<FastingEntry | null> {
  const entry = await prisma.fastingEntry.findFirst({
    where: { endTime: null },
    orderBy: { createdAt: 'desc' },
  })
  return entry ? { ...entry, startTime: entry.startTime.toISOString(), createdAt: entry.createdAt.toISOString(), endTime: entry.endTime?.toISOString() ?? null } : null
}

export async function listFastingEntries(limit = 30): Promise<FastingEntry[]> {
  const entries = await prisma.fastingEntry.findMany({
    orderBy: { startTime: 'desc' },
    take: limit,
  })
  return entries.map(e => ({ ...e, startTime: e.startTime.toISOString(), createdAt: e.createdAt.toISOString(), endTime: e.endTime?.toISOString() ?? null }))
}

export async function startFast(target: number = 16): Promise<FastingEntry> {
  const entry = await prisma.fastingEntry.create({
    data: { startTime: new Date(), target, completed: false },
  })
  return { ...entry, startTime: entry.startTime.toISOString(), createdAt: entry.createdAt.toISOString(), endTime: null }
}

export async function endFast(id: string, completed: boolean = true): Promise<FastingEntry> {
  const entry = await prisma.fastingEntry.update({
    where: { id },
    data: { endTime: new Date(), completed },
  })
  return { ...entry, startTime: entry.startTime.toISOString(), createdAt: entry.createdAt.toISOString(), endTime: entry.endTime?.toISOString() ?? null }
}

export async function getFastingStats(): Promise<FastingStats> {
  const entries = await prisma.fastingEntry.findMany({
    where: { endTime: { not: null } },
    orderBy: { startTime: 'desc' },
    take: 30,
  })

  const completed = entries.filter(e => e.completed)
  const durations = entries
    .filter(e => e.endTime)
    .map(e => {
      const ms = e.endTime!.getTime() - e.startTime.getTime()
      return { ms, date: e.startTime.toISOString().split('T')[0] }
    })

  const longest = durations.reduce(
    (best, d) => d.ms > best.ms ? d : best,
    { ms: 0, date: '' }
  )

  const avgMs = durations.length > 0
    ? durations.reduce((s, d) => s + d.ms, 0) / durations.length
    : 0

  const compliance = entries.length > 0
    ? Math.round((completed.length / entries.length) * 100)
    : 0

  return {
    longestFast: {
      hours: Math.floor(longest.ms / 3600000),
      minutes: Math.floor((longest.ms % 3600000) / 60000),
      date: longest.date,
    },
    averageHours: Math.round((avgMs / 3600000) * 10) / 10,
    complianceRate: compliance,
    totalFasts: entries.length,
    completedFasts: completed.length,
  }
}