import type z from 'zod'
import type { itemOrFeed } from './schemas'

export type ItemOrFeed = z.infer<typeof itemOrFeed>
