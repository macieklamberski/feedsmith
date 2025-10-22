import type { DateLike, GenerateUtil } from '../../../common/types.js'
import type { Atom } from '../../../feeds/atom/common/types.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../feeds/atom/generate/utils.js'
import type { Entry, Feed } from '../common/types.js'

export const generateEntry: GenerateUtil<Entry<DateLike>> = (entry) => {
  return generateAtomEntry(entry as Atom.Entry<DateLike>, { prefix: 'atom:', asNamespace: true })
}

export const generateFeed: GenerateUtil<Feed<DateLike>> = (feed) => {
  return generateAtomFeed(feed as Atom.Feed<DateLike>, { prefix: 'atom:', asNamespace: true })?.feed
}
