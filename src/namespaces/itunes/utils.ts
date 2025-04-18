import type { ParseFunction } from '../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextNumber,
  parseTextString,
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
    name: parseSingularOf(value['itunes:name'], parseTextString),
    email: parseSingularOf(value['itunes:email'], parseTextString),
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

  const itunes = parseSingularOf(value['itunes:applepodcastsverify'], parseTextString)
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
    image: parseSingularOf(value['itunes:image'], parseTextString),
    explicit: parseSingularOf(value['itunes:explicit'], (value) =>
      parseExplicit(retrieveText(value)),
    ),
    title: parseSingularOf(value['itunes:title'], parseTextString),
    episode: parseSingularOf(value['itunes:episode'], parseTextNumber),
    season: parseSingularOf(value['itunes:season'], parseTextNumber),
    episodeTitle: parseSingularOf(value['itunes:episodetype'], parseTextString),
    block: parseSingularOf(value['itunes:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    summary: parseSingularOf(value['itunes:summary'], parseTextString),
    subtitle: parseSingularOf(value['itunes:subtitle'], parseTextString),
    keywords: parseSingularOf(value['itunes:keywords'], (value) =>
      parseKeywords(retrieveText(value)),
    ),
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
    author: parseSingularOf(value['itunes:author'], parseTextString),
    title: parseSingularOf(value['itunes:title'], parseTextString),
    type: parseSingularOf(value['itunes:type'], parseTextString),
    newFeedUrl: parseSingularOf(value['itunes:new-feed-url'], parseTextString),
    block: parseYesNoBoolean(retrieveText(value['itunes:block'])),
    complete: parseYesNoBoolean(retrieveText(value['itunes:complete'])),
    applePodcastsVerify: retrieveApplePodcastsVerify(value),
    categories: parseArrayOf(value['itunes:category'], parseCategory),
    owner: parseOwner(value['itunes:owner']),
    summary: parseSingularOf(value['itunes:summary'], parseTextString),
    subtitle: parseSingularOf(value['itunes:subtitle'], parseTextString),
    keywords: parseKeywords(retrieveText(value['itunes:keywords'])),
  })

  return feed
}
