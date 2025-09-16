import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseDate,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialUtil<ItemOrFeed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    title: parseSingularOf(value['dc:title'], (value) => parseString(retrieveText(value))),
    creator: parseSingularOf(value['dc:creator'], (value) => parseString(retrieveText(value))),
    subject: parseSingularOf(value['dc:subject'], (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value['dc:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    publisher: parseSingularOf(value['dc:publisher'], (value) => parseString(retrieveText(value))),
    contributor: parseSingularOf(value['dc:contributor'], (value) =>
      parseString(retrieveText(value)),
    ),
    date: parseSingularOf(value['dc:date'], (value) => parseDate(retrieveText(value))),
    type: parseSingularOf(value['dc:type'], (value) => parseString(retrieveText(value))),
    format: parseSingularOf(value['dc:format'], (value) => parseString(retrieveText(value))),
    identifier: parseSingularOf(value['dc:identifier'], (value) =>
      parseString(retrieveText(value)),
    ),
    source: parseSingularOf(value['dc:source'], (value) => parseString(retrieveText(value))),
    language: parseSingularOf(value['dc:language'], (value) => parseString(retrieveText(value))),
    relation: parseSingularOf(value['dc:relation'], (value) => parseString(retrieveText(value))),
    coverage: parseSingularOf(value['dc:coverage'], (value) => parseString(retrieveText(value))),
    rights: parseSingularOf(value['dc:rights'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(itemOrFeed)
}
