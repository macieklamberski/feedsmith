import type { DateAny, ParseOptions, ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseDate,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { DcNs } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialUtil<
  DcNs.ItemOrFeed<DateAny>,
  ParseOptions<DateAny>
> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    titles: parseArrayOf(value['dc:title'], (value) => parseString(retrieveText(value))),
    creators: parseArrayOf(value['dc:creator'], (value) => parseString(retrieveText(value))),
    subjects: parseArrayOf(value['dc:subject'], (value) => parseString(retrieveText(value))),
    descriptions: parseArrayOf(value['dc:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    publishers: parseArrayOf(value['dc:publisher'], (value) => parseString(retrieveText(value))),
    contributors: parseArrayOf(value['dc:contributor'], (value) =>
      parseString(retrieveText(value)),
    ),
    dates: parseArrayOf(value['dc:date'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    types: parseArrayOf(value['dc:type'], (value) => parseString(retrieveText(value))),
    formats: parseArrayOf(value['dc:format'], (value) => parseString(retrieveText(value))),
    identifiers: parseArrayOf(value['dc:identifier'], (value) => parseString(retrieveText(value))),
    sources: parseArrayOf(value['dc:source'], (value) => parseString(retrieveText(value))),
    languages: parseArrayOf(value['dc:language'], (value) => parseString(retrieveText(value))),
    relations: parseArrayOf(value['dc:relation'], (value) => parseString(retrieveText(value))),
    coverage: parseArrayOf(value['dc:coverage'], (value) => parseString(retrieveText(value))),
    rights: parseArrayOf(value['dc:rights'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(itemOrFeed)
}
