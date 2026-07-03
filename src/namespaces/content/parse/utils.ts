import { isPlainObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseSingularOf, parseString, retrieveText, trimObject } from '../../../common/utils.js'
import type { ContentNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<ContentNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    encoded: parseSingularOf(value['content:encoded'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
