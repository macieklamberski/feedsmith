import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseDate,
  parseSingularOf,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { AppNs } from '../common/types.js'

export const parseControl: ParseUtilPartial<AppNs.Control> = (value) => {
  if (!isObject(value)) {
    return
  }

  const control = {
    draft: parseSingularOf(value['app:draft'], (value) => parseYesNoBoolean(retrieveText(value))),
  }

  return trimObject(control)
}

export const retrieveEntry: ParseUtilPartial<AppNs.Entry<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value)) {
    return
  }

  const entry = {
    edited: parseSingularOf(value['app:edited'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    control: parseSingularOf(value['app:control'], parseControl),
  }

  return trimObject(entry)
}
