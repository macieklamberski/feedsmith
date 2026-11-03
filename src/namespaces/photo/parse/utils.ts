import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { PhotoNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<PhotoNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    thumbnail: parseSingularOf(value['photo:thumbnail'], (value) => {
      return parseString(retrieveText(value))
    }),
    imgsrc: parseSingularOf(value['photo:imgsrc'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
