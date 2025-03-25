import type { ParseFunction } from '../../common/types'
import {
  hasAllProps,
  hasAnyProps,
  isNonEmptyStringOrNumber,
  isObject,
  omitNullishFromArray,
  omitUndefinedFromObject,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
} from '../../common/utils'
import type { Attachment, Author, Feed, Hub, Item } from './types'

export const parseTags: ParseFunction<Array<string>> = (value) => {
  if (Array.isArray(value)) {
    return omitNullishFromArray(value.map((item) => parseString(item)))
  }

  if (isNonEmptyStringOrNumber(value)) {
    return omitNullishFromArray([parseString(value)])
  }
}

export const parseAuthor: ParseFunction<Author> = (value) => {
  if (isObject(value)) {
    const author = omitUndefinedFromObject({
      name: parseString(value.name),
      url: parseString(value.url),
      avatar: parseString(value.avatar),
    })

    return author.name || author.url || author.avatar ? author : undefined
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
  const parsedAuthors = parseArrayOf(value.authors, parseAuthor)
  const parsedAuthor = parseArrayOf(value.author, parseAuthor)

  return parsedAuthors?.length ? parsedAuthors : parsedAuthor
}

export const parseHub: ParseFunction<Hub> = (value) => {
  if (!isObject(value)) {
    return
  }

  const hub = omitUndefinedFromObject({
    type: parseString(value.type),
    url: parseString(value.url),
  })

  if (hasAnyProps(hub, ['type', 'url'])) {
    return hub
  }
}

export const parseAttachment: ParseFunction<Attachment> = (value) => {
  if (!isObject(value)) {
    return
  }

  const attachment = omitUndefinedFromObject({
    url: parseString(value.url),
    mime_type: parseString(value.mime_type),
    title: parseString(value.title),
    size_in_bytes: parseNumber(value.size_in_bytes),
    duration_in_seconds: parseNumber(value.duration_in_seconds),
  })

  // TODO: Consider checking if URL has value before parsing the whole object.
  if (hasAllProps(attachment, ['url'])) {
    return attachment
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = omitUndefinedFromObject({
    id: parseString(value.id),
    url: parseString(value.url),
    external_url: parseString(value.external_url),
    title: parseString(value.title),
    content_html: parseString(value.content_html),
    content_text: parseString(value.content_text),
    summary: parseString(value.summary),
    image: parseString(value.image),
    banner_image: parseString(value.banner_image),
    date_published: parseString(value.date_published),
    date_modified: parseString(value.date_modified),
    tags: parseTags(value.tags),
    authors: retrieveAuthors(value),
    language: parseString(value.language),
    attachments: parseArrayOf(value.attachments, parseAttachment),
  })

  // TODO: Consider checking if ID has value before parsing the whole object.
  if (hasAllProps(item, ['id'])) {
    return item
  }
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = omitUndefinedFromObject({
    version: parseString(value.version),
    title: parseString(value.title),
    home_page_url: parseString(value.home_page_url),
    feed_url: parseString(value.feed_url),
    description: parseString(value.description),
    user_comment: parseString(value.user_comment),
    next_url: parseString(value.next_url),
    icon: parseString(value.icon),
    favicon: parseString(value.favicon),
    language: parseString(value.language),
    expired: parseBoolean(value.expired),
    hubs: parseArrayOf(value.hubs, parseHub),
    authors: retrieveAuthors(value),
    items: parseArrayOf(value.items, parseItem),
  })

  // TODO: Consider checking if version, title and items have value before parsing the whole object.
  if (hasAllProps(feed, ['version', 'title', 'items'])) {
    return feed
  }
}
