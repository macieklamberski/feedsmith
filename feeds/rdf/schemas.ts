import { z } from 'zod'
import { item as contentItem } from '../../namespaces/content/schemas'
import { itemOrFeed as dcItemOrFeed } from '../../namespaces/dc/schemas'
import { feed as syFeed } from '../../namespaces/sy/schemas'
import { entry as atomEntry, feed as atomFeed } from '../atom/schemas'

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
    atom: atomEntry,
    content: contentItem,
    dc: dcItemOrFeed,
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
    atom: atomFeed,
    dc: dcItemOrFeed,
    sy: syFeed,
  })
  .partial()
