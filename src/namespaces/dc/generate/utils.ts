import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateArrayOrSingular,
  generateCdataString,
  generateRfc3339Date,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { DcNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<DcNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dc:title': generateArrayOrSingular(itemOrFeed.titles, itemOrFeed.title, generateCdataString),
    'dc:creator': generateArrayOrSingular(
      itemOrFeed.creators,
      itemOrFeed.creator,
      generateCdataString,
    ),
    'dc:subject': generateArrayOrSingular(
      itemOrFeed.subjects,
      itemOrFeed.subject,
      generateCdataString,
    ),
    'dc:description': generateArrayOrSingular(
      itemOrFeed.descriptions,
      itemOrFeed.description,
      generateCdataString,
    ),
    'dc:publisher': generateArrayOrSingular(
      itemOrFeed.publishers,
      itemOrFeed.publisher,
      generateCdataString,
    ),
    'dc:contributor': generateArrayOrSingular(
      itemOrFeed.contributors,
      itemOrFeed.contributor,
      generateCdataString,
    ),
    'dc:date': generateArrayOrSingular(itemOrFeed.dates, itemOrFeed.date, generateRfc3339Date),
    'dc:type': generateArrayOrSingular(itemOrFeed.types, itemOrFeed.type, generateCdataString),
    'dc:format': generateArrayOrSingular(
      itemOrFeed.formats,
      itemOrFeed.format,
      generateCdataString,
    ),
    'dc:identifier': generateArrayOrSingular(
      itemOrFeed.identifiers,
      itemOrFeed.identifier,
      generateCdataString,
    ),
    'dc:source': generateArrayOrSingular(
      itemOrFeed.sources,
      itemOrFeed.source,
      generateCdataString,
    ),
    'dc:language': generateArrayOrSingular(
      itemOrFeed.languages,
      itemOrFeed.language,
      generateCdataString,
    ),
    'dc:relation': generateArrayOrSingular(
      itemOrFeed.relations,
      itemOrFeed.relation,
      generateCdataString,
    ),
    'dc:coverage': generateCdataString(itemOrFeed.coverage),
    'dc:rights': generateCdataString(itemOrFeed.rights),
  }

  return trimObject(value)
}
