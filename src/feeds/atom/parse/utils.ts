import type { Unreliable } from '../../../common/types.js'
import {
  detectNamespaces,
  isObject,
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveDctermsItemOrFeed } from '../../../namespaces/dcterms/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import {
  retrieveFeed as retrieveItunesFeed,
  retrieveItem as retrieveItunesItem,
} from '../../../namespaces/itunes/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveItem as retrievePscItem } from '../../../namespaces/psc/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import {
  retrieveItem as retrieveThrItem,
  retrieveLink as retrieveThrLink,
} from '../../../namespaces/thr/parse/utils.js'
import { retrieveItem as retrieveWfwItem } from '../../../namespaces/wfw/parse/utils.js'
import {
  retrieveFeed as retrieveYtFeed,
  retrieveItem as retrieveYtItem,
} from '../../../namespaces/yt/parse/utils.js'
import type {
  Category,
  Entry,
  Feed,
  Generator,
  Link,
  ParsePartialFunction,
  Person,
  Source,
} from '../common/types.js'

export const createNamespaceGetter = (
  value: Record<string, Unreliable>,
  prefix: string | undefined,
) => {
  if (!prefix) {
    return (key: string) => value[key]
  }

  const prefixedKeys = new Map<string, string>()

  return (key: string) => {
    let prefixedKey = prefixedKeys.get(key)

    if (!prefixedKey) {
      prefixedKey = prefix + key
      prefixedKeys.set(key, prefixedKey)
    }

    return value[prefixedKey]
  }
}

export const parseLink: ParsePartialFunction<Link<string>> = (value) => {
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

  return trimObject(link)
}

export const retrievePersonUri: ParsePartialFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const uri = parseSingularOf(get('uri'), (value) => parseString(retrieveText(value))) // Atom 1.0.
  const url = parseSingularOf(get('url'), (value) => parseString(retrieveText(value))) // Atom 0.3.

  return uri || url
}

export const parsePerson: ParsePartialFunction<Person> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const person = {
    name: parseSingularOf(get('name'), (value) => parseString(retrieveText(value))),
    uri: retrievePersonUri(value, options),
    email: parseSingularOf(get('email'), (value) => parseString(retrieveText(value))),
  }

  return trimObject(person)
}

export const parseCategory: ParsePartialFunction<Category> = (value) => {
  if (!isObject(value)) {
    return
  }

  const category = {
    term: parseString(value['@term']),
    scheme: parseString(value['@scheme']),
    label: parseString(value['@label']),
  }

  return trimObject(category)
}

export const retrieveGeneratorUri: ParsePartialFunction<string> = (value) => {
  if (!isObject(value)) {
    return
  }

  const uri = parseString(value['@uri']) // Atom 1.0.
  const url = parseString(value['@url']) // Atom 0.3.

  return uri || url
}

export const parseGenerator: ParsePartialFunction<Generator> = (value) => {
  const generator = {
    text: parseString(retrieveText(value)),
    uri: retrieveGeneratorUri(value),
    version: parseString(value?.['@version']),
  }

  return trimObject(generator)
}

export const parseSource: ParsePartialFunction<Source<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const source = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseSingularOf(get('generator'), parseGenerator),
    icon: parseSingularOf(get('icon'), (value) => parseString(retrieveText(value))),
    id: parseSingularOf(get('id'), (value) => parseString(retrieveText(value))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseSingularOf(get('logo'), (value) => parseString(retrieveText(value))),
    rights: parseSingularOf(get('rights'), (value) => parseString(retrieveText(value))),
    subtitle: parseSingularOf(get('subtitle'), (value) => parseString(retrieveText(value))),
    title: parseSingularOf(get('title'), (value) => parseString(retrieveText(value))),
    updated: retrieveUpdated(value),
  }

  return trimObject(source)
}

export const retrievePublished: ParsePartialFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const published = parseSingularOf(get('published'), (value) => parseDate(retrieveText(value))) // Atom 1.0.
  const issued = parseSingularOf(get('issued'), (value) => parseDate(retrieveText(value))) // Atom 0.3.
  const created = parseSingularOf(get('created'), (value) => parseDate(retrieveText(value))) // Atom 0.3.

  // The "created" date is not entirely valid as "published date", but if it's there when
  // no other date is present, it's a good-enough fallback especially that it's not present
  // in 1.0 version of the specfication.
  return published || issued || created
}

export const retrieveUpdated: ParsePartialFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const updated = parseSingularOf(get('updated'), (value) => parseDate(retrieveText(value))) // Atom 1.0.
  const modified = parseSingularOf(get('modified'), (value) => parseDate(retrieveText(value))) // Atom 0.3.

  return updated || modified
}

export const retrieveSubtitle: ParsePartialFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const subtitle = parseSingularOf(get('subtitle'), (value) => parseString(retrieveText(value))) // Atom 1.0.
  const tagline = parseSingularOf(get('tagline'), (value) => parseString(retrieveText(value))) // Atom 0.3.

  return subtitle || tagline
}

export const parseEntry: ParsePartialFunction<Entry<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = options?.asNamespace ? undefined : detectNamespaces(value)
  const get = createNamespaceGetter(value, options?.prefix)
  const entry = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    content: parseSingularOf(get('content'), (value) => parseString(retrieveText(value))),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    id: parseSingularOf(get('id'), (value) => parseString(retrieveText(value))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    published: retrievePublished(value, options),
    rights: parseSingularOf(get('rights'), (value) => parseString(retrieveText(value))),
    source: parseSingularOf(get('source'), parseSource),
    summary: parseSingularOf(get('summary'), (value) => parseString(retrieveText(value))),
    title: parseSingularOf(get('title'), (value) => parseString(retrieveText(value))),
    updated: retrieveUpdated(value, options),
    dc: namespaces?.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    slash: namespaces?.has('slash') ? retrieveSlashItem(value) : undefined,
    itunes: namespaces?.has('itunes') ? retrieveItunesItem(value) : undefined,
    psc: namespaces?.has('psc') ? retrievePscItem(value) : undefined,
    media: namespaces?.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces?.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    thr: namespaces?.has('thr') ? retrieveThrItem(value) : undefined,
    dcterms: namespaces?.has('dcterms') ? retrieveDctermsItemOrFeed(value) : undefined,
    wfw: namespaces?.has('wfw') ? retrieveWfwItem(value) : undefined,
    yt: namespaces?.has('yt') ? retrieveYtItem(value) : undefined,
  }

  return trimObject(entry)
}

export const parseFeed: ParsePartialFunction<Feed<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const namespaces = options?.asNamespace ? undefined : detectNamespaces(value)
  const get = createNamespaceGetter(value, options?.prefix)
  const feed = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseSingularOf(get('generator'), parseGenerator),
    icon: parseSingularOf(get('icon'), (value) => parseString(retrieveText(value))),
    id: parseSingularOf(get('id'), (value) => parseString(retrieveText(value))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseSingularOf(get('logo'), (value) => parseString(retrieveText(value))),
    rights: parseSingularOf(get('rights'), (value) => parseString(retrieveText(value))),
    subtitle: retrieveSubtitle(value, options),
    title: parseSingularOf(get('title'), (value) => parseString(retrieveText(value))),
    updated: retrieveUpdated(value, options),
    entries: parseArrayOf(get('entry'), (value) => parseEntry(value, options)),
    dc: namespaces?.has('dc') ? retrieveDcItemOrFeed(value) : undefined,
    sy: namespaces?.has('sy') ? retrieveSyFeed(value) : undefined,
    itunes: namespaces?.has('itunes') ? retrieveItunesFeed(value) : undefined,
    media: namespaces?.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces?.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    dcterms: namespaces?.has('dcterms') ? retrieveDctermsItemOrFeed(value) : undefined,
    yt: namespaces?.has('yt') ? retrieveYtFeed(value) : undefined,
  }

  return trimObject(feed)
}

export const retrieveFeed: ParsePartialFunction<Feed<string>> = (value) => {
  const notNamespaced = parseSingularOf(value?.feed, parseFeed)
  const namespaced = parseSingularOf(value?.['atom:feed'], (value) =>
    parseFeed(value, { prefix: 'atom:' }),
  )

  return notNamespaced || namespaced
}
