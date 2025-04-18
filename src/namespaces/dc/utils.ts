import type { ParseFunction } from '../../common/types.js'
import { isObject, parseString, retrieveText, trimObject } from '../../common/utils.js'
import type { ItemOrFeed } from './types.js'

export const parseItemOrFeed: ParseFunction<ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = trimObject({
    title: parseString(retrieveText(value['dc:title'])),
    creator: parseString(retrieveText(value['dc:creator'])),
    subject: parseString(retrieveText(value['dc:subject'])),
    description: parseString(retrieveText(value['dc:description'])),
    publisher: parseString(retrieveText(value['dc:publisher'])),
    contributor: parseString(retrieveText(value['dc:contributor'])),
    date: parseString(retrieveText(value['dc:date'])),
    type: parseString(retrieveText(value['dc:type'])),
    format: parseString(retrieveText(value['dc:format'])),
    identifier: parseString(retrieveText(value['dc:identifier'])),
    source: parseString(retrieveText(value['dc:source'])),
    language: parseString(retrieveText(value['dc:language'])),
    relation: parseString(retrieveText(value['dc:relation'])),
    coverage: parseString(retrieveText(value['dc:coverage'])),
    rights: parseString(retrieveText(value['dc:rights'])),
  })

  return itemOrFeed
}
