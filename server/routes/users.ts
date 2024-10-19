import {Hono} from 'hono'
import {z} from 'zod'
import {db} from '../db'
import {users} from '../db/schema'

const userSchema = z.object({
  id: z.number().int().positive().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.string().min(2).max(100),
})

export const createUserSchema = userSchema.omit({ id: true })

export const loginUserSchema = userSchema.pick({ email: true, password: true })

type User = z.infer<typeof userSchema>

export const userRoutes = new Hono().get('/', async (c) => {
  const result = await db.select().from(users)
  return c.json(result)
})
