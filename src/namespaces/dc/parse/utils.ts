import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
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
    // Singular fields (deprecated - kept for backward compatibility, returns first value)
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

    // Plural fields (correct - all DC elements are repeatable, returns all values)
    titles: parseArrayOf(value['dc:title'], (value) => parseString(retrieveText(value))),
    creators: parseArrayOf(value['dc:creator'], (value) => parseString(retrieveText(value))),
    subjects: parseArrayOf(value['dc:subject'], (value) => parseString(retrieveText(value))),
    descriptions: parseArrayOf(value['dc:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    publishers: parseArrayOf(value['dc:publisher'], (value) => parseString(retrieveText(value))),
    contributors: parseArrayOf(value['dc:contributor'], (value) =>
      parseString(retrieveText(value)),
    ),
    dates: parseArrayOf(value['dc:date'], (value) => parseDate(retrieveText(value))),
    types: parseArrayOf(value['dc:type'], (value) => parseString(retrieveText(value))),
    formats: parseArrayOf(value['dc:format'], (value) => parseString(retrieveText(value))),
    identifiers: parseArrayOf(value['dc:identifier'], (value) => parseString(retrieveText(value))),
    sources: parseArrayOf(value['dc:source'], (value) => parseString(retrieveText(value))),
    languages: parseArrayOf(value['dc:language'], (value) => parseString(retrieveText(value))),
    relations: parseArrayOf(value['dc:relation'], (value) => parseString(retrieveText(value))),
    coverages: parseArrayOf(value['dc:coverage'], (value) => parseString(retrieveText(value))),
    rights_: parseArrayOf(value['dc:rights'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(itemOrFeed)
}
