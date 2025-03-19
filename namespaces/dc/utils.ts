import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, parseString } from '../../common/utils'
import type { DublinCore } from './types'

export const retrieveDublinCore: ParseFunction<DublinCore> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const dublinCore = {
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

  if (hasAnyProps(dublinCore, Object.keys(dublinCore) as Array<keyof DublinCore>)) {
    return dublinCore
  }
}
