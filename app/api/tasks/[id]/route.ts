import { updateTask, deleteTask } from '@/modules/tasks/service'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')

  try {
    const task = await updateTask(id, body as Record<string, unknown>)
    return Response.json(task)
  } catch {
    return err('failed to update task', 500)
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await deleteTask(id)
    return Response.json({ success: true })
  } catch {
    return err('failed to delete task', 500)
  }
}