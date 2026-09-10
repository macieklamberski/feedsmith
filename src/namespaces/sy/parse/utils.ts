import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { SyNs } from '../common/types.js'

export const retrieveFeed: ParseUtilPartial<SyNs.Feed<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
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
    updateBase: parseSingularOf(value['sy:updatebase'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
  }

  return trimObject(feed)
}
