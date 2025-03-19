import type z from 'zod'
import type { dublinCore } from './schemas'

export type DublinCore = z.infer<typeof dublinCore>
