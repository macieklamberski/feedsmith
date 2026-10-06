import { XMLParser } from 'fast-xml-parser'
import { isPlainObject, trimObject } from 'trousse'
import { parserConfig } from '../../../common/config.js'
import type {
  DateAny,
  ParseMainOptions,
  ParseUtilPartial,
  Unreliable,
} from '../../../common/types.js'
import {
  parseArrayOf,
  parseDate,
  parseSingular,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { DcNs } from '../common/types.js'

const rdfDescriptionRegex = /^\s*<rdf:description[\s/>]/i

// The value is re-parsed because every dc element is a stop node, so its markup arrives raw.
const rdfDescriptionParser = new XMLParser({
  ...parserConfig,
  stopNodes: ['rdf:description.rdf:value'],
})

// A DC property in RDF can hold a value node in place of a literal, its value string in rdf:value.
// See: https://web.archive.org/web/20110101182532/http://dublincore.org/documents/dc-rdf/, section 4.6.
const retrieveValue = (value: Unreliable): Unreliable => {
  const text = retrieveText(value)

  if (typeof text !== 'string' || !rdfDescriptionRegex.test(text)) {
    return text
  }

  try {
    const description = parseSingular(rdfDescriptionParser.parse(text)['rdf:description'])

    return retrieveText(parseSingular(description?.['rdf:value']))
  } catch {
    return text
  }
}

export const retrieveItemOrFeed: ParseUtilPartial<
  DcNs.ItemOrFeed<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const itemOrFeed = {
    titles: parseArrayOf(value['dc:title'], (value) => parseString(retrieveValue(value))),
    creators: parseArrayOf(value['dc:creator'], (value) => parseString(retrieveValue(value))),
    subjects: parseArrayOf(value['dc:subject'], (value) => parseString(retrieveValue(value))),
    descriptions: parseArrayOf(value['dc:description'], (value) =>
      parseString(retrieveValue(value)),
    ),
    publishers: parseArrayOf(value['dc:publisher'], (value) => parseString(retrieveValue(value))),
    contributors: parseArrayOf(value['dc:contributor'], (value) =>
      parseString(retrieveValue(value)),
    ),
    dates: parseArrayOf(value['dc:date'], (value) =>
      parseDate(retrieveValue(value), options?.parseDateFn),
    ),
    types: parseArrayOf(value['dc:type'], (value) => parseString(retrieveValue(value))),
    formats: parseArrayOf(value['dc:format'], (value) => parseString(retrieveValue(value))),
    identifiers: parseArrayOf(value['dc:identifier'], (value) => parseString(retrieveValue(value))),
    sources: parseArrayOf(value['dc:source'], (value) => parseString(retrieveValue(value))),
    languages: parseArrayOf(value['dc:language'], (value) => parseString(retrieveValue(value))),
    relations: parseArrayOf(value['dc:relation'], (value) => parseString(retrieveValue(value))),
    coverage: parseArrayOf(value['dc:coverage'], (value) => parseString(retrieveValue(value))),
    rights: parseArrayOf(value['dc:rights'], (value) => parseString(retrieveValue(value))),
  }

  return trimObject(itemOrFeed)
}
