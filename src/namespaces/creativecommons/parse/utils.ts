import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { CreativecommonsNs } from '../common/types.js'

export const retrieveFeed: ParsePartialUtil<CreativecommonsNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    license: parseSingularOf(value['creativecommons:license'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}
