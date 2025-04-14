import type { ParseFunction } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseString,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../namespaces/atom/utils.js'
import { parseItem as parseContentItem } from '../../../namespaces/content/utils.js'
import { parseItemOrFeed as parseDcItemOrFeed } from '../../../namespaces/dc/utils.js'
import {
  parseFeed as parseItunesFeed,
  parseItem as parseItunesItem,
} from '../../../namespaces/itunes/utils.js'
import { parseItem as parseSlashItem } from '../../../namespaces/slash/utils.js'
import { parseFeed as parseSyFeed } from '../../../namespaces/sy/utils.js'
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
} from './types.js'

export const parseTextInput: ParseFunction<TextInput> = (value) => {
  if (!isObject(value)) {
    return
  }

  const textInput = {
    title: parseString(value?.title?.['#text']),
    description: parseString(value?.description?.['#text']),
    name: parseString(value?.name?.['#text']),
    link: parseString(value?.link?.['#text']),
  }

  if (
    isPresent(textInput.title) &&
    isPresent(textInput.description) &&
    isPresent(textInput.name) &&
    isPresent(textInput.link)
  ) {
    return trimObject(textInput)
  }
}

export const parseCloud: ParseFunction<Cloud> = (value) => {
  if (!isObject(value)) {
    return
  }

  const cloud = {
    domain: parseString(value?.['@domain']),
    port: parseNumber(value?.['@port']),
    path: parseString(value?.['@path']),
    registerProcedure: parseString(value?.['@registerprocedure']),
    protocol: parseString(value?.['@protocol']),
  }

  if (
    isPresent(cloud.domain) &&
    isPresent(cloud.port) &&
    isPresent(cloud.path) &&
    isPresent(cloud.registerProcedure) &&
    isPresent(cloud.protocol)
  ) {
    return trimObject(cloud)
  }
}

export const parseSkipHours: ParseFunction<Array<number>> = (value) => {
  const hours = value?.hour

  if (!Array.isArray(hours)) {
    return
  }

  return trimArray(hours.map((hour) => parseNumber(hour?.['#text'])))
}

export const parseSkipDays: ParseFunction<Array<string>> = (value) => {
  const days = value?.day

  if (!Array.isArray(days)) {
    return
  }

  return trimArray(days.map((hour) => parseString(hour?.['#text'])))
}

export const parseEnclosure: ParseFunction<Enclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const enclosure = {
    url: parseString(value['@url']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
  }

  if (isPresent(enclosure.url) && isPresent(enclosure.length) && isPresent(enclosure.type)) {
    return trimObject(enclosure)
  }
}

export const parseSource: ParseFunction<Source> = (value) => {
  if (!isObject(value)) {
    return
  }

  const source = {
    title: parseString(value?.['#text']),
    url: parseString(value?.['@url']),
  }

  if (isPresent(source.title)) {
    return trimObject(source)
  }
}

export const parseImage: ParseFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    url: parseString(value.url?.['#text']),
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    description: parseString(value.description?.['#text']),
    height: parseNumber(value.height?.['#text']),
    width: parseNumber(value.width?.['#text']),
  }

  if (isPresent(image.url) && isPresent(image.title) && isPresent(image.link)) {
    return trimObject(image)
  }
}

export const parseCategory: ParseFunction<Category> = (value) => {
  if (!isObject(value)) {
    return
  }

  const category = {
    name: parseString(value?.['#text']),
    domain: parseString(value?.['@domain']),
  }

  if (isPresent(category.name)) {
    return trimObject(category)
  }
}

export const parseAuthor: ParseFunction<Author> = (value) => {
  return parseString(value?.name?.['#text'] || value?.['#text'])
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
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
    slash: parseSlashItem(value),
    itunes: parseItunesItem(value),
  }

  if (isPresent(item.title) || isPresent(item.description)) {
    return trimObject(item)
  }
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
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
    itunes: parseItunesFeed(value),
  }

  // INFO: Spec also says about required "description" but this field is not always present
  // in feeds. We can still parse the feed without it. In addition, the "link" might be missing
  // as well when the atom:link rel="self" is present so checking "link" is skipped as well.
  if (isPresent(feed.title)) {
    return trimObject(feed)
  }
}

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value?.rss?.channel)) {
    return
  }

  return parseFeed(value.rss.channel)
}
