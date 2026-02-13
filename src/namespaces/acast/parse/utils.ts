import type { ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { AcastNs } from '../common/types.js'

export const parseSignature: ParseUtilPartial<AcastNs.Signature> = (value) => {
  if (!isObject(value)) {
    return
  }

  const signature = {
    key: parseString(value['@key']),
    algorithm: parseString(value['@algorithm']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(signature)
}

export const parseNetwork: ParseUtilPartial<AcastNs.Network> = (value) => {
  if (!isObject(value)) {
    return
  }

  const network = {
    id: parseString(value['@id']),
    slug: parseString(value['@slug']),
    value: parseString(retrieveText(value)),
  }

  return trimObject(network)
}

export const retrieveFeed: ParseUtilPartial<AcastNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    showId: parseSingularOf(value['acast:showid'], (value) => parseString(retrieveText(value))),
    showUrl: parseSingularOf(value['acast:showurl'], (value) => parseString(retrieveText(value))),
    signature: parseSingularOf(value['acast:signature'], parseSignature),
    settings: parseSingularOf(value['acast:settings'], (value) => parseString(retrieveText(value))),
    network: parseSingularOf(value['acast:network'], parseNetwork),
    importedFeed: parseSingularOf(value['acast:importedfeed'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<AcastNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    episodeId: parseSingularOf(value['acast:episodeid'], (value) =>
      parseString(retrieveText(value)),
    ),
    showId: parseSingularOf(value['acast:showid'], (value) => parseString(retrieveText(value))),
    episodeUrl: parseSingularOf(value['acast:episodeurl'], (value) =>
      parseString(retrieveText(value)),
    ),
    settings: parseSingularOf(value['acast:settings'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
