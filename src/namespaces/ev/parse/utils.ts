import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import { parseDate, parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { EvNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<EvNs.Item<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    startDate: parseSingularOf(value['ev:startdate'], (value) => {
      return parseDate(retrieveText(value), options?.parseDateFn)
    }),
    endDate: parseSingularOf(value['ev:enddate'], (value) => {
      return parseDate(retrieveText(value), options?.parseDateFn)
    }),
    location: parseSingularOf(value['ev:location'], (value) => parseString(retrieveText(value))),
    organizer: parseSingularOf(value['ev:organizer'], (value) => parseString(retrieveText(value))),
    type: parseSingularOf(value['ev:type'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
