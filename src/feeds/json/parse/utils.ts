import type { ParseOptions, ParsePartialUtil } from '../../../common/types.js'
import {
  createCaseInsensitiveGetter,
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
import type { Json } from '../common/types.js'

export const parseAuthor: ParsePartialUtil<Json.Author> = (value) => {
  if (isObject(value)) {
    const get = createCaseInsensitiveGetter(value)
    const author = {
      name: parseSingularOf(get('name'), parseString),
      url: parseSingularOf(get('url'), parseString),
      avatar: parseSingularOf(get('avatar'), parseString),
    }

    return trimObject(author)
  }

  if (isNonEmptyStringOrNumber(value)) {
    const author = {
      name: parseString(value),
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
    url: parseSingularOf(get('url'), parseString),
    mime_type: parseSingularOf(get('mime_type'), parseString),
    title: parseSingularOf(get('title'), parseString),
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
    authors: retrieveAuthors(value),
    language: parseSingularOf(get('language'), parseString),
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
    type: parseSingularOf(get('type'), parseString),
    url: parseSingularOf(get('url'), parseString),
  }

  return trimObject(hub)
}

export const parseFeed: ParsePartialUtil<Json.Feed<string>, ParseOptions> = (value, options) => {
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
    hubs: parseArrayOf(get('hubs'), parseHub),
    authors: retrieveAuthors(value),
    items: parseArrayOf(get('items'), parseItem, options?.maxItems),
  }

  return trimObject(feed)
}
