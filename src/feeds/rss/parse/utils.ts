import type { ParseFunction } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
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

export const parsePerson: ParseFunction<Person> = (value) => {
  return parseSingularOf(value?.name ?? value, parseTextString)
}

export const parseCategory: ParseFunction<Category> = (value) => {
  const category = {
    name: parseString(retrieveText(value)),
    domain: parseString(value?.['@domain']),
  }

  if (isPresent(category.name)) {
    return trimObject(category) as Category
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
    return trimObject(cloud) as Cloud
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
    return trimObject(image) as Image
  }
}

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
    return trimObject(textInput) as TextInput
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
    return trimObject(enclosure) as Enclosure
  }
}

export const parseGuid: ParseFunction<Guid> = (value) => {
  const source = {
    value: parseString(retrieveText(value)),
    isPermalink: parseBoolean(value?.['@ispermalink']),
  }

  if (isPresent(source.value)) {
    return trimObject(source) as Guid
  }
}

export const parseSource: ParseFunction<Source> = (value) => {
  const source = {
    title: parseString(retrieveText(value)),
    url: parseString(value?.['@url']),
  }

  if (isPresent(source.title)) {
    return trimObject(source) as Source
  }
}

export const parseItem: ParseFunction<Item<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    authors: parseArrayOf(value.author, parsePerson),
    categories: parseArrayOf(value.category, parseCategory),
    comments: parseSingularOf(value.comments, parseTextString),
    enclosure: parseSingularOf(value.enclosure, parseEnclosure),
    guid: parseSingularOf(value.guid, parseGuid),
    pubDate: parseSingularOf(value.pubdate, parseTextString),
    source: parseSingularOf(value.source, parseSource),
    content: retrieveContentItem(value),
    atom: retrieveAtomEntry(value),
    dc: retrieveDcItemOrFeed(value),
    slash: retrieveSlashItem(value),
    itunes: retrieveItunesItem(value),
    podcast: retrievePodcastItem(value),
    media: retrieveMediaItemOrFeed(value),
    georss: retrieveGeoRssItemOrFeed(value),
    thr: retrieveThrItem(value),
  }

  if (isPresent(item.title) || isPresent(item.description)) {
    return trimObject(item) as Item<string>
  }
}

export const parseFeed: ParseFunction<Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    language: parseSingularOf(value.language, parseTextString),
    copyright: parseSingularOf(value.copyright, parseTextString),
    managingEditor: parseSingularOf(value.managingeditor, parsePerson),
    webMaster: parseSingularOf(value.webmaster, parsePerson),
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
    atom: retrieveAtomFeed(value),
    dc: retrieveDcItemOrFeed(value),
    sy: retrieveSyFeed(value),
    itunes: retrieveItunesFeed(value),
    podcast: retrievePodcastFeed(value),
    media: retrieveMediaItemOrFeed(value),
    georss: retrieveGeoRssItemOrFeed(value),
  }

  // INFO: Spec also says about required "description" but this field is not always present
  // in feeds. We can still parse the feed without it. In addition, the "link" might be missing
  // as well when the atom:link rel="self" is present so checking "link" is skipped as well.
  if (isPresent(feed.title)) {
    return trimObject(feed) as Feed<string>
  }
}

export const retrieveFeed: ParseFunction<Feed<string>> = (value) => {
  return parseSingularOf(value?.rss?.channel, parseFeed)
}
