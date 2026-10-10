import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, generatePlainString } from '../../../common/utils.js'
import type { WikiNs } from '../common/types.js'

export const generateInterwiki: GenerateUtil<WikiNs.Interwiki> = (interwiki) => {
  if (!isPlainObject(interwiki)) {
    return
  }

  const link = generatePlainString(interwiki.link)

  if (!link) {
    return generateCdataString(interwiki.value)
  }

  const value = {
    'rdf:Description': trimObject({
      '@link': link,
      'rdf:value': generateCdataString(interwiki.value),
    }),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<WikiNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'wiki:interwiki': generateInterwiki(feed.interwiki),
  }

  return trimObject(value)
}

// Host is left out: the spec places it on the rdf:Description inside dc:contributor, which the
// Dublin Core generator writes.
export const generateItem: GenerateUtil<WikiNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'wiki:version': generateCdataString(item.version),
    'wiki:status': generateCdataString(item.status),
    'wiki:importance': generateCdataString(item.importance),
    'wiki:diff': generateCdataString(item.diff),
    'wiki:history': generateCdataString(item.history),
  }

  return trimObject(value)
}
