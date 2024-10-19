import { z } from "zod";


const EnvVariables = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_ORIGIN: z.string().url().optional(),
  API_HOST: z.string().default('localhost'),
  API_PORT: z.preprocess((a: any) => +a, z.number().optional().default(5000)),
  POSTGRESQL_HOST: z.string(),
  POSTGRESQL_PORT: z.preprocess((a: any) => +a, z.number().optional().default(5432)),
  POSTGRESQL_DB_NAME: z.string(),
  POSTGRESQL_USER: z.string(),
  POSTGRESQL_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_MINUTES: z.preprocess((a: any) => +a, z.number().default(30)),
  JWT_REFRESH_EXPIRATION_DAYS: z.preprocess((a: any) => +a, z.number().default(30)),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.preprocess((a: any) => +a, z.number().default(10)),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.preprocess((a: any) => +a, z.number().default(10)),
})

let envVars

try {
  envVars = EnvVariables.parse(process.env)
}catch (error) {
  console.log(`Error: ENV validation error ${error}`)
  process.exit(1)
}

export const config = {
  env: envVars.NODE_ENV,
  appOrigin: envVars.APP_ORIGIN,
  api: {
    host: envVars.API_HOST,
    port: envVars.API_PORT,
  },
  postgresql: {
    host: envVars.POSTGRESQL_HOST,
    port: envVars.POSTGRESQL_PORT,
    dbName: envVars.POSTGRESQL_DB_NAME,
    user: envVars.POSTGRESQL_USER,
    password: envVars.POSTGRESQL_PASSWORD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
}