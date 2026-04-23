import { afterEach, describe, expect, it, vi } from 'vitest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    routineItemLog: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    routineLog: {
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

import { listRoutineLogs, skipRoutine, toggleItemLog } from '@/modules/routines/service'

describe('routines service', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('toggles a missing item log on and recalculates required-item completion', async () => {
    prismaMock.routineItemLog.findUnique.mockResolvedValueOnce(null)
    prismaMock.routineItemLog.create.mockResolvedValueOnce(undefined)
    prismaMock.routineLog.findUniqueOrThrow.mockResolvedValueOnce({
      id: 'log-1',
      itemLogs: [
        { itemId: 'item-1', done: true },
      ],
      variant: {
        items: [
          { id: 'item-1', optional: false },
          { id: 'item-2', optional: false },
          { id: 'item-3', optional: true },
        ],
      },
    })
    prismaMock.routineLog.update.mockResolvedValueOnce({
      id: 'log-1',
      completionPct: 50,
      itemLogs: [{ itemId: 'item-1', done: true }],
    })

    const updated = await toggleItemLog('log-1', 'item-1')

    expect(prismaMock.routineItemLog.create).toHaveBeenCalledWith({
      data: { logId: 'log-1', itemId: 'item-1', done: true },
    })
    expect(prismaMock.routineLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { completionPct: 50 },
      include: { itemLogs: true },
    })
    expect(updated.completionPct).toBe(50)
  })

  it('supports restoring a skipped routine log', async () => {
    prismaMock.routineLog.upsert.mockResolvedValueOnce({
      id: 'log-restore',
      skipped: false,
      itemLogs: [],
    })

    const restored = await skipRoutine('routine-1', 'variant-1', '2026-04-23', false)

    expect(prismaMock.routineLog.upsert).toHaveBeenCalledWith({
      where: { routineId_date: { routineId: 'routine-1', date: '2026-04-23' } },
      create: {
        routineId: 'routine-1',
        variantId: 'variant-1',
        date: '2026-04-23',
        skipped: false,
      },
      update: { skipped: false },
      include: { itemLogs: true },
    })
    expect(restored.skipped).toBe(false)
  })

  it('recovers from a log upsert race by loading the created log', async () => {
    const raceError = new Error('unique') as Error & { code?: string; name?: string }
    raceError.name = 'PrismaClientKnownRequestError'
    raceError.code = 'P2002'

    prismaMock.routineLog.upsert.mockRejectedValueOnce(raceError)
    prismaMock.routineLog.findUniqueOrThrow.mockResolvedValueOnce({
      id: 'log-race',
      itemLogs: [],
    })

    const service = await import('@/modules/routines/service')
    const log = await service.upsertLog('routine-1', 'variant-1', '2026-04-23')

    expect(prismaMock.routineLog.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { routineId_date: { routineId: 'routine-1', date: '2026-04-23' } },
      include: { itemLogs: true },
    })
    expect(log.id).toBe('log-race')
  })

  it('loads routine history within the requested date window', async () => {
    prismaMock.routineLog.findMany.mockResolvedValueOnce([])

    await listRoutineLogs(14)

    expect(prismaMock.routineLog.findMany).toHaveBeenCalledTimes(1)
    const findManyArgs = prismaMock.routineLog.findMany.mock.calls[0][0]
    expect(findManyArgs.include).toEqual({ itemLogs: true })
    expect(findManyArgs.orderBy).toEqual({ date: 'desc' })
    expect(findManyArgs.where.date.gte).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(findManyArgs.where.date.lte).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
