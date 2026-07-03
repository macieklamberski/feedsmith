import { isPlainObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  trimObject,
} from '../../../common/utils.js'
import type { AdminNs } from '../common/types.js'

export const retrieveFeed: ParseUtilPartial<AdminNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    errorReportsTo: parseSingularOf(value['admin:errorreportsto'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    generatorAgent: parseSingularOf(value['admin:generatoragent'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
  }

  return trimObject(feed)
}
