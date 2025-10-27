import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateRfc3339Date,
  isObject,
  isPresent,
  trimObject,
} from '../../../common/utils.js'
import type { DcNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<DcNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  // TODO: Remove this once deprecated singular fields are removed in next major version.
  const generateArray = <V>(
    pluralValues: Array<V> | undefined,
    singularValue: V | undefined,
    generator: (value: V) => unknown,
  ) => {
    if (isPresent(pluralValues)) {
      return pluralValues.map(generator)
    }

    if (isPresent(singularValue)) {
      return generator(singularValue)
    }
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
    'dc:rights': generateArray(itemOrFeed.rights, undefined, generateCdataString),
  }

  return trimObject(value)
}
