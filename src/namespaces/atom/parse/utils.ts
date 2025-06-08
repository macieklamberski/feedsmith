import type { ParsePartialFunction } from '../../../common/types.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../../feeds/atom/parse/utils.js'
import type { Entry, Feed } from '../common/types.js'

export const retrieveEntry: ParsePartialFunction<Entry<string>> = (value) => {
  return (
    parseAtomEntry(value, { prefix: 'atom:', asNamespace: true }) ||
    parseAtomEntry(value, { prefix: 'a10:', asNamespace: true })
  )
}

export const retrieveFeed: ParsePartialFunction<Feed<string>> = (value) => {
  return (
    parseAtomFeed(value, { prefix: 'atom:', asNamespace: true }) ||
    parseAtomFeed(value, { prefix: 'a10:', asNamespace: true })
  )
}
