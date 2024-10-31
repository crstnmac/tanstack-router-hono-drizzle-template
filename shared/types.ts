import {z} from 'zod'
import type {ApiRoutes} from '../server/app'

export {type ApiRoutes}

export type SuccessResponse<T = void> = {
  success: true
  message: string
} & (T extends void ? {} : {data: T})

export type ErrorResponse = {
  success: false
  error: string
  isFormError?: boolean
}

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(3).max(255),
})

export const loginSchema = z.object({
  email: z.string().min(3).max(255),
  password: z.string().min(3).max(255),
})
