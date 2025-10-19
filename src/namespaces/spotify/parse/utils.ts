import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Feed, Limit } from '../common/types.js'

export const parseLimit: ParsePartialUtil<Limit> = (value) => {
  if (!isObject(value)) {
    return
  }

  const limit = {
    recentCount: parseNumber(value['@recentcount']),
  }

  return trimObject(limit)
}

export const retrieveFeed: ParsePartialUtil<Feed> = (value) => {
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
