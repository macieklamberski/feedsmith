import type z from 'zod'
import type { any } from './schemas'

export type Any = z.infer<typeof any>
