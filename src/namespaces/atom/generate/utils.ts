import type { DateLike, GenerateUtil } from '../../../common/types.js'
import type { Atom } from '../../../feeds/atom/common/types.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../feeds/atom/generate/utils.js'
import type { AtomNs } from '../common/types.js'

export const generateEntry: GenerateUtil<AtomNs.Entry<DateLike>> = (entry) => {
  return generateAtomEntry(entry as Atom.Entry<DateLike>, { prefix: 'atom:', asNamespace: true })
}

export const generateFeed: GenerateUtil<AtomNs.Feed<DateLike>> = (feed) => {
  return generateAtomFeed(feed as Atom.Feed<DateLike>, { prefix: 'atom:', asNamespace: true })?.feed
}
