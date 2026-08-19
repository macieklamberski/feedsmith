import { XMLValidator } from 'fast-xml-parser'
import { escapeHtml, isNonEmptyString, isPlainObject, trimObject } from 'trousse'
import { namespaceUris } from '../../../common/config.js'
import type { DateLike } from '../../../common/types.js'
import {
  generateCdataString,
  generateNamespaceAttrs,
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  generateTextOrCdataString,
  isXmlAttributeKey,
  trimArray,
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
import type { AtomFeed, GenerateUtil } from '../common/types.js'

export const createNamespaceSetter = (prefix: string | undefined) => {
  return (key: string) => (prefix ? `${prefix}${key}` : key)
}

// A `type="xhtml"` construct must hold its markup as XML inside a single div (RFC 4287
// §3.1.1.3), not as escaped text or CDATA, so the value is wrapped in the div. The builder
// emits these constructs raw (see the stop nodes in config.ts), which is only correct when
// the wrapped value is well-formed XML.

// XMLValidator accepts entity references it cannot resolve, but a document without a DTD
// can only resolve the five predefined entities and numeric references; anything else,
// `&nbsp;` included, leaves it not well-formed for strict parsers. Any other name-shaped
// reference is matched, since flagging one too many only routes the value to the escaped
// fallback while missing one emits markup that will not parse.
const nonXmlEntityRegex = /&(?!(?:amp|lt|gt|quot|apos);|#\d+;|#x[0-9a-fA-F]+;)[^;\s&<]+;/

export const generateXhtmlValue: GenerateUtil<string> = (value) => {
  if (!isNonEmptyString(value)) {
    return
  }

  // A literal carriage return would be normalized away by the reading XML parser
  // (XML §2.11); the character reference survives, so the value round-trips exactly.
  const inner = value.trim().replace(/\r/g, '&#13;')
  const wrapped = `<div xmlns="http://www.w3.org/1999/xhtml">${inner}</div>`

  if (XMLValidator.validate(wrapped) !== true || nonXmlEntityRegex.test(wrapped)) {
    return
  }

  // The builder emits this value raw and puts the closing tag right after it; the newline
  // lets that tag land indented on its own line instead of glued to the div.
  return { '#text': `${wrapped}\n` }
}

// A construct emitted raw by the builder (see the stop nodes in config.ts) has its
// attributes emitted verbatim too, so their values are escaped here. Constructs of every
// other type go through the builder's own attribute encoding, which would double-escape.
const escapeStopNodeAttributes = <T extends Record<string, unknown>>(value: T): T => {
  if (value['@type'] !== 'xhtml') {
    return value
  }

  const escaped: Record<string, unknown> = {}

  // biome-ignore lint/suspicious/noForIn: Plain object; avoids per-call Object.keys allocation.
  for (const key in value) {
    const attribute = value[key]

    escaped[key] =
      isXmlAttributeKey(key) && typeof attribute === 'string' ? escapeHtml(attribute) : attribute
  }

  return escaped as T
}

// A value that cannot be embedded as XML (unclosed HTML tags, a bare `&`, an HTML-only
// entity) is emitted as type="html" instead: an xhtml construct without its div is invalid,
// while escaped markup under type="html" is the conformant spelling of the same value.
// The type is normalized once and decides both the routing and the emitted attribute: a
// padded ` xhtml` would otherwise take the escaped path while the trimmed attribute matches
// the stop node, and the builder would serialize the CDATA key as an element.
const generateTypedText = (value: string | undefined, rawType: string | undefined) => {
  const type = generatePlainString(rawType)

  if (type !== 'xhtml') {
    return { ...generateTextOrCdataString(value), '@type': type }
  }

  const xhtml = generateXhtmlValue(value)

  if (xhtml || !isNonEmptyString(value)) {
    return { ...xhtml, '@type': 'xhtml' }
  }

  return { ...generateTextOrCdataString(value), '@type': 'html' }
}

export const generateText: GenerateUtil<AtomFeed.Text> = (text) => {
  if (!isPlainObject(text)) {
    return
  }

  const typed = generateTypedText(text.value, text.type)

  // A text construct carries nothing but its value, so without one there is no element to
  // emit: a bare `type="xhtml"` would even violate the single-div content model. Content
  // differs here, since `src` makes an empty element meaningful.
  if (!typed?.['#text'] && !typed?.['#cdata']) {
    return
  }

  const value = {
    ...typed,
    ...generateXmlItemOrFeed(text.xml),
  }

  return trimObject(escapeStopNodeAttributes(value))
}

export const generateContent: GenerateUtil<AtomFeed.Content> = (content) => {
  if (!isPlainObject(content)) {
    return
  }

  const value = {
    ...generateTypedText(content.value, content.type),
    '@src': generatePlainString(content.src),
    ...generateXmlItemOrFeed(content.xml),
  }

  return trimObject(escapeStopNodeAttributes(value))
}

export const generateLink: GenerateUtil<AtomFeed.Link<DateLike>> = (link) => {
  if (!isPlainObject(link)) {
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

export const generatePerson: GenerateUtil<AtomFeed.Person> = (person, options) => {
  if (!isPlainObject(person)) {
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

export const generateCategory: GenerateUtil<AtomFeed.Category> = (category) => {
  if (!isPlainObject(category)) {
    return
  }

  const value = {
    '@term': generatePlainString(category.term),
    '@scheme': generatePlainString(category.scheme),
    '@label': generatePlainString(category.label),
  }

  return trimObject(value)
}

export const generateGenerator: GenerateUtil<AtomFeed.Generator> = (generator) => {
  if (!isPlainObject(generator)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(generator.text),
    '@uri': generatePlainString(generator.uri),
    '@version': generatePlainString(generator.version),
  }

  return trimObject(value)
}

export const generateSource: GenerateUtil<AtomFeed.Source<DateLike>> = (source, options) => {
  if (!isPlainObject(source)) {
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

export const generateEntry: GenerateUtil<AtomFeed.Entry<DateLike>> = (entry, options) => {
  if (!isPlainObject(entry)) {
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

export const generateFeed: GenerateUtil<AtomFeed.Feed<DateLike>> = (feed, options) => {
  if (!isPlainObject(feed)) {
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
