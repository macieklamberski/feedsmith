import { z } from 'zod'

// In the Atom specification, the text construct is represented by the { type, text } object.
// For simplicity's sake, a string is used for now, but this may be reconsidered in the future.
export const plainText = z.string()

export const text = z.object({
  type: z.string(), // Atom 1.0.
  text: z.string(), // Atom 1.0.
  html: z.string(), // Atom 1.0.
  xhtml: z.any(), // Atom 1.0.
  src: z.string(), // Atom 1.0.
  mode: z.string(), // Atom 0.3.
  xml: z.any(), // Atom 0.3.
  escaped: z.string(), // Atom 0.3.
  base64: z.string(), // Atom 0.3.
})

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
    rights: plainText,
    subtitle: plainText,
    title: plainText,
    updated: z.string(),
  })
  .partial()

export const entry = z
  .object({
    authors: z.array(person),
    categories: z.array(category),
    content: plainText,
    contributors: z.array(person),
    id: z.string(),
    links: z.array(link),
    published: z.string(),
    rights: plainText,
    source,
    summary: plainText,
    title: plainText,
    updated: z.string(),
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
    rights: plainText,
    subtitle: plainText,
    title: plainText,
    updated: z.string(),
    entries: z.array(entry),
  })
  .partial()
