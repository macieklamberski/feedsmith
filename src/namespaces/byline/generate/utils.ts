import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { BylineNs } from '../common/types.js'

export const generateProfile: GenerateUtil<BylineNs.Profile> = (profile) => {
  if (!isObject(profile) || !isNonEmptyString(profile.href)) {
    return
  }

  const value = {
    '@href': profile.href,
    '@rel': generatePlainString(profile.rel),
  }

  return trimObject(value)
}

export const generateTheme: GenerateUtil<BylineNs.Theme> = (theme) => {
  if (!isObject(theme)) {
    return
  }

  const value = {
    '@color': generatePlainString(theme.color),
    '@accent': generatePlainString(theme.accent),
    '@style': generatePlainString(theme.style),
  }

  return trimObject(value)
}

export const generatePerson: GenerateUtil<BylineNs.Person> = (person) => {
  if (!isObject(person) || !isNonEmptyString(person.name)) {
    return
  }

  const value = {
    '@id': generatePlainString(person.id),
    'byline:name': generateCdataString(person.name),
    'byline:context': generateCdataString(person.context),
    'byline:url': trimArray(person.urls, generateCdataString),
    'byline:avatar': generateCdataString(person.avatar),
    'byline:profile': trimArray(person.profiles, generateProfile),
    'byline:now': generateCdataString(person.now),
    'byline:uses': generateCdataString(person.uses),
    'byline:theme': generateTheme(person.theme),
  }

  return trimObject(value)
}

export const generateOrg: GenerateUtil<BylineNs.Org> = (org) => {
  if (!isObject(org) || !isNonEmptyString(org.name)) {
    return
  }

  const value = {
    '@id': generatePlainString(org.id),
    'byline:name': generateCdataString(org.name),
    'byline:url': generateCdataString(org.url),
    'byline:type': generateCdataString(org.type),
    'byline:theme': generateTheme(org.theme),
  }

  return trimObject(value)
}

export const generateAuthor: GenerateUtil<BylineNs.Author> = (author) => {
  if (!isObject(author)) {
    return
  }

  const value = {
    '@ref': generatePlainString(author.ref),
    'byline:person': generatePerson(author.person),
  }

  return trimObject(value)
}

export const generateAffiliation: GenerateUtil<BylineNs.Affiliation> = (affiliation) => {
  if (!isObject(affiliation)) {
    return
  }

  const value = {
    'byline:org-ref': isNonEmptyString(affiliation.org) ? { '@ref': affiliation.org } : undefined,
    'byline:relationship': generateCdataString(affiliation.relationship),
    'byline:title': generateCdataString(affiliation.title),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<BylineNs.Feed> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const persons = trimArray(feed.contributors, generatePerson)
  const organizations = trimArray(feed.organizations, generateOrg)

  const value = {
    'byline:contributors': persons ? { 'byline:person': persons } : undefined,
    'byline:organizations': organizations ? { 'byline:org': organizations } : undefined,
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<BylineNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'byline:author': generateAuthor(item.author),
    'byline:role': generateCdataString(item.role),
    'byline:perspective': generateCdataString(item.perspective),
    'byline:affiliation': generateAffiliation(item.affiliation),
  }

  return trimObject(value)
}
