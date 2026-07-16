import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { BylineNs } from '../common/types.js'

export const parseProfile: ParsePartialUtil<BylineNs.Profile> = (value) => {
  if (!isObject(value)) {
    return
  }

  const profile = {
    href: parseString(value['@href']),
    rel: parseString(value['@rel']),
  }

  return trimObject(profile)
}

export const parseTheme: ParsePartialUtil<BylineNs.Theme> = (value) => {
  if (!isObject(value)) {
    return
  }

  const theme = {
    color: parseString(value['@color']),
    accent: parseString(value['@accent']),
    style: parseString(value['@style']),
  }

  return trimObject(theme)
}

export const parsePerson: ParsePartialUtil<BylineNs.Person> = (value) => {
  if (!isObject(value)) {
    return
  }

  const person = {
    id: parseString(value['@id']),
    name: parseSingularOf(value['byline:name'], (value) => parseString(retrieveText(value))),
    context: parseSingularOf(value['byline:context'], (value) => parseString(retrieveText(value))),
    urls: parseArrayOf(value['byline:url'], (value) => parseString(retrieveText(value))),
    avatar: parseSingularOf(value['byline:avatar'], (value) => parseString(retrieveText(value))),
    profiles: parseArrayOf(value['byline:profile'], parseProfile),
    now: parseSingularOf(value['byline:now'], (value) => parseString(retrieveText(value))),
    uses: parseSingularOf(value['byline:uses'], (value) => parseString(retrieveText(value))),
    theme: parseSingularOf(value['byline:theme'], parseTheme),
  }

  return trimObject(person)
}

export const parseOrg: ParsePartialUtil<BylineNs.Org> = (value) => {
  if (!isObject(value)) {
    return
  }

  const org = {
    id: parseString(value['@id']),
    name: parseSingularOf(value['byline:name'], (value) => parseString(retrieveText(value))),
    url: parseSingularOf(value['byline:url'], (value) => parseString(retrieveText(value))),
    type: parseSingularOf(value['byline:type'], (value) => parseString(retrieveText(value))),
    theme: parseSingularOf(value['byline:theme'], parseTheme),
  }

  return trimObject(org)
}

export const parseAuthor: ParsePartialUtil<BylineNs.Author> = (value) => {
  if (!isObject(value)) {
    return
  }

  const author = {
    ref: parseString(value['@ref']),
    person: parseSingularOf(value['byline:person'], parsePerson),
  }

  return trimObject(author)
}

export const parseAffiliation: ParsePartialUtil<BylineNs.Affiliation> = (value) => {
  if (!isObject(value)) {
    return
  }

  const affiliation = {
    org: parseSingularOf(value['byline:org-ref'], (value) => parseString(value?.['@ref'])),
    relationship: parseSingularOf(value['byline:relationship'], (value) =>
      parseString(retrieveText(value)),
    ),
    title: parseSingularOf(value['byline:title'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(affiliation)
}

export const retrieveFeed: ParsePartialUtil<BylineNs.Feed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    contributors: parseSingularOf(value['byline:contributors'], (value) =>
      isObject(value) ? parseArrayOf(value['byline:person'], parsePerson) : undefined,
    ),
    organizations: parseSingularOf(value['byline:organizations'], (value) =>
      isObject(value) ? parseArrayOf(value['byline:org'], parseOrg) : undefined,
    ),
  }

  return trimObject(feed)
}

export const retrieveItem: ParsePartialUtil<BylineNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    author: parseSingularOf(value['byline:author'], parseAuthor),
    role: parseSingularOf(value['byline:role'], (value) => parseString(retrieveText(value))),
    perspective: parseSingularOf(value['byline:perspective'], (value) =>
      parseString(retrieveText(value)),
    ),
    affiliation: parseSingularOf(value['byline:affiliation'], parseAffiliation),
  }

  return trimObject(item)
}
