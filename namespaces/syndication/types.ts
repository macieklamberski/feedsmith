import type z from 'zod'
import type { channel } from './schemas'

export type Channel = z.infer<typeof channel>
