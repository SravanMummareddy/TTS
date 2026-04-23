import { afterEach, describe, expect, it, vi } from 'vitest'

const { serviceMock, utilsMock } = vi.hoisted(() => ({
  serviceMock: {
    listRoutines: vi.fn(),
    createRoutine: vi.fn(),
    getRoutine: vi.fn(),
    listRoutineLogs: vi.fn(),
    upsertLog: vi.fn(),
    toggleItemLog: vi.fn(),
    skipRoutine: vi.fn(),
  },
  utilsMock: {
    getVariantForDay: vi.fn(),
  },
}))

vi.mock('@/modules/routines/service', () => serviceMock)
vi.mock('@/modules/routines/utils', () => utilsMock)

import { POST as createRoutinePost } from '@/app/api/routines/route'
import { GET as historyGet } from '@/app/api/routines/history/route'
import { POST as logPost } from '@/app/api/routines/[id]/log/route'

describe('routines routes', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('rejects malformed routine payloads', async () => {
    const req = new Request('http://localhost/api/routines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bad routine',
        category: 'fitness',
        color: '#f97316',
        icon: '💪',
        variants: [{ days: [1], items: [{ text: 'Missing order' }] }],
      }),
    })

    const res = await createRoutinePost(req)

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'item.order must be a number' })
  })

  it('creates a routine when the payload is valid', async () => {
    serviceMock.createRoutine.mockResolvedValueOnce({ id: 'routine-1', name: 'Valid routine' })

    const req = new Request('http://localhost/api/routines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Valid routine',
        category: 'fitness',
        color: '#f97316',
        icon: '💪',
        variants: [{ days: [1], items: [{ text: 'Lift', order: 0 }] }],
      }),
    })

    const res = await createRoutinePost(req)

    expect(serviceMock.createRoutine).toHaveBeenCalledTimes(1)
    expect(res.status).toBe(201)
  })

  it('passes skipped=false through the log route for restore behavior', async () => {
    serviceMock.getRoutine.mockResolvedValueOnce({ id: 'routine-1' })
    utilsMock.getVariantForDay.mockReturnValueOnce({ id: 'variant-1' })
    serviceMock.skipRoutine.mockResolvedValueOnce({ id: 'log-1', skipped: false })

    const req = new Request('http://localhost/api/routines/routine-1/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'skip', skipped: false }),
    })

    const res = await logPost(req, { params: Promise.resolve({ id: 'routine-1' }) })

    expect(serviceMock.skipRoutine).toHaveBeenCalledWith('routine-1', 'variant-1', expect.any(String), false)
    expect(res.status).toBe(200)
  })

  it('rejects toggle-item without itemId', async () => {
    serviceMock.getRoutine.mockResolvedValueOnce({ id: 'routine-1' })
    utilsMock.getVariantForDay.mockReturnValueOnce({ id: 'variant-1' })

    const req = new Request('http://localhost/api/routines/routine-1/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle-item' }),
    })

    const res = await logPost(req, { params: Promise.resolve({ id: 'routine-1' }) })

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'itemId is required' })
  })

  it('loads history with a sanitized day window', async () => {
    serviceMock.listRoutineLogs.mockResolvedValueOnce([])

    const res = await historyGet(new Request('http://localhost/api/routines/history?days=999'))

    expect(serviceMock.listRoutineLogs).toHaveBeenCalledWith(365)
    expect(res.status).toBe(200)
  })
})
