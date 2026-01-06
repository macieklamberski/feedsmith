import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  generateTextOrCdataString,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { AcastNs } from '../common/types.js'

export const generateSignature: GenerateUtil<AcastNs.Signature> = (signature) => {
  if (!isObject(signature)) {
    return
  }

  const value = {
    '@key': generatePlainString(signature.key),
    '@algorithm': generatePlainString(signature.algorithm),
    ...generateTextOrCdataString(signature.value),
  }

  return trimObject(value)
}

export const generateNetwork: GenerateUtil<AcastNs.Network> = (network) => {
  if (!isObject(network)) {
    return
  }

  const value = {
    '@id': generatePlainString(network.id),
    '@slug': generatePlainString(network.slug),
    ...generateTextOrCdataString(network.value),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<AcastNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'acast:showId': generateCdataString(feed.showId),
    'acast:showUrl': generateCdataString(feed.showUrl),
    'acast:signature': generateSignature(feed.signature),
    'acast:settings': generateCdataString(feed.settings),
    'acast:network': generateNetwork(feed.network),
    'acast:importedFeed': generateCdataString(feed.importedFeed),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<AcastNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'acast:episodeId': generateCdataString(item.episodeId),
    'acast:showId': generateCdataString(item.showId),
    'acast:episodeUrl': generateCdataString(item.episodeUrl),
    'acast:settings': generateCdataString(item.settings),
  }

  return trimObject(value)
}
