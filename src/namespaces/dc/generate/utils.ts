import type { GenerateFunction } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimObject } from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const generateItemOrFeed: GenerateFunction<ItemOrFeed<Date>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dc:title': itemOrFeed.title,
    'dc:creator': itemOrFeed.creator,
    'dc:subject': itemOrFeed.subject,
    'dc:description': itemOrFeed.description,
    'dc:publisher': itemOrFeed.publisher,
    'dc:contributor': itemOrFeed.contributor,
    'dc:date': generateRfc3339Date(itemOrFeed.date),
    'dc:type': itemOrFeed.type,
    'dc:format': itemOrFeed.format,
    'dc:identifier': itemOrFeed.identifier,
    'dc:source': itemOrFeed.source,
    'dc:language': itemOrFeed.language,
    'dc:relation': itemOrFeed.relation,
    'dc:coverage': itemOrFeed.coverage,
    'dc:rights': itemOrFeed.rights,
  }

  return trimObject(value)
}
