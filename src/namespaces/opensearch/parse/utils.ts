import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { OpenSearchNs } from '../common/types.js'

export const parseQuery: ParseUtilPartial<OpenSearchNs.Query> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const query = {
    role: parseString(value['@role']),
    title: parseString(value['@title']),
    totalResults: parseNumber(value['@totalresults']),
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

export const parseLink: ParseUtilPartial<OpenSearchNs.Link> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const link = {
    href: parseString(value['@href']),
    rel: parseString(value['@rel']),
    type: parseString(value['@type']),
    hreflang: parseString(value['@hreflang']),
  }

  return trimObject(link)
}

export const retrieveFeed: ParseUtilPartial<OpenSearchNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
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
    link: parseSingularOf(value['opensearch:link'], parseLink),
    queries: parseArrayOf(value['opensearch:query'], parseQuery),
  }

  return trimObject(feed)
}
