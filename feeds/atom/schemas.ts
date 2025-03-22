import { z } from 'zod'
import { itemOrFeed as dcItemOrFeed } from '../../namespaces/dc/schemas'
import { feed as syFeed } from '../../namespaces/sy/schemas'

// In the Atom specification, the text construct is represented by the { type, text, url } object.
// For simplicity's sake, a string is used for now, but this may be reconsidered in the future.
export const text = z.string()

export const link = z
  .object({
    href: z.string(),
    rel: z.string(),
    type: z.string(),
    hreflang: z.string(),
    title: z.string(),
    length: z.number(),
  })
  .partial()

export const person = z
  .object({
    name: z.string(),
    uri: z.string(),
    email: z.string(),
  })
  .partial()

export const category = z
  .object({
    term: z.string(),
    scheme: z.string(),
    label: z.string(),
  })
  .partial()

export const generator = z
  .object({
    text: z.string(),
    uri: z.string(),
    version: z.string(),
  })
  .partial()

export const source = z
  .object({
    authors: z.array(person),
    categories: z.array(category),
    contributors: z.array(person),
    generator,
    icon: z.string(),
    id: z.string(),
    links: z.array(link),
    logo: z.string(),
    rights: text,
    subtitle: text,
    title: text,
    updated: z.string(),
  })
  .partial()

export const entry = z
  .object({
    authors: z.array(person),
    categories: z.array(category),
    content: text,
    contributors: z.array(person),
    id: z.string(),
    links: z.array(link),
    published: z.string(),
    rights: text,
    source,
    summary: text,
    title: text,
    updated: z.string(),
    dc: dcItemOrFeed,
  })
  .partial()

export const feed = z
  .object({
    authors: z.array(person),
    categories: z.array(category),
    contributors: z.array(person),
    generator,
    icon: z.string(),
    id: z.string(),
    links: z.array(link),
    logo: z.string(),
    rights: text,
    subtitle: text,
    title: text,
    updated: z.string(),
    entries: z.array(entry),
    dc: dcItemOrFeed,
    sy: syFeed,
  })
  .partial()
