import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseDate,
  parseSingularOf,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialFunction<ItemOrFeed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    title: parseSingularOf(value['dc:title'], parseTextString),
    creator: parseSingularOf(value['dc:creator'], parseTextString),
    subject: parseSingularOf(value['dc:subject'], parseTextString),
    description: parseSingularOf(value['dc:description'], parseTextString),
    publisher: parseSingularOf(value['dc:publisher'], parseTextString),
    contributor: parseSingularOf(value['dc:contributor'], parseTextString),
    date: parseSingularOf(value['dc:date'], (value) => parseDate(retrieveText(value))),
    type: parseSingularOf(value['dc:type'], parseTextString),
    format: parseSingularOf(value['dc:format'], parseTextString),
    identifier: parseSingularOf(value['dc:identifier'], parseTextString),
    source: parseSingularOf(value['dc:source'], parseTextString),
    language: parseSingularOf(value['dc:language'], parseTextString),
    relation: parseSingularOf(value['dc:relation'], parseTextString),
    coverage: parseSingularOf(value['dc:coverage'], parseTextString),
    rights: parseSingularOf(value['dc:rights'], parseTextString),
  }

  return trimObject(itemOrFeed)
}
