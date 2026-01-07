import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseDate,
  parseSingularOf,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { AppNs } from '../common/types.js'

export const parseControl: ParsePartialUtil<AppNs.Control> = (value) => {
  if (!isObject(value)) {
    return
  }

  const control = {
    draft: parseSingularOf(value['app:draft'], (value) => parseYesNoBoolean(retrieveText(value))),
  }

  return trimObject(control)
}

export const retrieveEntry: ParsePartialUtil<AppNs.Entry<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const entry = {
    edited: parseSingularOf(value['app:edited'], (value) => parseDate(retrieveText(value))),
    control: parseSingularOf(value['app:control'], parseControl),
  }

  return trimObject(entry)
}
