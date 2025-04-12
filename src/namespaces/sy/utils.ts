import type { ParseFunction } from '../../common/types.js'
import {
  hasAnyProps,
  isNonEmptyObject,
  isObject,
  omitUndefinedFromObject,
  parseNumber,
  parseString,
} from '../../common/utils.js'
import type { Feed } from './types.js'

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    updatePeriod: parseString(value['sy:updateperiod']?.['#text']),
    updateFrequency: parseNumber(value['sy:updatefrequency']?.['#text']),
    updateBase: parseString(value['sy:updatebase']?.['#text']),
  }

  if (hasAnyProps(feed, ['updatePeriod', 'updateFrequency', 'updateBase'])) {
    return omitUndefinedFromObject(feed)
  }
}
