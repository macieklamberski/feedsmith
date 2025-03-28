import type { ParseFunction } from '../../../common/types'
import {
  hasAllProps,
  hasAnyProps,
  isObject,
  omitNullishFromArray,
  omitUndefinedFromObject,
  parseArrayOf,
  parseNumber,
  parseString,
} from '../../../common/utils'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../namespaces/atom/utils'
import { parseItem as parseContentItem } from '../../../namespaces/content/utils'
import { parseItemOrFeed as parseDcItemOrFeed } from '../../../namespaces/dc/utils'
import { parseFeed as parseSyFeed } from '../../../namespaces/sy/utils'
import type {
  Author,
  Category,
  Cloud,
  Enclosure,
  Feed,
  Image,
  Item,
  Source,
  TextInput,
} from './types'

export const parseTextInput: ParseFunction<TextInput> = (value) => {
  if (!isObject(value)) {
    return
  }

  const textInput = omitUndefinedFromObject({
    title: parseString(value?.title?.['#text']),
    description: parseString(value?.description?.['#text']),
    name: parseString(value?.name?.['#text']),
    link: parseString(value?.link?.['#text']),
  })

  if (hasAllProps(textInput, ['title', 'description', 'name', 'link'])) {
    return textInput
  }
}

export const parseCloud: ParseFunction<Cloud> = (value) => {
  if (!isObject(value)) {
    return
  }

  const cloud = omitUndefinedFromObject({
    domain: parseString(value?.['@domain']),
    port: parseNumber(value?.['@port']),
    path: parseString(value?.['@path']),
    registerProcedure: parseString(value?.['@registerprocedure']),
    protocol: parseString(value?.['@protocol']),
  })

  if (hasAllProps(cloud, ['domain', 'port', 'path', 'registerProcedure', 'protocol'])) {
    return cloud
  }
}

export const parseSkipHours: ParseFunction<Array<number>> = (value) => {
  const hours = value?.hour

  if (!Array.isArray(hours)) {
    return
  }

  return omitNullishFromArray(hours.map((hour) => parseNumber(hour?.['#text'])))
}

export const parseSkipDays: ParseFunction<Array<string>> = (value) => {
  const days = value?.day

  if (!Array.isArray(days)) {
    return
  }

  return omitNullishFromArray(days.map((hour) => parseString(hour?.['#text'])))
}

export const parseEnclosure: ParseFunction<Enclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const enclosure = omitUndefinedFromObject({
    url: parseString(value['@url']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
  })

  if (hasAllProps(enclosure, ['url', 'length', 'type'])) {
    return enclosure
  }
}

export const parseSource: ParseFunction<Source> = (value) => {
  if (!isObject(value)) {
    return
  }

  const source = omitUndefinedFromObject({
    title: parseString(value?.['#text']),
    url: parseString(value?.['@url']),
  })

  if (hasAllProps(source, ['title'])) {
    return source
  }
}

export const parseImage: ParseFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = omitUndefinedFromObject({
    url: parseString(value.url?.['#text']),
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    description: parseString(value.description?.['#text']),
    height: parseNumber(value.height?.['#text']),
    width: parseNumber(value.width?.['#text']),
  })

  if (hasAllProps(image, ['url', 'title', 'link'])) {
    return image
  }
}

export const parseCategory: ParseFunction<Category> = (value) => {
  if (!isObject(value)) {
    return
  }

  const category = omitUndefinedFromObject({
    name: parseString(value?.['#text']),
    domain: parseString(value?.['@domain']),
  })

  if (category.name) {
    return category
  }
}

export const parseAuthor: ParseFunction<Author> = (value) => {
  return parseString(value?.['#text'])
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = omitUndefinedFromObject({
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    description: parseString(value.description?.['#text']),
    authors: parseArrayOf(value.author, parseAuthor),
    categories: parseArrayOf(value.category, parseCategory),
    comments: parseString(value.comments?.['#text']),
    enclosure: parseEnclosure(value.enclosure),
    guid: parseString(value.guid?.['#text']),
    pubDate: parseString(value.pubdate?.['#text']),
    source: parseSource(value.source),
    content: parseContentItem(value),
    atom: parseAtomEntry(value),
    dc: parseDcItemOrFeed(value),
  })

  if (hasAnyProps(item, ['title', 'description'])) {
    return item
  }
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = omitUndefinedFromObject({
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    description: parseString(value.description?.['#text']),
    language: parseString(value.language?.['#text']),
    copyright: parseString(value.copyright?.['#text']),
    managingEditor: parseString(value.managingeditor?.['#text']),
    webMaster: parseString(value.webmaster?.['#text']),
    pubDate: parseString(value.pubdate?.['#text']),
    lastBuildDate: parseString(value.lastbuilddate?.['#text']),
    categories: parseArrayOf(value.category, parseCategory),
    generator: parseString(value.generator?.['#text']),
    docs: parseString(value.docs?.['#text']),
    cloud: parseCloud(value.cloud),
    ttl: parseNumber(value.ttl?.['#text']),
    image: parseImage(value.image),
    rating: parseString(value.rating?.['#text']),
    textInput: parseTextInput(value.textinput),
    skipHours: parseSkipHours(value.skiphours),
    skipDays: parseSkipDays(value.skipdays),
    items: parseArrayOf(value.item, parseItem),
    atom: parseAtomFeed(value),
    dc: parseDcItemOrFeed(value),
    sy: parseSyFeed(value),
  })

  // INFO: Spec also says about required "description" but this field is
  // not always present in feeds. We can still parse the feed without it.
  if (hasAllProps(feed, ['title', 'link'])) {
    return feed
  }
}

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value?.rss?.channel)) {
    return
  }

  return parseFeed(value.rss.channel)
}
