import type { ParseFunction } from '../../common/types'
import {
  hasAllProps,
  hasAnyProps,
  isObject,
  parseArrayOf,
  parseNumber,
  parseString,
} from '../../common/utils'
import { parseDublinCore as parseDublinCoreNamespaceFeed } from '../../namespaces/dc/utils'
import { parseFeed as parseSyndicationNamespaceFeed } from '../../namespaces/sy/utils'
import type { Category, Entry, Feed, Generator, Link, Person, Source } from './types'

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
    return link
  }
}

export const retrievePersonUri: ParseFunction<string> = (value) => {
  if (!isObject(value)) {
    return
  }

  const uri = parseString(value.uri?.['#text']) // Atom 1.0.
  const url = parseString(value.url?.['#text']) // Atom 0.3.

  return uri || url
}

export const parsePerson: ParseFunction<Person> = (value) => {
  if (!isObject(value)) {
    return
  }

  const person = {
    name: parseString(value.name?.['#text']),
    uri: retrievePersonUri(value),
    email: parseString(value.email?.['#text']),
  }

  if (hasAllProps(person, ['name'])) {
    return person
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
    return category
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
    return generator
  }
}

export const parseSource: ParseFunction<Source> = (value) => {
  if (!isObject(value)) {
    return
  }

  const source = {
    authors: parseArrayOf<Person>(value.author, parsePerson),
    categories: parseArrayOf<Category>(value.category, parseCategory),
    contributors: parseArrayOf<Person>(value.contributor, parsePerson),
    generator: parseGenerator(value.generator),
    icon: parseString(value.icon?.['#text']),
    id: parseString(value.id?.['#text']),
    links: parseArrayOf(value.link, parseLink),
    logo: parseString(value.logo?.['#text']),
    rights: parseString(value.rights?.['#text']),
    subtitle: parseString(value.subtitle?.['#text']),
    title: parseString(value.title?.['#text']),
    updated: retrieveUpdated(value),
  }

  if (hasAnyProps(source, Object.keys(source) as Array<keyof Source>)) {
    return source
  }
}

export const retrievePublished: ParseFunction<string> = (value) => {
  if (!isObject(value)) {
    return
  }

  const published = parseString(value.published?.['#text']) // Atom 1.0.
  const issued = parseString(value.issued?.['#text']) // Atom 0.3.
  const created = parseString(value.created?.['#text']) // Atom 0.3.

  // The "created" date is not entirely valid as "published date", but if it's there when
  // no other date is present, it's a good-enough fallback especially that it's not present
  // in 1.0 version of the specfication.
  return published || issued || created
}

export const retrieveUpdated: ParseFunction<string> = (value) => {
  if (!isObject(value)) {
    return
  }

  const updated = parseString(value.updated?.['#text']) // Atom 1.0.
  const modified = parseString(value.modified?.['#text']) // Atom 0.3.

  return updated || modified
}

export const retrieveSubtitle: ParseFunction<string> = (value) => {
  if (!isObject(value)) {
    return
  }

  const subtitle = parseString(value.subtitle?.['#text']) // Atom 1.0.
  const tagline = parseString(value.tagline?.['#text']) // Atom 0.3.

  return subtitle || tagline
}

export const parseEntry: ParseFunction<Entry> = (value) => {
  if (!isObject(value)) {
    return
  }

  const entry = {
    authors: parseArrayOf(value.author, parsePerson),
    categories: parseArrayOf(value.category, parseCategory),
    content: parseString(value.content?.['#text']),
    contributors: parseArrayOf(value.contributor, parsePerson),
    id: parseString(value.id?.['#text']),
    links: parseArrayOf(value.link, parseLink),
    published: retrievePublished(value),
    rights: parseString(value.rights?.['#text']),
    source: parseSource(value.source),
    summary: parseString(value.summary?.['#text']),
    title: parseString(value.title?.['#text']),
    updated: retrieveUpdated(value),
    dc: parseDublinCoreNamespaceFeed(value),
  }

  // INFO: Spec also says about required "updated" and "author" but those are
  // not always present in feeds. We can still parse the feed without them.
  if (hasAllProps(entry, ['id', 'title'])) {
    return entry
  }
}

export const parseFeed: ParseFunction<Feed> = (value) => {
  if (!isObject(value?.feed)) {
    return
  }

  const feed = {
    authors: parseArrayOf(value.feed.author, parsePerson),
    categories: parseArrayOf(value.feed.category, parseCategory),
    contributors: parseArrayOf(value.feed.contributor, parsePerson),
    generator: parseGenerator(value.feed.generator),
    icon: parseString(value.feed.icon?.['#text']),
    id: parseString(value.feed.id?.['#text']),
    links: parseArrayOf(value.feed.link, parseLink),
    logo: parseString(value.feed.logo?.['#text']),
    rights: parseString(value.feed.rights?.['#text']),
    subtitle: retrieveSubtitle(value.feed),
    title: parseString(value.feed.title?.['#text']),
    updated: retrieveUpdated(value.feed),
    entries: parseArrayOf(value.feed.entry, parseEntry),
    dc: parseDublinCoreNamespaceFeed(value.feed),
    sy: parseSyndicationNamespaceFeed(value.feed),
  }

  // INFO: Spec also says about required "updated" and "author" but those are
  // not always present in feeds. We can still parse the feed without them.
  if (hasAllProps(feed, ['id', 'title'])) {
    return feed
  }
}
