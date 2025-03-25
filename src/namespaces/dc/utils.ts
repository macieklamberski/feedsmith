import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, omitUndefinedFromObject, parseString } from '../../common/utils'
import type { ItemOrFeed } from './types'

export const parseItemOrFeed: ParseFunction<ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = omitUndefinedFromObject({
    title: parseString(value['dc:title']?.['#text']),
    creator: parseString(value['dc:creator']?.['#text']),
    subject: parseString(value['dc:subject']?.['#text']),
    description: parseString(value['dc:description']?.['#text']),
    publisher: parseString(value['dc:publisher']?.['#text']),
    contributor: parseString(value['dc:contributor']?.['#text']),
    date: parseString(value['dc:date']?.['#text']),
    type: parseString(value['dc:type']?.['#text']),
    format: parseString(value['dc:format']?.['#text']),
    identifier: parseString(value['dc:identifier']?.['#text']),
    source: parseString(value['dc:source']?.['#text']),
    language: parseString(value['dc:language']?.['#text']),
    relation: parseString(value['dc:relation']?.['#text']),
    coverage: parseString(value['dc:coverage']?.['#text']),
    rights: parseString(value['dc:rights']?.['#text']),
  })

  // TODO: This could be improved. Replace this with isEmptyObject().
  if (hasAnyProps(itemOrFeed, Object.keys(itemOrFeed) as Array<keyof ItemOrFeed>)) {
    return itemOrFeed
  }
}
