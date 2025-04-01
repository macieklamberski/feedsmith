import type { ParseFunction } from '../../common/types.js'
import type { Entry, Feed } from '../../feeds/atom/parse/types.js'
import {
  parseEntry as parseAtomEntry,
  parseFeed as parseAtomFeed,
} from '../../feeds/atom/parse/utils.js'

export const parseEntry: ParseFunction<Entry> = (value) => {
  return (
    parseAtomEntry(value, { prefix: 'atom:', partial: true }) ||
    parseAtomEntry(value, { prefix: 'a10:', partial: true })
  )
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  return (
    parseAtomFeed(value, { prefix: 'atom:', partial: true }) ||
    parseAtomFeed(value, { prefix: 'a10:', partial: true })
  )
}
