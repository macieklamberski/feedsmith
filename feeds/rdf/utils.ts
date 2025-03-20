import type { ParseFunction } from '../../common/types'
import { hasAllProps, isObject, parseArrayOf, parseString } from '../../common/utils'
import { retrieveItem as retrieveContentNamespaceItem } from '../../namespaces/content/utils'
import { retrieveDublinCore as retrieveDublinCoreNamespaceFeed } from '../../namespaces/dc/utils'
import { retrieveFeed as retrieveSyndicationNamespaceFeed } from '../../namespaces/sy/utils'
import type { Feed, Image, Item, Textinput } from './types'

export const retrieveImage: ParseFunction<Image> = (value, level) => {
  if (!isObject(value?.image)) {
    return
  }

  const image = {
    title: parseString(value.image?.title?.['#text'], level),
    link: parseString(value.image?.link?.['#text'], level),
    url: parseString(value.image?.url?.['#text'], level),
  }

  // TODO: Consider implementing the logic of retrieving the image according to the spec.
  // Read the rdf:rdf.channel.image[rdf:resource] to get the image ID, then get it based
  // on rdf:about attribute.
  // Details: https://web.resource.org/rss/1.0/spec#s5.3.4.

  if (hasAllProps(image, ['title', 'link'])) {
    return image
  }
}

export const parseItem: ParseFunction<Item> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseString(value.title?.['#text'], level),
    link: parseString(value.link?.['#text'], level),
    description: parseString(value.description?.['#text'], level),
    content: retrieveContentNamespaceItem(value, level),
    dc: retrieveDublinCoreNamespaceFeed(value, level),
  }

  if (hasAllProps(item, ['title', 'link'])) {
    return item
  }
}

export const retrieveItems: ParseFunction<Array<Item>> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  // TODO: Consider implementing the logic of retrieving items more in line with the spec.
  // Read the rdf:rdf.channel.items.rdf:seq.rdf:li[resource|rdf:resource] to get the list
  // of items IDs, then get them based on rdf:about attribute.
  // Details: https://web.resource.org/rss/1.0/spec#s5.3.5.

  return parseArrayOf(value.item, parseItem, level)
}

export const retrieveTextinput: ParseFunction<Textinput> = (value, level) => {
  if (!isObject(value?.textinput)) {
    return
  }

  // TODO: Consider implementing the logic of retrieving the textinput according to the spec.
  // Read the rdf:rdf.channel.textinput[rdf:resource] to get the textinput ID, then get it based
  // on rdf:about attribute.
  // Details: https://web.resource.org/rss/1.0/spec#s5.3.6.

  const textinput = {
    title: parseString(value.textinput?.title?.['#text'], level),
    description: parseString(value.textinput?.description?.['#text'], level),
    name: parseString(value.textinput?.name?.['#text'], level),
    link: parseString(value.textinput?.link?.['#text'], level),
  }

  if (hasAllProps(textinput, Object.keys(textinput) as Array<keyof Textinput>)) {
    return textinput
  }
}

export const parseFeed: ParseFunction<Feed> = (value, level) => {
  const rdf = value?.['rdf:rdf']

  if (!isObject(rdf)) {
    return
  }

  const feed = {
    title: parseString(rdf.channel?.title?.['#text'], level),
    link: parseString(rdf.channel?.link?.['#text'], level),
    description: parseString(rdf.channel?.description?.['#text'], level),
    image: retrieveImage(rdf, level),
    items: retrieveItems(rdf, level),
    textinput: retrieveTextinput(rdf, level),
    dc: retrieveDublinCoreNamespaceFeed(rdf.channel, level),
    sy: retrieveSyndicationNamespaceFeed(rdf.channel, level),
  }

  if (hasAllProps(feed, ['title', 'items'])) {
    return feed
  }
}
