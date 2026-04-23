export interface JournalEntryInput {
  title: string
  body: string
  tag: string
  date: Date
  featured?: boolean
}

export interface JournalEntryUpdateInput {
  title?: string
  body?: string
  tag?: string
  date?: Date
  featured?: boolean
}

export interface JournalEntry {
  id: string
  title: string
  body: string
  tag: string
  date: string
  excerpt: string
  readTime: string
  featured: boolean
  createdAt: string
  updatedAt: string
}
