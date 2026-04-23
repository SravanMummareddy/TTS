import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed TaskLists
  const inbox = await prisma.taskList.create({ data: { id: 'inbox', name: 'Inbox', color: '#7c5cfc' } })
  const health = await prisma.taskList.create({ data: { id: 'health', name: 'Health', color: '#f97316' } })
  const personal = await prisma.taskList.create({ data: { id: 'personal', name: 'Personal', color: '#22c55e' } })
  const work = await prisma.taskList.create({ data: { id: 'work', name: 'Work', color: '#0ea5e9' } })

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const in3 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  const in7 = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

  // Seed Tasks
  const tasks = [
    // Health — today
    { text: 'Morning meditation — 15 min', notes: 'Use Calm app', done: true, flagged: false, priority: 'high', dueDate: today, dueTime: '07:00', listId: health.id },
    { text: 'Cold shower', notes: '', done: true, flagged: false, priority: 'medium', dueDate: today, dueTime: '07:30', listId: health.id },
    { text: 'Protein target ≥ 160g', notes: 'Track in MyFitnessPal', done: true, flagged: false, priority: 'medium', dueDate: today, dueTime: null, listId: health.id },
    { text: 'Evening walk — 30 min', notes: '', done: false, flagged: true, priority: 'high', dueDate: today, dueTime: '19:00', listId: health.id },
    { text: 'Mobility session', notes: 'Hip flexors + thoracic spine', done: false, flagged: false, priority: 'low', dueDate: today, dueTime: '20:00', listId: health.id },

    // Personal
    { text: 'Read — 30 min', notes: 'Current: Atomic Habits', done: false, flagged: false, priority: 'medium', dueDate: today, dueTime: '21:00', listId: personal.id },
    { text: 'Schedule dentist appointment', notes: '', done: false, flagged: false, priority: 'medium', dueDate: tomorrow, dueTime: null, listId: personal.id },
    { text: 'Reply to lease renewal email', notes: 'Landlord wants answer', done: false, flagged: true, priority: 'high', dueDate: in3, dueTime: null, listId: personal.id },
    { text: 'Research new running shoes', notes: 'Budget ~$150', done: true, flagged: false, priority: 'low', dueDate: null, dueTime: null, listId: personal.id },

    // Work
    { text: 'Mobile responsive layout pass', notes: 'Sidebar collapses', done: false, flagged: false, priority: 'medium', dueDate: in7, dueTime: null, listId: work.id },
    { text: 'Deploy to Vercel', notes: '', done: false, flagged: false, priority: 'medium', dueDate: in7, dueTime: null, listId: work.id },

    // Inbox
    { text: 'Buy groceries', notes: 'Protein bars, eggs', done: true, flagged: false, priority: 'low', dueDate: today, dueTime: null, listId: inbox.id },
    { text: 'Journal entry', notes: '', done: true, flagged: false, priority: 'high', dueDate: today, dueTime: '22:00', listId: inbox.id },
  ]

  for (const t of tasks) {
    await prisma.task.create({ data: t })
  }

  console.log('Tasks seeded:', { lists: 4, tasks: tasks.length })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())