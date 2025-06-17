import type { GenerateFunction } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { InReplyTo, Item, Link } from '../common/types.js'

export const generateInReplyTo: GenerateFunction<InReplyTo> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    '@ref': value.ref,
    '@href': value.href,
    '@type': value.type,
    '@source': value.source,
  })
}

export const generateLink: GenerateFunction<Link<Date>> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    '@thr:count': value.count,
    '@thr:updated': generateRfc3339Date(value.updated),
  })
}

export const generateItem: GenerateFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    'thr:total': value.total,
    'thr:in-reply-to': trimArray(value.inReplyTos?.map(generateInReplyTo)),
  })
}
