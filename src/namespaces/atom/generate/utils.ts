import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../feeds/atom/generate/utils.js'
import type { AtomNs } from '../common/types.js'

export const generateEntry: GenerateUtil<AtomNs.Entry<DateLike>> = (entry) => {
  return generateAtomEntry(entry, { prefix: 'atom:', asNamespace: true })
}

export const generateFeed: GenerateUtil<AtomNs.Feed<DateLike>> = (feed) => {
  return generateAtomFeed(feed, { prefix: 'atom:', asNamespace: true })?.feed
}
