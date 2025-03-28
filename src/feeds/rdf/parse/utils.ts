import type { ParseFunction } from '../../../common/types'
import {
  hasAllProps,
  isObject,
  omitUndefinedFromObject,
  parseArrayOf,
  parseString,
} from '../../../common/utils'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../namespaces/atom/utils'
import { parseItem as parseContentItem } from '../../../namespaces/content/utils'
import { parseItemOrFeed as parseDcItemOrFeed } from '../../../namespaces/dc/utils'
import { parseFeed as parseSyFeed } from '../../../namespaces/sy/utils'
import type { Feed, Image, Item, Textinput } from './types'

export const parseImage: ParseFunction<Image> = (value) => {
  if (!isObject(value)) {
    return
  }

  const image = omitUndefinedFromObject({
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    url: parseString(value.url?.['#text']),
  })

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

  const item = omitUndefinedFromObject({
    title: parseString(value.title?.['#text']),
    link: parseString(value.link?.['#text']),
    description: parseString(value.description?.['#text']),
    atom: parseAtomEntry(value),
    content: parseContentItem(value),
    dc: parseDcItemOrFeed(value),
  })

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

  const textinput = omitUndefinedFromObject({
    title: parseString(value.title?.['#text']),
    description: parseString(value.description?.['#text']),
    name: parseString(value.name?.['#text']),
    link: parseString(value.link?.['#text']),
  })

  if (hasAllProps(textinput, ['title', 'description', 'name', 'link'])) {
    return textinput
  }
}

export const retrieveTextinput: ParseFunction<Textinput> = (value) => {
  return parseTextinput(value?.textinput)
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = omitUndefinedFromObject({
    title: parseString(value.channel?.title?.['#text']),
    link: parseString(value.channel?.link?.['#text']),
    description: parseString(value.channel?.description?.['#text']),
    image: retrieveImage(value),
    items: retrieveItems(value),
    textinput: retrieveTextinput(value),
    atom: parseAtomFeed(value.channel),
    dc: parseDcItemOrFeed(value.channel),
    sy: parseSyFeed(value.channel),
  })

  if (hasAllProps(feed, ['title'])) {
    return feed
  }
}

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value?.['rdf:rdf'])) {
    return
  }

  return parseFeed(value['rdf:rdf'])
}
