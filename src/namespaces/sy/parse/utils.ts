import type { ParsePartialFunction } from '@/common/types.js'
import {
  isObject,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '@/common/utils.js'
import type { Feed } from '@/namespaces/sy/common/types.js'

export const retrieveFeed: ParsePartialFunction<Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    updatePeriod: parseSingularOf(value['sy:updateperiod'], (value) =>
      parseString(retrieveText(value)),
    ),
    updateFrequency: parseSingularOf(value['sy:updatefrequency'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    updateBase: parseSingularOf(value['sy:updatebase'], (value) => parseDate(retrieveText(value))),
  }

  return trimObject(feed)
}
