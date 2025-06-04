import {
  createNamespaceGetter,
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import {
  retrieveFeed as retrieveItunesFeed,
  retrieveItem as retrieveItunesItem,
} from '../../../namespaces/itunes/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import {
  retrieveItem as retrieveThrItem,
  retrieveLink as retrieveThrLink,
} from '../../../namespaces/thr/parse/utils.js'
import type { ParseFunction } from '../common/types.js'
import type { Category, Entry, Feed, Generator, Link, Person, Source } from '../common/types.js'

export const parseLink: ParseFunction<Link<string>> = (value) => {
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
    thr: retrieveThrLink(value),
  }

  if (isPresent(link.href)) {
    return trimObject(link) as Link<string>
  }
}

export const retrievePersonUri: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const uri = parseSingularOf(get('uri'), parseTextString) // Atom 1.0.
  const url = parseSingularOf(get('url'), parseTextString) // Atom 0.3.

  return uri || url
}

export const parsePerson: ParseFunction<Person> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const person = {
    name: parseSingularOf(get('name'), parseTextString),
    uri: retrievePersonUri(value, options),
    email: parseSingularOf(get('email'), parseTextString),
  }

  if (isPresent(person.name)) {
    return trimObject(person) as Person
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
    return trimObject(category) as Category
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
  const generator = {
    text: parseString(retrieveText(value)),
    uri: retrieveGeneratorUri(value),
    version: parseString(value?.['@version']),
  }

  if (isPresent(generator.text)) {
    return trimObject(generator) as Generator
  }
}

export const parseSource: ParseFunction<Source<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const source = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseSingularOf(get('generator'), parseGenerator),
    icon: parseSingularOf(get('icon'), parseTextString),
    id: parseSingularOf(get('id'), parseTextString),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseSingularOf(get('logo'), parseTextString),
    rights: parseSingularOf(get('rights'), parseTextString),
    subtitle: parseSingularOf(get('subtitle'), parseTextString),
    title: parseSingularOf(get('title'), parseTextString),
    updated: retrieveUpdated(value),
  }

  return trimObject(source)
}

export const retrievePublished: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const published = parseSingularOf(get('published'), parseTextString) // Atom 1.0.
  const issued = parseSingularOf(get('issued'), parseTextString) // Atom 0.3.
  const created = parseSingularOf(get('created'), parseTextString) // Atom 0.3.

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
  const updated = parseSingularOf(get('updated'), parseTextString) // Atom 1.0.
  const modified = parseSingularOf(get('modified'), parseTextString) // Atom 0.3.

  return updated || modified
}

export const retrieveSubtitle: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const subtitle = parseSingularOf(get('subtitle'), parseTextString) // Atom 1.0.
  const tagline = parseSingularOf(get('tagline'), parseTextString) // Atom 0.3.

  return subtitle || tagline
}

export const parseEntry: ParseFunction<Entry<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const entry = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    content: parseSingularOf(get('content'), parseTextString),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    id: parseSingularOf(get('id'), parseTextString),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    published: retrievePublished(value, options),
    rights: parseSingularOf(get('rights'), parseTextString),
    source: parseSingularOf(get('source'), parseSource),
    summary: parseSingularOf(get('summary'), parseTextString),
    title: parseSingularOf(get('title'), parseTextString),
    updated: retrieveUpdated(value, options),
    dc: options?.partial ? undefined : retrieveDcItemOrFeed(value),
    slash: options?.partial ? undefined : retrieveSlashItem(value),
    itunes: options?.partial ? undefined : retrieveItunesItem(value),
    media: options?.partial ? undefined : retrieveMediaItemOrFeed(value),
    georss: options?.partial ? undefined : retrieveGeoRssItemOrFeed(value),
    thr: options?.partial ? undefined : retrieveThrItem(value),
  }

  // INFO: Spec also says about required "updated" but this field is
  // not always present in entries. We can still parse the entry without it.
  if (options?.partial || (isPresent(entry.id) && isPresent(entry.title))) {
    return trimObject(entry) as Entry<string>
  }
}

export const parseFeed: ParseFunction<Feed<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const feed = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseSingularOf(get('generator'), parseGenerator),
    icon: parseSingularOf(get('icon'), parseTextString),
    id: parseSingularOf(get('id'), parseTextString),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseSingularOf(get('logo'), parseTextString),
    rights: parseSingularOf(get('rights'), parseTextString),
    subtitle: retrieveSubtitle(value, options),
    title: parseSingularOf(get('title'), parseTextString),
    updated: retrieveUpdated(value, options),
    entries: parseArrayOf(get('entry'), (value) => parseEntry(value, options)),
    dc: options?.partial ? undefined : retrieveDcItemOrFeed(value),
    sy: options?.partial ? undefined : retrieveSyFeed(value),
    itunes: options?.partial ? undefined : retrieveItunesFeed(value),
    media: options?.partial ? undefined : retrieveMediaItemOrFeed(value),
    georss: options?.partial ? undefined : retrieveGeoRssItemOrFeed(value),
  }

  // INFO: Spec says about required "id", "title" and "updated". The thing is, "updated" is
  // frequently missing from the feeds and since this field is not strictly necessary to make
  // the feed make sense, it is not required here. The "ID" field is mostly present, but also
  // not in 100% of cases. It's not ideal not to have it, but it's not a dealbreaker either,
  // so if either "id" or "title" is present, the feed is treated as valid.
  // The "ID" can always fall back to the "title" if it's missing in application's code.
  if (options?.partial || isPresent(feed.id) || isPresent(feed.title)) {
    return trimObject(feed) as Feed<string>
  }
}

export const retrieveFeed: ParseFunction<Feed<string>> = (value) => {
  const notNamespaced = parseSingularOf(value?.feed, parseFeed)
  const namespaced = parseSingularOf(value?.['atom:feed'], (value) =>
    parseFeed(value, { prefix: 'atom:' }),
  )

  return notNamespaced || namespaced
}
