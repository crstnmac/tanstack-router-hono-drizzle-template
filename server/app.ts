import {Hono} from 'hono'
import {cors} from 'hono/cors'
import {logger} from 'hono/logger'
import {config} from './config'
import {authRoutes} from './routes/auth'
import {serveStatic} from 'hono/bun'

const app = new Hono()

app.use('*', logger())

const apiRoutes = app
  .basePath('/api')
  .use(
    '*',
    cors({
      origin: config.appOrigin!,
      credentials: true,
    })
  )
  .route('/auth', authRoutes)

app.use('*', serveStatic({root: './frontend/dist'}))
app.use('*', serveStatic({root: './frontend/dist/index.html'}))

export default app
export type ApiRoutes = typeof apiRoutes