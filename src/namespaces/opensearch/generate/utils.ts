import type { GenerateUtil } from '../../../common/types.js'
import {
  generateNumber,
  generatePlainString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { OpensearchNs } from '../common/types.js'

export const generateQuery: GenerateUtil<OpensearchNs.Query> = (query) => {
  if (!isObject(query)) {
    return
  }

  const value = {
    '@role': generatePlainString(query.role),
    '@searchTerms': generatePlainString(query.searchTerms),
    '@count': generateNumber(query.count),
    '@startIndex': generateNumber(query.startIndex),
    '@startPage': generateNumber(query.startPage),
    '@language': generatePlainString(query.language),
    '@inputEncoding': generatePlainString(query.inputEncoding),
    '@outputEncoding': generatePlainString(query.outputEncoding),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<OpensearchNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'opensearch:totalResults': generateNumber(feed.totalResults),
    'opensearch:startIndex': generateNumber(feed.startIndex),
    'opensearch:itemsPerPage': generateNumber(feed.itemsPerPage),
    'opensearch:Query': trimArray(feed.queries, generateQuery),
  }

  return trimObject(value)
}
