import {
  createNamespaceGetter,
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import { parseItemOrFeed as parseDcItemOrFeed } from '../../../namespaces/dc/utils.js'
import {
  parseFeed as parseItunesFeed,
  parseItem as parseItunesItem,
} from '../../../namespaces/itunes/utils.js'
import { parseItem as parseSlashItem } from '../../../namespaces/slash/utils.js'
import { parseFeed as parseSyFeed } from '../../../namespaces/sy/utils.js'
import type { ParseFunction } from './types.js'
import type { Category, Entry, Feed, Generator, Link, Person, Source } from './types.js'

export const parseLink: ParseFunction<Link> = (value) => {
  if (!isObject(value)) {
    return
  }

  const link = {
    href: parseString(value['@href']),
    rel: parseString(value['@rel']),
    type: parseString(value['@type']),
    hreflang: parseString(value['@hreflang']),
    title: parseString(value['@title']),
    length: parseNumber(value['@length']),
  }

  if (isPresent(link.href)) {
    return trimObject(link)
  }
}

export const retrievePersonUri: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const uri = parseString(retrieveText(get('uri'))) // Atom 1.0.
  const url = parseString(retrieveText(get('url'))) // Atom 0.3.

  return uri || url
}

export const parsePerson: ParseFunction<Person> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const person = {
    name: parseString(retrieveText(get('name'))),
    uri: retrievePersonUri(value, options),
    email: parseString(retrieveText(get('email'))),
  }

  if (isPresent(person.name)) {
    return trimObject(person)
  }
}

export const parseCategory: ParseFunction<Category> = (value) => {
  if (!isObject(value)) {
    return
  }

  const category = {
    term: parseString(value['@term']),
    scheme: parseString(value['@scheme']),
    label: parseString(value['@label']),
  }

  if (isPresent(category.term)) {
    return trimObject(category)
  }
}

export const retrieveGeneratorUri: ParseFunction<string> = (value) => {
  if (!isObject(value)) {
    return
  }

  const uri = parseString(value['@uri']) // Atom 1.0.
  const url = parseString(value['@url']) // Atom 0.3.

  return uri || url
}

export const parseGenerator: ParseFunction<Generator> = (value) => {
  if (!isObject(value)) {
    return
  }

  const generator = {
    text: parseString(retrieveText(value)),
    uri: retrieveGeneratorUri(value),
    version: parseString(value['@version']),
  }

  if (isPresent(generator.text)) {
    return trimObject(generator)
  }
}

export const parseSource: ParseFunction<Source> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const source = trimObject({
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseGenerator(get('generator')),
    icon: parseString(retrieveText(get('icon'))),
    id: parseString(retrieveText(get('id'))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseString(retrieveText(get('logo'))),
    rights: parseString(retrieveText(get('rights'))),
    subtitle: parseString(retrieveText(get('subtitle'))),
    title: parseString(retrieveText(get('title'))),
    updated: retrieveUpdated(value),
  })

  return source
}

export const retrievePublished: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const published = parseString(retrieveText(get('published'))) // Atom 1.0.
  const issued = parseString(retrieveText(get('issued'))) // Atom 0.3.
  const created = parseString(retrieveText(get('created'))) // Atom 0.3.

  // The "created" date is not entirely valid as "published date", but if it's there when
  // no other date is present, it's a good-enough fallback especially that it's not present
  // in 1.0 version of the specfication.
  return published || issued || created
}

export const retrieveUpdated: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const updated = parseString(retrieveText(get('updated'))) // Atom 1.0.
  const modified = parseString(retrieveText(get('modified'))) // Atom 0.3.

  return updated || modified
}

export const retrieveSubtitle: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const subtitle = parseString(retrieveText(get('subtitle'))) // Atom 1.0.
  const tagline = parseString(retrieveText(get('tagline'))) // Atom 0.3.

  return subtitle || tagline
}

export const parseEntry: ParseFunction<Entry> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const entry = trimObject({
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    content: parseString(retrieveText(get('content'))),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    id: parseString(retrieveText(get('id'))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    published: retrievePublished(value, options),
    rights: parseString(retrieveText(get('rights'))),
    source: parseSource(get('source')),
    summary: parseString(retrieveText(get('summary'))),
    title: parseString(retrieveText(get('title'))),
    updated: retrieveUpdated(value, options),
    dc: options?.partial ? undefined : parseDcItemOrFeed(value),
    slash: options?.partial ? undefined : parseSlashItem(value),
    itunes: options?.partial ? undefined : parseItunesItem(value),
  })

  if (options?.partial || !entry) {
    return entry
  }

  // INFO: Spec also says about required "updated" but this field is
  // not always present in entries. We can still parse the entry without it.
  if (isPresent(entry.id) && isPresent(entry.title)) {
    return entry
  }
}

export const parseFeed: ParseFunction<Feed> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const feed = trimObject({
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseGenerator(get('generator')),
    icon: parseString(retrieveText(get('icon'))),
    id: parseString(retrieveText(get('id'))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseString(retrieveText(get('logo'))),
    rights: parseString(retrieveText(get('rights'))),
    subtitle: retrieveSubtitle(value, options),
    title: parseString(retrieveText(get('title'))),
    updated: retrieveUpdated(value, options),
    entries: parseArrayOf(get('entry'), (value) => parseEntry(value, options)),
    dc: options?.partial ? undefined : parseDcItemOrFeed(value),
    sy: options?.partial ? undefined : parseSyFeed(value),
    itunes: options?.partial ? undefined : parseItunesFeed(value),
  })

  if (options?.partial || !feed) {
    return feed
  }

  // INFO: Spec says about required "id", "title" and "updated". The thing is "updated" is
  // frequently missing from the feeds and since this field is not strictly necessary to make
  // the feed make sense, it is not required here. The "ID" field is mostly present, but also
  // not in 100% of cases. It's not ideal not to have it, but it's not a dealbreaker either,
  // so if either "id" or "title" is present, the feed is treated as valid.
  // The "ID" can always fall back to the "title" if it's missing in application's code.
  if (isPresent(feed.id) || isPresent(feed.title)) {
    return feed
  }
}

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  const notNamespaced = parseFeed(value?.feed)
  const namespaced = parseFeed(value?.['atom:feed'], { prefix: 'atom:' })

  return notNamespaced || namespaced
}
