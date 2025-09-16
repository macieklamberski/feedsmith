import type { DateLike, GenerateUtil } from '../../../common/types.js'
import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../feeds/atom/common/types.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../feeds/atom/generate/utils.js'
import type { Entry, Feed } from '../common/types.js'

export const generateEntry: GenerateUtil<Entry<DateLike>> = (entry) => {
  return generateAtomEntry(entry as AtomEntry<DateLike>, { prefix: 'atom:', asNamespace: true })
}

export const generateFeed: GenerateUtil<Feed<DateLike>> = (feed) => {
  return generateAtomFeed(feed as AtomFeed<DateLike>, { prefix: 'atom:', asNamespace: true })?.feed
}
