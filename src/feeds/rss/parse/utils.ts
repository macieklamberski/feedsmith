import type { ParsePartialUtil } from '../../../common/types.js'
import {
  detectNamespaces,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
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
import { retrieveItemOrFeed as retrieveDctermsItemOrFeed } from '../../../namespaces/dcterms/parse/utils.js'
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
import { retrieveItem as retrievePscItem } from '../../../namespaces/psc/parse/utils.js'
import {
  retrieveFeed as retrieveRawvoiceFeed,
  retrieveItem as retrieveRawvoiceItem,
} from '../../../namespaces/rawvoice/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import {
  retrieveFeed as retrieveSourceFeed,
  retrieveItem as retrieveSourceItem,
} from '../../../namespaces/source/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import { retrieveItem as retrieveThrItem } from '../../../namespaces/thr/parse/utils.js'
import { retrieveItem as retrieveWfwItem } from '../../../namespaces/wfw/parse/utils.js'
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

export const parsePerson: ParsePartialUtil<Person> = (value) => {
  return parseSingularOf(value?.name ?? value, (value) => parseString(retrieveText(value)))
}

export const parseCategory: ParsePartialUtil<Category> = (value) => {
  const category = {
    name: parseString(retrieveText(value)),
    domain: parseString(value?.['@domain']),
  }

  return trimObject(category)
}

export const parseCloud: ParsePartialUtil<Cloud> = (value) => {
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

export const parseImage: ParsePartialUtil<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    url: parseSingularOf(value.url, (value) => parseString(retrieveText(value))),
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    height: parseSingularOf(value.height, (value) => parseNumber(retrieveText(value))),
    width: parseSingularOf(value.width, (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(image)
}

export const parseTextInput: ParsePartialUtil<TextInput> = (value) => {
  if (!isObject(value)) {
    return
  }

  const textInput = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    name: parseSingularOf(value.name, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
  }

  return trimObject(textInput)
}

export const parseSkipHours: ParsePartialUtil<Array<number>> = (value) => {
  return trimArray(value?.hour, (value) => parseNumber(retrieveText(value)))
}

export const parseSkipDays: ParsePartialUtil<Array<string>> = (value) => {
  return trimArray(value?.day, (value) => parseString(retrieveText(value)))
}

export const parseEnclosure: ParsePartialUtil<Enclosure> = (value) => {
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

export const parseGuid: ParsePartialUtil<Guid> = (value) => {
  const source = {
    value: parseString(retrieveText(value)),
    isPermaLink: parseBoolean(value?.['@ispermalink']),
  }

  return trimObject(source)
}

export const parseSource: ParsePartialUtil<Source> = (value) => {
  const source = {
    title: parseString(retrieveText(value)),
    url: parseString(value?.['@url']),
  }

  return trimObject(source)
}

export const parseItem: ParsePartialUtil<Item<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const item = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    authors: parseArrayOf(value.author, parsePerson),
    categories: parseArrayOf(value.category, parseCategory),
    comments: parseSingularOf(value.comments, (value) => parseString(retrieveText(value))),
    enclosures: parseArrayOf(value.enclosure, parseEnclosure),
    guid: parseSingularOf(value.guid, parseGuid),
    pubDate: parseSingularOf(value.pubdate, (value) => parseDate(retrieveText(value))),
    source: parseSingularOf(value.source, parseSource),
    atom: namespaces.has('atom') ? retrieveAtomEntry(value) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    content: namespaces.has('content') ? retrieveContentItem(value) : undefined,
    slash: namespaces.has('slash') ? retrieveSlashItem(value) : undefined,
    itunes: namespaces.has('itunes') ? retrieveItunesItem(value) : undefined,
    podcast: namespaces.has('podcast') ? retrievePodcastItem(value) : undefined,
    psc: namespaces.has('psc') ? retrievePscItem(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    thr: namespaces.has('thr') ? retrieveThrItem(value) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDctermsItemOrFeed(value) : undefined,
    wfw: namespaces.has('wfw') ? retrieveWfwItem(value) : undefined,
    src: namespaces.has('source') ? retrieveSourceItem(value) : undefined,
    rawvoice: namespaces.has('rawvoice') ? retrieveRawvoiceItem(value) : undefined,
  }

  return trimObject(item)
}

export const parseFeed: ParsePartialUtil<Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const feed = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    language: parseSingularOf(value.language, (value) => parseString(retrieveText(value))),
    copyright: parseSingularOf(value.copyright, (value) => parseString(retrieveText(value))),
    managingEditor: parseSingularOf(value.managingeditor, parsePerson),
    webMaster: parseSingularOf(value.webmaster, parsePerson),
    pubDate: parseSingularOf(value.pubdate, (value) => parseDate(retrieveText(value))),
    lastBuildDate: parseSingularOf(value.lastbuilddate, (value) => parseDate(retrieveText(value))),
    categories: parseArrayOf(value.category, parseCategory),
    generator: parseSingularOf(value.generator, (value) => parseString(retrieveText(value))),
    docs: parseSingularOf(value.docs, (value) => parseString(retrieveText(value))),
    cloud: parseSingularOf(value.cloud, parseCloud),
    ttl: parseSingularOf(value.ttl, (value) => parseNumber(retrieveText(value))),
    image: parseSingularOf(value.image, parseImage),
    rating: parseSingularOf(value.rating, (value) => parseString(retrieveText(value))),
    textInput: parseSingularOf(value.textinput, parseTextInput),
    skipHours: parseSingularOf(value.skiphours, parseSkipHours),
    skipDays: parseSingularOf(value.skipdays, parseSkipDays),
    items: parseArrayOf(value.item, parseItem),
    atom: namespaces.has('atom') ? retrieveAtomFeed(value) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    sy: namespaces.has('sy') ? retrieveSyFeed(value) : undefined,
    itunes: namespaces.has('itunes') ? retrieveItunesFeed(value) : undefined,
    podcast: namespaces.has('podcast') ? retrievePodcastFeed(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDctermsItemOrFeed(value) : undefined,
    src: namespaces.has('source') ? retrieveSourceFeed(value) : undefined,
    rawvoice: namespaces.has('rawvoice') ? retrieveRawvoiceFeed(value) : undefined,
  }

  return trimObject(feed)
}

export const retrieveFeed: ParsePartialUtil<Feed<string>> = (value) => {
  return parseSingularOf(value?.rss?.channel, parseFeed)
}
