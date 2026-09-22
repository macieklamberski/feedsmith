import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, generateNumber, generatePlainString } from '../../../common/utils.js'
import type { LivejournalNs } from '../common/types.js'

export const generateRssFeed: GenerateUtil<LivejournalNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'lj:journal': generateCdataString(feed.journal),
    'lj:journalid': generateCdataString(feed.journalId),
    'lj:journaltype': generateCdataString(feed.journalType),
  }

  return trimObject(value)
}

export const generateRssItem: GenerateUtil<LivejournalNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'lj:music': generateCdataString(item.music),
    'lj:mood': generateCdataString(item.mood),
    'lj:security': generateCdataString(item.security),
    'lj:poster': generateCdataString(item.poster),
    'lj:posterid': generateCdataString(item.posterId),
    'lj:posterurl': generateCdataString(item.posterUrl),
    'lj:posteruserpic': generateCdataString(item.posterUserpic),
    'lj:replycount': generateNumber(item.replyCount),
  }

  return trimObject(value)
}

export const generateAtomFeed: GenerateUtil<LivejournalNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const journal = {
    '@userid': generatePlainString(feed.journalId),
    '@username': generatePlainString(feed.journal),
    '@type': generatePlainString(feed.journalType),
  }
  const value = {
    'lj:journal': trimObject(journal),
  }

  return trimObject(value)
}

// LiveJournal's Atom feed carries none of the fields after lj:poster. They keep the RSS text form,
// so generating Atom drops nothing.
export const generateAtomEntry: GenerateUtil<LivejournalNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const poster = {
    '@user': generatePlainString(item.poster),
    '@userid': generatePlainString(item.posterId),
  }
  const value = {
    'lj:poster': trimObject(poster),
    'lj:music': generateCdataString(item.music),
    'lj:mood': generateCdataString(item.mood),
    'lj:security': generateCdataString(item.security),
    'lj:posterurl': generateCdataString(item.posterUrl),
    'lj:posteruserpic': generateCdataString(item.posterUserpic),
    'lj:replycount': generateNumber(item.replyCount),
  }

  return trimObject(value)
}
