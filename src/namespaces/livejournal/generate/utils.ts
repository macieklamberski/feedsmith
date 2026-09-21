import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, generateNumber } from '../../../common/utils.js'
import type { LivejournalNs } from '../common/types.js'

export const generateFeed: GenerateUtil<LivejournalNs.Feed> = (feed) => {
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

export const generateItem: GenerateUtil<LivejournalNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'lj:music': generateCdataString(item.music),
    'lj:mood': generateCdataString(item.mood),
    'lj:security': generateCdataString(item.security),
    'lj:poster': generateCdataString(item.poster),
    'lj:posterid': generateCdataString(item.posterId),
    'lj:replycount': generateNumber(item.replyCount),
  }

  return trimObject(value)
}
