import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { RawvoiceNs } from '../common/types.js'

export const parseRating: ParsePartialUtil<RawvoiceNs.Rating> = (value) => {
  const rating = {
    value: parseString(retrieveText(value)),
    tv: parseString(value?.['@tv']),
    movie: parseString(value?.['@movie']),
  }

  return trimObject(rating)
}

export const parseLiveStream: ParsePartialUtil<RawvoiceNs.LiveStream<string>> = (value) => {
  const liveStream = {
    url: parseString(retrieveText(value)),
    schedule: parseDate(value?.['@schedule']),
    duration: parseString(value?.['@duration']),
    type: parseString(value?.['@type']),
  }

  return trimObject(liveStream)
}

export const parsePoster: ParsePartialUtil<RawvoiceNs.Poster> = (value) => {
  if (!isObject(value)) {
    return
  }

  const poster = {
    url: parseString(value['@url']),
  }

  return trimObject(poster)
}

export const parseAlternateEnclosure: ParsePartialUtil<RawvoiceNs.AlternateEnclosure> = (value) => {
  if (!isObject(value)) {
    return
  }

  const alternateEnclosure = {
    src: parseString(value['@src']),
    type: parseString(value['@type']),
    length: parseNumber(value['@length']),
  }

  return trimObject(alternateEnclosure)
}

export const parseSubscribe: ParsePartialUtil<RawvoiceNs.Subscribe> = (value) => {
  if (!isObject(value)) {
    return
  }

  const subscribe: RawvoiceNs.Subscribe = {}

  for (const key in value) {
    if (key.startsWith('@')) {
      const attrName = key.substring(1)
      const attrValue = parseString(value[key])
      if (attrValue) {
        subscribe[attrName] = attrValue
      }
    }
  }

  return trimObject(subscribe)
}

export const parseMetamark: ParsePartialUtil<RawvoiceNs.Metamark> = (value) => {
  if (!isObject(value)) {
    return
  }

  const metamark = {
    type: parseString(value['@type']),
    link: parseString(value['@link']),
    position: parseNumber(value['@position']),
    duration: parseNumber(value['@duration']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(metamark)
}

export const retrieveItem: ParsePartialUtil<RawvoiceNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    poster: parseSingularOf(value['rawvoice:poster'], parsePoster),
    isHd: parseSingularOf(value['rawvoice:ishd'], (value) => parseString(retrieveText(value))),
    embed: parseSingularOf(value['rawvoice:embed'], (value) => parseString(retrieveText(value))),
    webm: parseSingularOf(value['rawvoice:webm'], parseAlternateEnclosure),
    mp4: parseSingularOf(value['rawvoice:mp4'], parseAlternateEnclosure),
    metamarks: parseArrayOf(value['rawvoice:metamark'], parseMetamark),
  }

  return trimObject(item)
}

export const retrieveFeed: ParsePartialUtil<RawvoiceNs.Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    rating: parseSingularOf(value['rawvoice:rating'], parseRating),
    liveEmbed: parseSingularOf(value['rawvoice:liveembed'], (value) =>
      parseString(retrieveText(value)),
    ),
    flashLiveStream: parseSingularOf(value['rawvoice:flashlivestream'], parseLiveStream),
    httpLiveStream: parseSingularOf(value['rawvoice:httplivestream'], parseLiveStream),
    shoutcastLiveStream: parseSingularOf(value['rawvoice:shoutcastlivestream'], parseLiveStream),
    liveStream: parseSingularOf(value['rawvoice:livestream'], parseLiveStream),
    location: parseSingularOf(value['rawvoice:location'], (value) =>
      parseString(retrieveText(value)),
    ),
    frequency: parseSingularOf(value['rawvoice:frequency'], (value) =>
      parseString(retrieveText(value)),
    ),
    mycast: parseSingularOf(value['rawvoice:mycast'], (value) => parseString(retrieveText(value))),
    subscribe: parseSingularOf(value['rawvoice:subscribe'], parseSubscribe),
  }

  return trimObject(feed)
}
