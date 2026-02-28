import type { DateLike } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { ExtraFieldNames, GenerateUtil, Json } from '../common/types.js'

export const filterExtraFields = <T extends Record<string, unknown>>(
  source: T,
  extraFields?: ExtraFieldNames,
): Partial<T> => {
  if (!extraFields || extraFields.length === 0) {
    return {}
  }

  const result: Record<string, unknown> = {}

  for (const field of extraFields) {
    if (field in source) {
      result[field] = source[field]
    }
  }

  return result as Partial<T>
}

export const generateAuthor: GenerateUtil<Json.Author> = (author, options) => {
  if (!isObject(author)) {
    return
  }

  const value = {
    name: author.name,
    url: author.url,
    avatar: author.avatar,
    ...filterExtraFields(author, options?.extraFields),
  }

  return trimObject(value)
}

export const generateAttachment: GenerateUtil<Json.Attachment> = (attachment, options) => {
  if (!isObject(attachment)) {
    return
  }

  const value = {
    url: attachment.url,
    mime_type: attachment.mime_type,
    title: attachment.title,
    size_in_bytes: attachment.size_in_bytes,
    duration_in_seconds: attachment.duration_in_seconds,
    ...filterExtraFields(attachment, options?.extraFields),
  }

  return trimObject(value)
}

export const generateHub: GenerateUtil<Json.Hub> = (hub, options) => {
  if (!isObject(hub)) {
    return
  }

  const value = {
    type: hub.type,
    url: hub.url,
    ...filterExtraFields(hub, options?.extraFields),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<Json.Item<DateLike>> = (item, options) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    id: item.id,
    url: item.url,
    external_url: item.external_url,
    title: item.title,
    content_html: item.content_html,
    content_text: item.content_text,
    summary: item.summary,
    image: item.image,
    banner_image: item.banner_image,
    date_published: generateRfc3339Date(item.date_published),
    date_modified: generateRfc3339Date(item.date_modified),
    language: item.language,
    authors: trimArray(item.authors, (value) => generateAuthor(value, options)),
    tags: item.tags,
    attachments: trimArray(item.attachments, (value) => generateAttachment(value, options)),
    ...filterExtraFields(item, options?.extraFields),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<Json.Feed<DateLike>> = (feed, options) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    version: 'https://jsonfeed.org/version/1.1',
    title: feed.title,
    home_page_url: feed.home_page_url,
    feed_url: feed.feed_url,
    description: feed.description,
    user_comment: feed.user_comment,
    next_url: feed.next_url,
    icon: feed.icon,
    favicon: feed.favicon,
    language: feed.language,
    expired: feed.expired,
    hubs: trimArray(feed.hubs, (value) => generateHub(value, options)),
    authors: trimArray(feed.authors, (value) => generateAuthor(value, options)),
    items: trimArray(feed.items, (value) => generateItem(value, options)),
    ...filterExtraFields(feed, options?.extraFields),
  }

  return trimObject(value) as Record<string, unknown>
}
