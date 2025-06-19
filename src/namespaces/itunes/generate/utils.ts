import type { GenerateFunction } from '../../../common/types.js'
import {
  generateCsvOf,
  generateYesNoBoolean,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { Category, Feed, Item, Owner } from '../common/types.js'

export const generateImage: GenerateFunction<string> = (image) => {
  if (!isNonEmptyString(image)) {
    return
  }

  return {
    '@href': image,
  }
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  return trimObject({
    '@text': category.text,
    'itunes:category': trimArray(category.categories?.map(generateCategory)),
  })
}

export const generateOwner: GenerateFunction<Owner> = (owner) => {
  if (!isObject(owner)) {
    return
  }

  return trimObject({
    'itunes:name': owner.name,
    'itunes:email': owner.email,
  })
}

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'itunes:duration': item.duration,
    'itunes:image': generateImage(item.image),
    'itunes:explicit': generateYesNoBoolean(item.explicit),
    'itunes:title': item.title,
    'itunes:episode': item.episode,
    'itunes:season': item.season,
    'itunes:episodeType': item.episodeType,
    'itunes:block': generateYesNoBoolean(item.block),
    'itunes:summary': item.summary,
    'itunes:subtitle': item.subtitle,
    'itunes:keywords': generateCsvOf(item.keywords),
  })
}

export const generateFeed: GenerateFunction<Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  return trimObject({
    'itunes:image': generateImage(feed.image),
    'itunes:category': trimArray(feed.categories?.map(generateCategory)),
    'itunes:explicit': generateYesNoBoolean(feed.explicit),
    'itunes:author': feed.author,
    'itunes:title': feed.title,
    'itunes:type': feed.type,
    'itunes:new-feed-url': feed.newFeedUrl,
    'itunes:block': generateYesNoBoolean(feed.block),
    'itunes:complete': generateYesNoBoolean(feed.complete),
    'itunes:apple-podcasts-verify': feed.applePodcastsVerify,
    'itunes:summary': feed.summary,
    'itunes:subtitle': feed.subtitle,
    'itunes:keywords': generateCsvOf(feed.keywords),
    'itunes:owner': generateOwner(feed.owner),
  })
}
