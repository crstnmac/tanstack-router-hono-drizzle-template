import {Hono} from 'hono'
import {config} from '../config'
import bcrypt from 'bcrypt'
import {zValidator} from '@hono/zod-validator'
import {createUserSchema} from './users'
import {db} from '../db'
import {users} from '../db/schema'
import {eq} from 'drizzle-orm'
import {Jwt} from 'hono/utils/jwt'
import {getCookie, setCookie} from 'hono/cookie'

const JWT_OPTIONS = {
  expiresIn: config.jwt.accessExpirationMinutes,
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'Lax' as const,
  path: '/',
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export const authRoutes = new Hono()
  .post('/register', zValidator('form', createUserSchema), async (c) => {
    const {name, email, password, role} = await c.req.valid('form')

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (user.length) {
      return c.json({message: 'User already exists'}, 400)
    }

    const hashedPassword = await hashPassword(password)

    const result = await db
      .insert(users)
      .values({name, email, password: hashedPassword, role})
      .returning()

    return c.json(
      {
        message: 'User created',
        user: result[0],
      },
      201
    )
  })
  .post(
    '/login',
    zValidator(
      'form',
      createUserSchema.pick({email: true, password: true}),
      (result, c) => {
        if (!result.success) {
          c.json({message: 'Invalid email or password'}, 400)
        }
      }
    ),
    async (c) => {
      const {email, password} = await c.req.valid('form')
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
      if (!user.length) {
        return c.json({message: 'User not found please signup'}, 400)
      }

      const isValid = await verifyPassword(password, user[0].password)
      if (!isValid) {
        return c.json({message: 'Invalid email or password'}, 400)
      }

      const token = await Jwt.sign(
        {
          id: user[0].id,
          email: user[0].email,
          role: user[0].role,
        },
        config.jwt.secret
      )

      setCookie(c, 'token', token, JWT_OPTIONS)
      return c.json(
        {
          message: 'Login successful',
          user: {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role,
          },
        },
        200
      )
    }
  )
  .post('/logout', async (c) => {
    setCookie(c, 'token', '', {...JWT_OPTIONS, maxAge: 0})
    return c.json({message: 'Logout successful'})
  })
  .get('/check-auth', async (c) => {
    const token = getCookie(c, 'token')
    if (!token) {
      return c.json({message: 'Not authenticated'}, 401)
    }

    try {
      const payload = await Jwt.verify(token, config.jwt.secret)
      return c.json({message: 'Authenticated', user: payload}, 200)
    } catch (error) {
      return c.json({message: 'Not authenticated', user: null}, 401)
    }
  })
