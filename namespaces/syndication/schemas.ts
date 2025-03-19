import { z } from 'zod'

export const channel = z
  .object({
    updatePeriod: z.string(),
    updateFrequency: z.number(),
    updateBase: z.string(),
  })
  .partial()
