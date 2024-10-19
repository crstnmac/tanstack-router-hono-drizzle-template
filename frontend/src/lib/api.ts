import {ApiRoutes} from '@server/app'
import {hc} from 'hono/client'

const client = hc<ApiRoutes>('/')

export const api = client.api
