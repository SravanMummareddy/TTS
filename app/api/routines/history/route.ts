import { listRoutineLogs } from '@/modules/routines/service'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const rawDays = Number(url.searchParams.get('days') ?? '30')
  const days = Number.isFinite(rawDays) && rawDays > 0 ? Math.min(Math.round(rawDays), 365) : 30
  const logs = await listRoutineLogs(days)
  return Response.json(logs)
}
