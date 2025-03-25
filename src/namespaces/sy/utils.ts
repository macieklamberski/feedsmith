import type { ParseFunction } from '../../common/types'
import {
  isNonEmptyObject,
  isObject,
  omitUndefinedFromObject,
  parseNumber,
  parseString,
} from '../../common/utils'
import type { Feed } from './types'

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = omitUndefinedFromObject({
    updatePeriod: parseString(value['sy:updateperiod']?.['#text']),
    updateFrequency: parseNumber(value['sy:updatefrequency']?.['#text']),
    updateBase: parseString(value['sy:updatebase']?.['#text']),
  })

  if (isNonEmptyObject(feed)) {
    return feed
  }
}
