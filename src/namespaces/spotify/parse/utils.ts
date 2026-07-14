import { isPlainObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseBoolean,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { SpotifyNs } from '../common/types.js'

export const parseLimit: ParseUtilPartial<SpotifyNs.Limit> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const limit = {
    recentCount: parseNumber(value['@recentcount']),
  }

  return trimObject(limit)
}

export const parsePartner: ParseUtilPartial<SpotifyNs.Partner> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const id = parseString(value['@id'])

  return id ? { id } : undefined
}

export const parseSandbox: ParseUtilPartial<SpotifyNs.Sandbox> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const enabled = parseBoolean(value['@enabled'])

  return enabled !== undefined ? { enabled } : undefined
}

export const parseFeedAccess: ParseUtilPartial<SpotifyNs.FeedAccess> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const access = {
    partner: parseSingularOf(value.partner, parsePartner),
    sandbox: parseSingularOf(value.sandbox, parseSandbox),
  }

  return trimObject(access)
}

export const parseEntitlement: ParseUtilPartial<SpotifyNs.Entitlement> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const name = parseString(value['@name'])

  return name ? { name } : undefined
}

export const parseItemAccess: ParseUtilPartial<SpotifyNs.ItemAccess> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const access = {
    entitlement: parseSingularOf(value.entitlement, parseEntitlement),
  }

  return trimObject(access)
}

export const retrieveFeed: ParseUtilPartial<SpotifyNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    limit: parseSingularOf(value['spotify:limit'], parseLimit),
    countryOfOrigin: parseSingularOf(value['spotify:countryoforigin'], (value) =>
      parseString(retrieveText(value)),
    ),
    access: parseSingularOf(value['spotify:access'], parseFeedAccess),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<SpotifyNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    access: parseSingularOf(value['spotify:access'], parseItemAccess),
  }

  return trimObject(item)
}
