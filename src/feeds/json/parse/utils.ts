import { isPlainObject } from 'trousse'
import type { DateAny } from '../../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseVerbatimString,
  trimObject,
} from '../../../common/utils.js'
import type { JsonFeed, ParseUtilPartial } from '../common/types.js'

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

export const parseAuthor: ParseUtilPartial<JsonFeed.Author> = (value) => {
  if (isPlainObject(value)) {
    const get = createCaseInsensitiveGetter(value)
    const author = {
      name: parseSingularOf(get('name'), parseVerbatimString),
      url: parseSingularOf(get('url'), parseVerbatimString),
      avatar: parseSingularOf(get('avatar'), parseVerbatimString),
    }

    return trimObject(author)
  }

  if (isNonEmptyStringOrNumber(value)) {
    const author = {
      name: parseVerbatimString(value),
    }

    return trimObject(author)
  }
}

export const retrieveAuthors: ParseUtilPartial<Array<JsonFeed.Author>> = (value) => {
  if (!isPlainObject(value)) {
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

export const parseAttachment: ParseUtilPartial<JsonFeed.Attachment> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const attachment = {
    url: parseSingularOf(get('url'), parseVerbatimString),
    mime_type: parseSingularOf(get('mime_type'), parseVerbatimString),
    title: parseSingularOf(get('title'), parseVerbatimString),
    size_in_bytes: parseSingularOf(get('size_in_bytes'), parseNumber),
    duration_in_seconds: parseSingularOf(get('duration_in_seconds'), parseNumber),
  }

  return trimObject(attachment)
}

export const parseItem: ParseUtilPartial<JsonFeed.Item<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const item = {
    id: parseSingularOf(get('id'), parseVerbatimString),
    url: parseSingularOf(get('url'), parseVerbatimString),
    external_url: parseSingularOf(get('external_url'), parseVerbatimString),
    title: parseSingularOf(get('title'), parseVerbatimString),
    content_html: parseSingularOf(get('content_html'), parseVerbatimString),
    content_text: parseSingularOf(get('content_text'), parseVerbatimString),
    summary: parseSingularOf(get('summary'), parseVerbatimString),
    image: parseSingularOf(get('image'), parseVerbatimString),
    banner_image: parseSingularOf(get('banner_image'), parseVerbatimString),
    date_published: parseSingularOf(get('date_published'), (value) =>
      parseDate(value, options?.parseDateFn),
    ),
    date_modified: parseSingularOf(get('date_modified'), (value) =>
      parseDate(value, options?.parseDateFn),
    ),
    tags: parseArrayOf(get('tags'), parseVerbatimString),
    authors: retrieveAuthors(value),
    language: parseSingularOf(get('language'), parseVerbatimString),
    attachments: parseArrayOf(get('attachments'), parseAttachment),
  }

  return trimObject(item)
}

export const parseHub: ParseUtilPartial<JsonFeed.Hub> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const hub = {
    type: parseSingularOf(get('type'), parseVerbatimString),
    url: parseSingularOf(get('url'), parseVerbatimString),
  }

  return trimObject(hub)
}

export const parseFeed: ParseUtilPartial<JsonFeed.Feed<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const feed = {
    title: parseSingularOf(get('title'), parseVerbatimString),
    home_page_url: parseSingularOf(get('home_page_url'), parseVerbatimString),
    feed_url: parseSingularOf(get('feed_url'), parseVerbatimString),
    description: parseSingularOf(get('description'), parseVerbatimString),
    user_comment: parseSingularOf(get('user_comment'), parseVerbatimString),
    next_url: parseSingularOf(get('next_url'), parseVerbatimString),
    icon: parseSingularOf(get('icon'), parseVerbatimString),
    favicon: parseSingularOf(get('favicon'), parseVerbatimString),
    language: parseSingularOf(get('language'), parseVerbatimString),
    expired: parseSingularOf(get('expired'), parseBoolean),
    hubs: parseArrayOf(get('hubs'), parseHub),
    authors: retrieveAuthors(value),
    items: parseArrayOf(get('items'), (value) => parseItem(value, options), options?.maxItems),
  }

  return trimObject(feed)
}
