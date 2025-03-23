import type z from 'zod'
import type { feed } from './schemas'

export type Feed = z.infer<typeof feed>
