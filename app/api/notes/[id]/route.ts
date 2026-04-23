import { updateNote, deleteNote } from '@/modules/notes/service'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: unknown
  try { body = await req.json() } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 })
  }
  try {
    const note = await updateNote(id, body as Record<string, unknown>)
    return Response.json(note)
  } catch {
    return Response.json({ error: 'failed to update note' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await deleteNote(id)
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'failed to delete note' }, { status: 500 })
  }
}