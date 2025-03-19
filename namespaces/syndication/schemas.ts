import { z } from 'zod'

export const feed = z
  .object({
    updatePeriod: z.string(),
    updateFrequency: z.number(),
    updateBase: z.string(),
  })
  .partial()
