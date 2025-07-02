import { namespaceUrls } from '../../../common/config.js'
import {
  generateNamespaceAttrs,
  generateRfc3339Date,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '../../../namespaces/dc/generate/utils.js'
import { generateItemOrFeed as generateDctermsItemOrFeed } from '../../../namespaces/dcterms/generate/utils.js'
import { generateItemOrFeed as generateGeoRssItemOrFeed } from '../../../namespaces/georss/generate/utils.js'
import {
  generateFeed as generateItunesFeed,
  generateItem as generateItunesItem,
} from '../../../namespaces/itunes/generate/utils.js'
import { generateItemOrFeed as generateMediaItemOrFeed } from '../../../namespaces/media/generate/utils.js'
import { generateItem as generateSlashItem } from '../../../namespaces/slash/generate/utils.js'
import { generateFeed as generateSyFeed } from '../../../namespaces/sy/generate/utils.js'
import {
  generateItem as generateThrItem,
  generateLink as generateThrLink,
} from '../../../namespaces/thr/generate/utils.js'
import { generateItem as generateWfwItem } from '../../../namespaces/wfw/generate/utils.js'
import {
  generateFeed as generateYtFeed,
  generateItem as generateYtItem,
} from '../../../namespaces/yt/generate/utils.js'
import type {
  Category,
  Entry,
  Feed,
  GenerateFunction,
  Generator,
  Link,
  Person,
  Source,
  Text,
} from '../common/types.js'

export const createNamespaceSetter = (prefix: string | undefined) => {
  return (key: string) => (prefix ? `${prefix}${key}` : key)
}

export const generateText: GenerateFunction<Text> = (text) => {
  if (!isNonEmptyString(text)) {
    return
  }

  return text
}

export const generateLink: GenerateFunction<Link<Date>> = (link) => {
  if (!isObject(link)) {
    return
  }

  const value = {
    '@href': link.href,
    '@rel': link.rel,
    '@type': link.type,
    '@hreflang': link.hreflang,
    '@title': link.title,
    '@length': link.length,
    ...generateThrLink(link.thr),
  }

  return trimObject(value)
}

export const generatePerson: GenerateFunction<Person> = (person, options) => {
  if (!isObject(person)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const value = {
    [key('name')]: person.name,
    [key('uri')]: person.uri,
    [key('email')]: person.email,
  }

  return trimObject(value)
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  const value = {
    '@term': category.term,
    '@scheme': category.scheme,
    '@label': category.label,
  }

  return trimObject(value)
}

export const generateGenerator: GenerateFunction<Generator> = (generator) => {
  if (!isObject(generator)) {
    return
  }

  const value = {
    '#text': generator.text,
    '@uri': generator.uri,
    '@version': generator.version,
  }

  return trimObject(value)
}

export const generateSource: GenerateFunction<Source<Date>> = (source, options) => {
  if (!isObject(source)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const value = {
    [key('author')]: trimArray(source.authors, (author) => generatePerson(author, options)),
    [key('category')]: trimArray(
      source.categories?.map((category) => generateCategory(category, options)),
    ),
    [key('contributor')]: trimArray(
      source.contributors?.map((contributor) => generatePerson(contributor, options)),
    ),
    [key('generator')]: generateGenerator(source.generator),
    [key('icon')]: source.icon,
    [key('id')]: source.id,
    [key('link')]: trimArray(source.links, (link) => generateLink(link, options)),
    [key('logo')]: source.logo,
    [key('rights')]: generateText(source.rights),
    [key('subtitle')]: generateText(source.subtitle),
    [key('title')]: generateText(source.title),
    [key('updated')]: generateRfc3339Date(source.updated),
  }

  return trimObject(value)
}

export const generateEntry: GenerateFunction<Entry<Date>> = (entry, options) => {
  if (!isObject(entry)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const value = {
    [key('author')]: trimArray(entry.authors, generatePerson),
    [key('category')]: trimArray(entry.categories, generateCategory),
    [key('content')]: generateText(entry.content),
    [key('contributor')]: trimArray(
      entry.contributors?.map((contributor) => generatePerson(contributor)),
    ),
    [key('id')]: entry.id,
    [key('link')]: trimArray(entry.links, (link) => generateLink(link, options)),
    [key('published')]: generateRfc3339Date(entry.published),
    [key('rights')]: generateText(entry.rights),
    [key('source')]: generateSource(entry.source),
    [key('summary')]: generateText(entry.summary),
    [key('title')]: generateText(entry.title),
    [key('updated')]: generateRfc3339Date(entry.updated),
  }

  const trimmedValue = trimObject(value)

  if (!trimmedValue) {
    return
  }

  if (options?.asNamespace) {
    return trimmedValue
  }

  return {
    ...trimmedValue,
    ...generateDcItemOrFeed(entry.dc),
    ...generateDctermsItemOrFeed(entry.dcterms),
    ...generateSlashItem(entry.slash),
    ...generateItunesItem(entry.itunes),
    ...generateMediaItemOrFeed(entry.media),
    ...generateGeoRssItemOrFeed(entry.georss),
    ...generateThrItem(entry.thr),
    ...generateWfwItem(entry.wfw),
    ...generateYtItem(entry.yt),
  }
}

export const generateFeed: GenerateFunction<Feed<Date>> = (feed, options) => {
  if (!isObject(feed)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const feedValue = {
    [key('author')]: trimArray(feed.authors, (author) => generatePerson(author, options)),
    [key('category')]: trimArray(
      feed.categories?.map((category) => generateCategory(category, options)),
    ),
    [key('contributor')]: trimArray(
      feed.contributors?.map((contributor) => generatePerson(contributor, options)),
    ),
    [key('generator')]: generateGenerator(feed.generator),
    [key('icon')]: feed.icon,
    [key('id')]: feed.id,
    [key('link')]: trimArray(feed.links, (link) => generateLink(link, options)),
    [key('logo')]: feed.logo,
    [key('rights')]: generateText(feed.rights),
    [key('subtitle')]: generateText(feed.subtitle),
    [key('title')]: generateText(feed.title),
    [key('updated')]: generateRfc3339Date(feed.updated),
  }

  const valueFeed = trimObject(feedValue)

  const entriesValue = {
    [key('entry')]: trimArray(feed.entries, (entry) => generateEntry(entry, options)),
  }

  const valueEntries = trimObject(entriesValue)

  if (!valueFeed && !valueEntries) {
    return
  }

  if (options?.asNamespace) {
    return {
      feed: {
        ...valueFeed,
        ...valueEntries,
      },
    }
  }

  const valueFull = {
    ...valueFeed,
    ...generateDcItemOrFeed(feed.dc),
    ...generateDctermsItemOrFeed(feed.dcterms),
    ...generateSyFeed(feed.sy),
    ...generateItunesFeed(feed.itunes),
    ...generateMediaItemOrFeed(feed.media),
    ...generateGeoRssItemOrFeed(feed.georss),
    ...generateYtFeed(feed.yt),
    ...valueEntries,
  }

  return {
    feed: {
      '@xmlns': 'http://www.w3.org/2005/Atom',
      ...generateNamespaceAttrs({ value: valueFull }, namespaceUrls),
      ...valueFull,
    },
  }
}
