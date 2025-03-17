import { z } from 'zod'

// TODO: Consider replacing this with breaking up the author string to { name, email }.
export const author = z.string()

export const category = z
  .object({
    name: z.string(),
    domain: z.string(),
  })
  .partial()

export const cloud = z
  .object({
    domain: z.string(),
    port: z.number(),
    path: z.string(),
    registerProcedure: z.string(),
    protocol: z.string(),
  })
  .partial()

export const enclosure = z
  .object({
    url: z.string(),
    length: z.number(),
    type: z.string(),
  })
  .partial()

export const source = z
  .object({
    title: z.string(),
    url: z.string(),
  })
  .partial()

export const image = z
  .object({
    url: z.string(),
    title: z.string(),
    link: z.string(),
    description: z.string(),
    height: z.number(),
    width: z.number(),
  })
  .partial()

export const textInput = z
  .object({
    title: z.string(),
    description: z.string(),
    name: z.string(),
    link: z.string(),
  })
  .partial()

export const itemMedia = z
  .object({
    image: z.string(),
    length: z.number(),
    mimetype: z.string(),
    title: z.string(),
    type: z.string(),
    link: z.string(),
  })
  .partial()

export const item = z
  .object({
    title: z.string(),
    link: z.string(),
    description: z.string(),
    authors: z.array(author),
    categories: z.array(category),
    comments: z.string(),
    enclosure,
    guid: z.string(),
    pubDate: z.string(),
    source,
  })
  .partial()

export const feed = z
  .object({
    title: z.string(),
    link: z.string(),
    description: z.string(),
    language: z.string(),
    copyright: z.string(),
    managingEditor: z.string(),
    webMaster: z.string(),
    pubDate: z.string(),
    lastBuildDate: z.string(),
    authors: z.array(z.string()),
    categories: z.array(category),
    generator: z.string(),
    docs: z.string(),
    cloud,
    ttl: z.number(),
    image,
    rating: z.string(),
    textInput,
    skipHours: z.array(z.number()),
    skipDays: z.array(z.string()),
    items: z.array(item),
  })
  .partial()
