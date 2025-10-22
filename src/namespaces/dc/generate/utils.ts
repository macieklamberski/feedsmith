import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
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
    'dc:title': generateCdataString(itemOrFeed.title),
    'dc:creator': generateCdataString(itemOrFeed.creator),
    'dc:subject': generateCdataString(itemOrFeed.subject),
    'dc:description': generateCdataString(itemOrFeed.description),
    'dc:publisher': generateCdataString(itemOrFeed.publisher),
    'dc:contributor': generateCdataString(itemOrFeed.contributor),
    'dc:date': generateRfc3339Date(itemOrFeed.date),
    'dc:type': generateCdataString(itemOrFeed.type),
    'dc:format': generateCdataString(itemOrFeed.format),
    'dc:identifier': generateCdataString(itemOrFeed.identifier),
    'dc:source': generateCdataString(itemOrFeed.source),
    'dc:language': generateCdataString(itemOrFeed.language),
    'dc:relation': generateCdataString(itemOrFeed.relation),
    'dc:coverage': generateCdataString(itemOrFeed.coverage),
    'dc:rights': generateCdataString(itemOrFeed.rights),
  }

  return trimObject(value)
}
