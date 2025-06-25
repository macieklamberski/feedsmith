import type { GenerateFunction } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { InReplyTo, Item, Link } from '../common/types.js'

export const generateInReplyTo: GenerateFunction<InReplyTo> = (inReplyTo) => {
  if (!isObject(inReplyTo)) {
    return
  }

  const value = {
    '@ref': inReplyTo.ref,
    '@href': inReplyTo.href,
    '@type': inReplyTo.type,
    '@source': inReplyTo.source,
  }

  return trimObject(value)
}

export const generateLink: GenerateFunction<Link<Date>> = (link) => {
  if (!isObject(link)) {
    return
  }

  const value = {
    '@thr:count': link.count,
    '@thr:updated': generateRfc3339Date(link.updated),
  }

  return trimObject(value)
}

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'thr:total': item.total,
    'thr:in-reply-to': trimArray(item.inReplyTos?.map(generateInReplyTo)),
  }

  return trimObject(value)
}
