import type z from 'zod'
import type { dublincore } from './schemas'

export type Dublincore = z.infer<typeof dublincore>
