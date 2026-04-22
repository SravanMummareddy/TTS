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
