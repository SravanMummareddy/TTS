import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import type { JournalEntryInput, JournalEntryUpdateInput } from './types'

function buildExcerpt(body: string) {
  const text = body.trim().replace(/\s+/g, ' ')
  return text.length > 180 ? `${text.slice(0, 177)}...` : text
}

function buildReadTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 225))
  return `${minutes} min`
}

function toCreateData(input: JournalEntryInput): Prisma.JournalEntryCreateInput {
  return {
    title: input.title.trim(),
    body: input.body.trim(),
    tag: input.tag.trim(),
    date: input.date,
    excerpt: buildExcerpt(input.body),
    readTime: buildReadTime(input.body),
    featured: input.featured ?? false,
  }
}

function toUpdateData(input: JournalEntryUpdateInput): Prisma.JournalEntryUpdateInput {
  const data: Prisma.JournalEntryUpdateInput = {}

  if (input.title !== undefined) data.title = input.title.trim()
  if (input.tag !== undefined) data.tag = input.tag.trim()
  if (input.date !== undefined) data.date = input.date
  if (input.featured !== undefined) data.featured = input.featured

  if (input.body !== undefined) {
    data.body = input.body.trim()
    data.excerpt = buildExcerpt(input.body)
    data.readTime = buildReadTime(input.body)
  }

  return data
}

export async function listJournalEntries() {
  return prisma.journalEntry.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  })
}

export async function getJournalEntry(id: string) {
  return prisma.journalEntry.findUnique({ where: { id } })
}

export async function createJournalEntry(input: JournalEntryInput) {
  return prisma.journalEntry.create({ data: toCreateData(input) })
}

export async function updateJournalEntry(id: string, input: JournalEntryUpdateInput) {
  return prisma.journalEntry.update({
    where: { id },
    data: toUpdateData(input),
  })
}

export async function deleteJournalEntry(id: string) {
  return prisma.journalEntry.delete({ where: { id } })
}
