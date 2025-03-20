import { z } from 'zod'
import { item as contentNamespaceItem } from '../../namespaces/content/schemas'
import { dublinCore as dublinCoreNamespace } from '../../namespaces/dc/schemas'
import { feed as syndicationNamespaceFeed } from '../../namespaces/sy/schemas'

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
    content: contentNamespaceItem,
    dc: dublinCoreNamespace,
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
    dc: dublinCoreNamespace,
    sy: syndicationNamespaceFeed,
  })
  .partial()
