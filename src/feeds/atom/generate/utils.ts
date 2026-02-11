import { namespaceUris } from '../../../common/config.js'
import type { DateLike } from '../../../common/types.js'
import {
  generateCdataString,
  generateNamespaceAttrs,
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  generateTextOrCdataString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import { generateFeed as generateAdminFeed } from '../../../namespaces/admin/generate/utils.js'
import { generateEntry as generateAppEntry } from '../../../namespaces/app/generate/utils.js'
import {
  generateAuthor as generateArxivAuthor,
  generateEntry as generateArxivEntry,
} from '../../../namespaces/arxiv/generate/utils.js'
import { generateItemOrFeed as generateCc } from '../../../namespaces/cc/generate/utils.js'
import { generateItemOrFeed as generateCreativeCommonsItemOrFeed } from '../../../namespaces/creativecommons/generate/utils.js'
import { generateItemOrFeed as generateDcItemOrFeed } from '../../../namespaces/dc/generate/utils.js'
import { generateItemOrFeed as generateDcTermsItemOrFeed } from '../../../namespaces/dcterms/generate/utils.js'
import { generateItemOrFeed as generateGeoItemOrFeed } from '../../../namespaces/geo/generate/utils.js'
import { generateItemOrFeed as generateGeoRssItemOrFeed } from '../../../namespaces/georss/generate/utils.js'
import {
  generateFeed as generateGooglePlayFeed,
  generateItem as generateGooglePlayItem,
} from '../../../namespaces/googleplay/generate/utils.js'
import {
  generateFeed as generateItunesFeed,
  generateItem as generateItunesItem,
} from '../../../namespaces/itunes/generate/utils.js'
import { generateItemOrFeed as generateMediaItemOrFeed } from '../../../namespaces/media/generate/utils.js'
import { generateFeed as generateOpenSearchFeed } from '../../../namespaces/opensearch/generate/utils.js'
import {
  generateFeed as generatePingbackFeed,
  generateItem as generatePingbackItem,
} from '../../../namespaces/pingback/generate/utils.js'
import { generateItem as generatePscItem } from '../../../namespaces/psc/generate/utils.js'
import { generateItem as generateSlashItem } from '../../../namespaces/slash/generate/utils.js'
import { generateFeed as generateSyFeed } from '../../../namespaces/sy/generate/utils.js'
import {
  generateItem as generateThrItem,
  generateLink as generateThrLink,
} from '../../../namespaces/thr/generate/utils.js'
import { generateItem as generateTrackbackItem } from '../../../namespaces/trackback/generate/utils.js'
import { generateItem as generateWfwItem } from '../../../namespaces/wfw/generate/utils.js'
import { generateItemOrFeed as generateXmlItemOrFeed } from '../../../namespaces/xml/generate/utils.js'
import {
  generateFeed as generateYtFeed,
  generateItem as generateYtItem,
} from '../../../namespaces/yt/generate/utils.js'
import type { Atom, GenerateUtil } from '../common/types.js'

export const createNamespaceSetter = (prefix: string | undefined) => {
  return (key: string) => (prefix ? `${prefix}${key}` : key)
}

export const generateText: GenerateUtil<Atom.Text> = (text) => {
  return generateCdataString(text)
}

export const generateContent: GenerateUtil<Atom.Content> = (content) => {
  if (!isObject(content)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(content.value),
    '@type': generatePlainString(content.type),
    '@src': generatePlainString(content.src),
    ...generateXmlItemOrFeed(content.xml),
  }

  return trimObject(value)
}

export const generateLink: GenerateUtil<Atom.Link<DateLike>> = (link) => {
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

export const generatePerson: GenerateUtil<Atom.Person> = (person, options) => {
  if (!isObject(person)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const value = {
    [key('name')]: generateCdataString(person.name),
    [key('uri')]: generateCdataString(person.uri),
    [key('email')]: generateCdataString(person.email),
    ...generateArxivAuthor(person.arxiv),
  }

  return trimObject(value)
}

export const generateCategory: GenerateUtil<Atom.Category> = (category) => {
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

export const generateGenerator: GenerateUtil<Atom.Generator> = (generator) => {
  if (!isObject(generator)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(generator.text),
    '@uri': generatePlainString(generator.uri),
    '@version': generatePlainString(generator.version),
  }

  return trimObject(value)
}

export const generateSource: GenerateUtil<Atom.Source<DateLike>> = (source, options) => {
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

export const generateEntry: GenerateUtil<Atom.Entry<DateLike>> = (entry, options) => {
  if (!isObject(entry)) {
    return
  }

  const key = createNamespaceSetter(options?.prefix)
  const value = {
    [key('author')]: trimArray(entry.authors, generatePerson),
    [key('category')]: trimArray(entry.categories, generateCategory),
    [key('content')]: generateContent(entry.content),
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
    ...generateAppEntry(entry.app),
    ...generateArxivEntry(entry.arxiv),
    ...generateCc(entry.cc),
    ...generateDcItemOrFeed(entry.dc),
    ...generateSlashItem(entry.slash),
    ...generateItunesItem(entry.itunes),
    ...generateGooglePlayItem(entry.googleplay),
    ...generatePscItem(entry.psc),
    ...generateMediaItemOrFeed(entry.media),
    ...generateGeoRssItemOrFeed(entry.georss),
    ...generateGeoItemOrFeed(entry.geo),
    ...generateThrItem(entry.thr),
    ...generateDcTermsItemOrFeed(entry.dcterms),
    ...generateCreativeCommonsItemOrFeed(entry.creativeCommons),
    ...generateWfwItem(entry.wfw),
    ...generateYtItem(entry.yt),
    ...generatePingbackItem(entry.pingback),
    ...generateTrackbackItem(entry.trackback),
    ...generateXmlItemOrFeed(entry.xml),
  }
}

export const generateFeed: GenerateUtil<Atom.Feed<DateLike>> = (feed, options) => {
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
    ...generateCc(feed.cc),
    ...generateDcItemOrFeed(feed.dc),
    ...generateSyFeed(feed.sy),
    ...generateItunesFeed(feed.itunes),
    ...generateGooglePlayFeed(feed.googleplay),
    ...generateMediaItemOrFeed(feed.media),
    ...generateGeoRssItemOrFeed(feed.georss),
    ...generateGeoItemOrFeed(feed.geo),
    ...generateDcTermsItemOrFeed(feed.dcterms),
    ...generateCreativeCommonsItemOrFeed(feed.creativeCommons),
    ...generateOpenSearchFeed(feed.opensearch),
    ...generateYtFeed(feed.yt),
    ...generateAdminFeed(feed.admin),
    ...generatePingbackFeed(feed.pingback),
    ...generateXmlItemOrFeed(feed.xml),
    ...valueEntries,
  }

  return {
    feed: {
      '@xmlns': 'http://www.w3.org/2005/Atom',
      ...generateNamespaceAttrs({ value: valueFull }, namespaceUris),
      ...valueFull,
    },
  }
}
