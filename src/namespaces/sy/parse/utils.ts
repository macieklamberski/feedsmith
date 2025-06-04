import type { ParseFunction } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseTextNumber,
  parseTextString,
  trimObject,
} from '../../../common/utils.js'
import type { Feed } from '../common/types.js'

export const retrieveFeed: ParseFunction<Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    updatePeriod: parseSingularOf(value['sy:updateperiod'], parseTextString),
    updateFrequency: parseSingularOf(value['sy:updatefrequency'], parseTextNumber),
    updateBase: parseSingularOf(value['sy:updatebase'], parseTextString),
  }

  return trimObject(feed) as Feed<string>
}
