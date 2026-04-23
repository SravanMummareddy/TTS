import { updateNote, deleteNote } from '@/modules/notes/service'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  let body: unknown
  try { body = await req.json() } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 })
  }
  try {
    const note = await updateNote(params.id, body as Record<string, unknown>)
    return Response.json(note)
  } catch {
    return Response.json({ error: 'failed to update note' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await deleteNote(params.id)
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'failed to delete note' }, { status: 500 })
  }
}