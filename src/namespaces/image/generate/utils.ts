import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import { generateNumber, generatePlainString } from '../../../common/utils.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '../../dc/generate/utils.js'
import type { ImageNs } from '../common/types.js'

export const generateImage: GenerateUtil<ImageNs.Image<DateLike>> = (image) => {
  if (!isPlainObject(image)) {
    return
  }

  const value = {
    '@rdf:about': generatePlainString(image.about),
    '@rdf:resource': generatePlainString(image.resource),
    'image:width': generateNumber(image.width),
    'image:height': generateNumber(image.height),
    ...generateDcItemOrFeed(image.dc),
  }

  return trimObject(value)
}

export const generateFavicon: GenerateUtil<ImageNs.Favicon<DateLike>> = (favicon) => {
  if (!isPlainObject(favicon)) {
    return
  }

  const value = {
    '@rdf:about': generatePlainString(favicon.about),
    '@image:size': generatePlainString(favicon.size),
    ...generateDcItemOrFeed(favicon.dc),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<ImageNs.Feed<DateLike>> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'image:favicon': generateFavicon(feed.favicon),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<ImageNs.Item<DateLike>> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'image:item': generateImage(item.item),
    'image:favicon': generateFavicon(item.favicon),
  }

  return trimObject(value)
}
