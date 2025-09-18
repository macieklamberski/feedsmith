import type { ParsePartialUtil } from '../../../common/types.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../feeds/atom/parse/utils.js'
import type { Entry, Feed } from '../common/types.js'

export const retrieveEntry: ParsePartialUtil<Entry<string>> = (value) => {
  return parseAtomEntry(value, { prefix: 'atom:', asNamespace: true })
}

export const retrieveFeed: ParsePartialUtil<Feed<string>> = (value) => {
  return parseAtomFeed(value, { prefix: 'atom:', asNamespace: true })
}
