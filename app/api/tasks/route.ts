import { listTaskLists, listTasks, createTask, updateTask, deleteTask } from '@/modules/tasks/service'

function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status })
}

export async function GET() {
  const [lists, tasks] = await Promise.all([listTaskLists(), listTasks()])
  return Response.json({ lists, tasks })
}

export async function POST(req: Request) {
  let body: unknown
  try { body = await req.json() } catch { return err('invalid JSON') }
  if (typeof body !== 'object' || body === null) return err('body must be an object')

  const { text, listId, dueDate, dueTime, notes, priority, flagged } = body as Record<string, unknown>
  if (typeof text !== 'string' || !text.trim()) return err('text is required')
  if (typeof listId !== 'string') return err('listId is required')

  const validPriorities = ['high', 'medium', 'low', 'none']
  const priorityVal = (priority as string) ?? 'none'
  const p = validPriorities.includes(priorityVal) ? priorityVal : 'none'

  try {
    const task = await createTask({
      text: text.trim(),
      listId,
      notes: (notes as string) ?? '',
      dueDate: (dueDate as string) ?? null,
      dueTime: (dueTime as string) ?? null,
      priority: p as any,
      flagged: (flagged as boolean) ?? false,
      done: false,
      parentId: null,
    })
    return Response.json(task, { status: 201 })
  } catch (e) {
    console.error(e)
    return err('failed to create task', 500)
  }
}