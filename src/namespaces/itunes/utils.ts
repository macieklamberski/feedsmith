import type { ParseFunction } from '../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
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
    name: parseString(value['itunes:name']?.['#text']),
    email: parseString(value['itunes:email']?.['#text']),
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

  const itunes = parseString(value['itunes:applepodcastsverify']?.['#text'])
  // TODO: Implement support for <podcast:txt purpose=“applepodcastsverify”>.
  // On the other hand, shouldn't this be the domain of podcast namespace? Food for thought.

  return itunes
}

export const parseKeywords: ParseFunction<Array<string>> = (value) => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  return trimArray(
    parseString(value)
      ?.split(',')
      ?.map((keyword) => keyword.trim() || undefined) || [],
  )
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    duration: parseDuration(value['itunes:duration']?.['#text']),
    image: parseString(value['itunes:image']),
    explicit: parseExplicit(value['itunes:explicit']?.['#text']),
    title: parseString(value['itunes:title']?.['#text']),
    episode: parseNumber(value['itunes:episode']?.['#text']),
    season: parseNumber(value['itunes:season']?.['#text']),
    episodeTitle: parseString(value['itunes:episodeType']?.['#text']),
    block: parseYesNoBoolean(value['itunes:block']?.['#text']),
    summary: parseString(value['itunes:summary']?.['#text']),
    subtitle: parseString(value['itunes:subtitle']?.['#text']),
    keywords: parseKeywords(value['itunes:keywords']?.['#text']),
  })

  return item
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    image: parseString(value['itunes:image']?.['@href']),
    explicit: parseExplicit(value['itunes:explicit']?.['#text']),
    author: parseString(value['itunes:author']?.['#text']),
    title: parseString(value['itunes:title']?.['#text']),
    type: parseString(value['itunes:type']?.['#text']),
    newFeedUrl: parseString(value['itunes:new-feed-url']?.['#text']),
    block: parseYesNoBoolean(value['itunes:block']?.['#text']),
    complete: parseYesNoBoolean(value['itunes:complete']?.['#text']),
    applePodcastsVerify: retrieveApplePodcastsVerify(value),
    categories: parseArrayOf(value['itunes:category'], parseCategory),
    owner: parseOwner(value['itunes:owner']),
    summary: parseString(value['itunes:summary']?.['#text']),
    subtitle: parseString(value['itunes:subtitle']?.['#text']),
    keywords: parseKeywords(value['itunes:keywords']?.['#text']),
  })

  return feed
}
