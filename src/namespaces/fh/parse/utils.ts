import { isPlainObject, isPresent, trimObject } from 'trousse'
import type { ParseUtilPartial, Unreliable } from '../../../common/types.js'
import { parseBoolean, parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { FhNs } from '../common/types.js'

// RFC 5005 defines no content for fh:complete and fh:archive: their presence is the signal.
const parseFlag = (value: Unreliable): true | undefined => {
  if (isPresent(value)) {
    return true
  }
}

export const retrieveFeed: ParseUtilPartial<FhNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    complete: parseFlag(value['fh:complete']),
    archive: parseFlag(value['fh:archive']),
    incremental: parseSingularOf(value['fh:incremental'], (value) => {
      return parseBoolean(retrieveText(value))
    }),
    stateful: parseSingularOf(value['fh:stateful'], (value) => {
      return parseBoolean(retrieveText(value))
    }),
    prev: parseSingularOf(value['fh:prev'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(feed)
}
