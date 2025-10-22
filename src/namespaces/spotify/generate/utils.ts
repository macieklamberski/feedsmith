import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, generateNumber, isObject, trimObject } from '../../../common/utils.js'
import type { SpotifyNs } from '../common/types.js'

export const generateLimit: GenerateUtil<SpotifyNs.Limit> = (limit) => {
  if (!isObject(limit)) {
    return
  }

  const value = {
    '@recentCount': generateNumber(limit.recentCount),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<SpotifyNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'spotify:limit': generateLimit(feed.limit),
    'spotify:countryOfOrigin': generateCdataString(feed.countryOfOrigin),
  }

  return trimObject(value)
}
