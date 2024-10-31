import {Hono} from 'hono'
import {zValidator} from '@hono/zod-validator'
import {eq} from 'drizzle-orm'
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from '@/utils/authUtils'
import {userTable} from '@/db/schema'
import {db} from '@/db'
import {loginSchema, registerSchema, type SuccessResponse} from '@/shared/types'
import {deleteCookie, setCookie} from 'hono/cookie'
import postgres from 'postgres'
import {HTTPException} from 'hono/http-exception'
import type {Context} from '@/context'
import {loggedIn} from '@/middleware/loggedIn'
import {config} from '@/config'

export const authRouter = new Hono<Context>()
  .post('/signup', zValidator('form', registerSchema), async (c) => {
    const {username, name, email, password} = c.req.valid('form')

    const passwordHash = await Bun.password.hash(password) // Use Bun for hashing

    try {
      const res = await db
        .insert(userTable)
        .values({
          username,
          name,
          email,
          password: passwordHash,
        })
        .returning()

      const token = generateSessionToken()

      const session = await createSession(token, res[0].id)

      setCookie(c, 'session', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'Lax',
        expires: session.expiresAt,
        path: '/',
      })

      c.set('user', res[0])
      c.set('session', session)

      return c.json<SuccessResponse>(
        {
          message: 'User created',
          success: true,
        },
        201
      )
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === '23505') {
        throw new HTTPException(409, {
          message: 'User already exists',
        })
      }
      console.log(error)
      throw new HTTPException(500, {
        message: 'Failed to create User',
      })
    }
  })
  .post(
    '/login',
    zValidator('form', loginSchema, (result, c) => {
      if (!result.success) {
        c.json({message: 'Invalid username or password'}, 400)
      }
    }),
    async (c) => {
      const {email, password} = await c.req.valid('form')

      const [existingUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1)

      if (!existingUser) {
        throw new HTTPException(401, {
          message: 'Incorrect username or password',
        })
      }

      const validPassword = await Bun.password.verify(
        password,
        existingUser.password
      )

      if (!validPassword) {
        throw new HTTPException(401, {
          message: 'Incorrect password',
        })
      }

      const token = generateSessionToken()

      const session = await createSession(token, existingUser.id)

      console.log('session', session)
      console.log('token', token)

      setCookie(c, 'session', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'Lax',
        expires: session.expiresAt,
        path: '/',
      })

      c.set('user', existingUser)
      c.set('session', session)

      return c.json<SuccessResponse>(
        {
          message: 'Logged In',
          success: true,
        },
        200
      )
    }
  )
  .get('/logout', async (c) => {
    const session = c.get('session')
    if (!session) {
      return c.redirect('/')
    }

    invalidateSession(session.id)
    deleteCookie(c, 'session')

    return c.redirect('/')
  })
  .get('/user', loggedIn, async (c) => {
    const user = c.get('user')!
    return c.json<
      SuccessResponse<{
        email: string
        name: string
        username: string
      }>
    >({
      success: true,
      data: {
        username: user.username,
        name: user.name,
        email: user.email,
      },
      message: 'User found',
    })
  })
