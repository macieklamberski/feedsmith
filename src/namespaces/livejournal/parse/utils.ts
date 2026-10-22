import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseNumber, parseSingularOf, parseString, retrieveText } from '../../../common/utils.js'
import type { LivejournalNs } from '../common/types.js'

// RSS writes lj:journal, lj:journalid and lj:journaltype as text. Atom writes one
// <lj:journal userid username type/> instead.
export const retrieveJournal: ParseUtilPartial<string> = (value) => {
  return (
    parseSingularOf(value['lj:journal'], (value) => parseString(retrieveText(value))) ??
    parseSingularOf(value['lj:journal'], (value) => parseString(value?.['@username']))
  )
}

export const retrieveJournalId: ParseUtilPartial<string> = (value) => {
  return (
    parseSingularOf(value['lj:journalid'], (value) => parseString(retrieveText(value))) ??
    parseSingularOf(value['lj:journal'], (value) => parseString(value?.['@userid']))
  )
}

export const retrieveJournalType: ParseUtilPartial<string> = (value) => {
  return (
    parseSingularOf(value['lj:journaltype'], (value) => parseString(retrieveText(value))) ??
    parseSingularOf(value['lj:journal'], (value) => parseString(value?.['@type']))
  )
}

// RSS writes lj:poster and lj:posterid as text. Atom writes one <lj:poster user userid/> instead.
export const retrievePoster: ParseUtilPartial<string> = (value) => {
  return (
    parseSingularOf(value['lj:poster'], (value) => parseString(retrieveText(value))) ??
    parseSingularOf(value['lj:poster'], (value) => parseString(value?.['@user']))
  )
}

export const retrievePosterId: ParseUtilPartial<string> = (value) => {
  return (
    parseSingularOf(value['lj:posterid'], (value) => parseString(retrieveText(value))) ??
    parseSingularOf(value['lj:poster'], (value) => parseString(value?.['@userid']))
  )
}

// Current LiveJournal writes lj:replycount. Older LiveJournal and Dreamwidth write lj:reply-count.
export const retrieveReplyCount: ParseUtilPartial<number> = (value) => {
  return (
    parseSingularOf(value['lj:replycount'], (value) => parseNumber(retrieveText(value))) ??
    parseSingularOf(value['lj:reply-count'], (value) => parseNumber(retrieveText(value)))
  )
}

export const retrieveFeed: ParseUtilPartial<LivejournalNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    journal: retrieveJournal(value),
    journalId: retrieveJournalId(value),
    journalType: retrieveJournalType(value),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<LivejournalNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    music: parseSingularOf(value['lj:music'], (value) => parseString(retrieveText(value))),
    mood: parseSingularOf(value['lj:mood'], (value) => parseString(retrieveText(value))),
    security: parseSingularOf(value['lj:security'], (value) => parseString(retrieveText(value))),
    poster: retrievePoster(value),
    posterId: retrievePosterId(value),
    posterUrl: parseSingularOf(value['lj:posterurl'], (value) => parseString(retrieveText(value))),
    posterUserpic: parseSingularOf(value['lj:posteruserpic'], (value) =>
      parseString(retrieveText(value)),
    ),
    replyCount: retrieveReplyCount(value),
  }

  return trimObject(item)
}
