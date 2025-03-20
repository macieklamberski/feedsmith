import type { ParseFunction } from '../../common/types'
import {
  hasAllProps,
  isObject,
  omitNullish,
  parseArrayOf,
  parseNumber,
  parseString,
} from '../../common/utils'
import { parseItem as parseContentNamespaceItem } from '../../namespaces/content/utils'
import { parseDublinCore as parseDublinCoreNamespaceFeed } from '../../namespaces/dc/utils'
import { parseFeed as parseSyndicationNamespaceFeed } from '../../namespaces/sy/utils'
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

  const textInput = {
    title: parseString(value?.title?.['#text']),
    description: parseString(value?.description?.['#text']),
    name: parseString(value?.name?.['#text']),
    link: parseString(value?.link?.['#text']),
  }

  // TODO: Return only if required values are present: all.
  return textInput
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

  // TODO: Return only if required values are present: all.
  return cloud
}

export const parseSkipHours: ParseFunction<Array<number>> = (value) => {
  const hours = value?.hour

  if (!Array.isArray(hours)) {
    return
  }

  return omitNullish(hours.map((hour) => parseNumber(hour?.['#text'])))
}

export const parseSkipDays: ParseFunction<Array<string>> = (value) => {
  const days = value?.day

  if (!Array.isArray(days)) {
    return
  }

  return omitNullish(days.map((hour) => parseString(hour?.['#text'])))
}

export const parseEnclosure: ParseFunction<Enclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const enclosure = {
    url: parseString(value.url?.['#text']),
    length: parseNumber(value.length?.['#text']),
    type: parseString(value.type?.['#text']),
  }

  // TODO: Return only if required values are present: url, length, type.
  return enclosure
}

export const parseSource: ParseFunction<Source> = (value) => {
  const source = {
    title: parseString(value?.['#text']),
    url: parseString(value?.['@url']),
  }

  if (source.title) {
    return source
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

  // TODO: Return only if required values are present: url, title, link, description.
  return image
}

export const parseCategory: ParseFunction<Category> = (value) => {
  const category = {
    name: parseString(value?.['#text']),
    domain: parseString(value?.['@domain']),
  }

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
    content: parseContentNamespaceItem(value),
    dc: parseDublinCoreNamespaceFeed(value),
  }

  // TODO: Return only if required values are present: title || description.
  return item
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  const channel = value?.rss?.channel

  if (!isObject(channel)) {
    return
  }

  const feed = {
    title: parseString(channel.title?.['#text']),
    link: parseString(channel.link?.['#text']),
    description: parseString(channel.description?.['#text']),
    language: parseString(channel.language?.['#text']),
    copyright: parseString(channel.copyright?.['#text']),
    managingEditor: parseString(channel.managingeditor?.['#text']),
    webMaster: parseString(channel.webmaster?.['#text']),
    pubDate: parseString(channel.pubdate?.['#text']),
    lastBuildDate: parseString(channel.lastbuilddate?.['#text']),
    categories: parseArrayOf(channel.category, parseCategory),
    generator: parseString(channel.generator?.['#text']),
    docs: parseString(channel.docs?.['#text']),
    cloud: parseCloud(channel.cloud),
    ttl: parseNumber(channel.ttl?.['#text']),
    image: parseImage(channel.image),
    rating: parseString(channel.rating?.['#text']),
    textInput: parseTextInput(channel.textinput),
    skipHours: parseSkipHours(channel.skiphours),
    skipDays: parseSkipDays(channel.skipdays),
    items: parseArrayOf(channel.item, parseItem),
    dc: parseDublinCoreNamespaceFeed(channel),
    sy: parseSyndicationNamespaceFeed(channel),
  }

  // TODO: Return only if required values are present: title, link, description.
  // Reconsider requiring "description" as it might not be as common that this value is present.
  if (hasAllProps(feed, ['title', 'link'])) {
    return feed
  }
}
