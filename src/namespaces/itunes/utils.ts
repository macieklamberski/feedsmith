import type { ParseFunction } from '../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
  retrieveText,
  trimArray,
  trimObject,
} from '../../common/utils.js'
import type { Category, Feed, Item, Owner } from './types.js'

export const parseCategory: ParseFunction<Category> = (value) => {
  if (!isObject(value)) {
    return
  }

  const category = {
    text: parseString(value['@text']),
    categories: parseArrayOf(value['itunes:category'], parseCategory),
  }

  if (isPresent(category.text)) {
    return trimObject(category)
  }
}

export const parseOwner: ParseFunction<Owner> = (value) => {
  if (!isObject(value)) {
    return
  }

  const owner = {
    name: parseString(retrieveText(value['itunes:name'])),
    email: parseString(retrieveText(value['itunes:email'])),
  }

  if (isPresent(owner.name) || isPresent(owner.email)) {
    return trimObject(owner)
  }
}

export const parseYesNoBoolean: ParseFunction<boolean> = (value) => {
  const boolean = parseBoolean(value)

  if (boolean !== undefined) {
    return boolean
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'yes'
  }
}

export const parseExplicit: ParseFunction<boolean> = (value) => {
  const boolean = parseBoolean(value)

  if (boolean !== undefined) {
    return boolean
  }

  if (typeof value === 'string') {
    const lowercase = value.toLowerCase()

    // There are also cases of "clean" and "f", but those are considered false.
    return lowercase === 'explicit' || lowercase === 'yes'
  }
}

export const parseDuration: ParseFunction<number> = (value) => {
  const duration = parseNumber(value)

  if (duration !== undefined) {
    return duration
  }

  if (typeof value !== 'string') {
    return
  }

  // Handle HH:MM:SS and MM:SS format.
  const match = value.match(/^(?:(\d+):)?(\d+):(\d+)$/)

  if (match) {
    const [, hours, minutes, seconds] = match
    return Number(hours || 0) * 3600 + Number(minutes) * 60 + Number(seconds)
  }
}

export const retrieveApplePodcastsVerify: ParseFunction<string> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itunes = parseString(retrieveText(value['itunes:applepodcastsverify']))
  // TODO: Implement support for <podcast:txt purpose=“applepodcastsverify”>.
  // On the other hand, shouldn't this be the domain of podcast namespace? Food for thought.

  return itunes
}

export const parseKeywords: ParseFunction<Array<string>> = (value) => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  const keywords = parseString(value)?.split(',')

  if (keywords) {
    return trimArray(keywords, (keyword) => parseString(keyword) || undefined)
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    duration: parseDuration(retrieveText(value['itunes:duration'])),
    image: parseString(value['itunes:image']),
    explicit: parseExplicit(retrieveText(value['itunes:explicit'])),
    title: parseString(retrieveText(value['itunes:title'])),
    episode: parseNumber(retrieveText(value['itunes:episode'])),
    season: parseNumber(retrieveText(value['itunes:season'])),
    episodeTitle: parseString(retrieveText(value['itunes:episodeType'])),
    block: parseYesNoBoolean(retrieveText(value['itunes:block'])),
    summary: parseString(retrieveText(value['itunes:summary'])),
    subtitle: parseString(retrieveText(value['itunes:subtitle'])),
    keywords: parseKeywords(retrieveText(value['itunes:keywords'])),
  })

  return item
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    image: parseString(value['itunes:image']?.['@href']),
    explicit: parseExplicit(retrieveText(value['itunes:explicit'])),
    author: parseString(retrieveText(value['itunes:author'])),
    title: parseString(retrieveText(value['itunes:title'])),
    type: parseString(retrieveText(value['itunes:type'])),
    newFeedUrl: parseString(retrieveText(value['itunes:new-feed-url'])),
    block: parseYesNoBoolean(retrieveText(value['itunes:block'])),
    complete: parseYesNoBoolean(retrieveText(value['itunes:complete'])),
    applePodcastsVerify: retrieveApplePodcastsVerify(value),
    categories: parseArrayOf(value['itunes:category'], parseCategory),
    owner: parseOwner(value['itunes:owner']),
    summary: parseString(retrieveText(value['itunes:summary'])),
    subtitle: parseString(retrieveText(value['itunes:subtitle'])),
    keywords: parseKeywords(retrieveText(value['itunes:keywords'])),
  })

  return feed
}
