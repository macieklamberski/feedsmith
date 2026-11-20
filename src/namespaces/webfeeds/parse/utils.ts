import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  parseBoolean,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { WebfeedsNs } from '../common/types.js'

export const parseCover: ParseUtilPartial<WebfeedsNs.Cover> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const cover = {
    image: parseString(value['@image']),
  }

  return trimObject(cover)
}

export const parseRelated: ParseUtilPartial<WebfeedsNs.Related> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const related = {
    layout: parseString(value['@layout']),
    target: parseString(value['@target']),
  }

  return trimObject(related)
}

export const parseAnalytics: ParseUtilPartial<WebfeedsNs.Analytics> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const analytics = {
    id: parseString(value['@id']),
    engine: parseString(value['@engine']),
  }

  return trimObject(analytics)
}

export const parseFeaturedImage: ParseUtilPartial<WebfeedsNs.FeaturedImage> = (value) => {
  // Some feeds write the image URL as element text, with no url attribute.
  if (isNonEmptyStringOrNumber(value)) {
    const featuredImage = {
      url: parseString(value),
    }

    return trimObject(featuredImage)
  }

  if (!isPlainObject(value)) {
    return
  }

  const featuredImage = {
    url: parseString(value['@url']) ?? parseString(value['#text']),
    type: parseString(value['@type']),
    width: parseNumber(value['@width']),
    height: parseNumber(value['@height']),
  }

  return trimObject(featuredImage)
}

export const retrieveFeed: ParseUtilPartial<WebfeedsNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    cover: parseSingularOf(value['webfeeds:cover'], parseCover),
    icon: parseSingularOf(value['webfeeds:icon'], (value) => parseString(retrieveText(value))),
    logo: parseSingularOf(value['webfeeds:logo'], (value) => parseString(retrieveText(value))),
    accentColor: parseSingularOf(value['webfeeds:accentcolor'], (value) =>
      parseString(retrieveText(value)),
    ),
    related: parseSingularOf(value['webfeeds:related'], parseRelated),
    analytics: parseSingularOf(value['webfeeds:analytics'], parseAnalytics),
    partial: parseSingularOf(value['webfeeds:partial'], (value) =>
      parseBoolean(retrieveText(value)),
    ),
    wordmark: parseSingularOf(value['webfeeds:wordmark'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<WebfeedsNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    featuredImage: parseSingularOf(value['webfeeds:featuredimage'], parseFeaturedImage),
    featuredVisual: parseSingularOf(value['webfeeds:featuredvisual'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
