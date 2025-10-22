import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { SpotifyNs } from '../common/types.js'

export const parseLimit: ParsePartialUtil<SpotifyNs.Limit> = (value) => {
  if (!isObject(value)) {
    return
  }

  const limit = {
    recentCount: parseNumber(value['@recentcount']),
  }

  return trimObject(limit)
}

export const retrieveFeed: ParsePartialUtil<SpotifyNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    limit: parseSingularOf(value['spotify:limit'], parseLimit),
    countryOfOrigin: parseSingularOf(value['spotify:countryoforigin'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}
