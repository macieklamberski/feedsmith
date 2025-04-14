import type { ParseFunction } from '../../../common/types.js'
import {
  createCaseInsensitiveGetter,
  isNonEmptyStringOrNumber,
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Attachment, Author, Feed, Hub, Item } from './types.js'

export const parseTags: ParseFunction<Array<string>> = (value) => {
  if (Array.isArray(value)) {
    return trimArray(value, parseString)
  }

  if (isNonEmptyStringOrNumber(value)) {
    return trimArray([value], parseString)
  }
}

export const parseAuthor: ParseFunction<Author> = (value) => {
  if (isObject(value)) {
    const get = createCaseInsensitiveGetter(value)
    const author = trimObject({
      name: parseString(get('name')),
      url: parseString(get('url')),
      avatar: parseString(get('avatar')),
    })

    return author
  }

  if (isNonEmptyStringOrNumber(value)) {
    return {
      name: parseString(value),
    }
  }
}

export const retrieveAuthors: ParseFunction<Array<Author>> = (value) => {
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

export const parseHub: ParseFunction<Hub> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const hub = {
    type: parseString(get('type')),
    url: parseString(get('url')),
  }

  if (isPresent(hub.type) || isPresent(hub.url)) {
    return trimObject(hub)
  }
}

export const parseAttachment: ParseFunction<Attachment> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const attachment = {
    url: parseString(get('url')),
    mime_type: parseString(get('mime_type')),
    title: parseString(get('title')),
    size_in_bytes: parseNumber(get('size_in_bytes')),
    duration_in_seconds: parseNumber(get('duration_in_seconds')),
  }

  if (isPresent(attachment.url)) {
    return trimObject(attachment)
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const item = {
    id: parseString(get('id')),
    url: parseString(get('url')),
    external_url: parseString(get('external_url')),
    title: parseString(get('title')),
    content_html: parseString(get('content_html')),
    content_text: parseString(get('content_text')),
    summary: parseString(get('summary')),
    image: parseString(get('image')),
    banner_image: parseString(get('banner_image')),
    date_published: parseString(get('date_published')),
    date_modified: parseString(get('date_modified')),
    tags: parseTags(get('tags')),
    authors: retrieveAuthors(value),
    language: parseString(get('language')),
    attachments: parseArrayOf(get('attachments'), parseAttachment),
  }

  if (isPresent(item.id)) {
    return trimObject(item)
  }
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const get = createCaseInsensitiveGetter(value)
  const feed = {
    version: parseString(get('version')),
    title: parseString(get('title')),
    home_page_url: parseString(get('home_page_url')),
    feed_url: parseString(get('feed_url')),
    description: parseString(get('description')),
    user_comment: parseString(get('user_comment')),
    next_url: parseString(get('next_url')),
    icon: parseString(get('icon')),
    favicon: parseString(get('favicon')),
    language: parseString(get('language')),
    expired: parseBoolean(get('expired')),
    hubs: parseArrayOf(get('hubs'), parseHub),
    authors: retrieveAuthors(value),
    items: parseArrayOf(get('items'), parseItem),
  }

  if (isPresent(feed.version) && isPresent(feed.title) && isPresent(feed.items)) {
    return trimObject(feed)
  }
}
