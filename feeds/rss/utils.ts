import type { ParseFunction } from '../../common/types'
import {
  hasAllProps,
  isObject,
  omitNullish,
  parseArrayOf,
  parseNumber,
  parseString,
} from '../../common/utils'
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

export const parseTextInput: ParseFunction<TextInput> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const textInput = {
    title: parseString(value?.title?.['#text'], level),
    description: parseString(value?.description?.['#text'], level),
    name: parseString(value?.name?.['#text'], level),
    link: parseString(value?.link?.['#text'], level),
  }

  // TODO: Return only if required values are present: all.
  return textInput
}

export const parseCloud: ParseFunction<Cloud> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const cloud = {
    domain: parseString(value?.['@domain'], level),
    port: parseNumber(value?.['@port'], level),
    path: parseString(value?.['@path'], level),
    registerProcedure: parseString(value?.['@registerprocedure'], level),
    protocol: parseString(value?.['@protocol'], level),
  }

  // TODO: Return only if required values are present: all.
  return cloud
}

export const parseSkipHours: ParseFunction<Array<number>> = (value, level) => {
  const hours = value?.hour

  if (!Array.isArray(hours)) {
    return
  }

  return omitNullish(hours.map((hour) => parseNumber(hour?.['#text'], level)))
}

export const parseSkipDays: ParseFunction<Array<string>> = (value, level) => {
  const days = value?.day

  if (!Array.isArray(days)) {
    return
  }

  return omitNullish(days.map((hour) => parseString(hour?.['#text'], level)))
}

export const parseEnclosure: ParseFunction<Enclosure> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const enclosure = {
    url: parseString(value.url?.['#text'], level),
    length: parseNumber(value.length?.['#text'], level),
    type: parseString(value.type?.['#text'], level),
  }

  // TODO: Return only if required values are present: url, length, type.
  return enclosure
}

export const parseSource: ParseFunction<Source> = (value, level) => {
  const source = {
    title: parseString(value?.['#text'], level),
    url: parseString(value?.['@url'], level),
  }

  if (source.title) {
    return source
  }
}

export const parseImage: ParseFunction<Image> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    url: parseString(value.url?.['#text'], level),
    title: parseString(value.title?.['#text'], level),
    link: parseString(value.link?.['#text'], level),
    description: parseString(value.description?.['#text'], level),
    height: parseNumber(value.height?.['#text'], level),
    width: parseNumber(value.width?.['#text'], level),
  }

  // TODO: Return only if required values are present: url, title, link, description.
  return image
}

export const parseCategory: ParseFunction<Category> = (value, level) => {
  const category = {
    name: parseString(value?.['#text'], level),
    domain: parseString(value?.['@domain'], level),
  }

  if (category.name) {
    return category
  }
}

export const parseAuthor: ParseFunction<Author> = (value, level) => {
  return parseString(value?.['#text'], level)
}

export const parseItem: ParseFunction<Item> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseString(value?.title?.['#text'], level),
    link: parseString(value?.link?.['#text'], level),
    description: parseString(value?.description?.['#text'], level),
    authors: parseArrayOf(value?.author, parseAuthor, level),
    categories: parseArrayOf(value?.category, parseCategory, level),
    comments: parseString(value?.comments?.['#text'], level),
    enclosure: parseEnclosure(value?.enclosure, level),
    guid: parseString(value?.guid?.['#text'], level),
    pubDate: parseString(value?.pubdate?.['#text'], level),
    source: parseSource(value?.source, level),
  }

  // TODO: Return only if required values are present: title || description.
  return item
}

export const parseFeed: ParseFunction<Feed> = (value, level) => {
  if (!isObject(value?.rss)) {
    return
  }

  const feed = {
    title: parseString(value.rss.channel?.title?.['#text'], level),
    link: parseString(value.rss.channel?.link?.['#text'], level),
    description: parseString(value.rss.channel?.description?.['#text'], level),
    language: parseString(value.rss.channel?.language?.['#text'], level),
    copyright: parseString(value.rss.channel?.copyright?.['#text'], level),
    managingEditor: parseString(value.rss.channel?.managingeditor?.['#text'], level),
    webMaster: parseString(value.rss.channel?.webmaster?.['#text'], level),
    pubDate: parseString(value.rss.channel?.pubdate?.['#text'], level),
    lastBuildDate: parseString(value.rss.channel?.lastbuilddate?.['#text'], level),
    categories: parseArrayOf(value.rss.channel?.category, parseCategory, level),
    generator: parseString(value.rss.channel?.generator?.['#text'], level),
    docs: parseString(value.rss.channel?.docs?.['#text'], level),
    cloud: parseCloud(value.rss.channel?.cloud, level),
    ttl: parseNumber(value.rss.channel?.ttl?.['#text'], level),
    image: parseImage(value.rss.channel?.image, level),
    rating: parseString(value.rss.channel?.rating?.['#text'], level),
    textInput: parseTextInput(value.rss.channel?.textinput, level),
    skipHours: parseSkipHours(value.rss.channel?.skiphours, level),
    skipDays: parseSkipDays(value.rss.channel?.skipdays, level),
    items: parseArrayOf(value.rss.channel?.item, parseItem, level),
  }

  // TODO: Return only if required values are present: title, link, description.
  // Reconsider requiring "description" as it might not be as common that this value is present.
  if (hasAllProps(feed, ['title', 'link'])) {
    return feed
  }
}
