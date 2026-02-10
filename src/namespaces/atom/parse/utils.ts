import type { DateAny, ParseOptions, ParsePartialUtil } from '../../../common/types.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../feeds/atom/parse/utils.js'
import type { AtomNs } from '../common/types.js'

export const retrieveEntry: ParsePartialUtil<AtomNs.Entry<DateAny>, ParseOptions<DateAny>> = (
  value,
  options,
) => {
  return parseAtomEntry(value, { ...options, prefix: 'atom:', asNamespace: true }) as
    | AtomNs.Entry<DateAny>
    | undefined
}

export const retrieveFeed: ParsePartialUtil<AtomNs.Feed<DateAny>, ParseOptions<DateAny>> = (
  value,
  options,
) => {
  return parseAtomFeed(value, { ...options, prefix: 'atom:', asNamespace: true }) as
    | AtomNs.Feed<DateAny>
    | undefined
}
