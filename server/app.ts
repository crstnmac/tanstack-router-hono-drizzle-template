import {Hono} from 'hono'
import {cors} from 'hono/cors'
import {logger} from 'hono/logger'
import {config} from './config'
import {serveStatic} from 'hono/bun'
import {HTTPException} from 'hono/http-exception'
import type {ErrorResponse} from '@/shared/types'
import {deleteCookie, getCookie, setCookie} from 'hono/cookie'
import type {Context} from './context'
import {
  createSession,
  generateSessionToken,
  validateSessionToken,
} from './utils/authUtils'
import {authRouter} from './routes/auth'

const app = new Hono<Context>()

app.use('*', logger())

app.use(
  '*',
  cors({origin: config.appOrigin!, credentials: true}),
  async (c, next) => {
    const sessionId = getCookie(c, 'session')

    if (!sessionId) {
      c.set('user', null)
      c.set('session', null)
      return next()
    }

    const {session, user} = await validateSessionToken(sessionId)

    if (session && session.expiresAt < new Date()) {
      const token = generateSessionToken()

      const newSession = await createSession(token, session.userId)

      console.log('newSession', newSession)

      setCookie(c, 'session', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'Lax',
        expires: newSession.expiresAt,
        path: '/',
      })
    }

    if (!session) {
      deleteCookie(c, 'session')
    }

    c.set('session', session)
    c.set('user', user)

    return next()
  }
)

const apiRoutes = app.basePath('/api').route('/auth', authRouter)

app.use('*', serveStatic({root: './frontend/dist'}))
app.use('*', serveStatic({root: './frontend/dist/index.html'}))

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause === 'object' && 'form' in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status
      )

    return errResponse
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : err.stack ?? err.message,
    },
    500
  )
})

export default app
export type ApiRoutes = typeof apiRoutes
