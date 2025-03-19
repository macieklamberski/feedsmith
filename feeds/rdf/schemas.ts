import { z } from 'zod'

export const image = z
  .object({
    title: z.string(),
    link: z.string(),
    url: z.string(),
  })
  .partial()

export const textinput = z
  .object({
    title: z.string(),
    description: z.string(),
    name: z.string(),
    link: z.string(),
  })
  .partial()

export const item = z
  .object({
    title: z.string(),
    link: z.string(),
    description: z.string(),
  })
  .partial()

export const feed = z
  .object({
    title: z.string(),
    link: z.string(),
    description: z.string(),
    image,
    items: z.array(item),
    textinput,
  })
  .partial()
