import type { ParseFunction } from '../../common/types'
import { hasAllProps, isObject, parseArrayOf, parseSingular, parseString } from '../../common/utils'
import { parseItem as parseContentNamespaceItem } from '../../namespaces/content/utils'
import { parseDublinCore as parseDublinCoreNamespaceFeed } from '../../namespaces/dc/utils'
import { parseFeed as retrieveSyndicationNamespaceFeed } from '../../namespaces/sy/utils'
import type { Feed, Image, Item, Textinput } from './types'

export const parseImage: ParseFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = {
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    url: parseString(value.url?.['#text']),
  }

  if (hasAllProps(image, ['title', 'link'])) {
    return image
  }
}

export const retrieveImage: ParseFunction<Image> = (value) => {
  return parseImage(value?.image)
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    description: parseString(value.description?.['#text']),
    content: parseContentNamespaceItem(value),
    dc: parseDublinCoreNamespaceFeed(value),
  }

  if (hasAllProps(item, ['title', 'link'])) {
    return item
  }
}

export const retrieveItems: ParseFunction<Array<Item>> = (value) => {
  if (!isObject(value)) {
    return
  }

  return parseArrayOf(value?.item, parseItem)
}

export const parseTextinput: ParseFunction<Textinput> = (value) => {
  if (!isObject(value)) {
    return
  }

  const textinput = {
    title: parseString(value.title?.['#text']),
    description: parseString(value.description?.['#text']),
    name: parseString(value.name?.['#text']),
    link: parseString(value.link?.['#text']),
  }

  if (hasAllProps(textinput, Object.keys(textinput) as Array<keyof Textinput>)) {
    return textinput
  }
}

export const retrieveTextinput: ParseFunction<Textinput> = (value) => {
  return parseTextinput(value?.textinput)
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
    dc: parseDublinCoreNamespaceFeed(rdf.channel),
    sy: retrieveSyndicationNamespaceFeed(rdf.channel),
  }

  if (hasAllProps(feed, ['title', 'items'])) {
    return feed
  }
}
