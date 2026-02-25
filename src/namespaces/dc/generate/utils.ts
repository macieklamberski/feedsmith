import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateRfc3339Date,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { DcNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<DcNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dc:title': trimArray(itemOrFeed.titles, generateCdataString),
    'dc:creator': trimArray(itemOrFeed.creators, generateCdataString),
    'dc:subject': trimArray(itemOrFeed.subjects, generateCdataString),
    'dc:description': trimArray(itemOrFeed.descriptions, generateCdataString),
    'dc:publisher': trimArray(itemOrFeed.publishers, generateCdataString),
    'dc:contributor': trimArray(itemOrFeed.contributors, generateCdataString),
    'dc:date': trimArray(itemOrFeed.dates, generateRfc3339Date),
    'dc:type': trimArray(itemOrFeed.types, generateCdataString),
    'dc:format': trimArray(itemOrFeed.formats, generateCdataString),
    'dc:identifier': trimArray(itemOrFeed.identifiers, generateCdataString),
    'dc:source': trimArray(itemOrFeed.sources, generateCdataString),
    'dc:language': trimArray(itemOrFeed.languages, generateCdataString),
    'dc:relation': trimArray(itemOrFeed.relations, generateCdataString),
    'dc:coverage': trimArray(itemOrFeed.coverage, generateCdataString),
    'dc:rights': trimArray(itemOrFeed.rights, generateCdataString),
  }

  return trimObject(value)
}
