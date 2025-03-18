import type { ParseFunction } from '../../common/types'
import {
  hasAllProps,
  hasAnyProps,
  isObject,
  parseArrayOf,
  parseNumber,
  parseString,
} from '../../common/utils'
import type { Category, Entry, Feed, Generator, Link, Person, Source } from './types'

export const parseLink: ParseFunction<Link> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const link = {
    href: parseString(value?.['@href'], level),
    rel: parseString(value?.['@rel'], level),
    type: parseString(value?.['@type'], level),
    hreflang: parseString(value?.['@hreflang'], level),
    title: parseString(value?.['@title'], level),
    length: parseNumber(value?.['@length'], level),
  }

  if (hasAllProps(link, ['href'])) {
    return link
  }
}

export const retrievePersonUri: ParseFunction<string> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const uri = parseString(value.uri?.['#text'], level) // Atom 1.0.
  const url = parseString(value.url?.['#text'], level) // Atom 0.3.

  return uri || url
}

export const parsePerson: ParseFunction<Person> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const person = {
    name: parseString(value.name?.['#text'], level),
    uri: retrievePersonUri(value, level),
    email: parseString(value.email?.['#text'], level),
  }

  if (hasAllProps(person, ['name'])) {
    return person
  }
}

export const parseCategory: ParseFunction<Category> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const category = {
    term: parseString(value['@term'], level),
    scheme: parseString(value['@scheme'], level),
    label: parseString(value['@label'], level),
  }

  if (hasAllProps(category, ['term'])) {
    return category
  }
}

export const retrieveGeneratorUri: ParseFunction<string> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const uri = parseString(value['@uri'], level) // Atom 1.0.
  const url = parseString(value['@url'], level) // Atom 0.3.

  return uri || url
}

export const parseGenerator: ParseFunction<Generator> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const generator = {
    text: parseString(value?.['#text'], level),
    uri: retrieveGeneratorUri(value, level),
    version: parseString(value['@version'], level),
  }

  if (hasAllProps(generator, ['text'])) {
    return generator
  }
}

export const parseSource: ParseFunction<Source> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const source = {
    authors: parseArrayOf<Person>(value.author, parsePerson, level),
    categories: parseArrayOf<Category>(value.category, parseCategory, level),
    contributors: parseArrayOf<Person>(value.contributor, parsePerson, level),
    generator: parseGenerator(value.generator, level),
    icon: parseString(value.icon?.['#text'], level),
    id: parseString(value.id?.['#text'], level),
    links: parseArrayOf(value.link, parseLink, level),
    logo: parseString(value.logo?.['#text'], level),
    rights: parseString(value.rights?.['#text'], level),
    subtitle: parseString(value.subtitle?.['#text'], level),
    title: parseString(value.title?.['#text'], level),
    updated: retrieveUpdated(value, level),
  }

  if (hasAnyProps(source, Object.keys(source) as Array<keyof Source>)) {
    return source
  }
}

export const retrievePublished: ParseFunction<string> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const published = parseString(value.published?.['#text'], level) // Atom 1.0.
  const issued = parseString(value.issued?.['#text'], level) // Atom 0.3.
  const created = parseString(value.created?.['#text'], level) // Atom 0.3.

  // The "created" date is not entirely valid as "published date", but if it's there awhen
  // no other date is present, it's a good-enough fallback especially that it's not present
  // in 1.0 version of the specfication.
  return published || issued || created
}

export const retrieveUpdated: ParseFunction<string> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const updated = parseString(value.updated?.['#text'], level) // Atom 1.0.
  const modified = parseString(value.modified?.['#text'], level) // Atom 0.3.

  return updated || modified
}

export const retrieveSubtitle: ParseFunction<string> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const subtitle = parseString(value.subtitle?.['#text'], level) // Atom 1.0.
  const tagline = parseString(value.tagline?.['#text'], level) // Atom 0.3.

  return subtitle || tagline
}

export const parseEntry: ParseFunction<Entry> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const entry = {
    authors: parseArrayOf(value.author, parsePerson, level),
    categories: parseArrayOf(value.category, parseCategory, level),
    content: parseString(value.content?.['#text'], level),
    contributors: parseArrayOf(value.contributor, parsePerson, level),
    id: parseString(value.id?.['#text'], level),
    links: parseArrayOf(value.link, parseLink, level),
    published: retrievePublished(value, level),
    rights: parseString(value.rights?.['#text'], level),
    source: parseSource(value.source, level),
    summary: parseString(value.summary?.['#text'], level),
    title: parseString(value.title?.['#text'], level),
    updated: retrieveUpdated(value, level),
  }

  // INFO: Spec also says about required "updated" and "author" but those are
  // not always present in feeds. We can still parse the feed without them.
  if (hasAllProps(entry, ['id', 'title'])) {
    return entry
  }
}

export const parseFeed: ParseFunction<Feed> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    authors: parseArrayOf(value.author, parsePerson, level),
    categories: parseArrayOf(value.category, parseCategory, level),
    contributors: parseArrayOf(value.contributor, parsePerson, level),
    generator: parseGenerator(value.generator, level),
    icon: parseString(value.icon?.['#text'], level),
    id: parseString(value.id?.['#text'], level),
    links: parseArrayOf(value.link, parseLink, level),
    logo: parseString(value.logo?.['#text'], level),
    rights: parseString(value.rights?.['#text'], level),
    subtitle: retrieveSubtitle(value, level),
    title: parseString(value.title?.['#text'], level),
    updated: retrieveUpdated(value, level),
    entries: parseArrayOf(value.entry, parseEntry, level),
  }

  // INFO: Spec also says about required "updated" and "author" but those are
  // not always present in feeds. We can still parse the feed without them.
  if (hasAllProps(feed, ['id', 'title'])) {
    return feed
  }
}
