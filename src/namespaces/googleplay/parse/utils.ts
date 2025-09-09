import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Feed, Image, Item } from '../common/types.js'

export const parseImage: ParsePartialFunction<Image> = (value) => {
  if (isObject(value) && value['@href']) {
    const image = {
      href: parseString(value['@href']),
    }

    return trimObject(image)
  }

  const text = retrieveText(value)
  if (text) {
    const image = {
      href: parseString(text),
    }

    return trimObject(image)
  }
}

export const parseCategory: ParsePartialFunction<string> = (value) => {
  if (isObject(value) && value['@text']) {
    return parseString(value['@text'])
  }

  return parseString(retrieveText(value))
}

export const retrieveItem: ParsePartialFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    author: parseSingularOf(value['googleplay:author'], (value) =>
      parseString(retrieveText(value)),
    ),
    description: parseSingularOf(value['googleplay:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    explicit: parseSingularOf(value['googleplay:explicit'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    block: parseSingularOf(value['googleplay:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    image: parseSingularOf(value['googleplay:image'], parseImage),
  }

  return trimObject(item)
}

export const retrieveFeed: ParsePartialFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    author: parseSingularOf(value['googleplay:author'], (value) =>
      parseString(retrieveText(value)),
    ),
    description: parseSingularOf(value['googleplay:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    explicit: parseSingularOf(value['googleplay:explicit'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    block: parseSingularOf(value['googleplay:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    image: parseSingularOf(value['googleplay:image'], parseImage),
    newFeedUrl: parseSingularOf(value['googleplay:new-feed-url'], (value) =>
      parseString(retrieveText(value)),
    ),
    email: parseSingularOf(value['googleplay:email'], (value) => parseString(retrieveText(value))),
    categories: parseArrayOf(value['googleplay:category'], parseCategory),
  }

  return trimObject(feed)
}
