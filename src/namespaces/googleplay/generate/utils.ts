import type { GenerateFunction } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Feed, Image, Item } from '../common/types.js'

const generateImage: GenerateFunction<Image> = (image) => {
  if (!isObject(image)) {
    return
  }

  const value = {
    '@href': generatePlainString(image.href),
  }

  return trimObject(value)
}

const generateCategory: GenerateFunction<string> = (category) => {
  const value = {
    '@text': generatePlainString(category),
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'googleplay:author': generatePlainString(item.author),
    'googleplay:description': generateCdataString(item.description),
    'googleplay:explicit': generateYesNoBoolean(item.explicit),
    'googleplay:block': generateYesNoBoolean(item.block),
    'googleplay:image': generateImage(item.image),
  })
}

export const generateFeed: GenerateFunction<Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  return trimObject({
    'googleplay:author': generatePlainString(feed.author),
    'googleplay:description': generateCdataString(feed.description),
    'googleplay:explicit': generateYesNoBoolean(feed.explicit),
    'googleplay:block': generateYesNoBoolean(feed.block),
    'googleplay:image': generateImage(feed.image),
    'googleplay:new-feed-url': generatePlainString(feed.newFeedUrl),
    'googleplay:email': generatePlainString(feed.email),
    'googleplay:category': trimArray(feed.categories, generateCategory),
  })
}
