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

export const parseImage: ParseFunction<string> = (value) => {
  // Support non-standard format of the image tag where href is not provided in the @href
  // attribute but rather provided as a node value.
  if (isNonEmptyStringOrNumber(value)) {
    return parseString(value)
  }

  if (!isObject(value)) {
    return
  }

  return parseString(retrieveText(value['@href']))
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

export const retrieveItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    duration: parseSingularOf(value['itunes:duration'], (value) =>
      parseDuration(retrieveText(value)),
    ),
    image: parseSingularOf(value['itunes:image'], parseImage),
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

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    image: parseSingularOf(value['itunes:image'], parseImage),
    explicit: parseSingularOf(value['itunes:explicit'], (value) =>
      parseExplicit(retrieveText(value)),
    ),
    author: parseSingularOf(value['itunes:author'], parseTextString),
    title: parseSingularOf(value['itunes:title'], parseTextString),
    type: parseSingularOf(value['itunes:type'], parseTextString),
    newFeedUrl: parseSingularOf(value['itunes:new-feed-url'], parseTextString),
    block: parseSingularOf(value['itunes:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    complete: parseSingularOf(value['itunes:complete'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    applePodcastsVerify: parseSingularOf(value['itunes:applepodcastsverify'], parseTextString),
    categories: parseArrayOf(value['itunes:category'], parseCategory),
    owner: parseSingularOf(value['itunes:owner'], parseOwner),
    summary: parseSingularOf(value['itunes:summary'], parseTextString),
    subtitle: parseSingularOf(value['itunes:subtitle'], parseTextString),
    keywords: parseSingularOf(value['itunes:keywords'], (value) =>
      parseKeywords(retrieveText(value)),
    ),
  })

  return feed
}
