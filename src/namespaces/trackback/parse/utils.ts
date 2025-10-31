import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { TrackbackNs } from '../common/types.js'

export const retrieveItem: ParsePartialUtil<TrackbackNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    ping: parseSingularOf(value['trackback:ping'], (value) => parseString(retrieveText(value))),
    about: parseArrayOf(value['trackback:about'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
