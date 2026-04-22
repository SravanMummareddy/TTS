import { createJournalEntry, listJournalEntries } from '@/modules/journal/service'
import type { JournalEntryInput } from '@/modules/journal/types'

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseJournalEntryInput(value: unknown): JournalEntryInput | string {
  if (!isObject(value)) return 'Request body must be an object.'

  const { title, body, tag, date, featured } = value

  if (typeof title !== 'string' || !title.trim()) return 'Title is required.'
  if (typeof body !== 'string' || !body.trim()) return 'Body is required.'
  if (typeof tag !== 'string' || !tag.trim()) return 'Tag is required.'
  if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) return 'Valid date is required.'
  if (featured !== undefined && typeof featured !== 'boolean') return 'Featured must be a boolean.'

  return {
    title,
    body,
    tag,
    date: new Date(date),
    featured,
  }
}

export async function GET() {
  const entries = await listJournalEntries()
  return Response.json(entries)
}

export async function POST(req: Request) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return errorResponse('Request body must be valid JSON.')
  }

  const input = parseJournalEntryInput(body)
  if (typeof input === 'string') return errorResponse(input)

  const entry = await createJournalEntry(input)
  return Response.json(entry, { status: 201 })
}
