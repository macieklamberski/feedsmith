import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, parseNumber, parseString } from '../../common/utils'
import type { Any } from './types'

export const retrieveAny: ParseFunction<Any> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const any = {
    title: parseString(value['dc:title']?.['#text'], level),
    creator: parseString(value['dc:creator']?.['#text'], level),
    subject: parseString(value['dc:subject']?.['#text'], level),
    description: parseString(value['dc:description']?.['#text'], level),
    publisher: parseString(value['dc:publisher']?.['#text'], level),
    contributor: parseString(value['dc:contributor']?.['#text'], level),
    date: parseString(value['dc:date']?.['#text'], level),
    type: parseString(value['dc:type']?.['#text'], level),
    format: parseString(value['dc:format']?.['#text'], level),
    identifier: parseString(value['dc:identifier']?.['#text'], level),
    source: parseString(value['dc:source']?.['#text'], level),
    language: parseString(value['dc:language']?.['#text'], level),
    relation: parseString(value['dc:relation']?.['#text'], level),
    coverage: parseString(value['dc:coverage']?.['#text'], level),
    rights: parseString(value['dc:rights']?.['#text'], level),
  }

  if (hasAnyProps(any, Object.keys(any) as Array<keyof Any>)) {
    return any
  }
}
