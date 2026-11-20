import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { WikidotNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<WikidotNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    authorName: parseSingularOf(value['wikidot:authorname'], (value) => {
      return parseString(retrieveText(value))
    }),
    authorUserId: parseSingularOf(value['wikidot:authoruserid'], (value) => {
      return parseString(retrieveText(value))
    }),
  }

  return trimObject(item)
}
