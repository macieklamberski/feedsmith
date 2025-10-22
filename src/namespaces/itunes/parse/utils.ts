import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseNumber,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { ItunesNs } from '../common/types.js'

export const parseCategory: ParsePartialUtil<ItunesNs.Category> = (value) => {
  if (!isObject(value)) {
    return
  }

  const category = {
    text: parseString(value['@text']),
    categories: parseArrayOf(value['itunes:category'], parseCategory),
  }

  return trimObject(category)
}

export const parseOwner: ParsePartialUtil<ItunesNs.Owner> = (value) => {
  if (!isObject(value)) {
    return
  }

  const owner = {
    name: parseSingularOf(value['itunes:name'], (value) => parseString(retrieveText(value))),
    email: parseSingularOf(value['itunes:email'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(owner)
}

const explicitOrYesRegex = /^\p{White_Space}*(explicit|yes)\p{White_Space}*$/iu

export const parseExplicit: ParsePartialUtil<boolean> = (value) => {
  const boolean = parseBoolean(value)

  if (boolean !== undefined) {
    return boolean
  }

  if (typeof value === 'string') {
    // There are also cases of "clean" and "f", but those are considered false.
    return explicitOrYesRegex.test(value)
  }
}

export const parseDuration: ParsePartialUtil<number> = (value) => {
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

export const parseImage: ParsePartialUtil<string> = (value) => {
  // Support non-standard format of the image tag where href is not provided in the @href
  // attribute but rather provided as a node value.
  if (isNonEmptyStringOrNumber(value)) {
    return parseString(value)
  }

  if (!isObject(value)) {
    return
  }

  return parseString(value['@href'])
}

export const retrieveItem: ParsePartialUtil<ItunesNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    duration: parseSingularOf(value['itunes:duration'], (value) =>
      parseDuration(retrieveText(value)),
    ),
    image: parseSingularOf(value['itunes:image'], parseImage),
    explicit: parseSingularOf(value['itunes:explicit'], (value) =>
      parseExplicit(retrieveText(value)),
    ),
    title: parseSingularOf(value['itunes:title'], (value) => parseString(retrieveText(value))),
    episode: parseSingularOf(value['itunes:episode'], (value) => parseNumber(retrieveText(value))),
    season: parseSingularOf(value['itunes:season'], (value) => parseNumber(retrieveText(value))),
    episodeType: parseSingularOf(value['itunes:episodetype'], (value) =>
      parseString(retrieveText(value)),
    ),
    block: parseSingularOf(value['itunes:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    summary: parseSingularOf(value['itunes:summary'], (value) => parseString(retrieveText(value))),
    subtitle: parseSingularOf(value['itunes:subtitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    keywords: parseSingularOf(value['itunes:keywords'], (value) =>
      parseCsvOf(retrieveText(value), parseString),
    ),
  }

  return trimObject(item)
}

export const retrieveFeed: ParsePartialUtil<ItunesNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    image: parseSingularOf(value['itunes:image'], parseImage),
    explicit: parseSingularOf(value['itunes:explicit'], (value) =>
      parseExplicit(retrieveText(value)),
    ),
    author: parseSingularOf(value['itunes:author'], (value) => parseString(retrieveText(value))),
    title: parseSingularOf(value['itunes:title'], (value) => parseString(retrieveText(value))),
    type: parseSingularOf(value['itunes:type'], (value) => parseString(retrieveText(value))),
    newFeedUrl: parseSingularOf(value['itunes:new-feed-url'], (value) =>
      parseString(retrieveText(value)),
    ),
    block: parseSingularOf(value['itunes:block'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    complete: parseSingularOf(value['itunes:complete'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    applePodcastsVerify: parseSingularOf(value['itunes:applepodcastsverify'], (value) =>
      parseString(retrieveText(value)),
    ),
    categories: parseArrayOf(value['itunes:category'], parseCategory),
    owner: parseSingularOf(value['itunes:owner'], parseOwner),
    summary: parseSingularOf(value['itunes:summary'], (value) => parseString(retrieveText(value))),
    subtitle: parseSingularOf(value['itunes:subtitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    keywords: parseSingularOf(value['itunes:keywords'], (value) =>
      parseCsvOf(retrieveText(value), parseString),
    ),
  }

  return trimObject(feed)
}
