import { getTodayRoutines } from '@/modules/routines/service'

export async function GET() {
  const date = new Date().toISOString().split('T')[0]
  const data = await getTodayRoutines(date)
  return Response.json(data)
}
