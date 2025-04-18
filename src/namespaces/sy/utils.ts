import type { ParseFunction } from '../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseTextNumber,
  parseTextString,
  trimObject,
} from '../../common/utils.js'
import type { Feed } from './types.js'

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    updatePeriod: parseSingularOf(value['sy:updateperiod'], parseTextString),
    updateFrequency: parseSingularOf(value['sy:updatefrequency'], parseTextNumber),
    updateBase: parseSingularOf(value['sy:updatebase'], parseTextString),
  })

  return feed
}
