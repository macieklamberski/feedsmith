import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateYesNoBoolean,
  trimArray,
} from '../../../common/utils.js'
import type { GooglePlayNs } from '../common/types.js'

const generateImage: GenerateUtil<GooglePlayNs.Image> = (image) => {
  if (!isPlainObject(image)) {
    return
  }

  const value = {
    '@href': generatePlainString(image.href),
  }

  return trimObject(value)
}

const generateCategory: GenerateUtil<string> = (category) => {
  const value = {
    '@text': generatePlainString(category),
  }

  return trimObject(value)
}

const generateExplicit: GenerateUtil<boolean | 'clean'> = (explicit) => {
  if (explicit === 'clean') {
    return explicit
  }

  return generateYesNoBoolean(explicit)
}

export const generateItem: GenerateUtil<GooglePlayNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  return trimObject({
    'googleplay:author': generateCdataString(item.author),
    'googleplay:description': generateCdataString(item.description),
    'googleplay:explicit': generateExplicit(item.explicit),
    'googleplay:block': generateYesNoBoolean(item.block),
    'googleplay:image': generateImage(item.image),
  })
}

export const generateFeed: GenerateUtil<GooglePlayNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  return trimObject({
    'googleplay:author': generateCdataString(feed.author),
    'googleplay:description': generateCdataString(feed.description),
    'googleplay:explicit': generateExplicit(feed.explicit),
    'googleplay:block': generateYesNoBoolean(feed.block),
    'googleplay:image': generateImage(feed.image),
    'googleplay:newFeedUrl': generateCdataString(feed.newFeedUrl),
    'googleplay:email': generateCdataString(feed.email),
    'googleplay:owner': generateCdataString(feed.owner),
    'googleplay:category': trimArray(feed.categories, generateCategory),
  })
}
