import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { AtNs } from '../common/types.js'

export const generatePerson: GenerateUtil<AtNs.Person> = (person) => {
  if (!isObject(person)) {
    return
  }

  const value = {
    name: generateCdataString(person.name),
    uri: generateCdataString(person.uri),
    email: generateCdataString(person.email),
  }

  return trimObject(value)
}

export const generateLink: GenerateUtil<AtNs.Link> = (link) => {
  if (!isObject(link)) {
    return
  }

  const value = {
    '@href': generatePlainString(link.href),
    '@rel': generatePlainString(link.rel),
    '@type': generatePlainString(link.type),
    '@hreflang': generatePlainString(link.hreflang),
    '@title': generatePlainString(link.title),
    '@length': generateNumber(link.length),
  }

  return trimObject(value)
}

export const generateDeletedEntry: GenerateUtil<AtNs.DeletedEntry<DateLike>> = (deletedEntry) => {
  if (!isObject(deletedEntry)) {
    return
  }

  const value = {
    '@ref': generatePlainString(deletedEntry.ref),
    '@when': generateRfc3339Date(deletedEntry.when),
    'at:by': generatePerson(deletedEntry.by),
    'at:comment': generateCdataString(deletedEntry.comment),
    link: trimArray(deletedEntry.links, generateLink),
  }

  return trimObject(value)
}

export const generateFeed: GenerateUtil<AtNs.Feed<DateLike>> = (feed) => {
  if (!isObject(feed)) {
    return
  }

  const value = {
    'at:deleted-entry': trimArray(feed.deletedEntries, generateDeletedEntry),
  }

  return trimObject(value)
}
