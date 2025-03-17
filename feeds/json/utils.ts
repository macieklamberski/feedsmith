import {
  hasAllProps,
  hasAnyProps,
  isNonEmptyStringOrNumber,
  isObject,
  omitNullish,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
} from '../../common/utils'
import type { ParseFunction } from '../../common/types'
import type { Attachment, Author, Feed, Hub, Item } from './types'

export const parseTags: ParseFunction<Array<string>> = (value, level) => {
  if (Array.isArray(value)) {
    return omitNullish(value.map((item) => parseString(item, level)))
  }

  if (level === 'coerce' && isNonEmptyStringOrNumber(value)) {
    return omitNullish([parseString(value, level)])
  }
}

export const parseAuthor: ParseFunction<Author> = (value, level) => {
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
}

export const parseAuthors: ParseFunction<Array<Author>> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  // Regardless of the JSON Feed version, the 'authors' property is returned in the item/feed.
  // Some feeds use author/authors incorrectly based on the feed version, so this function helps
  // to unify those into one value.
  const parsedAuthors = parseArrayOf(value.authors, parseAuthor, level, true)
  const parsedAuthor = parseArrayOf(value.author, parseAuthor, level, true)

  return parsedAuthors?.length ? parsedAuthors : parsedAuthor
}

export const parseHub: ParseFunction<Hub> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const hub = {
    type: parseString(value.type, level),
    url: parseString(value.url, level),
  }

  if (hasAnyProps(hub, ['type', 'url'])) {
    return hub
  }
}

export const parseAttachment: ParseFunction<Attachment> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const attachment = {
    url: parseString(value.url, level),
    mime_type: parseString(value.mime_type, level),
    title: parseString(value.title, level),
    size_in_bytes: parseNumber(value.size_in_bytes, level),
    duration_in_seconds: parseNumber(value.duration_in_seconds, level),
  }

  // TODO: Consider checking if URL has value before parsing the whole object.
  if (hasAllProps(attachment, ['url'])) {
    return attachment
  }
}

export const parseItem: ParseFunction<Item> = (value, level) => {
  if (!isObject(value)) {
    return
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
    authors: parseAuthors(value, level),
    language: parseString(value.language, level),
    attachments: parseArrayOf(value.attachments, parseAttachment, level),
  }

  // TODO: Consider checking if ID has value before parsing the whole object.
  if (hasAllProps(item, ['id'])) {
    return item
  }
}

export const parseFeed: ParseFunction<Feed> = (value, level) => {
  if (!isObject(value)) {
    return
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
    authors: parseAuthors(value, level),
    items: parseArrayOf(value.items, parseItem, level),
  }

  // TODO: Consider checking if version, title and items have value before parsing the whole object.
  if (hasAllProps(feed, ['version', 'title', 'items'])) {
    return feed
  }
}
