import type { ParseFunction, Unreliable } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseString,
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
    title: parseString(retrieveText(value.title)),
    description: parseString(retrieveText(value.description)),
    name: parseString(retrieveText(value.name)),
    link: parseString(retrieveText(value.link)),
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
  return trimArray(value?.hour, (hour) => parseNumber(retrieveText(hour)))
}

export const parseSkipDays: ParseFunction<Array<string>> = (value) => {
  return trimArray(value?.day, (day) => parseString(retrieveText(day)))
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
    title: parseString(retrieveText(value)),
    url: parseString(value['@url']),
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
    url: parseString(retrieveText(value.url)),
    title: parseString(retrieveText(value.title)),
    link: parseString(retrieveText(value.link)),
    description: parseString(retrieveText(value.description)),
    height: parseNumber(retrieveText(value.height)),
    width: parseNumber(retrieveText(value.width)),
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
    name: parseString(retrieveText(value)),
    domain: parseString(value['@domain']),
  }

  if (isPresent(category.name)) {
    return trimObject(category)
  }
}

export const parseAuthor: ParseFunction<Author> = (value) => {
  return parseString(retrieveText(value?.name ?? value))
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseString(retrieveText(value.title)),
    link: parseString(retrieveText(value.link)),
    description: parseString(retrieveText(value.description)),
    authors: parseArrayOf(value.author, parseAuthor),
    categories: parseArrayOf(value.category, parseCategory),
    comments: parseString(retrieveText(value.comments)),
    enclosure: parseEnclosure(value.enclosure),
    guid: parseString(retrieveText(value.guid)),
    pubDate: parseString(retrieveText(value.pubdate)),
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
    title: parseString(retrieveText(value.title)),
    link: parseString(retrieveText(value.link)),
    description: parseString(retrieveText(value.description)),
    language: parseString(retrieveText(value.language)),
    copyright: parseString(retrieveText(value.copyright)),
    managingEditor: parseString(retrieveText(value.managingeditor)),
    webMaster: parseString(retrieveText(value.webmaster)),
    pubDate: parseString(retrieveText(value.pubdate)),
    lastBuildDate: parseString(retrieveText(value.lastbuilddate)),
    categories: parseArrayOf(value.category, parseCategory),
    generator: parseString(retrieveText(value.generator)),
    docs: parseString(retrieveText(value.docs)),
    cloud: parseCloud(value.cloud),
    ttl: parseNumber(retrieveText(value.ttl)),
    image: parseImage(value.image),
    rating: parseString(retrieveText(value.rating)),
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
  return parseFeed(value?.rss?.channel)
}
