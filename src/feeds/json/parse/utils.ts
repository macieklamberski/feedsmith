import type { ParseOptions, ParsePartialUtil } from '../../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseJsonString,
  parseNumber,
  parseSingularOf,
  trimObject,
} from '../../../common/utils.js'
import type { Json } from '../common/types.js'

export const createCaseInsensitiveGetter = (value: Record<string, unknown>) => {
  return (requestedKey: string) => {
    if (requestedKey in value) {
      return value[requestedKey]
    }

    const lowerKey = requestedKey.toLowerCase()

    // biome-ignore lint/suspicious/noForIn: Plain object; avoids per-call Object.keys allocation.
    for (const key in value) {
      if (key.toLowerCase() === lowerKey) {
        return value[key]
      }
    }
  }
}

export const parseAuthor: ParsePartialUtil<Json.Author> = (value) => {
  if (isObject(value)) {
    const get = createCaseInsensitiveGetter(value)
    const author = {
      name: parseSingularOf(get('name'), parseJsonString),
      url: parseSingularOf(get('url'), parseJsonString),
      avatar: parseSingularOf(get('avatar'), parseJsonString),
    }

    return trimObject(author)
  }

  if (isNonEmptyStringOrNumber(value)) {
    const author = {
      name: parseJsonString(value),
    }

    return trimObject(author)
  }
}

export const retrieveAuthors: ParsePartialUtil<Array<Json.Author>> = (value) => {
  if (!isObject(value)) {
    return
  }

  // Regardless of the JSON Feed version, the 'authors' property is returned in the item/feed.
  // Some feeds use author/authors incorrectly based on the feed version, so this function helps
  // to unify those into one value.
  const get = createCaseInsensitiveGetter(value)
  const parsedAuthors = parseArrayOf(get('authors'), parseAuthor)
  const parsedAuthor = parseArrayOf(get('author'), parseAuthor)

  return parsedAuthors?.length ? parsedAuthors : parsedAuthor
}

export const parseAttachment: ParsePartialUtil<Json.Attachment> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const attachment = {
    url: parseSingularOf(get('url'), parseJsonString),
    mime_type: parseSingularOf(get('mime_type'), parseJsonString),
    title: parseSingularOf(get('title'), parseJsonString),
    size_in_bytes: parseSingularOf(get('size_in_bytes'), parseNumber),
    duration_in_seconds: parseSingularOf(get('duration_in_seconds'), parseNumber),
  }

  return trimObject(attachment)
}

export const parseItem: ParsePartialUtil<Json.Item<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const item = {
    id: parseSingularOf(get('id'), parseJsonString),
    url: parseSingularOf(get('url'), parseJsonString),
    external_url: parseSingularOf(get('external_url'), parseJsonString),
    title: parseSingularOf(get('title'), parseJsonString),
    content_html: parseSingularOf(get('content_html'), parseJsonString),
    content_text: parseSingularOf(get('content_text'), parseJsonString),
    summary: parseSingularOf(get('summary'), parseJsonString),
    image: parseSingularOf(get('image'), parseJsonString),
    banner_image: parseSingularOf(get('banner_image'), parseJsonString),
    date_published: parseSingularOf(get('date_published'), parseDate),
    date_modified: parseSingularOf(get('date_modified'), parseDate),
    tags: parseArrayOf(get('tags'), parseJsonString),
    authors: retrieveAuthors(value),
    language: parseSingularOf(get('language'), parseJsonString),
    attachments: parseArrayOf(get('attachments'), parseAttachment),
  }

  return trimObject(item)
}

export const parseHub: ParsePartialUtil<Json.Hub> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const hub = {
    type: parseSingularOf(get('type'), parseJsonString),
    url: parseSingularOf(get('url'), parseJsonString),
  }

  return trimObject(hub)
}

export const parseFeed: ParsePartialUtil<Json.Feed<string>, ParseOptions> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const feed = {
    title: parseSingularOf(get('title'), parseJsonString),
    home_page_url: parseSingularOf(get('home_page_url'), parseJsonString),
    feed_url: parseSingularOf(get('feed_url'), parseJsonString),
    description: parseSingularOf(get('description'), parseJsonString),
    user_comment: parseSingularOf(get('user_comment'), parseJsonString),
    next_url: parseSingularOf(get('next_url'), parseJsonString),
    icon: parseSingularOf(get('icon'), parseJsonString),
    favicon: parseSingularOf(get('favicon'), parseJsonString),
    language: parseSingularOf(get('language'), parseJsonString),
    expired: parseSingularOf(get('expired'), parseBoolean),
    hubs: parseArrayOf(get('hubs'), parseHub),
    authors: retrieveAuthors(value),
    items: parseArrayOf(get('items'), parseItem, options?.maxItems),
  }

  return trimObject(feed)
}
