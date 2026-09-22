import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, Unreliable } from '../../../common/types.js'
import {
  detectNamespaces,
  parseArrayOf,
  parseSingular,
  parseSingularOf,
  parseString,
  retrieveText,
  trimArray,
} from '../../../common/utils.js'
import { retrieveFeed as retrieveAdminFeed } from '../../../namespaces/admin/parse/utils.js'
import {
  retrieveEntry as retrieveAtomEntry,
  retrieveFeed as retrieveAtomFeed,
} from '../../../namespaces/atom/parse/utils.js'
import { retrieveItemOrFeed as retrieveCc } from '../../../namespaces/cc/parse/utils.js'
import { retrieveItem as retrieveContentItem } from '../../../namespaces/content/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcTermsItemOrFeed } from '../../../namespaces/dcterms/parse/utils.js'
import {
  retrieveFeed as retrieveFeedBurnerFeed,
  retrieveItem as retrieveFeedBurnerItem,
} from '../../../namespaces/feedburner/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoItemOrFeed } from '../../../namespaces/geo/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveFeed as retrieveOpenSearchFeed } from '../../../namespaces/opensearch/parse/utils.js'
import { retrieveItem as retrievePingbackItem } from '../../../namespaces/pingback/parse/utils.js'
import { retrieveItemOrFeed as retrievePrismItemOrFeed } from '../../../namespaces/prism/parse/utils.js'
import { retrieveAbout as retrieveRdfAbout } from '../../../namespaces/rdf/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import { retrieveItem as retrieveTrackbackItem } from '../../../namespaces/trackback/parse/utils.js'
import { retrieveItem as retrieveWfwItem } from '../../../namespaces/wfw/parse/utils.js'
import { retrieveItemOrFeed as retrieveXmlItemOrFeed } from '../../../namespaces/xml/parse/utils.js'
import type { ParseUtilPartial, RdfFeed } from '../common/types.js'

const retrieveByAbout = (elements: unknown, resourceUri: string | undefined): unknown => {
  if (!resourceUri) {
    return
  }

  const array = Array.isArray(elements) ? elements : [elements]

  return array.find((el) => parseString(el?.['@about']) === resourceUri)
}

const findByTocReference = (value: unknown, property: string): unknown => {
  if (!isPlainObject(value)) {
    return
  }

  const channel = parseSingular(value.channel as Unreliable)
  const resourceRef = parseSingular(channel?.[property])
  const resourceUri = parseString(resourceRef?.['@resource'])

  return retrieveByAbout(value[property], resourceUri)
}

export const parseImage: ParseUtilPartial<RdfFeed.Image<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const image = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    url: parseSingularOf(value.url, (value) => parseString(retrieveText(value))),
    rdf: retrieveRdfAbout(value),
    prism: namespaces.has('prism') ? retrievePrismItemOrFeed(value, options) : undefined,
    cc: namespaces.has('cc') ? retrieveCc(value) : undefined,
  }

  return trimObject(image)
}

export const retrieveImage: ParseUtilPartial<RdfFeed.Image<DateAny>> = (value, options) => {
  return (
    parseImage(findByTocReference(value, 'image'), options) ??
    parseSingularOf(value?.image, (value) => parseImage(value, options))
  )
}

export const parseTextInput: ParseUtilPartial<RdfFeed.TextInput<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const textInput = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    name: parseSingularOf(value.name, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    rdf: retrieveRdfAbout(value),
    prism: namespaces.has('prism') ? retrievePrismItemOrFeed(value, options) : undefined,
  }

  return trimObject(textInput)
}

export const retrieveTextInput: ParseUtilPartial<RdfFeed.TextInput<DateAny>> = (value, options) => {
  return (
    parseTextInput(findByTocReference(value, 'textinput'), options) ??
    parseSingularOf(value?.textinput, (value) => parseTextInput(value, options))
  )
}

export const parseItem: ParseUtilPartial<RdfFeed.Item<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const item = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(value.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value.description, (value) => parseString(retrieveText(value))),
    rdf: retrieveRdfAbout(value),
    atom: namespaces.has('atom') ? retrieveAtomEntry(value, options) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(value, options) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDcTermsItemOrFeed(value, options) : undefined,
    content: namespaces.has('content') ? retrieveContentItem(value) : undefined,
    slash: namespaces.has('slash') ? retrieveSlashItem(value) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    feedburner: namespaces.has('feedburner') ? retrieveFeedBurnerItem(value) : undefined,
    prism: namespaces.has('prism') ? retrievePrismItemOrFeed(value, options) : undefined,
    cc: namespaces.has('cc') ? retrieveCc(value) : undefined,
    wfw: namespaces.has('wfw') ? retrieveWfwItem(value) : undefined,
    pingback: namespaces.has('pingback') ? retrievePingbackItem(value) : undefined,
    trackback: namespaces.has('trackback') ? retrieveTrackbackItem(value) : undefined,
    geo: namespaces.has('geo') ? retrieveGeoItemOrFeed(value) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    xml: retrieveXmlItemOrFeed(value),
  }

  return trimObject(item)
}

export const retrieveItems: ParseUtilPartial<Array<RdfFeed.Item<DateAny>>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const channel = parseSingular(value.channel as Unreliable)
  // Some generators nest the items inside the channel and some split the ToC into several Seq.
  const itemElements = value.item ?? channel?.item
  const tocItems = parseSingular(channel?.items)
  const tocLis = parseArrayOf(tocItems?.seq, (seq) => seq?.li)?.flat()
  const itemUris = parseArrayOf(tocLis, (li) => parseString(li?.['@resource']), options?.maxItems)
  // Some generators give several items the same rdf:about.
  const unclaimedElements = parseArrayOf(itemElements, (element) => element) ?? []
  const tocElements: Array<unknown> = []

  for (const uri of itemUris ?? []) {
    const index = unclaimedElements.findIndex((element) => parseString(element?.['@about']) === uri)

    if (index !== -1) {
      tocElements.push(...unclaimedElements.splice(index, 1))
    }
  }

  const items = trimArray(tocElements, (value) => parseItem(value, options))

  if (items?.length) {
    return items
  }

  return parseArrayOf(itemElements, (value) => parseItem(value, options), options?.maxItems)
}

export const parseFeed: ParseUtilPartial<RdfFeed.Feed<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const channel = parseSingular(value.channel as Unreliable)
  const namespaces = detectNamespaces(channel)
  const feed = {
    title: parseSingularOf(channel?.title, (value) => parseString(retrieveText(value))),
    link: parseSingularOf(channel?.link, (value) => parseString(retrieveText(value))),
    description: parseSingularOf(channel?.description, (value) => parseString(retrieveText(value))),
    image: retrieveImage(value, options),
    items: retrieveItems(value, options),
    textInput: retrieveTextInput(value, options),
    rdf: retrieveRdfAbout(channel),
    atom: namespaces.has('atom') ? retrieveAtomFeed(channel, options) : undefined,
    dc: namespaces.has('dc') ? retrieveDcItemOrFeed(channel, options) : undefined,
    dcterms: namespaces.has('dcterms') ? retrieveDcTermsItemOrFeed(channel, options) : undefined,
    sy: namespaces.has('sy') ? retrieveSyFeed(channel, options) : undefined,
    media: namespaces.has('media') ? retrieveMediaItemOrFeed(channel) : undefined,
    feedburner: namespaces.has('feedburner') ? retrieveFeedBurnerFeed(channel) : undefined,
    opensearch: namespaces.has('opensearch') ? retrieveOpenSearchFeed(channel) : undefined,
    prism: namespaces.has('prism') ? retrievePrismItemOrFeed(channel, options) : undefined,
    cc: namespaces.has('cc') ? retrieveCc(channel) : undefined,
    admin: namespaces.has('admin') ? retrieveAdminFeed(channel) : undefined,
    geo: namespaces.has('geo') ? retrieveGeoItemOrFeed(channel) : undefined,
    georss: namespaces.has('georss') ? retrieveGeoRssItemOrFeed(channel) : undefined,
    xml: retrieveXmlItemOrFeed(value),
  }

  return trimObject(feed)
}

export const retrieveFeed: ParseUtilPartial<RdfFeed.Feed<DateAny>> = (value, options) => {
  return parseSingularOf(value?.rdf, (value) => parseFeed(value, options))
}
