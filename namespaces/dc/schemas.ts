import { z } from 'zod'

export const itemOrFeed = z
  .object({
    title: z.string(),
    creator: z.string(),
    subject: z.string(),
    description: z.string(),
    publisher: z.string(),
    contributor: z.string(),
    date: z.string(),
    type: z.string(),
    format: z.string(),
    identifier: z.string(),
    source: z.string(),
    language: z.string(),
    relation: z.string(),
    coverage: z.string(),
    rights: z.string(),
  })
  .partial()
