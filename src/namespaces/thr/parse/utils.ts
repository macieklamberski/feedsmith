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
import type { ThrNs } from '../common/types.js'

export const parseInReplyTo: ParseUtilPartial<ThrNs.InReplyTo> = (value) => {
  if (!isObject(value)) {
    return
  }

  const inReplyTo = {
    ref: parseString(value['@ref']),
    href: parseString(value['@href']),
    type: parseString(value['@type']),
    source: parseString(value['@source']),
  }

  return trimObject(inReplyTo)
}

export const retrieveLink: ParseUtilPartial<ThrNs.Link<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value)) {
    return
  }

  const link = {
    count: parseNumber(value['@thr:count']),
    updated: parseDate(value['@thr:updated'], options?.parseDateFn),
  }

  return trimObject(link)
}

export const retrieveItem: ParseUtilPartial<ThrNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    total: parseSingularOf(value['thr:total'], (value) => parseNumber(retrieveText(value))),
    inReplyTos: parseArrayOf(value['thr:in-reply-to'], parseInReplyTo),
  }

  return trimObject(item)
}
