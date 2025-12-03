import type { ParseOptions, ParsePartialUtil } from '../../../common/types.js'
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
import { retrieveFeed as retrieveAdminFeed } from '../../../namespaces/admin/parse/utils.js'
import {
  retrieveEntry as retrieveAtomEntry,
  retrieveFeed as retrieveAtomFeed,
} from '../../../namespaces/atom/parse/utils.js'
import { retrieveItem as retrieveContentItem } from '../../../namespaces/content/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveDctermsItemOrFeed } from '../../../namespaces/dcterms/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveAbout as retrieveRdfAbout } from '../../../namespaces/rdf/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import { retrieveItem as retrieveWfwItem } from '../../../namespaces/wfw/parse/utils.js'
import type { Rdf } from '../common/types.js'

export const parseImage: ParsePartialUtil<Rdf.Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    url: parseSingularOf(value.url, (value) => parseString(retrieveText(value))),
    rdf: retrieveRdfAbout(value),
  }

  return trimObject(image)
}

export const retrieveImage: ParsePartialUtil<Rdf.Image> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseSingularOf(value?.image, parseImage)
}

export const parseTextInput: ParsePartialUtil<Rdf.TextInput> = (value) => {
  if (!isObject(value)) {
    return
  }

  const textInput = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    name: parseSingularOf(value.name, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    rdf: retrieveRdfAbout(value),
  }

  return trimObject(textInput)
}

export const retrieveTextInput: ParsePartialUtil<Rdf.TextInput> = (value) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseSingularOf(value?.textinput, parseTextInput)
}

export const parseItem: ParsePartialUtil<Rdf.Item<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const item = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    rdf: retrieveRdfAbout(value),
    atom: namespaces.has('atom') ? retrieveAtomEntry(value) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    content: namespaces.has('content') ? retrieveContentItem(value) : undefined,
    slash: namespaces.has('slash') ? retrieveSlashItem(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDctermsItemOrFeed(value) : undefined,
    wfw: namespaces.has('wfw') ? retrieveWfwItem(value) : undefined,
  }

  return trimObject(item)
}

export const retrieveItems: ParsePartialUtil<Array<Rdf.Item<string>>, ParseOptions> = (
  value,
  options,
) => {
  // Prepared for https://github.com/macieklamberski/feedsmith/issues/1.
  return parseArrayOf(value?.item, parseItem, options?.maxItems)
}

export const parseFeed: ParsePartialUtil<Rdf.Feed<string>, ParseOptions> = (value, options) => {
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
    items: retrieveItems(value, options),
    textInput: retrieveTextInput(value),
    rdf: retrieveRdfAbout(channel),
    atom: namespaces.has('atom') ? retrieveAtomFeed(channel) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(channel) : undefined,
    sy: namespaces.has('sy') ? retrieveSyFeed(channel) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(channel) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(channel) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDctermsItemOrFeed(channel) : undefined,
    admin: namespaces.has('admin') ? retrieveAdminFeed(channel) : undefined,
  }

  return trimObject(feed)
}

export const retrieveFeed: ParsePartialUtil<Rdf.Feed<string>, ParseOptions> = (value, options) => {
  return parseSingularOf(value?.rdf, (value) => parseFeed(value, options))
}
