import type z from 'zod'
import type { entry, feed } from './schemas'

export type Entry = z.infer<typeof entry>

export type Feed = z.infer<typeof feed>
