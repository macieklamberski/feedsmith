import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import { generatePlainString, generateRfc3339Date, trimArray } from '../../../common/utils.js'
import {
  generateLink,
  generatePerson,
  generateSource,
  generateText,
} from '../../../feeds/atom/generate/utils.js'
import type { AtNs } from '../common/types.js'

export const generateDeletedEntry: GenerateUtil<AtNs.DeletedEntry<DateLike>> = (deletedEntry) => {
  if (!isPlainObject(deletedEntry)) {
    return
  }

  const value = {
    '@ref': generatePlainString(deletedEntry.ref),
    '@when': generateRfc3339Date(deletedEntry.when),
    'at:by': generatePerson(deletedEntry.by),
    'at:comment': generateText(deletedEntry.comment),
    link: trimArray(deletedEntry.links, generateLink),
    source: generateSource(deletedEntry.source),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<AtNs.Feed<DateLike>> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'at:deleted-entry': trimArray(feed.deletedEntries, generateDeletedEntry),
  }

  return trimObject(value)
}
