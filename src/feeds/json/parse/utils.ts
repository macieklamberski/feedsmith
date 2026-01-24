import {
  isNonEmptyStringOrNumber,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  trimObject,
} from '../../../common/utils.js'
import type { ExtraFieldNames, Json, ParsePartialOptions } from '../common/types.js'

export const createCaseInsensitiveGetter = (value: Record<string, unknown>) => {
  return (requestedKey: string) => {
    if (requestedKey in value) {
      return value[requestedKey]
    }

    const lowerKey = requestedKey.toLowerCase()

    for (const key in value) {
      if (key.toLowerCase() === lowerKey) {
        return value[key]
      }
    }
  }
}

const preserveExtraFields = <T extends Record<string, unknown>>(
  source: Record<string, unknown>,
  target: T,
  extraFields?: ExtraFieldNames,
): T => {
  if (!extraFields || extraFields.length === 0) {
    return target
  }

  for (const field of extraFields) {
    if (field in source) {
      ;(target as Record<string, unknown>)[field] = source[field]
    }
  }

  return target
}

export const parseAuthor = <TExtra extends ExtraFieldNames = []>(
  value: unknown,
  options?: ParsePartialOptions<TExtra>,
): Partial<Json.Author<TExtra>> | undefined => {
  if (isObject(value)) {
    const get = createCaseInsensitiveGetter(value)
    const author = {
      name: parseSingularOf(get('name'), parseString),
      url: parseSingularOf(get('url'), parseString),
      avatar: parseSingularOf(get('avatar'), parseString),
    }

    preserveExtraFields(value, author, options?.extraFields)

    return trimObject(author) as Partial<Json.Author<TExtra>> | undefined
  }

  if (isNonEmptyStringOrNumber(value)) {
    const author = {
      name: parseString(value),
    }

    return trimObject(author) as Partial<Json.Author<TExtra>> | undefined
  }
}

export const retrieveAuthors = <TExtra extends ExtraFieldNames = []>(
  value: unknown,
  options?: ParsePartialOptions<TExtra>,
): Array<Partial<Json.Author<TExtra>>> | undefined => {
  if (!isObject(value)) {
    return
  }

  // Regardless of the JSON Feed version, the 'authors' property is returned in the item/feed.
  // Some feeds use author/authors incorrectly based on the feed version, so this function helps
  // to unify those into one value.
  const get = createCaseInsensitiveGetter(value)
  const parsedAuthors = parseArrayOf(get('authors'), (value) => parseAuthor(value, options))
  const parsedAuthor = parseArrayOf(get('author'), (value) => parseAuthor(value, options))

  return parsedAuthors?.length ? parsedAuthors : parsedAuthor
}

export const parseAttachment = <TExtra extends ExtraFieldNames = []>(
  value: unknown,
  options?: ParsePartialOptions<TExtra>,
): Partial<Json.Attachment<false, TExtra>> | undefined => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const attachment = {
    url: parseSingularOf(get('url'), parseString),
    mime_type: parseSingularOf(get('mime_type'), parseString),
    title: parseSingularOf(get('title'), parseString),
    size_in_bytes: parseSingularOf(get('size_in_bytes'), parseNumber),
    duration_in_seconds: parseSingularOf(get('duration_in_seconds'), parseNumber),
  }

  preserveExtraFields(value, attachment, options?.extraFields)

  return trimObject(attachment) as Partial<Json.Attachment<false, TExtra>> | undefined
}

export const parseItem = <TExtra extends ExtraFieldNames = []>(
  value: unknown,
  options?: ParsePartialOptions<TExtra>,
): Partial<Json.Item<string, false, TExtra>> | undefined => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const item = {
    id: parseSingularOf(get('id'), parseString),
    url: parseSingularOf(get('url'), parseString),
    external_url: parseSingularOf(get('external_url'), parseString),
    title: parseSingularOf(get('title'), parseString),
    content_html: parseSingularOf(get('content_html'), parseString),
    content_text: parseSingularOf(get('content_text'), parseString),
    summary: parseSingularOf(get('summary'), parseString),
    image: parseSingularOf(get('image'), parseString),
    banner_image: parseSingularOf(get('banner_image'), parseString),
    date_published: parseSingularOf(get('date_published'), parseDate),
    date_modified: parseSingularOf(get('date_modified'), parseDate),
    tags: parseArrayOf(get('tags'), parseString),
    authors: retrieveAuthors(value, options),
    language: parseSingularOf(get('language'), parseString),
    attachments: parseArrayOf(get('attachments'), (value) => parseAttachment(value, options)),
  }

  preserveExtraFields(value, item, options?.extraFields)

  return trimObject(item) as Partial<Json.Item<string, false, TExtra>> | undefined
}

export const parseHub = <TExtra extends ExtraFieldNames = []>(
  value: unknown,
  options?: ParsePartialOptions<TExtra>,
): Partial<Json.Hub<false, TExtra>> | undefined => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const hub = {
    type: parseSingularOf(get('type'), parseString),
    url: parseSingularOf(get('url'), parseString),
  }

  preserveExtraFields(value, hub, options?.extraFields)

  return trimObject(hub) as Partial<Json.Hub<false, TExtra>> | undefined
}

export const parseFeed = <TExtra extends ExtraFieldNames = []>(
  value: unknown,
  options?: ParsePartialOptions<TExtra>,
): Partial<Json.Feed<string, false, TExtra>> | undefined => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const feed = {
    title: parseSingularOf(get('title'), parseString),
    home_page_url: parseSingularOf(get('home_page_url'), parseString),
    feed_url: parseSingularOf(get('feed_url'), parseString),
    description: parseSingularOf(get('description'), parseString),
    user_comment: parseSingularOf(get('user_comment'), parseString),
    next_url: parseSingularOf(get('next_url'), parseString),
    icon: parseSingularOf(get('icon'), parseString),
    favicon: parseSingularOf(get('favicon'), parseString),
    language: parseSingularOf(get('language'), parseString),
    expired: parseSingularOf(get('expired'), parseBoolean),
    hubs: parseArrayOf(get('hubs'), (value) => parseHub(value, options)),
    authors: retrieveAuthors(value, options),
    items: parseArrayOf(get('items'), (value) => parseItem(value, options), options?.maxItems),
  }

  preserveExtraFields(value, feed, options?.extraFields)

  return trimObject(feed) as Partial<Json.Feed<string, false, TExtra>> | undefined
}
