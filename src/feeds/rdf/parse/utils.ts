import type { ParseFunction } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseSingular,
  parseSingularOf,
  parseString,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import {
  retrieveEntry as retrieveAtomEntry,
  retrieveFeed as retrieveAtomFeed,
} from '../../../namespaces/atom/utils.js'
import { retrieveItem as retrieveContentItem } from '../../../namespaces/content/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/utils.js'
import {
  retrieveFeed as retrieveItunesFeed,
  retrieveItem as retrieveItunesItem,
} from '../../../namespaces/itunes/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/utils.js'
import type { Feed, Image, Item, TextInput } from './types.js'

export const parseImage: ParseFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    url: parseSingularOf(value.url, parseTextString),
  }

  if (isPresent(image.title) && isPresent(image.link)) {
    return trimObject(image)
  }
}

export const retrieveImage: ParseFunction<Image> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseSingularOf(value?.image, parseImage)
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    description: parseSingularOf(value.description, parseTextString),
    atom: retrieveAtomEntry(value),
    content: retrieveContentItem(value),
    dc: retrieveDcItemOrFeed(value),
    slash: retrieveSlashItem(value),
    itunes: retrieveItunesItem(value),
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

export const retrieveTextInput: ParseFunction<TextInput> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseSingularOf(value?.textinput, parseTextInput)
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const channel = parseSingular(value.channel)
  const feed = {
    title: parseSingularOf(channel?.title, parseTextString),
    link: parseSingularOf(channel?.link, parseTextString),
    description: parseSingularOf(channel?.description, parseTextString),
    image: retrieveImage(value),
    items: retrieveItems(value),
    textInput: retrieveTextInput(value),
    atom: retrieveAtomFeed(channel),
    dc: retrieveDcItemOrFeed(channel),
    sy: retrieveSyFeed(channel),
    itunes: retrieveItunesFeed(channel),
  }

  if (isPresent(feed.title)) {
    return trimObject(feed)
  }
}

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  return parseSingularOf(value?.['rdf:rdf'], parseFeed)
}
