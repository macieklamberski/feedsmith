import {
  hasAllProps,
  hasAnyProps,
  isNonEmptyObject,
  isObject,
  omitUndefinedFromObject,
  parseArrayOf,
  parseNumber,
  parseString,
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
    href: parseString(value?.['@href']),
    rel: parseString(value?.['@rel']),
    type: parseString(value?.['@type']),
    hreflang: parseString(value?.['@hreflang']),
    title: parseString(value?.['@title']),
    length: parseNumber(value?.['@length']),
  }

  if (hasAllProps(link, ['href'])) {
    return omitUndefinedFromObject(link)
  }
}

export const retrievePersonUri: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const uri = parseString(value[`${prefix}uri`]?.['#text']) // Atom 1.0.
  const url = parseString(value[`${prefix}url`]?.['#text']) // Atom 0.3.

  return uri || url
}

export const parsePerson: ParseFunction<Person> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const person = {
    name: parseString(value[`${prefix}name`]?.['#text']),
    uri: retrievePersonUri(value, options),
    email: parseString(value[`${prefix}email`]?.['#text']),
  }

  if (hasAllProps(person, ['name'])) {
    return omitUndefinedFromObject(person)
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

  if (hasAllProps(category, ['term'])) {
    return omitUndefinedFromObject(category)
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
    text: parseString(value?.['#text']),
    uri: retrieveGeneratorUri(value),
    version: parseString(value['@version']),
  }

  if (hasAllProps(generator, ['text'])) {
    return omitUndefinedFromObject(generator)
  }
}

export const parseSource: ParseFunction<Source> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const source = omitUndefinedFromObject({
    authors: parseArrayOf(value[`${prefix}author`], (value) => parsePerson(value, options)),
    categories: parseArrayOf(value[`${prefix}category`], (value) => parseCategory(value, options)),
    contributors: parseArrayOf(value[`${prefix}contributor`], (value) =>
      parsePerson(value, options),
    ),
    generator: parseGenerator(value[`${prefix}generator`]),
    icon: parseString(value[`${prefix}icon`]?.['#text']),
    id: parseString(value[`${prefix}id`]?.['#text']),
    links: parseArrayOf(value[`${prefix}link`], (value) => parseLink(value, options)),
    logo: parseString(value[`${prefix}logo`]?.['#text']),
    rights: parseString(value[`${prefix}rights`]?.['#text']),
    subtitle: parseString(value[`${prefix}subtitle`]?.['#text']),
    title: parseString(value[`${prefix}title`]?.['#text']),
    updated: retrieveUpdated(value),
  })

  if (isNonEmptyObject(source)) {
    return source
  }
}

export const retrievePublished: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const published = parseString(value[`${prefix}published`]?.['#text']) // Atom 1.0.
  const issued = parseString(value[`${prefix}issued`]?.['#text']) // Atom 0.3.
  const created = parseString(value[`${prefix}created`]?.['#text']) // Atom 0.3.

  // The "created" date is not entirely valid as "published date", but if it's there when
  // no other date is present, it's a good-enough fallback especially that it's not present
  // in 1.0 version of the specfication.
  return published || issued || created
}

export const retrieveUpdated: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const updated = parseString(value[`${prefix}updated`]?.['#text']) // Atom 1.0.
  const modified = parseString(value[`${prefix}modified`]?.['#text']) // Atom 0.3.

  return updated || modified
}

export const retrieveSubtitle: ParseFunction<string> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const subtitle = parseString(value[`${prefix}subtitle`]?.['#text']) // Atom 1.0.
  const tagline = parseString(value[`${prefix}tagline`]?.['#text']) // Atom 0.3.

  return subtitle || tagline
}

export const parseEntry: ParseFunction<Entry> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const entry = omitUndefinedFromObject({
    authors: parseArrayOf(value[`${prefix}author`], (value) => parsePerson(value, options)),
    categories: parseArrayOf(value[`${prefix}category`], (value) => parseCategory(value, options)),
    content: parseString(value[`${prefix}content`]?.['#text']),
    contributors: parseArrayOf(value[`${prefix}contributor`], (value) =>
      parsePerson(value, options),
    ),
    id: parseString(value[`${prefix}id`]?.['#text']),
    links: parseArrayOf(value[`${prefix}link`], (value) => parseLink(value, options)),
    published: retrievePublished(value, options),
    rights: parseString(value[`${prefix}rights`]?.['#text']),
    source: parseSource(value[`${prefix}source`]),
    summary: parseString(value[`${prefix}summary`]?.['#text']),
    title: parseString(value[`${prefix}title`]?.['#text']),
    updated: retrieveUpdated(value, options),
    dc: options?.partial ? undefined : parseDcItemOrFeed(value),
    slash: options?.partial ? undefined : parseSlashItem(value),
    itunes: options?.partial ? undefined : parseItunesItem(value),
  })

  if (options?.partial && isNonEmptyObject(entry)) {
    return entry
  }

  // INFO: Spec also says about required "updated" but this field is
  // not always present in entries. We can still parse the entry without it.
  if (hasAllProps(entry, ['id', 'title'])) {
    return entry
  }
}

export const parseFeed: ParseFunction<Feed> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const prefix = options?.prefix ?? ''
  const feed = omitUndefinedFromObject({
    authors: parseArrayOf(value[`${prefix}author`], (value) => parsePerson(value, options)),
    categories: parseArrayOf(value[`${prefix}category`], (value) => parseCategory(value, options)),
    contributors: parseArrayOf(value[`${prefix}contributor`], (value) =>
      parsePerson(value, options),
    ),
    generator: parseGenerator(value[`${prefix}generator`]),
    icon: parseString(value[`${prefix}icon`]?.['#text']),
    id: parseString(value[`${prefix}id`]?.['#text']),
    links: parseArrayOf(value[`${prefix}link`], (value) => parseLink(value, options)),
    logo: parseString(value[`${prefix}logo`]?.['#text']),
    rights: parseString(value[`${prefix}rights`]?.['#text']),
    subtitle: retrieveSubtitle(value, options),
    title: parseString(value[`${prefix}title`]?.['#text']),
    updated: retrieveUpdated(value, options),
    entries: parseArrayOf(value[`${prefix}entry`], (value) => parseEntry(value, options)),
    dc: options?.partial ? undefined : parseDcItemOrFeed(value),
    sy: options?.partial ? undefined : parseSyFeed(value),
    itunes: options?.partial ? undefined : parseItunesFeed(value),
  })

  if (options?.partial && isNonEmptyObject(feed)) {
    return feed
  }

  // INFO: Spec says about required "id", "title" and "updated". The thing is "updated" is
  // frequently missing from the feeds and since this field is not strictly necessary to make
  // the feed make sense, it is not required here. The "ID" field is mostly present, but also
  // not in 100% of cases. It's not ideal not to have it, but it's not a dealbreaker either,
  // so if either "id" or "title" is present, the feed is treated as valid.
  // The "ID" can always fall back to the "title" if it's missing in application's code.
  if (hasAnyProps(feed, ['id', 'title'])) {
    return feed
  }
}

export const retrieveFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value?.feed || value?.['atom:feed'])) {
    return
  }

  const notNamespaced = parseFeed(value.feed)
  const namespaced = parseFeed(value['atom:feed'], { prefix: 'atom:' })

  return notNamespaced || namespaced
}
