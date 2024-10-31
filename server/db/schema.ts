import type {InferSelectModel} from 'drizzle-orm'
import {integer, pgTable, text, timestamp, varchar} from 'drizzle-orm/pg-core'

export const userTable = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', {length: 255}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull()
})

export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof sessionTable>
