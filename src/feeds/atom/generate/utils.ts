import {
  generateNamespaceAttrs,
  generateRfc3339Date,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '../../../namespaces/dc/generate/utils.js'
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

  return trimObject({
    '@href': link.href,
    '@rel': link.rel,
    '@type': link.type,
    '@hreflang': link.hreflang,
    '@title': link.title,
    '@length': link.length,
    ...generateThrLink(link.thr),
  })
}

export const generatePerson: GenerateFunction<Person> = (person, options) => {
  if (!isObject(person)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)

  return trimObject({
    [key('name')]: person.name,
    [key('uri')]: person.uri,
    [key('email')]: person.email,
  })
}

export const generateCategory: GenerateFunction<Category> = (category) => {
  if (!isObject(category)) {
    return
  }

  return trimObject({
    '@term': category.term,
    '@scheme': category.scheme,
    '@label': category.label,
  })
}

export const generateGenerator: GenerateFunction<Generator> = (generator) => {
  if (!isObject(generator)) {
    return
  }

  return trimObject({
    '#text': generator.text,
    '@uri': generator.uri,
    '@version': generator.version,
  })
}

export const generateSource: GenerateFunction<Source<Date>> = (source, options) => {
  if (!isObject(source)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)

  return trimObject({
    [key('author')]: trimArray(source.authors?.map((author) => generatePerson(author, options))),
    [key('category')]: trimArray(
      source.categories?.map((category) => generateCategory(category, options)),
    ),
    [key('contributor')]: trimArray(
      source.contributors?.map((contributor) => generatePerson(contributor, options)),
    ),
    [key('generator')]: generateGenerator(source.generator),
    [key('icon')]: source.icon,
    [key('id')]: source.id,
    [key('link')]: trimArray(source.links?.map((link) => generateLink(link, options))),
    [key('logo')]: source.logo,
    [key('rights')]: generateText(source.rights),
    [key('subtitle')]: generateText(source.subtitle),
    [key('title')]: generateText(source.title),
    [key('updated')]: generateRfc3339Date(source.updated),
  })
}

export const generateEntry: GenerateFunction<Entry<Date>> = (entry, options) => {
  if (!isObject(entry)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const value = trimObject({
    [key('author')]: trimArray(entry.authors?.map((author) => generatePerson(author))),
    [key('category')]: trimArray(entry.categories?.map((category) => generateCategory(category))),
    [key('content')]: generateText(entry.content),
    [key('contributor')]: trimArray(
      entry.contributors?.map((contributor) => generatePerson(contributor)),
    ),
    [key('id')]: entry.id,
    [key('link')]: trimArray(entry.links?.map((link) => generateLink(link, options))),
    [key('published')]: generateRfc3339Date(entry.published),
    [key('rights')]: generateText(entry.rights),
    [key('source')]: generateSource(entry.source),
    [key('summary')]: generateText(entry.summary),
    [key('title')]: generateText(entry.title),
    [key('updated')]: generateRfc3339Date(entry.updated),
  })

  if (!value) {
    return
  }

  if (options?.asNamespace) {
    return value
  }

  return {
    ...value,
    ...generateDcItemOrFeed(entry.dc),
    ...generateSlashItem(entry.slash),
    ...generateItunesItem(entry.itunes),
    ...generateMediaItemOrFeed(entry.media),
    ...generateGeoRssItemOrFeed(entry.georss),
    ...generateThrItem(entry.thr),
  }
}

export const generateFeed: GenerateFunction<Feed<Date>> = (feed, options) => {
  if (!isObject(feed)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const valueFeed = trimObject({
    [key('author')]: trimArray(feed.authors?.map((author) => generatePerson(author, options))),
    [key('category')]: trimArray(
      feed.categories?.map((category) => generateCategory(category, options)),
    ),
    [key('contributor')]: trimArray(
      feed.contributors?.map((contributor) => generatePerson(contributor, options)),
    ),
    [key('generator')]: generateGenerator(feed.generator),
    [key('icon')]: feed.icon,
    [key('id')]: feed.id,
    [key('link')]: trimArray(feed.links?.map((link) => generateLink(link, options))),
    [key('logo')]: feed.logo,
    [key('rights')]: generateText(feed.rights),
    [key('subtitle')]: generateText(feed.subtitle),
    [key('title')]: generateText(feed.title),
    [key('updated')]: generateRfc3339Date(feed.updated),
  })
  const valueEntries = trimObject({
    [key('entry')]: trimArray(feed.entries?.map((entry) => generateEntry(entry, options))),
  })

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
    ...generateSyFeed(feed.sy),
    ...generateItunesFeed(feed.itunes),
    ...generateMediaItemOrFeed(feed.media),
    ...generateGeoRssItemOrFeed(feed.georss),
    ...valueEntries,
  }

  return {
    feed: {
      '@xmlns': 'http://www.w3.org/2005/Atom',
      ...generateNamespaceAttrs({ value: valueFull }),
      ...valueFull,
    },
  }
}
