import { prisma } from '@/lib/prisma'

export async function listNotes() {
  return prisma.note.findMany({ orderBy: { updatedAt: 'desc' } })
}

export async function createNote(data: { title: string; body: string }) {
  return prisma.note.create({ data })
}

export async function updateNote(id: string, data: { title?: string; body?: string }) {
  return prisma.note.update({ where: { id }, data })
}

export async function deleteNote(id: string) {
  return prisma.note.delete({ where: { id } })
}