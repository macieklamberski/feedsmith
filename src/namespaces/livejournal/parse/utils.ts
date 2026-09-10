import { isPlainObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { LivejournalNs } from '../common/types.js'

export const retrieveItem: ParseUtilPartial<LivejournalNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    music: parseSingularOf(value['lj:music'], (value) => parseString(retrieveText(value))),
    mood: parseSingularOf(value['lj:mood'], (value) => parseString(retrieveText(value))),
    security: parseSingularOf(value['lj:security'], (value) => parseString(retrieveText(value))),
    poster: parseSingularOf(value['lj:poster'], (value) => parseString(retrieveText(value))),
    posterId: parseSingularOf(value['lj:posterid'], (value) => parseString(retrieveText(value))),
    journal: parseSingularOf(value['lj:journal'], (value) => parseString(retrieveText(value))),
    journalId: parseSingularOf(value['lj:journalid'], (value) => parseString(retrieveText(value))),
    journalType: parseSingularOf(value['lj:journaltype'], (value) =>
      parseString(retrieveText(value)),
    ),
    // INFO: Both the unhyphenated (dominant) and hyphenated spellings appear in real feeds.
    replyCount: parseSingularOf(value['lj:replycount'] ?? value['lj:reply-count'], (value) =>
      parseNumber(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
