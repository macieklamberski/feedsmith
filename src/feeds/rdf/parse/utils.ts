import type { ParsePartialFunction } from '../../../common/types.js'
import {
  detectNamespaces,
  isObject,
  parseArrayOf,
  parseSingular,
  parseSingularOf,
  parseString,
  retrieveText,
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
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import { retrieveItem as retrieveWfwItem } from '../../../namespaces/wfw/parse/utils.js'
import type { Feed, Image, Item, TextInput } from '../common/types.js'

export const parseImage: ParsePartialFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    url: parseSingularOf(value.url, (value) => parseString(retrieveText(value))),
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
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    name: parseSingularOf(value.name, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
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

  const namespaces = detectNamespaces(value)
  const item = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    atom: namespaces.has('atom') || namespaces.has('a10') ? retrieveAtomEntry(value) : undefined,
    content: namespaces.has('content') ? retrieveContentItem(value) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDctermsItemOrFeed(value) : undefined,
    slash: namespaces.has('slash') ? retrieveSlashItem(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    wfw: namespaces.has('wfw') ? retrieveWfwItem(value) : undefined,
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
  const namespaces = detectNamespaces(channel)
  const feed = {
    title: parseSingularOf(channel?.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(channel?.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(channel?.description, (value) => parseString(retrieveText(value))),
    image: retrieveImage(value),
    items: retrieveItems(value),
    textInput: retrieveTextInput(value),
    atom: namespaces.has('atom') || namespaces.has('a10') ? retrieveAtomFeed(channel) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(channel) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDctermsItemOrFeed(channel) : undefined,
    sy: namespaces.has('sy') ? retrieveSyFeed(channel) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(channel) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(channel) : undefined,
  }

  return trimObject(feed)
}

export const retrieveFeed: ParsePartialFunction<Feed<string>> = (value) => {
  return parseSingularOf(value?.['rdf:rdf'], parseFeed)
}
