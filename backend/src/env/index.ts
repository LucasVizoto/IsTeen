import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'e2e','production']).default('dev'),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(3333),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_KEY: z.string(),
    SUPABASE_BUCKET_NAME: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string().default("587"),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    MAIL_FROM: z.string().email()
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error('❌ Invalid environment variables', _env.error.format())
    throw new Error('Invalid environment variables')
}

export const env = _env.data