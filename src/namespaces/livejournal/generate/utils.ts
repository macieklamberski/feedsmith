import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, generateNumber, trimObject } from '../../../common/utils.js'
import type { LivejournalNs } from '../common/types.js'

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
    'lj:journal': generateCdataString(item.journal),
    'lj:journalid': generateCdataString(item.journalId),
    'lj:journaltype': generateCdataString(item.journalType),
    'lj:replycount': generateNumber(item.replyCount),
  }

  return trimObject(value)
}
