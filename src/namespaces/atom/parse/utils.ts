import type { ParsePartialUtil } from '../../../common/types.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../feeds/atom/parse/utils.js'
import type { AtomNs } from '../common/types.js'

export const retrieveEntry: ParsePartialUtil<AtomNs.Entry<string>> = (value) => {
  return parseAtomEntry(value, { prefix: 'atom:', asNamespace: true })
}

export const retrieveFeed: ParsePartialUtil<AtomNs.Feed<string>> = (value) => {
  return parseAtomFeed(value, { prefix: 'atom:', asNamespace: true })
}
