import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { CreativecommonsNs } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialUtil<CreativecommonsNs.ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    licenses: parseArrayOf(value['creativecommons:license'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(itemOrFeed)
}
