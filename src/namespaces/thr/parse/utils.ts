import type { ParsePartialFunction } from '@/common/types.js'
import {
  isObject,
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '@/common/utils.js'
import type { InReplyTo, Item, Link } from '@/namespaces/thr/common/types.js'

export const parseInReplyTo: ParsePartialFunction<InReplyTo> = (value) => {
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

export const retrieveLink: ParsePartialFunction<Link<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const link = {
    count: parseNumber(value['@thr:count']),
    updated: parseDate(value['@thr:updated']),
  }

  return trimObject(link)
}

export const retrieveItem: ParsePartialFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    total: parseSingularOf(value['thr:total'], (value) => parseNumber(retrieveText(value))),
    inReplyTos: parseArrayOf(value['thr:in-reply-to'], parseInReplyTo),
  }

  return trimObject(item)
}
