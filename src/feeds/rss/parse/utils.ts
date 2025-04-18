import type { ParseFunction, Unreliable } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextNumber,
  parseTextString,
  retrieveText,
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
    title: parseSingularOf(value.title, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    name: parseSingularOf(value.name, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
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
    domain: parseString(value['@domain']),
    port: parseNumber(value['@port']),
    path: parseString(value['@path']),
    registerProcedure: parseString(value['@registerprocedure']),
    protocol: parseString(value['@protocol']),
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
  return trimArray(value?.hour, parseTextNumber)
}

export const parseSkipDays: ParseFunction<Array<string>> = (value) => {
  return trimArray(value?.day, parseTextString)
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
  const source = {
    title: parseString(retrieveText(value)),
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
    url: parseSingularOf(value.url, parseTextString),
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    height: parseSingularOf(value.height, parseTextNumber),
    width: parseSingularOf(value.width, parseTextNumber),
  }

  if (isPresent(image.url) && isPresent(image.title) && isPresent(image.link)) {
    return trimObject(image)
  }
}

export const parseCategory: ParseFunction<Category> = (value) => {
  const category = {
    name: parseString(retrieveText(value)),
    domain: parseString(value?.['@domain']),
  }

  if (isPresent(category.name)) {
    return trimObject(category)
  }
}

export const parseAuthor: ParseFunction<Author> = (value) => {
  return parseSingularOf(value?.name ?? value, parseTextString)
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    authors: parseArrayOf(value.author, parseAuthor),
    categories: parseArrayOf(value.category, parseCategory),
    comments: parseSingularOf(value.comments, parseTextString),
    enclosure: parseSingularOf(value.enclosure, parseEnclosure),
    guid: parseSingularOf(value.guid, parseTextString),
    pubDate: parseSingularOf(value.pubdate, parseTextString),
    source: parseSingularOf(value.source, parseSource),
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
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    language: parseSingularOf(value.language, parseTextString),
    copyright: parseSingularOf(value.copyright, parseTextString),
    managingEditor: parseSingularOf(value.managingeditor, parseTextString),
    webMaster: parseSingularOf(value.webmaster, parseTextString),
    pubDate: parseSingularOf(value.pubdate, parseTextString),
    lastBuildDate: parseSingularOf(value.lastbuilddate, parseTextString),
    categories: parseArrayOf(value.category, parseCategory),
    generator: parseSingularOf(value.generator, parseTextString),
    docs: parseSingularOf(value.docs, parseTextString),
    cloud: parseSingularOf(value.cloud, parseCloud),
    ttl: parseSingularOf(value.ttl, parseTextNumber),
    image: parseSingularOf(value.image, parseImage),
    rating: parseSingularOf(value.rating, parseTextString),
    textInput: parseSingularOf(value.textinput, parseTextInput),
    skipHours: parseSingularOf(value.skiphours, parseSkipHours),
    skipDays: parseSingularOf(value.skipdays, parseSkipDays),
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
  return parseSingularOf(value?.rss?.channel, parseFeed)
}
