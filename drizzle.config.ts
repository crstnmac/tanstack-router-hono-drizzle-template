import {defineConfig} from 'drizzle-kit'

import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url:
      process.env.NODE_ENV === 'development'
        ? `postgresql://${process.env.POSTGRESQL_USER}:${process.env.POSTGRESQL_PASSWORD}@${process.env.POSTGRESQL_HOST}:${process.env.POSTGRESQL_PORT}/${process.env.POSTGRESQL_DB_NAME}`
        : process.env.DATABASE_URL || '',
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
})
