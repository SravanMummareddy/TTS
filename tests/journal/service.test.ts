import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntry,
  listJournalEntries,
  updateJournalEntry,
} from '@/modules/journal/service'

function requireTestDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL must be set in .env.test before running service tests.')
  }
}

describe('journal service', () => {
  beforeAll(() => {
    requireTestDatabase()
  })

  afterEach(async () => {
    await prisma.journalEntry.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('creates an entry', async () => {
    const entry = await createJournalEntry({
      title: 'Morning notes',
      body: 'A clear start to the day.',
      tag: 'Reflection',
      date: new Date('2026-04-22T12:00:00.000Z'),
    })

    expect(entry.id).toBeTruthy()
    expect(entry.title).toBe('Morning notes')
    expect(entry.excerpt).toBe('A clear start to the day.')
    expect(entry.readTime).toBe('1 min')
  })

  it('lists entries newest first', async () => {
    await createJournalEntry({
      title: 'Older entry',
      body: 'Older body.',
      tag: 'Systems',
      date: new Date('2026-04-20T12:00:00.000Z'),
    })
    await createJournalEntry({
      title: 'Newer entry',
      body: 'Newer body.',
      tag: 'Systems',
      date: new Date('2026-04-22T12:00:00.000Z'),
    })

    const entries = await listJournalEntries()

    expect(entries.map(entry => entry.title)).toEqual(['Newer entry', 'Older entry'])
  })

  it('gets an entry by id', async () => {
    const created = await createJournalEntry({
      title: 'Find me',
      body: 'Lookup body.',
      tag: 'Books',
      date: new Date('2026-04-22T12:00:00.000Z'),
    })

    const entry = await getJournalEntry(created.id)

    expect(entry?.id).toBe(created.id)
    expect(entry?.title).toBe('Find me')
  })

  it('updates an entry', async () => {
    const created = await createJournalEntry({
      title: 'Before',
      body: 'Original body.',
      tag: 'Movement',
      date: new Date('2026-04-22T12:00:00.000Z'),
    })

    const updated = await updateJournalEntry(created.id, {
      title: 'After',
      body: 'Updated body with a fresh excerpt.',
      featured: true,
    })

    expect(updated.title).toBe('After')
    expect(updated.excerpt).toBe('Updated body with a fresh excerpt.')
    expect(updated.featured).toBe(true)
  })

  it('deletes an entry', async () => {
    const created = await createJournalEntry({
      title: 'Delete me',
      body: 'Short-lived body.',
      tag: 'Reflection',
      date: new Date('2026-04-22T12:00:00.000Z'),
    })

    await deleteJournalEntry(created.id)

    await expect(getJournalEntry(created.id)).resolves.toBeNull()
  })
})
