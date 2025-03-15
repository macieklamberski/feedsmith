import type { z } from 'zod'
import type {
  validatedFeed,
  validatedFeed1,
  validatedFeed11,
  validatedItem1,
  validatedItem11,
  validatedItemContent,
} from './schemas'

export type ValidatedItemContent = z.infer<typeof validatedItemContent>

export type ValidatedItem1 = z.infer<typeof validatedItem1>

export type ValidatedFeed1 = z.infer<typeof validatedFeed1>

export type ValidatedItem11 = z.infer<typeof validatedItem11>

export type ValidatedFeed11 = z.infer<typeof validatedFeed11>

export type ValidatedFeed = z.infer<typeof validatedFeed>
