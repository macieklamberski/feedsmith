import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseDate,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import { parseLink, parsePerson, parseSource } from '../../../feeds/atom/parse/utils.js'
import type { AtNs } from '../common/types.js'

export const parseDeletedEntry: ParseUtilPartial<
  AtNs.DeletedEntry<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const deletedEntry = {
    ref: parseString(value['@ref']),
    when: parseDate(value['@when'], options?.parseDateFn),
    by: parseSingularOf(value['at:by'], (value) => parsePerson(value, options)),
    comment: parseSingularOf(value['at:comment'], (value) => parseString(retrieveText(value))),
    links: parseArrayOf(value.link, (value) => parseLink(value, options)),
    source: parseSingularOf(value.source, (value) => parseSource(value, options)),
  }

  return trimObject(deletedEntry)
}

export const retrieveFeed: ParseUtilPartial<AtNs.Feed<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    deletedEntries: parseArrayOf(value['at:deleted-entry'], (value) => {
      return parseDeletedEntry(value, options)
    }),
  }

  return trimObject(feed)
}
