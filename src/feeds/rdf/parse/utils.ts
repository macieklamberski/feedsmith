import type { ParseFunction } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseString,
  retrieveText,
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
import type { Feed, Image, Item, TextInput } from './types.js'

export const parseImage: ParseFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    title: parseString(retrieveText(value.title)),
    link: parseString(retrieveText(value.link)),
    url: parseString(retrieveText(value.url)),
  }

  if (isPresent(image.title) && isPresent(image.link)) {
    return trimObject(image)
  }
}

export const retrieveImage: ParseFunction<Image> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseImage(value?.image)
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseString(retrieveText(value.title)),
    link: parseString(retrieveText(value.link)),
    description: parseString(retrieveText(value.description)),
    atom: parseAtomEntry(value),
    content: parseContentItem(value),
    dc: parseDcItemOrFeed(value),
    slash: parseSlashItem(value),
    itunes: parseItunesItem(value),
  }

  if (isPresent(item.title) && isPresent(item.link)) {
    return trimObject(item)
  }
}

export const retrieveItems: ParseFunction<Array<Item>> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseArrayOf(value?.item, parseItem)
}

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

export const retrieveTextInput: ParseFunction<TextInput> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseTextInput(value?.textinput)
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    title: parseString(retrieveText(value.channel?.title)),
    link: parseString(retrieveText(value.channel?.link)),
    description: parseString(retrieveText(value.channel?.description)),
    image: retrieveImage(value),
    items: retrieveItems(value),
    textInput: retrieveTextInput(value),
    atom: parseAtomFeed(value.channel),
    dc: parseDcItemOrFeed(value.channel),
    sy: parseSyFeed(value.channel),
    itunes: parseItunesFeed(value.channel),
  }

  if (isPresent(feed.title)) {
    return trimObject(feed)
  }
}

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  return parseFeed(value?.['rdf:rdf'])
}
