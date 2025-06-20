import type { ParsePartialFunction } from '../../../common/types.js'
import {
  detectNamespaces,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseDate,
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
  retrieveEntry as retrieveAtomEntry,
  retrieveFeed as retrieveAtomFeed,
} from '../../../namespaces/atom/parse/utils.js'
import { retrieveItem as retrieveContentItem } from '../../../namespaces/content/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import {
  retrieveFeed as retrieveItunesFeed,
  retrieveItem as retrieveItunesItem,
} from '../../../namespaces/itunes/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import {
  retrieveFeed as retrievePodcastFeed,
  retrieveItem as retrievePodcastItem,
} from '../../../namespaces/podcast/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import { retrieveItem as retrieveThrItem } from '../../../namespaces/thr/parse/utils.js'
import type {
  Category,
  Cloud,
  Enclosure,
  Feed,
  Guid,
  Image,
  Item,
  Person,
  Source,
  TextInput,
} from '../common/types.js'

export const parsePerson: ParsePartialFunction<Person> = (value) => {
  return parseSingularOf(value?.name ?? value, parseTextString)
}

export const parseCategory: ParsePartialFunction<Category> = (value) => {
  const category = {
    name: parseTextString(value),
    domain: parseString(value?.['@domain']),
  }

  return trimObject(category)
}

export const parseCloud: ParsePartialFunction<Cloud> = (value) => {
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

  return trimObject(cloud)
}

export const parseImage: ParsePartialFunction<Image> = (value) => {
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

  return trimObject(image)
}

export const parseTextInput: ParsePartialFunction<TextInput> = (value) => {
  if (!isObject(value)) {
    return
  }

  const textInput = {
    title: parseSingularOf(value.title, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    name: parseSingularOf(value.name, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
  }

  return trimObject(textInput)
}

export const parseSkipHours: ParsePartialFunction<Array<number>> = (value) => {
  return trimArray(value?.hour, parseTextNumber)
}

export const parseSkipDays: ParsePartialFunction<Array<string>> = (value) => {
  return trimArray(value?.day, parseTextString)
}

export const parseEnclosure: ParsePartialFunction<Enclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const enclosure = {
    url: parseString(value['@url']),
    length: parseNumber(value['@length']),
    type: parseString(value['@type']),
  }

  return trimObject(enclosure)
}

export const parseGuid: ParsePartialFunction<Guid> = (value) => {
  const source = {
    value: parseTextString(value),
    isPermaLink: parseBoolean(value?.['@ispermalink']),
  }

  return trimObject(source)
}

export const parseSource: ParsePartialFunction<Source> = (value) => {
  const source = {
    title: parseTextString(value),
    url: parseString(value?.['@url']),
  }

  return trimObject(source)
}

export const parseItem: ParsePartialFunction<Item<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const item = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    authors: parseArrayOf(value.author, parsePerson),
    categories: parseArrayOf(value.category, parseCategory),
    comments: parseSingularOf(value.comments, parseTextString),
    enclosure: parseSingularOf(value.enclosure, parseEnclosure),
    guid: parseSingularOf(value.guid, parseGuid),
    pubDate: parseSingularOf(value.pubdate, (value) => parseDate(retrieveText(value))),
    source: parseSingularOf(value.source, parseSource),
    content: namespaces.has('content') ? retrieveContentItem(value) : undefined,
    atom: namespaces.has('atom') ? retrieveAtomEntry(value) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    slash: namespaces.has('slash') ? retrieveSlashItem(value) : undefined,
    itunes: namespaces.has('itunes') ? retrieveItunesItem(value) : undefined,
    podcast: namespaces.has('podcast') ? retrievePodcastItem(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    thr: namespaces.has('thr') ? retrieveThrItem(value) : undefined,
  }

  return trimObject(item)
}

export const parseFeed: ParsePartialFunction<Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const feed = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    language: parseSingularOf(value.language, parseTextString),
    copyright: parseSingularOf(value.copyright, parseTextString),
    managingEditor: parseSingularOf(value.managingeditor, parsePerson),
    webMaster: parseSingularOf(value.webmaster, parsePerson),
    pubDate: parseSingularOf(value.pubdate, (value) => parseDate(retrieveText(value))),
    lastBuildDate: parseSingularOf(value.lastbuilddate, (value) => parseDate(retrieveText(value))),
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
    atom: namespaces.has('atom') || namespaces.has('a10') ? retrieveAtomFeed(value) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    sy: namespaces.has('sy') ? retrieveSyFeed(value) : undefined,
    itunes: namespaces.has('itunes') ? retrieveItunesFeed(value) : undefined,
    podcast: namespaces.has('podcast') ? retrievePodcastFeed(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
  }

  return trimObject(feed)
}

export const retrieveFeed: ParsePartialFunction<Feed<string>> = (value) => {
  return parseSingularOf(value?.rss?.channel, parseFeed)
}
