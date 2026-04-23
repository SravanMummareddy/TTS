import { Prisma } from '@prisma/client'

import {
  deleteJournalEntry,
  getJournalEntry,
  updateJournalEntry,
} from '@/modules/journal/service'
import type { JournalEntryUpdateInput } from '@/modules/journal/types'

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseJournalEntryUpdate(value: unknown): JournalEntryUpdateInput | string {
  if (!isObject(value)) return 'Request body must be an object.'

  const { title, body, tag, date, featured } = value
  const input: JournalEntryUpdateInput = {}

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) return 'Title must not be empty.'
    input.title = title
  }

  if (body !== undefined) {
    if (typeof body !== 'string' || !body.trim()) return 'Body must not be empty.'
    input.body = body
  }

  if (tag !== undefined) {
    if (typeof tag !== 'string' || !tag.trim()) return 'Tag must not be empty.'
    input.tag = tag
  }

  if (date !== undefined) {
    if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) return 'Date must be valid.'
    input.date = new Date(date)
  }

  if (featured !== undefined) {
    if (typeof featured !== 'boolean') return 'Featured must be a boolean.'
    input.featured = featured
  }

  if (Object.keys(input).length === 0) return 'At least one field is required.'

  return input
}

function isNotFound(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = await getJournalEntry(id)
  if (!entry) return errorResponse('Journal entry not found.', 404)
  return Response.json(entry)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return errorResponse('Request body must be valid JSON.')
  }

  const input = parseJournalEntryUpdate(body)
  if (typeof input === 'string') return errorResponse(input)

  try {
    const entry = await updateJournalEntry(id, input)
    return Response.json(entry)
  } catch (error) {
    if (isNotFound(error)) return errorResponse('Journal entry not found.', 404)
    throw error
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await deleteJournalEntry(id)
    return new Response(null, { status: 204 })
  } catch (error) {
    if (isNotFound(error)) return errorResponse('Journal entry not found.', 404)
    throw error
  }
}