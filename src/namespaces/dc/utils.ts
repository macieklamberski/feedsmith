import type { ParseFunction } from '../../common/types.js'
import { isObject, parseSingularOf, parseTextString, trimObject } from '../../common/utils.js'
import type { ItemOrFeed } from './types.js'

export const retrieveItemOrFeed: ParseFunction<ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = trimObject({
    title: parseSingularOf(value['dc:title'], parseTextString),
    creator: parseSingularOf(value['dc:creator'], parseTextString),
    subject: parseSingularOf(value['dc:subject'], parseTextString),
    description: parseSingularOf(value['dc:description'], parseTextString),
    publisher: parseSingularOf(value['dc:publisher'], parseTextString),
    contributor: parseSingularOf(value['dc:contributor'], parseTextString),
    date: parseSingularOf(value['dc:date'], parseTextString),
    type: parseSingularOf(value['dc:type'], parseTextString),
    format: parseSingularOf(value['dc:format'], parseTextString),
    identifier: parseSingularOf(value['dc:identifier'], parseTextString),
    source: parseSingularOf(value['dc:source'], parseTextString),
    language: parseSingularOf(value['dc:language'], parseTextString),
    relation: parseSingularOf(value['dc:relation'], parseTextString),
    coverage: parseSingularOf(value['dc:coverage'], parseTextString),
    rights: parseSingularOf(value['dc:rights'], parseTextString),
  })

  return itemOrFeed
}
