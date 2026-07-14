import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generatePlainString,
  trimObject,
} from '../../../common/utils.js'
import type { SpotifyNs } from '../common/types.js'

export const generateLimit: GenerateUtil<SpotifyNs.Limit> = (limit) => {
  if (!isPlainObject(limit)) {
    return
  }

  const value = {
    '@recentCount': generateNumber(limit.recentCount),
  }

  return trimObject(value)
}

export const generatePartner: GenerateUtil<SpotifyNs.Partner> = (partner) => {
  if (!isPlainObject(partner)) {
    return
  }

  const value = {
    '@id': generatePlainString(partner.id),
  }

  return trimObject(value)
}

export const generateSandbox: GenerateUtil<SpotifyNs.Sandbox> = (sandbox) => {
  if (!isPlainObject(sandbox)) {
    return
  }

  return {
    '@enabled': sandbox.enabled,
  }
}

export const generateFeedAccess: GenerateUtil<SpotifyNs.FeedAccess> = (access) => {
  if (!isPlainObject(access)) {
    return
  }

  const value = {
    partner: generatePartner(access.partner),
    sandbox: generateSandbox(access.sandbox),
  }

  return trimObject(value)
}

export const generateEntitlement: GenerateUtil<SpotifyNs.Entitlement> = (entitlement) => {
  if (!isPlainObject(entitlement)) {
    return
  }

  const value = {
    '@name': generatePlainString(entitlement.name),
  }

  return trimObject(value)
}

export const generateItemAccess: GenerateUtil<SpotifyNs.ItemAccess> = (access) => {
  if (!isPlainObject(access)) {
    return
  }

  const value = {
    entitlement: generateEntitlement(access.entitlement),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<SpotifyNs.Feed> = (feed) => {
  if (!isPlainObject(feed)) {
    return
  }

  const value = {
    'spotify:limit': generateLimit(feed.limit),
    'spotify:countryOfOrigin': generateCdataString(feed.countryOfOrigin),
    'spotify:access': generateFeedAccess(feed.access),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<SpotifyNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'spotify:access': generateItemAccess(item.access),
  }

  return trimObject(value)
}
