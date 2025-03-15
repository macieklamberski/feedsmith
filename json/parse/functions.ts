import { decode } from 'html-entities'
import type {
  NonStrictParseLevel,
  ParseFunction,
  ParsedAttachment,
  ParsedAuthor,
  ParsedFeed,
  ParsedHub,
  ParsedItem,
} from './types'

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

export const isNonEmptyStringOrNumber = (value: unknown): value is string | number => {
  return value !== '' && (typeof value === 'string' || typeof value === 'number')
}

export const omitNullish = <T>(array: Array<T | null | undefined>): Array<T> => {
  return array.filter((item): item is T => item !== null && item !== undefined)
}

export const parseString: ParseFunction<string> = (value, level) => {
  if (typeof value === 'number') {
    return level === 'coerce' ? value.toString() : undefined
  }

  if (typeof value === 'string') {
    return decode(value)
  }

  return undefined
}

export const parseNumber: ParseFunction<number> = (value, level) => {
  if (typeof value === 'number') {
    return value
  }

  if (level === 'coerce' && typeof value === 'string') {
    const numeric = Number(value)

    return Number.isNaN(numeric) ? undefined : numeric
  }

  return undefined
}

export const parseBoolean: ParseFunction<boolean> = (value, level) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (level === 'coerce' && value === 'true') {
    return true
  }

  if (level === 'coerce' && value === 'false') {
    return false
  }

  return undefined
}

export const parseArray: ParseFunction<Array<unknown>> = (value, level) => {
  if (Array.isArray(value)) {
    return value
  }

  if (level === 'skip' || !isObject(value)) {
    return undefined
  }

  if (value.length) {
    return Array.from(value as unknown as ArrayLike<unknown>)
  }

  const keys = Object.keys(value)

  if (keys.length === 0) {
    return undefined
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const n = Number(key)

    if (!Number.isInteger(n) || n !== i) {
      return undefined
    }
  }

  return Object.values(value)
}

export const parseArrayOf = <P>(
  value: unknown,
  parse: ParseFunction<P>,
  level: NonStrictParseLevel,
): Array<P> | undefined => {
  const array = parseArray(value, level)

  if (array) {
    return omitNullish(array.map((item) => parse(item, level)))
  }

  if (level === 'coerce') {
    const parsed = parse(value, level)

    return parsed ? [parsed] : undefined
  }

  return undefined
}

export const parseTags: ParseFunction<Array<string>> = (value, level) => {
  if (Array.isArray(value)) {
    return omitNullish(value.map((item) => parseString(item, level)))
  }

  if (level === 'coerce' && isNonEmptyStringOrNumber(value)) {
    return omitNullish([parseString(value, level)])
  }

  return undefined
}

export const parseAuthor: ParseFunction<ParsedAuthor> = (value, level) => {
  if (isObject(value)) {
    const author = {
      name: parseString(value.name, level),
      url: parseString(value.url, level),
      avatar: parseString(value.avatar, level),
    }

    return author.name || author.url || author.avatar ? author : undefined
  }

  if (level === 'coerce' && Array.isArray(value)) {
    return omitNullish(value.map((item) => parseAuthor(item, level)))[0]
  }

  if (level === 'coerce' && isNonEmptyStringOrNumber(value)) {
    return {
      name: parseString(value, level),
    }
  }

  return undefined
}

export const parseHub: ParseFunction<ParsedHub> = (value, level) => {
  if (!isObject(value)) {
    return undefined
  }

  const hub = {
    type: parseString(value.type, level),
    url: parseString(value.url, level),
  }

  return hub.type || hub.url ? hub : undefined
}

export const parseAttachment: ParseFunction<ParsedAttachment> = (value, level) => {
  if (!isObject(value)) {
    return undefined
  }

  const attachment = {
    url: parseString(value.url, level),
    mime_type: parseString(value.mime_type, level),
    title: parseString(value.title, level),
    size_in_bytes: parseNumber(value.size_in_bytes, level),
    duration_in_seconds: parseNumber(value.duration_in_seconds, level),
  }

  // TODO: Consider checking if URL has value before parsing the whole object.
  return attachment.url ? attachment : undefined
}

export const parseItem: ParseFunction<ParsedItem> = (value, level) => {
  if (!isObject(value)) {
    return undefined
  }

  const item = {
    id: parseString(value.id, level),
    url: parseString(value.url, level),
    external_url: parseString(value.external_url, level),
    title: parseString(value.title, level),
    content_html: parseString(value.content_html, level),
    content_text: parseString(value.content_text, level),
    summary: parseString(value.summary, level),
    image: parseString(value.image, level),
    banner_image: parseString(value.banner_image, level),
    date_published: parseString(value.date_published, level),
    date_modified: parseString(value.date_modified, level),
    tags: parseTags(value.tags, level),
    author: parseAuthor(value.author, level),
    authors: parseArrayOf(value.authors, parseAuthor, level),
    language: parseString(value.language, level),
    attachments: parseArrayOf(value.attachments, parseAttachment, level),
  }

  // TODO: Consider checking if ID has value before parsing the whole object.
  return item.id ? item : undefined
}

export const parseFeed: ParseFunction<ParsedFeed> = (value, level) => {
  if (!isObject(value)) {
    return undefined
  }

  const feed = {
    version: parseString(value.version, level),
    title: parseString(value.title, level),
    home_page_url: parseString(value.home_page_url, level),
    feed_url: parseString(value.feed_url, level),
    description: parseString(value.description, level),
    user_comment: parseString(value.user_comment, level),
    next_url: parseString(value.next_url, level),
    icon: parseString(value.icon, level),
    favicon: parseString(value.favicon, level),
    language: parseString(value.language, level),
    expired: parseBoolean(value.expired, level),
    hubs: parseArrayOf(value.hubs, parseHub, level),
    author: parseAuthor(value.author, level),
    authors: parseArrayOf(value.authors, parseAuthor, level),
    items: parseArrayOf(value.items, parseItem, level),
  }

  // TODO: Consider checking if version, title and items have value before parsing the whole object.
  return feed.version !== undefined && feed.title !== undefined && feed.items !== undefined
    ? feed
    : undefined
}
