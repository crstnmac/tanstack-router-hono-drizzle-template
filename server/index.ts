import app from './app'
import {config} from './config'

const port = config.api.port || 3000
const hostname = config.api.host || '0.0.0.0'

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`Server running at http://${hostname}:${port}/`)
