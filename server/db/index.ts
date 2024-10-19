import {Pool} from 'pg'
import {config} from '../config'
import {drizzle} from 'drizzle-orm/node-postgres'
import schema from './schema'

const pool = new Pool({
  host: config.postgresql.host,
  port: config.postgresql.port,
  database: config.postgresql.dbName,
  user: config.postgresql.user,
  password: config.postgresql.password,
  max: config.env === 'production' ? 20 : 5,
})

export const db = drizzle(pool, {
  schema: {
    ...schema,
  },
})
