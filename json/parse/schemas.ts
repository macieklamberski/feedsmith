import { z } from 'zod'

// TODO: Add option to define custom fields starting with underscore. Those fields should not be
// stripped from the object when parsing and should not raise validation errors if they start with
// the correct underscore character. For any custom fields not starting with underscore raise an
// error. More details here: https://www.jsonfeed.org/version/1.1/#extensions-a-name-extensions-a.

export const parsedAuthor = z
  .object({
    name: z.string(),
    url: z.string(),
    avatar: z.string(),
  })
  .partial()

export const parsedAttachment = z
  .object({
    url: z.string(),
    mime_type: z.string(),
    title: z.string(),
    size_in_bytes: z.number(),
    duration_in_seconds: z.number(),
  })
  .partial()

export const parsedItem = z
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
    authors: z.array(parsedAuthor),
    language: z.string(),
    attachments: z.array(parsedAttachment),
  })
  .partial()

export const parsedHub = z
  .object({
    type: z.string(),
    url: z.string(),
  })
  .partial()

export const parsedFeed = z
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
    hubs: z.array(parsedHub),
    authors: z.array(parsedAuthor),
    items: z.array(parsedItem),
  })
  .partial()
