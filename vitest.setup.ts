import { existsSync, readFileSync } from 'node:fs'

const envTestPath = '.env.test'

if (existsSync(envTestPath)) {
  const env = readFileSync(envTestPath, 'utf8')

  for (const line of env.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}
