import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateNumber,
  generatePlainString,
} from '../../../common/utils.js'
import type { WebfeedsNs } from '../common/types.js'

export const generateCover: GenerateUtil<WebfeedsNs.Cover> = (cover) => {
  if (!isPlainObject(cover)) {
    return
  }

  const value = {
    '@image': generatePlainString(cover.image),
  }

  return trimObject(value)
}

export const generateRelated: GenerateUtil<WebfeedsNs.Related> = (related) => {
  if (!isPlainObject(related)) {
    return
  }

  const value = {
    '@layout': generatePlainString(related.layout),
    '@target': generatePlainString(related.target),
  }

  return trimObject(value)
}

export const generateAnalytics: GenerateUtil<WebfeedsNs.Analytics> = (analytics) => {
  if (!isPlainObject(analytics)) {
    return
  }

  const value = {
    '@id': generatePlainString(analytics.id),
    '@engine': generatePlainString(analytics.engine),
  }

  return trimObject(value)
}

export const generateFeaturedImage: GenerateUtil<WebfeedsNs.FeaturedImage> = (featuredImage) => {
  if (!isPlainObject(featuredImage)) {
    return
  }

  const value = {
    '@url': generatePlainString(featuredImage.url),
    '@type': generatePlainString(featuredImage.type),
    '@width': generateNumber(featuredImage.width),
    '@height': generateNumber(featuredImage.height),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<WebfeedsNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'webfeeds:cover': generateCover(feed.cover),
    'webfeeds:icon': generateCdataString(feed.icon),
    'webfeeds:logo': generateCdataString(feed.logo),
    'webfeeds:accentColor': generateCdataString(feed.accentColor),
    'webfeeds:related': generateRelated(feed.related),
    'webfeeds:analytics': generateAnalytics(feed.analytics),
    'webfeeds:partial': generateBoolean(feed.partial),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<WebfeedsNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'webfeeds:featuredImage': generateFeaturedImage(item.featuredImage),
  }

  return trimObject(value)
}
