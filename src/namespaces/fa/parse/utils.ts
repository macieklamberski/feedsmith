import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import { parseDate, parseNumber, parseSingularOf, retrieveText } from '../../../common/utils.js'
import type { FaNs } from '../common/types.js'

export const retrieveItemOrFeed: ParseUtilPartial<
  FaNs.ItemOrFeed<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const itemOrFeed = {
    expires: parseSingularOf(value['fa:expires'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    maxAge: parseSingularOf(value['fa:max-age'], (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(itemOrFeed)
}
