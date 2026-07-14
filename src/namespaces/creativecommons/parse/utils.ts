import { isPlainObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseArrayOf, parseString, retrieveText, trimObject } from '../../../common/utils.js'
import type { CreativeCommonsNs } from '../common/types.js'

export const retrieveItemOrFeed: ParseUtilPartial<CreativeCommonsNs.ItemOrFeed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const itemOrFeed = {
    licenses: parseArrayOf(value['creativecommons:license'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(itemOrFeed)
}
