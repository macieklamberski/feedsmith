import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseBoolean,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { SpotifyNs } from '../common/types.js'

export const parseLimit: ParsePartialUtil<SpotifyNs.Limit> = (value) => {
  if (!isObject(value)) {
    return
  }

  const limit = {
    recentCount: parseNumber(value['@recentcount']),
  }

  return trimObject(limit)
}

export const parsePartner: ParsePartialUtil<SpotifyNs.Partner> = (value) => {
  if (!isObject(value)) {
    return
  }

  const id = parseString(value['@id'])

  return id ? { id } : undefined
}

export const parseSandbox: ParsePartialUtil<SpotifyNs.Sandbox> = (value) => {
  if (!isObject(value)) {
    return
  }

  const enabled = parseBoolean(value['@enabled'])

  return enabled !== undefined ? { enabled } : undefined
}

export const parseFeedAccess: ParsePartialUtil<SpotifyNs.FeedAccess> = (value) => {
  if (!isObject(value)) {
    return
  }

  const access = {
    partner: parseSingularOf(value.partner, parsePartner),
    sandbox: parseSingularOf(value.sandbox, parseSandbox),
  }

  return trimObject(access)
}

export const parseEntitlement: ParsePartialUtil<SpotifyNs.Entitlement> = (value) => {
  if (!isObject(value)) {
    return
  }

  const name = parseString(value['@name'])

  return name ? { name } : undefined
}

export const parseItemAccess: ParsePartialUtil<SpotifyNs.ItemAccess> = (value) => {
  if (!isObject(value)) {
    return
  }

  const access = {
    entitlement: parseSingularOf(value.entitlement, parseEntitlement),
  }

  return trimObject(access)
}

export const retrieveFeed: ParsePartialUtil<SpotifyNs.Feed> = (value) => {
  if (!isObject(value)) {
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

export const retrieveItem: ParsePartialUtil<SpotifyNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    access: parseSingularOf(value['spotify:access'], parseItemAccess),
  }

  return trimObject(item)
}
