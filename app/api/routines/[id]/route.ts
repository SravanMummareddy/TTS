import { getRoutine, updateRoutine, deleteRoutine } from '@/modules/routines/service'
import type { RoutineInput } from '@/modules/routines/types'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const routine = await getRoutine(params.id)
  if (!routine) return err('not found', 404)
  return Response.json(routine)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')
  const routine = await updateRoutine(params.id, body as Partial<RoutineInput>)
  return Response.json(routine)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await deleteRoutine(params.id)
  return new Response(null, { status: 204 })
}
