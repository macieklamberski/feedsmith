import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { ThrNs } from '../common/types.js'

export const generateInReplyTo: GenerateUtil<ThrNs.InReplyTo> = (inReplyTo) => {
  if (!isObject(inReplyTo)) {
    return
  }

  const value = {
    '@ref': generatePlainString(inReplyTo.ref),
    '@href': generatePlainString(inReplyTo.href),
    '@type': generatePlainString(inReplyTo.type),
    '@source': generatePlainString(inReplyTo.source),
  }

  return trimObject(value)
}

export const generateLink: GenerateUtil<ThrNs.Link<DateLike>> = (link) => {
  if (!isObject(link)) {
    return
  }

  const value = {
    '@thr:count': generateNumber(link.count),
    '@thr:updated': generateRfc3339Date(link.updated),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<ThrNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'thr:total': generateNumber(item.total),
    'thr:in-reply-to': trimArray(item.inReplyTos, generateInReplyTo),
  }

  return trimObject(value)
}
