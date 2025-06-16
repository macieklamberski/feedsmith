import type { GenerateFunction } from '../../../common/types.js'
import {
  generateRfc3339Date,
  isNonEmptyString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type {
  Category,
  Entry,
  Feed,
  Generator,
  Link,
  Person,
  Source,
  Text,
} from '../common/types.js'

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
    // thr
  })
}

export const generatePerson: GenerateFunction<Person> = (person) => {
  if (!isObject(person)) {
    return
  }

  return trimObject({
    name: person.name,
    uri: person.uri,
    email: person.email,
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

export const generateSource: GenerateFunction<Source<Date>> = (source) => {
  if (!isObject(source)) {
    return
  }

  return trimObject({
    author: trimArray(source.authors?.map(generatePerson)),
    category: trimArray(source.categories?.map(generateCategory)),
    contributor: trimArray(source.contributors?.map(generatePerson)),
    generator: generateGenerator(source.generator),
    icon: source.icon,
    id: source.id,
    link: trimArray(source.links?.map(generateLink)),
    logo: source.logo,
    rights: generateText(source.rights),
    subtitle: generateText(source.subtitle),
    title: generateText(source.title),
    updated: generateRfc3339Date(source.updated),
  })
}

export const generateEntry: GenerateFunction<Entry<Date>> = (entry) => {
  if (!isObject(entry)) {
    return
  }

  return trimObject({
    author: trimArray(entry.authors?.map(generatePerson)),
    category: trimArray(entry.categories?.map(generateCategory)),
    content: generateText(entry.content),
    contributor: trimArray(entry.contributors?.map(generatePerson)),
    id: entry.id,
    link: trimArray(entry.links?.map(generateLink)),
    published: generateRfc3339Date(entry.published),
    rights: generateText(entry.rights),
    source: generateSource(entry.source),
    summary: generateText(entry.summary),
    title: generateText(entry.title),
    updated: generateRfc3339Date(entry.updated),
    // dc
    // slash
    // itunes
    // media
    // georss
    // thr
  })
}

export const generateFeed: GenerateFunction<Feed<Date>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = trimObject({
    // TODO: When adding namespaces support, make sure to register them properly here.
    author: trimArray(value.authors?.map(generatePerson)),
    category: trimArray(value.categories?.map(generateCategory)),
    contributor: trimArray(value.contributors?.map(generatePerson)),
    generator: generateGenerator(value.generator),
    icon: value.icon,
    id: value.id,
    link: trimArray(value.links?.map(generateLink)),
    logo: value.logo,
    rights: generateText(value.rights),
    subtitle: generateText(value.subtitle),
    title: generateText(value.title),
    updated: generateRfc3339Date(value.updated),
    entry: trimArray(value.entries?.map(generateEntry)),
    // dc
    // sy
    // itunes
    // media
    // georss
  })

  if (!feed) {
    return
  }

  return {
    feed: {
      '@xmlns': 'http://www.w3.org/2005/Atom',
      ...feed,
    },
  }
}
