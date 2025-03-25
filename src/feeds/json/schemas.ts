import { z } from 'zod'

export const author = z
  .object({
    name: z.string(),
    url: z.string(),
    avatar: z.string(),
  })
  .partial()

export const attachment = z
  .object({
    url: z.string(),
    mime_type: z.string(),
    title: z.string(),
    size_in_bytes: z.number(),
    duration_in_seconds: z.number(),
  })
  .partial()

export const item = z
  .object({
    id: z.string(),
    url: z.string(),
    external_url: z.string(),
    title: z.string(),
    content_html: z.string(),
    content_text: z.string(),
    summary: z.string(),
    image: z.string(),
    banner_image: z.string(),
    date_published: z.string(),
    date_modified: z.string(),
    tags: z.array(z.string()),
    authors: z.array(author),
    language: z.string(),
    attachments: z.array(attachment),
  })
  .partial()

export const hub = z
  .object({
    type: z.string(),
    url: z.string(),
  })
  .partial()

export const feed = z
  .object({
    version: z.string(),
    title: z.string(),
    home_page_url: z.string(),
    feed_url: z.string(),
    description: z.string(),
    user_comment: z.string(),
    next_url: z.string(),
    icon: z.string(),
    favicon: z.string(),
    language: z.string(),
    expired: z.boolean(),
    hubs: z.array(hub),
    authors: z.array(author),
    items: z.array(item),
  })
  .partial()
