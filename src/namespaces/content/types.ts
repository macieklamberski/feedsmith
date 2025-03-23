import type z from 'zod'
import type { item } from './schemas'

export type Item = z.infer<typeof item>
