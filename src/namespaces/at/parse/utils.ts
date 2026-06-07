import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { AtNs } from '../common/types.js'

export const parsePerson: ParseUtilPartial<AtNs.Person> = (value) => {
  if (!isObject(value)) {
    return
  }

  const person = {
    name: parseSingularOf(value.name, (value) => parseString(retrieveText(value))),
    uri: parseSingularOf(value.uri, (value) => parseString(retrieveText(value))),
    email: parseSingularOf(value.email, (value) => parseString(retrieveText(value))),
  }

  return trimObject(person)
}

export const parseLink: ParseUtilPartial<AtNs.Link> = (value) => {
  if (!isObject(value)) {
    return
  }

  const link = {
    href: parseString(value['@href']),
    rel: parseString(value['@rel']),
    type: parseString(value['@type']),
    hreflang: parseString(value['@hreflang']),
    title: parseString(value['@title']),
    length: parseNumber(value['@length']),
  }

  return trimObject(link)
}

export const parseDeletedEntry: ParseUtilPartial<
  AtNs.DeletedEntry<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const deletedEntry = {
    ref: parseString(value['@ref']),
    when: parseDate(value['@when'], options?.parseDateFn),
    by: parseSingularOf(value['at:by'], parsePerson),
    comment: parseSingularOf(value['at:comment'], (value) => parseString(retrieveText(value))),
    links: parseArrayOf(value.link, parseLink),
  }

  return trimObject(deletedEntry)
}

export const retrieveFeed: ParseUtilPartial<AtNs.Feed<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    deletedEntries: parseArrayOf(value['at:deleted-entry'], (value) =>
      parseDeletedEntry(value, options),
    ),
  }

  return trimObject(feed)
}
