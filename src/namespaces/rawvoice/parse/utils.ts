import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { RawVoiceNs } from '../common/types.js'

export const parseRating: ParseUtilPartial<RawVoiceNs.Rating> = (value) => {
  const rating = {
    value: parseString(retrieveText(value)),
    tv: parseString(value?.['@tv']),
    movie: parseString(value?.['@movie']),
  }

  return trimObject(rating)
}

export const parseLiveStream: ParseUtilPartial<
  RawVoiceNs.LiveStream<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  const liveStream = {
    url: parseString(retrieveText(value)),
    schedule: parseDate(value?.['@schedule'], options?.parseDateFn),
    duration: parseString(value?.['@duration']),
    type: parseString(value?.['@type']),
  }

  return trimObject(liveStream) as RawVoiceNs.LiveStream<DateAny> | undefined
}

export const parsePoster: ParseUtilPartial<RawVoiceNs.Poster> = (value) => {
  if (!isObject(value)) {
    return
  }

  const poster = {
    url: parseString(value['@url']),
  }

  return trimObject(poster)
}

export const parseAlternateEnclosure: ParseUtilPartial<RawVoiceNs.AlternateEnclosure> = (value) => {
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

export const parseSubscribe: ParseUtilPartial<RawVoiceNs.Subscribe> = (value) => {
  if (!isObject(value)) {
    return
  }

  const subscribe: RawVoiceNs.Subscribe = {}

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

export const parseMetamark: ParseUtilPartial<RawVoiceNs.Metamark> = (value) => {
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

export const parseDonate: ParseUtilPartial<RawVoiceNs.Donate> = (value) => {
  if (!isObject(value)) {
    return
  }

  const donate = {
    href: parseString(value['@href']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(donate)
}

export const retrieveItem: ParseUtilPartial<RawVoiceNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    poster: parseSingularOf(value['rawvoice:poster'], parsePoster),
    isHd: parseSingularOf(value['rawvoice:ishd'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    embed: parseSingularOf(value['rawvoice:embed'], (value) => parseString(retrieveText(value))),
    webm: parseSingularOf(value['rawvoice:webm'], parseAlternateEnclosure),
    mp4: parseSingularOf(value['rawvoice:mp4'], parseAlternateEnclosure),
    metamarks: parseArrayOf(value['rawvoice:metamark'], parseMetamark),
  }

  return trimObject(item)
}

export const retrieveFeed: ParseUtilPartial<RawVoiceNs.Feed<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    rating: parseSingularOf(value['rawvoice:rating'], parseRating),
    liveEmbed: parseSingularOf(value['rawvoice:liveembed'], (value) =>
      parseString(retrieveText(value)),
    ),
    flashLiveStream: parseSingularOf(value['rawvoice:flashlivestream'], (value) =>
      parseLiveStream(value, options),
    ),
    httpLiveStream: parseSingularOf(value['rawvoice:httplivestream'], (value) =>
      parseLiveStream(value, options),
    ),
    shoutcastLiveStream: parseSingularOf(value['rawvoice:shoutcastlivestream'], (value) =>
      parseLiveStream(value, options),
    ),
    liveStream: parseSingularOf(value['rawvoice:livestream'], (value) =>
      parseLiveStream(value, options),
    ),
    location: parseSingularOf(value['rawvoice:location'], (value) =>
      parseString(retrieveText(value)),
    ),
    frequency: parseSingularOf(value['rawvoice:frequency'], (value) =>
      parseString(retrieveText(value)),
    ),
    mycast: parseSingularOf(value['rawvoice:mycast'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
    subscribe: parseSingularOf(value['rawvoice:subscribe'], parseSubscribe),
    donate: parseSingularOf(value['rawvoice:donate'], parseDonate),
  }

  return trimObject(feed)
}
