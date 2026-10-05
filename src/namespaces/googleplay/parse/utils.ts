import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
} from '../../../common/utils.js'
import type { GooglePlayNs } from '../common/types.js'

export const parseImage: ParseUtilPartial<GooglePlayNs.Image> = (value) => {
  if (isPlainObject(value) && value['@href']) {
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

export const parseCategory: ParseUtilPartial<string> = (value) => {
  if (isPlainObject(value) && value['@text']) {
    return parseString(value['@text'])
  }

  return parseString(retrieveText(value))
}

export const parseExplicit: ParseUtilPartial<boolean | 'clean'> = (value) => {
  const explicit = retrieveText(value)?.trim().toLowerCase()

  if (explicit === 'clean') {
    return explicit
  }

  return parseYesNoBoolean(retrieveText(value))
}

export const retrieveItem: ParseUtilPartial<GooglePlayNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    author: parseSingularOf(value['googleplay:author'], (value) =>
      parseString(retrieveText(value)),
    ),
    description: parseSingularOf(value['googleplay:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    explicit: parseSingularOf(value['googleplay:explicit'], parseExplicit),
    block: parseSingularOf(value['googleplay:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    image: parseSingularOf(value['googleplay:image'], parseImage),
  }

  return trimObject(item)
}

// See: https://www.google.com/schemas/play-podcasts/1.0/play-podcasts.xsd, which names it newFeedUrl.
export const retrieveNewFeedUrl: ParseUtilPartial<string> = (value) => {
  return (
    parseSingularOf(value['googleplay:new-feed-url'], (value) =>
      parseString(retrieveText(value)),
    ) ??
    parseSingularOf(value['googleplay:newfeedurl'], (value) => parseString(retrieveText(value)))
  )
}

export const retrieveFeed: ParseUtilPartial<GooglePlayNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    author: parseSingularOf(value['googleplay:author'], (value) =>
      parseString(retrieveText(value)),
    ),
    description: parseSingularOf(value['googleplay:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    explicit: parseSingularOf(value['googleplay:explicit'], parseExplicit),
    block: parseSingularOf(value['googleplay:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    image: parseSingularOf(value['googleplay:image'], parseImage),
    newFeedUrl: retrieveNewFeedUrl(value),
    email: parseSingularOf(value['googleplay:email'], (value) => parseString(retrieveText(value))),
    owner: parseSingularOf(value['googleplay:owner'], (value) => parseString(retrieveText(value))),
    categories: parseArrayOf(value['googleplay:category'], parseCategory),
  }

  return trimObject(feed)
}
