import { namespaceUrls } from '@/common/config.js'
import {
  generateCdataString,
  generateNamespaceAttrs,
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  isObject,
  trimArray,
  trimObject,
} from '@/common/utils.js'
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
} from '@/feeds/atom/common/types.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '@/namespaces/dc/generate/utils.js'
import { generateItemOrFeed as generateDctermsItemOrFeed } from '@/namespaces/dcterms/generate/utils.js'
import { generateItemOrFeed as generateGeoRssItemOrFeed } from '@/namespaces/georss/generate/utils.js'
import {
  generateFeed as generateItunesFeed,
  generateItem as generateItunesItem,
} from '@/namespaces/itunes/generate/utils.js'
import { generateItemOrFeed as generateMediaItemOrFeed } from '@/namespaces/media/generate/utils.js'
import { generateItem as generateSlashItem } from '@/namespaces/slash/generate/utils.js'
import { generateFeed as generateSyFeed } from '@/namespaces/sy/generate/utils.js'
import {
  generateItem as generateThrItem,
  generateLink as generateThrLink,
} from '@/namespaces/thr/generate/utils.js'
import { generateItem as generateWfwItem } from '@/namespaces/wfw/generate/utils.js'
import {
  generateFeed as generateYtFeed,
  generateItem as generateYtItem,
} from '@/namespaces/yt/generate/utils.js'

export const createNamespaceSetter = (prefix: string | undefined) => {
  return (key: string) => (prefix ? `${prefix}${key}` : key)
}

export const generateText: GenerateFunction<Text> = (text) => {
  return generateCdataString(text)
}

export const generateLink: GenerateFunction<Link<Date>> = (link) => {
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
    [key('name')]: generateCdataString(person.name),
    [key('uri')]: generateCdataString(person.uri),
    [key('email')]: generateCdataString(person.email),
  }

  return trimObject(value)
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  const value = {
    '@term': generatePlainString(category.term),
    '@scheme': generatePlainString(category.scheme),
    '@label': generatePlainString(category.label),
  }

  return trimObject(value)
}

export const generateGenerator: GenerateFunction<Generator> = (generator) => {
  if (!isObject(generator)) {
    return
  }

  const value = {
    '#text': generateCdataString(generator.text),
    '@uri': generatePlainString(generator.uri),
    '@version': generatePlainString(generator.version),
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
    [key('category')]: trimArray(source.categories, (category) =>
      generateCategory(category, options),
    ),
    [key('contributor')]: trimArray(source.contributors, (contributor) =>
      generatePerson(contributor, options),
    ),
    [key('generator')]: generateGenerator(source.generator),
    [key('icon')]: generateCdataString(source.icon),
    [key('id')]: generateCdataString(source.id),
    [key('link')]: trimArray(source.links, (link) => generateLink(link, options)),
    [key('logo')]: generateCdataString(source.logo),
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
    [key('contributor')]: trimArray(entry.contributors, (contributor) =>
      generatePerson(contributor, options),
    ),
    [key('id')]: generateCdataString(entry.id),
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
    [key('category')]: trimArray(feed.categories, (category) =>
      generateCategory(category, options),
    ),
    [key('contributor')]: trimArray(feed.contributors, (contributor) =>
      generatePerson(contributor, options),
    ),
    [key('generator')]: generateGenerator(feed.generator),
    [key('icon')]: generateCdataString(feed.icon),
    [key('id')]: generateCdataString(feed.id),
    [key('link')]: trimArray(feed.links, (link) => generateLink(link, options)),
    [key('logo')]: generateCdataString(feed.logo),
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
