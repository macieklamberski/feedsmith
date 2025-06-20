import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseDate,
  parseSingularOf,
  parseTextNumber,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Feed } from '../common/types.js'

export const retrieveFeed: ParsePartialFunction<Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    updatePeriod: parseSingularOf(value['sy:updateperiod'], parseTextString),
    updateFrequency: parseSingularOf(value['sy:updatefrequency'], parseTextNumber),
    updateBase: parseSingularOf(value['sy:updatebase'], (value) => parseDate(retrieveText(value))),
  }

  return trimObject(feed)
}
