import type { ZodError } from 'zod'
import { validatedFeed } from './schemas'

export type Validate = (json: Record<string, unknown>) => {
  isValid: boolean
  error: ZodError | undefined
}

export const validate: Validate = (json) => {
  const { success: isValid, error } = validatedFeed.safeParse(json)

  return { isValid, error }
}
