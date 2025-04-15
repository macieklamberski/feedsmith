import type { ParseFunction } from '../../common/types.js'
import { isObject, parseNumber, parseString, trimObject } from '../../common/utils.js'
import type { Feed } from './types.js'

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    updatePeriod: parseString(value['sy:updateperiod']?.['#text']),
    updateFrequency: parseNumber(value['sy:updatefrequency']?.['#text']),
    updateBase: parseString(value['sy:updatebase']?.['#text']),
  })

  return feed
}
