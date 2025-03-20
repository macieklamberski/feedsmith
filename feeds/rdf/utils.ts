import type { ParseFunction } from '../../common/types'
import { hasAllProps, isObject, parseArrayOf, parseString } from '../../common/utils'
import { retrieveItem as retrieveContentNamespaceItem } from '../../namespaces/content/utils'
import { retrieveDublinCore as retrieveDublinCoreNamespaceFeed } from '../../namespaces/dc/utils'
import { retrieveFeed as retrieveSyndicationNamespaceFeed } from '../../namespaces/sy/utils'
import type { Feed, Image, Item, Textinput } from './types'

export const retrieveImage: ParseFunction<Image> = (value) => {
  if (!isObject(value?.image)) {
    return
  }

  const image = {
    title: parseString(value.image?.title?.['#text']),
    link: parseString(value.image?.link?.['#text']),
    url: parseString(value.image?.url?.['#text']),
  }

  // TODO: Consider implementing the logic of retrieving the image according to the spec.
  // Read the rdf:rdf.channel.image[rdf:resource] to get the image ID, then get it based
  // on rdf:about attribute.
  // Details: https://web.resource.org/rss/1.0/spec#s5.3.4.

  if (hasAllProps(image, ['title', 'link'])) {
    return image
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    description: parseString(value.description?.['#text']),
    content: retrieveContentNamespaceItem(value),
    dc: retrieveDublinCoreNamespaceFeed(value),
  }

  if (hasAllProps(item, ['title', 'link'])) {
    return item
  }
}

export const retrieveItems: ParseFunction<Array<Item>> = (value) => {
  if (!isObject(value)) {
    return
  }

  // TODO: Consider implementing the logic of retrieving items more in line with the spec.
  // Read the rdf:rdf.channel.items.rdf:seq.rdf:li[resource|rdf:resource] to get the list
  // of items IDs, then get them based on rdf:about attribute.
  // Details: https://web.resource.org/rss/1.0/spec#s5.3.5.

  return parseArrayOf(value.item, parseItem)
}

export const retrieveTextinput: ParseFunction<Textinput> = (value) => {
  if (!isObject(value?.textinput)) {
    return
  }

  // TODO: Consider implementing the logic of retrieving the textinput according to the spec.
  // Read the rdf:rdf.channel.textinput[rdf:resource] to get the textinput ID, then get it based
  // on rdf:about attribute.
  // Details: https://web.resource.org/rss/1.0/spec#s5.3.6.

  const textinput = {
    title: parseString(value.textinput?.title?.['#text']),
    description: parseString(value.textinput?.description?.['#text']),
    name: parseString(value.textinput?.name?.['#text']),
    link: parseString(value.textinput?.link?.['#text']),
  }

  if (hasAllProps(textinput, Object.keys(textinput) as Array<keyof Textinput>)) {
    return textinput
  }
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  const rdf = value?.['rdf:rdf']

  if (!isObject(rdf)) {
    return
  }

  const feed = {
    title: parseString(rdf.channel?.title?.['#text']),
    link: parseString(rdf.channel?.link?.['#text']),
    description: parseString(rdf.channel?.description?.['#text']),
    image: retrieveImage(rdf),
    items: retrieveItems(rdf),
    textinput: retrieveTextinput(rdf),
    dc: retrieveDublinCoreNamespaceFeed(rdf.channel),
    sy: retrieveSyndicationNamespaceFeed(rdf.channel),
  }

  if (hasAllProps(feed, ['title', 'items'])) {
    return feed
  }
}
