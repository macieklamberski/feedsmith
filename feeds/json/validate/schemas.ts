import { z } from 'zod'

// TODO: Add option to define custom fields starting with underscore. Those fields should not be
// stripped from the object when parsing and should not raise validation errors if they start with
// the correct underscore character. For any custom fields not starting with underscore raise an
// error. More details here: https://www.jsonfeed.org/version/1.1/#extensions-a-name-extensions-a.

const validatedAuthorBase = z.object({
  name: z.string(),
  url: z.string().url().optional(),
  avatar: z.string().url().optional(),
})

const validatedAttachmentBase = z.object({
  url: z.string().url(),
  mime_type: z.string(),
  title: z.string().optional(),
  size_in_bytes: z.coerce.number().int().optional(),
  duration_in_seconds: z.coerce.number().int().optional(),
})

const validatedItemBase = z.object({
  id: z.string(),
  url: z.string().url().optional(),
  external_url: z.string().url().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  image: z.string().url().optional(),
  banner_image: z.string().url().optional(),
  date_published: z.string().optional(),
  date_modified: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(validatedAttachmentBase).optional(),
})

const validatedHubBase = z.object({
  type: z.string(),
  url: z.string().url(),
})

const validatedFeedBase = z.object({
  title: z.string(),
  home_page_url: z.string().url().optional(),
  feed_url: z.string().url().optional(),
  description: z.string().optional(),
  user_comment: z.string().optional(),
  next_url: z.string().url().optional(),
  icon: z.string().url().optional(),
  favicon: z.string().url().optional(),
  expired: z.boolean().optional(),
  hubs: z.array(validatedHubBase).optional(),
})

export const validatedItemContent = z
  .object({
    content_html: z.string().optional(),
    content_text: z.string().optional(),
  })
  .refine((data) => Boolean(data.content_html || data.content_text), {
    message: "At least one of 'content_html' or 'content_text' must be provided",
    path: ['content_text'],
  })

export const validatedItem1 = validatedItemBase
  .extend({
    author: validatedAuthorBase.optional(),
  })
  .and(validatedItemContent)

export const validatedFeed1 = validatedFeedBase.extend({
  version: z.literal('https://jsonfeed.org/version/1'),
  author: validatedAuthorBase.optional(),
  items: z.array(validatedItem1),
})

export const validatedItem11 = validatedItemBase
  .extend({
    authors: z.array(validatedAuthorBase).optional(),
    language: z.string().optional(),
  })
  .and(validatedItemContent)

export const validatedFeed11 = validatedFeedBase.extend({
  version: z.literal('https://jsonfeed.org/version/1.1'),
  authors: z.array(validatedAuthorBase).optional(),
  language: z.string().optional(),
  items: z.array(validatedItem11),
})

export const validatedFeed = z.discriminatedUnion('version', [validatedFeed1, validatedFeed11])
