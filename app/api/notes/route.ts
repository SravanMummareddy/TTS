import { listNotes, createNote, updateNote, deleteNote } from '@/modules/notes/service'

export async function GET() {
  const notes = await listNotes()
  return Response.json(notes)
}

export async function POST(req: Request) {
  let body: unknown
  try { body = await req.json() } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 })
  }
  const { title, body: noteBody } = body as Record<string, unknown>
  if (typeof title !== 'string' || !title.trim()) {
    return Response.json({ error: 'title is required' }, { status: 400 })
  }
  try {
    const note = await createNote({ title: title.trim(), body: (noteBody as string) ?? '' })
    return Response.json(note, { status: 201 })
  } catch {
    return Response.json({ error: 'failed to create note' }, { status: 500 })
  }
}