import {
  generateNamespaceAttrs,
  generateRfc3339Date,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '../../../namespaces/dc/generate/utils.js'
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

  return trimObject({
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
    ...generateDcItemOrFeed(entry.dc),
    ...generateSlashItem(entry.slash),
    ...generateThrItem(entry.thr),
    // TODO: Add support for itunes namespace here.
    // TODO: Add support for media namespace here.
    // TODO: Add support for georss namespace here.
  })
}

export const generateFeed: GenerateFunction<Feed<Date>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)

  const feed = trimObject({
    [key('author')]: trimArray(value.authors?.map((author) => generatePerson(author, options))),
    [key('category')]: trimArray(
      value.categories?.map((category) => generateCategory(category, options)),
    ),
    [key('contributor')]: trimArray(
      value.contributors?.map((contributor) => generatePerson(contributor, options)),
    ),
    [key('generator')]: generateGenerator(value.generator),
    [key('icon')]: value.icon,
    [key('id')]: value.id,
    [key('link')]: trimArray(value.links?.map((link) => generateLink(link, options))),
    [key('logo')]: value.logo,
    [key('rights')]: generateText(value.rights),
    [key('subtitle')]: generateText(value.subtitle),
    [key('title')]: generateText(value.title),
    [key('updated')]: generateRfc3339Date(value.updated),
    ...generateDcItemOrFeed(value.dc),
    ...generateSyFeed(value.sy),
    // TODO: Add support for itunes namespace here.
    // TODO: Add support for media namespace here.
    // TODO: Add support for georss namespace here.
    [key('entry')]: trimArray(value.entries?.map((entry) => generateEntry(entry, options))),
  })

  if (!feed) {
    return
  }

  return {
    feed: {
      '@xmlns': 'http://www.w3.org/2005/Atom',
      ...generateNamespaceAttrs({ feed }),
      ...feed,
    },
  }
}
