import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateRfc3339Date,
  generateYesNoBoolean,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { AppNs } from '../common/types.js'

export const generateControl: GenerateUtil<AppNs.Control> = (control) => {
  if (!isObject(control)) {
    return
  }

  const value = {
    'app:draft': generateYesNoBoolean(control.draft),
  }

  return trimObject(value)
}

export const generateEntry: GenerateUtil<AppNs.Entry<DateLike>> = (entry) => {
  if (!isObject(entry)) {
    return
  }

  const value = {
    'app:edited': generateRfc3339Date(entry.edited),
    'app:control': generateControl(entry.control),
  }

  return trimObject(value)
}
