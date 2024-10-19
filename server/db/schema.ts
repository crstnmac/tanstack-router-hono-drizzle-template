import {integer, pgTable, timestamp, varchar} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', {length: 100}).notNull(),
  email: varchar('email', {length: 100}).notNull().unique(),
  password: varchar('password', {length: 100}).notNull(),
  role: varchar('role', {length: 100}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export default {
  users,
}
