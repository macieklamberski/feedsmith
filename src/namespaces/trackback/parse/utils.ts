import { isPlainObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  trimObject,
} from '../../../common/utils.js'
import type { TrackbackNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<TrackbackNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    ping: parseSingularOf(value['trackback:ping'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    abouts: parseArrayOf(value['trackback:about'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
  }

  return trimObject(item)
}
