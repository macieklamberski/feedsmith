import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { GoogleplayNs } from '../common/types.js'

const generateImage: GenerateUtil<GoogleplayNs.Image> = (image) => {
  if (!isObject(image)) {
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

export const generateItem: GenerateUtil<GoogleplayNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'googleplay:author': generatePlainString(item.author),
    'googleplay:description': generateCdataString(item.description),
    'googleplay:explicit': generateExplicit(item.explicit),
    'googleplay:block': generateYesNoBoolean(item.block),
    'googleplay:image': generateImage(item.image),
  })
}

export const generateFeed: GenerateUtil<GoogleplayNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  return trimObject({
    'googleplay:author': generatePlainString(feed.author),
    'googleplay:description': generateCdataString(feed.description),
    'googleplay:explicit': generateExplicit(feed.explicit),
    'googleplay:block': generateYesNoBoolean(feed.block),
    'googleplay:image': generateImage(feed.image),
    'googleplay:new-feed-url': generatePlainString(feed.newFeedUrl),
    'googleplay:email': generatePlainString(feed.email),
    'googleplay:category': trimArray(feed.categories, generateCategory),
  })
}
