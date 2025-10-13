import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateRfc3339Date,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  // Helper to generate array of elements or fallback to singular
  const generateArray = (
    pluralValues: Array<string | DateLike> | undefined,
    singularValue: string | DateLike | undefined,
    generator: (v: string | DateLike) => unknown,
  ) => {
    // Prefer plural values if available
    if (pluralValues && pluralValues.length > 0) {
      return pluralValues.map(generator)
    }
    // Fallback to singular for backward compatibility
    if (singularValue !== undefined) {
      return generator(singularValue)
    }
    return undefined
  }

  const value = {
    'dc:title': generateArray(itemOrFeed.titles, itemOrFeed.title, generateCdataString),
    'dc:creator': generateArray(itemOrFeed.creators, itemOrFeed.creator, generateCdataString),
    'dc:subject': generateArray(itemOrFeed.subjects, itemOrFeed.subject, generateCdataString),
    'dc:description': generateArray(
      itemOrFeed.descriptions,
      itemOrFeed.description,
      generateCdataString,
    ),
    'dc:publisher': generateArray(itemOrFeed.publishers, itemOrFeed.publisher, generateCdataString),
    'dc:contributor': generateArray(
      itemOrFeed.contributors,
      itemOrFeed.contributor,
      generateCdataString,
    ),
    'dc:date': generateArray(itemOrFeed.dates, itemOrFeed.date, generateRfc3339Date),
    'dc:type': generateArray(itemOrFeed.types, itemOrFeed.type, generateCdataString),
    'dc:format': generateArray(itemOrFeed.formats, itemOrFeed.format, generateCdataString),
    'dc:identifier': generateArray(
      itemOrFeed.identifiers,
      itemOrFeed.identifier,
      generateCdataString,
    ),
    'dc:source': generateArray(itemOrFeed.sources, itemOrFeed.source, generateCdataString),
    'dc:language': generateArray(itemOrFeed.languages, itemOrFeed.language, generateCdataString),
    'dc:relation': generateArray(itemOrFeed.relations, itemOrFeed.relation, generateCdataString),
    'dc:coverage': generateArray(itemOrFeed.coverages, itemOrFeed.coverage, generateCdataString),
    'dc:rights': generateArray(itemOrFeed.rights_, itemOrFeed.rights, generateCdataString),
  }

  return trimObject(value)
}
