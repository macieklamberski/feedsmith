import type { ParseFunction } from '../../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextNumber,
  trimObject,
} from '../../../common/utils.js'
import type { InReplyTo, Item, Link } from '../common/types.js'

export const parseInReplyTo: ParseFunction<InReplyTo> = (value) => {
  if (!isObject(value)) {
    return
  }

  const inReplyTo = {
    ref: parseString(value['@ref']),
    href: parseString(value['@href']),
    type: parseString(value['@type']),
    source: parseString(value['@source']),
  }

  if (isPresent(inReplyTo.ref)) {
    return trimObject(inReplyTo) as InReplyTo
  }
}

export const retrieveLink: ParseFunction<Link<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const link = {
    count: parseNumber(value['@thr:count']),
    updated: parseString(value['@thr:updated']),
  }

  return trimObject(link) as Link<string>
}

export const retrieveItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    total: parseSingularOf(value['thr:total'], parseTextNumber),
    inReplyTos: parseArrayOf(value['thr:in-reply-to'], parseInReplyTo),
  }

  return trimObject(item) as Item
}
