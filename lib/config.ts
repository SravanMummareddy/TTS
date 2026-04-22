// Single source of truth for environment config.
// All URLs and external endpoints must be read from here, never hardcoded.

export const config = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const
