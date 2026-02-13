import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../feeds/atom/parse/utils.js'
import type { AtomNs } from '../common/types.js'

export const retrieveEntry: ParseUtilPartial<AtomNs.Entry<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  return parseAtomEntry(value, { ...options, prefix: 'atom:', asNamespace: true })
}

export const retrieveFeed: ParseUtilPartial<AtomNs.Feed<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  return parseAtomFeed(value, { ...options, prefix: 'atom:', asNamespace: true })
}
