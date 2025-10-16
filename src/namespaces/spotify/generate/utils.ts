import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { Feed } from '../common/types.js'

export const generateFeed: GenerateUtil<Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'spotify:limit': generateCdataString(feed.limit),
    'spotify:countryOfOrigin': generateCdataString(feed.countryOfOrigin),
  }

  return trimObject(value)
}
