import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingular,
  parseSingularOf,
  parseTextString,
  trimObject,
} from '../../../common/utils.js'
import {
  retrieveEntry as retrieveAtomEntry,
  retrieveFeed as retrieveAtomFeed,
} from '../../../namespaces/atom/parse/utils.js'
import { retrieveItem as retrieveContentItem } from '../../../namespaces/content/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import type { Feed, Image, Item, TextInput } from '../common/types.js'

export const parseImage: ParsePartialFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    title: parseSingularOf(value.title, parseTextString),
    link: parseSingularOf(value.link, parseTextString),
    url: parseSingularOf(value.url, parseTextString),
  }

  return trimObject(image)
}

export const retrieveImage: ParsePartialFunction<Image> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseSingularOf(value?.image, parseImage)
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

export const retrieveTextInput: ParsePartialFunction<TextInput> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseSingularOf(value?.textinput, parseTextInput)
}

export const parseItem: ParsePartialFunction<Item<string>> = (value) => {
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
    media: retrieveMediaItemOrFeed(value),
    georss: retrieveGeoRssItemOrFeed(value),
  }

  return trimObject(item)
}

export const retrieveItems: ParsePartialFunction<Array<Item<string>>> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseArrayOf(value?.item, parseItem)
}

export const parseFeed: ParsePartialFunction<Feed<string>> = (value) => {
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
    media: retrieveMediaItemOrFeed(channel),
    georss: retrieveGeoRssItemOrFeed(channel),
  }

  return trimObject(feed)
}

export const retrieveFeed: ParsePartialFunction<Feed<string>> = (value) => {
  return parseSingularOf(value?.['rdf:rdf'], parseFeed)
}
