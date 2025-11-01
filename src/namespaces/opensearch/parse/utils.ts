import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { OpenSearchNs } from '../common/types.js'

export const parseQuery: ParsePartialUtil<OpenSearchNs.Query> = (value) => {
  if (!isObject(value)) {
    return
  }

  const query = {
    role: parseString(value['@role']),
    searchTerms: parseString(value['@searchterms']),
    count: parseNumber(value['@count']),
    startIndex: parseNumber(value['@startindex']),
    startPage: parseNumber(value['@startpage']),
    language: parseString(value['@language']),
    inputEncoding: parseString(value['@inputencoding']),
    outputEncoding: parseString(value['@outputencoding']),
  }

  return trimObject(query)
}

export const retrieveFeed: ParsePartialUtil<OpenSearchNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    totalResults: parseSingularOf(value['opensearch:totalresults'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    startIndex: parseSingularOf(value['opensearch:startindex'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    itemsPerPage: parseSingularOf(value['opensearch:itemsperpage'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    queries: parseArrayOf(value['opensearch:query'], parseQuery),
  }

  return trimObject(feed)
}
