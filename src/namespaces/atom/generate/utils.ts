import type { GenerateFunction } from '../../../common/types.js'
import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../feeds/atom/common/types.js'
import {
  generateEntry as generateAtomEntry,
  generateFeed as generateAtomFeed,
} from '../../../feeds/atom/generate/utils.js'
import type { Entry, Feed } from '../common/types.js'

export const generateEntry: GenerateFunction<Entry<Date>> = (value) => {
  return generateAtomEntry(value as AtomEntry<Date>, { prefix: 'atom:', asNamespace: true })
}

export const generateFeed: GenerateFunction<Feed<Date>> = (value) => {
  return generateAtomFeed(value as AtomFeed<Date>, { prefix: 'atom:', asNamespace: true })?.feed
}
