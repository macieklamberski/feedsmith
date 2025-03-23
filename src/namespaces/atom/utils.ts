import type { ParseFunction } from '../../common/types'
import type { Entry, Feed } from '../../feeds/atom/types'
import { parseEntry as parseAtomEntry, parseFeed as parseAtomFeed } from '../../feeds/atom/utils'

export const parseEntry: ParseFunction<Entry> = (value) => {
  return (
    parseAtomEntry(value, { asNamespace: 'atom:' }) ||
    parseAtomEntry(value, { asNamespace: 'a10:' })
  )
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  return (
    parseAtomFeed(value, { asNamespace: 'atom:' }) || parseAtomFeed(value, { asNamespace: 'a10:' })
  )
}
