import type { GenerateFunction } from '@/common/types.js'
import {
  generateCdataString,
  generateCsvOf,
  generateNumber,
  generatePlainString,
  generateYesNoBoolean,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '@/common/utils.js'
import type { Category, Feed, Item, Owner } from '@/namespaces/itunes/common/types.js'

export const generateImage: GenerateFunction<string> = (image) => {
  if (!isNonEmptyString(image)) {
    return
  }

  return {
    '@href': generatePlainString(image),
  }
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  const value = {
    '@text': generatePlainString(category.text),
    'itunes:category': trimArray(category.categories, generateCategory),
  }

  return trimObject(value)
}

export const generateOwner: GenerateFunction<Owner> = (owner) => {
  if (!isObject(owner)) {
    return
  }

  const value = {
    'itunes:name': generateCdataString(owner.name),
    'itunes:email': generateCdataString(owner.email),
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'itunes:duration': generateNumber(item.duration),
    'itunes:image': generateImage(item.image),
    'itunes:explicit': generateYesNoBoolean(item.explicit),
    'itunes:title': generateCdataString(item.title),
    'itunes:episode': generateNumber(item.episode),
    'itunes:season': generateNumber(item.season),
    'itunes:episodeType': generateCdataString(item.episodeType),
    'itunes:block': generateYesNoBoolean(item.block),
    'itunes:summary': generateCdataString(item.summary),
    'itunes:subtitle': generateCdataString(item.subtitle),
    'itunes:keywords': generateCsvOf(item.keywords),
  }

  return trimObject(value)
}

export const generateFeed: GenerateFunction<Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'itunes:image': generateImage(feed.image),
    'itunes:category': trimArray(feed.categories, generateCategory),
    'itunes:explicit': generateYesNoBoolean(feed.explicit),
    'itunes:author': generateCdataString(feed.author),
    'itunes:title': generateCdataString(feed.title),
    'itunes:type': generateCdataString(feed.type),
    'itunes:new-feed-url': generateCdataString(feed.newFeedUrl),
    'itunes:block': generateYesNoBoolean(feed.block),
    'itunes:complete': generateYesNoBoolean(feed.complete),
    'itunes:applepodcastsverify': generateCdataString(feed.applePodcastsVerify),
    'itunes:summary': generateCdataString(feed.summary),
    'itunes:subtitle': generateCdataString(feed.subtitle),
    'itunes:keywords': generateCsvOf(feed.keywords),
    'itunes:owner': generateOwner(feed.owner),
  }

  return trimObject(value)
}
