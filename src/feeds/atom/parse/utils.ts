import { XMLParser } from 'fast-xml-parser'
import { isNonEmptyString, isPlainObject, parseUrl, trimObject } from 'trousse'
import type { DateAny, Unreliable } from '../../../common/types.js'
import {
  detectNamespaces,
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  parseVerbatimString,
  retrieveText,
} from '../../../common/utils.js'
import { retrieveFeed as retrieveAdminFeed } from '../../../namespaces/admin/parse/utils.js'
import { retrieveEntry as retrieveAppEntry } from '../../../namespaces/app/parse/utils.js'
import {
  retrieveAuthor as retrieveArxivAuthor,
  retrieveEntry as retrieveArxivEntry,
} from '../../../namespaces/arxiv/parse/utils.js'
import { retrieveItemOrFeed as retrieveCc } from '../../../namespaces/cc/parse/utils.js'
import { retrieveItemOrFeed as retrieveCreativeCommonsItemOrFeed } from '../../../namespaces/creativecommons/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcItemOrFeed } from '../../../namespaces/dc/parse/utils.js'
import { retrieveItemOrFeed as retrieveDcTermsItemOrFeed } from '../../../namespaces/dcterms/parse/utils.js'
import { retrieveItem as retrieveGItem } from '../../../namespaces/g/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoItemOrFeed } from '../../../namespaces/geo/parse/utils.js'
import { retrieveItemOrFeed as retrieveGeoRssItemOrFeed } from '../../../namespaces/georss/parse/utils.js'
import {
  retrieveFeed as retrieveGooglePlayFeed,
  retrieveItem as retrieveGooglePlayItem,
} from '../../../namespaces/googleplay/parse/utils.js'
import {
  retrieveFeed as retrieveItunesFeed,
  retrieveItem as retrieveItunesItem,
} from '../../../namespaces/itunes/parse/utils.js'
import { retrieveItemOrFeed as retrieveMediaItemOrFeed } from '../../../namespaces/media/parse/utils.js'
import { retrieveFeed as retrieveOpenSearchFeed } from '../../../namespaces/opensearch/parse/utils.js'
import {
  retrieveFeed as retrievePingbackFeed,
  retrieveItem as retrievePingbackItem,
} from '../../../namespaces/pingback/parse/utils.js'
import { retrieveItem as retrievePscItem } from '../../../namespaces/psc/parse/utils.js'
import { retrieveItem as retrieveSlashItem } from '../../../namespaces/slash/parse/utils.js'
import { retrieveFeed as retrieveSyFeed } from '../../../namespaces/sy/parse/utils.js'
import {
  retrieveItem as retrieveThrItem,
  retrieveLink as retrieveThrLink,
} from '../../../namespaces/thr/parse/utils.js'
import { retrieveItem as retrieveTrackbackItem } from '../../../namespaces/trackback/parse/utils.js'
import { retrieveItem as retrieveWfwItem } from '../../../namespaces/wfw/parse/utils.js'
import type { XmlNs } from '../../../namespaces/xml/common/types.js'
import { retrieveItemOrFeed as retrieveXmlItemOrFeed } from '../../../namespaces/xml/parse/utils.js'
import {
  retrieveFeed as retrieveYtFeed,
  retrieveItem as retrieveYtItem,
} from '../../../namespaces/yt/parse/utils.js'
import type { AtomFeed, ParseUtilPartial } from '../common/types.js'

export const createNamespaceGetter = (
  value: Record<string, Unreliable>,
  prefix: string | undefined,
) => {
  if (!prefix) {
    return (key: string) => value[key]
  }

  return (key: string) => value[prefix + key]
}

// The value of a `type="xhtml"` text construct is the content of its single wrapping <div>: RFC
// 4287 §3.1.1.3 requires the div itself to be excluded. The wrapper may also bind the XHTML
// namespace to a prefix (`<xhtml:div>`), in which case every descendant tag carries it too; the
// prefix is stripped along with the wrapper so the value is plain HTML. Only the XHTML prefix gets
// this treatment. SVG and MathML are the two other namespaces HTML represents unprefixed (foreign
// content: WHATWG HTML §13.2.6.5, "The rules for parsing tokens in foreign content",
// https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign), but prefixed
// SVG/MathML inside xhtml constructs has no observed real-world usage; extend to those bindings if
// such feeds ever appear.
const xhtmlDivStartRegex = /^\s*<(?:([a-zA-Z][\w.-]*):)?div[\s/>]/

// The wrapper is located by re-parsing the value with the div as a stop node, which hands back its
// raw inner markup byte for byte while a real tag scan deals with a `>` inside a quoted attribute,
// comments and nested divs. A spec-violating shape (sibling divs, text or comments around the
// wrapper, a mismatched closing tag) surfaces as extra root children or a parse error, and the
// value is then kept unchanged.
//
// The synthetic root exists because the parser silently drops text standing outside the root
// element; inside `x-wrap`, that text stays visible to the shape check below.
const xhtmlDivParser = new XMLParser({
  preserveOrder: true,
  stopNodes: ['x-wrap.div'],
  processEntities: false,
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  removeNSPrefix: true,
  trimValues: false,
  commentPropName: '#comment',
})

export const unwrapXhtmlDiv = (value: Unreliable): Unreliable => {
  if (!isNonEmptyString(value)) {
    return value
  }

  const match = value.match(xhtmlDivStartRegex)

  if (!match) {
    return value
  }

  let children: Unreliable

  try {
    const parsed = xhtmlDivParser.parse(`<x-wrap>${value}</x-wrap>`)

    if (parsed.length !== 1 || !Array.isArray(parsed[0]['x-wrap'])) {
      return value
    }

    children = parsed[0]['x-wrap']
  } catch {
    return value
  }

  const divTexts: Array<string> = []

  for (const child of children) {
    if (Array.isArray(child.div)) {
      divTexts.push(child.div[0]?.['#text'] ?? '')
      continue
    }

    if (typeof child['#text'] === 'string' && child['#text'].trim() === '') {
      continue
    }

    return value
  }

  if (divTexts.length !== 1) {
    return value
  }

  const inner = divTexts[0]

  // A self-closing or empty wrapper is a construct with no content.
  if (inner === '') {
    return
  }

  const prefix = match[1]

  if (prefix) {
    // A prefix may contain dots, which are regex metacharacters when interpolated.
    const escapedPrefix = prefix.replace(/\./g, '\\.')

    return inner.replace(new RegExp(`(</?)${escapedPrefix}:`, 'g'), '$1')
  }

  return inner
}

// The wrapper div is excluded from the content (RFC 4287 §3.1.1.3), so xml:base and xml:lang
// declared on it would vanish with it. They are read here through the same mini-parse that located
// the wrapper, only when it was actually stripped: a value kept verbatim still carries its div,
// declarations included. Atom 0.3 spelled the construct type as `application/xhtml+xml`.
const isXhtmlType = (type: string | undefined): boolean => {
  return type === 'xhtml' || type === 'application/xhtml+xml'
}

export const retrieveXhtmlDivXml = (
  value: Unreliable,
  type: string | undefined,
): XmlNs.ItemOrFeed | undefined => {
  if (!isXhtmlType(type)) {
    return
  }

  const escaped = escapeCdataSections(retrieveText(value))

  if (!isNonEmptyString(escaped) || unwrapXhtmlDiv(escaped) === escaped) {
    return
  }

  // The wrapper was stripped, so this identical parse is known to succeed and to hold exactly one
  // div child; no guards are needed on the way to it.
  const children = xhtmlDivParser.parse(`<x-wrap>${escaped}</x-wrap>`)[0]['x-wrap']

  for (const child of children) {
    if (Array.isArray(child.div)) {
      const attributes = child[':@']
      const xml = {
        base: parseString(attributes?.['@base']),
        lang: parseString(attributes?.['@lang']),
      }

      return trimObject(xml)
    }
  }
}

// The div is the inner scope, so its lang replaces the element's, and its base resolves against the
// element's when relative (XML Base §4.3); a pair the URL parser rejects keeps the div's value as
// declared.
export const mergeXhtmlDivXml = (
  elementXml: XmlNs.ItemOrFeed | undefined,
  divXml: XmlNs.ItemOrFeed | undefined,
): XmlNs.ItemOrFeed | undefined => {
  if (!divXml) {
    return elementXml
  }

  let base = divXml.base ?? elementXml?.base

  if (divXml.base && elementXml?.base) {
    base = parseUrl(divXml.base, elementXml.base)?.href ?? base
  }

  const merged = {
    ...elementXml,
    lang: divXml.lang ?? elementXml?.lang,
    base,
  }

  return trimObject(merged)
}

// A CDATA section is XML's other spelling for literal text, so its content becomes entities in the
// verbatim value: dropping only the markers would hand a literal `<` to an HTML parser as markup,
// the same corruption the verbatim path exists to avoid. A section without its `]]>` terminator is
// malformed XML and is left untouched.
const cdataSectionRegex = /<!\[CDATA\[([\s\S]*?)\]\]>/g

export const escapeCdataSections = (value: Unreliable): Unreliable => {
  if (!isNonEmptyString(value)) {
    return value
  }

  return value.replace(cdataSectionRegex, (_, content: string) => {
    return content.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  })
}

// Inside a genuine xhtml construct an escaped `&lt;` stands for that character and not for markup
// (RFC 4287 §3.1.1.3), so decoding it would turn text into tags that an HTML parser then swallows.
// Such a value is taken verbatim instead. The wrapper div identifies the genuine case: a value
// without one is not a valid construct, and the spec does not say how to read an invalid one, so it
// keeps the decoding, which suits a feed that labels escaped HTML as xhtml. That is a choice, not a
// rule: 1 of 554 wrapper-less constructs in the corpus sample carries escaped markup, and for the
// rest both paths produce the same string. Atom 0.3 spelled the same construct as
// `type="application/xhtml+xml"`, so that type gets the identical treatment.
export const parseTypedText = (value: Unreliable, type: string | undefined): string | undefined => {
  const text = retrieveText(value)

  if (!isXhtmlType(type)) {
    return parseString(text)
  }

  // CDATA is escaped before the wrapper is stripped: its content is literal text, so a `</xhtml:p>`
  // or `<div>` inside it must not be seen as markup by the prefix strip.
  const escaped = escapeCdataSections(text)
  const unwrapped = unwrapXhtmlDiv(escaped)

  if (unwrapped !== escaped) {
    return parseVerbatimString(unwrapped)
  }

  // A value that opens with a div is markup even when the wrapper cannot be stripped (sibling divs,
  // an unterminated wrapper, text around it); only wrapper-less values keep the decoding path for
  // feeds that label escaped HTML as xhtml.
  if (isNonEmptyString(escaped) && xhtmlDivStartRegex.test(escaped)) {
    return parseVerbatimString(escaped)
  }

  return parseString(text)
}

export const parseText: ParseUtilPartial<AtomFeed.Text> = (value) => {
  if (isNonEmptyString(value)) {
    const parsed = parseString(value)

    return parsed ? { value: parsed } : undefined
  }

  if (!isPlainObject(value)) {
    return
  }

  const type = parseString(value['@type'])
  const parsedValue = parseTypedText(value, type)

  if (!parsedValue) {
    return
  }

  const text = {
    value: parsedValue,
    type,
    xml: mergeXhtmlDivXml(retrieveXmlItemOrFeed(value), retrieveXhtmlDivXml(value, type)),
  }

  return trimObject(text) as AtomFeed.Text
}

export const parseContent: ParseUtilPartial<AtomFeed.Content> = (value) => {
  if (isNonEmptyString(value)) {
    const parsed = parseString(value)

    return parsed ? { value: parsed } : undefined
  }

  if (!isPlainObject(value)) {
    return
  }

  const type = parseString(value['@type'])

  const content = {
    value: parseTypedText(value, type),
    type,
    src: parseString(value['@src']),
    xml: mergeXhtmlDivXml(retrieveXmlItemOrFeed(value), retrieveXhtmlDivXml(value, type)),
  }

  return trimObject(content)
}

export const parseLink: ParseUtilPartial<AtomFeed.Link<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const namespaces = detectNamespaces(value)
  const link = {
    href: parseString(value['@href']) ?? parseString(retrieveText(value)),
    rel: parseString(value['@rel']),
    type: parseString(value['@type']),
    hreflang: parseString(value['@hreflang']),
    title: parseString(value['@title']),
    length: parseNumber(value['@length']),
    thr: namespaces.has('thr') ? retrieveThrLink(value, options) : undefined,
  }

  return trimObject(link)
}

export const retrievePersonUri: ParseUtilPartial<string> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const uri = parseSingularOf(get('uri'), (value) => parseString(retrieveText(value))) // Atom 1.0
  const url = parseSingularOf(get('url'), (value) => parseString(retrieveText(value))) // Atom 0.3

  return uri || url
}

export const parsePerson: ParseUtilPartial<AtomFeed.Person> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const namespaces = options?.asNamespace ? undefined : detectNamespaces(value)
  const get = createNamespaceGetter(value, options?.prefix)
  const person = {
    name: parseSingularOf(get('name'), (value) => parseString(retrieveText(value))),
    uri: retrievePersonUri(value, options),
    email: parseSingularOf(get('email'), (value) => parseString(retrieveText(value))),
    arxiv: namespaces?.has('arxiv') ? retrieveArxivAuthor(value) : undefined,
  }

  return trimObject(person)
}

export const parseCategory: ParseUtilPartial<AtomFeed.Category> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const category = {
    term: parseString(value['@term']),
    scheme: parseString(value['@scheme']),
    label: parseString(value['@label']),
  }

  return trimObject(category)
}

export const retrieveGeneratorUri: ParseUtilPartial<string> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const uri = parseString(value['@uri']) // Atom 1.0
  const url = parseString(value['@url']) // Atom 0.3

  return uri || url
}

export const parseGenerator: ParseUtilPartial<AtomFeed.Generator> = (value) => {
  const generator = {
    text: parseString(retrieveText(value)),
    uri: retrieveGeneratorUri(value),
    version: parseString(value?.['@version']),
  }

  return trimObject(generator)
}

export const parseSource: ParseUtilPartial<AtomFeed.Source<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const source = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseSingularOf(get('generator'), (value) => parseGenerator(value, options)),
    icon: parseSingularOf(get('icon'), (value) => parseString(retrieveText(value))),
    id: parseSingularOf(get('id'), (value) => parseString(retrieveText(value))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseSingularOf(get('logo'), (value) => parseString(retrieveText(value))),
    rights: parseSingularOf(get('rights'), parseText),
    subtitle: parseSingularOf(get('subtitle'), parseText),
    title: parseSingularOf(get('title'), parseText),
    updated: retrieveUpdated(value, options),
  }

  return trimObject(source)
}

export const retrievePublished: ParseUtilPartial<DateAny> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const published = parseSingularOf(get('published'), (value) =>
    parseDate(retrieveText(value), options?.parseDateFn),
  ) // Atom 1.0.
  const issued = parseSingularOf(get('issued'), (value) =>
    parseDate(retrieveText(value), options?.parseDateFn),
  ) // Atom 0.3.
  const created = parseSingularOf(get('created'), (value) =>
    parseDate(retrieveText(value), options?.parseDateFn),
  ) // Atom 0.3.

  // The "created" date is not entirely valid as "published date", but if it's there when no other
  // date is present, it's a good-enough fallback especially that it's not present in 1.0 version of
  // the specfication.
  return published || issued || created
}

export const retrieveUpdated: ParseUtilPartial<DateAny> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const updated = parseSingularOf(get('updated'), (value) =>
    parseDate(retrieveText(value), options?.parseDateFn),
  ) // Atom 1.0.
  const modified = parseSingularOf(get('modified'), (value) =>
    parseDate(retrieveText(value), options?.parseDateFn),
  ) // Atom 0.3.

  return updated || modified
}

export const retrieveSubtitle: ParseUtilPartial<AtomFeed.Text> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const get = createNamespaceGetter(value, options?.prefix)
  const subtitle = parseSingularOf(get('subtitle'), parseText) // Atom 1.0
  const tagline = parseSingularOf(get('tagline'), parseText) // Atom 0.3

  return subtitle || tagline
}

export const parseEntry: ParseUtilPartial<AtomFeed.Entry<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const namespaces = options?.asNamespace ? undefined : detectNamespaces(value)
  const get = createNamespaceGetter(value, options?.prefix)
  const entry = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    content: parseSingularOf(get('content'), (value) => parseContent(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    id: parseSingularOf(get('id'), (value) => parseString(retrieveText(value))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    published: retrievePublished(value, options),
    rights: parseSingularOf(get('rights'), parseText),
    source: parseSingularOf(get('source'), (value) => parseSource(value, options)),
    summary: parseSingularOf(get('summary'), parseText),
    title: parseSingularOf(get('title'), parseText),
    updated: retrieveUpdated(value, options),
    app: namespaces?.has('app') ? retrieveAppEntry(value, options) : undefined,
    arxiv: namespaces?.has('arxiv') ? retrieveArxivEntry(value) : undefined,
    cc: namespaces?.has('cc') ? retrieveCc(value) : undefined,
    dc: namespaces?.has('dc') ? retrieveDcItemOrFeed(value, options) : undefined,
    slash: namespaces?.has('slash') ? retrieveSlashItem(value) : undefined,
    itunes: namespaces?.has('itunes') ? retrieveItunesItem(value) : undefined,
    googleplay: namespaces?.has('googleplay') ? retrieveGooglePlayItem(value) : undefined,
    psc: namespaces?.has('psc') ? retrievePscItem(value) : undefined,
    media: namespaces?.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces?.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    geo: namespaces?.has('geo') ? retrieveGeoItemOrFeed(value) : undefined,
    thr: namespaces?.has('thr') ? retrieveThrItem(value) : undefined,
    dcterms: namespaces?.has('dcterms') ? retrieveDcTermsItemOrFeed(value, options) : undefined,
    creativeCommons: namespaces?.has('creativecommons')
      ? retrieveCreativeCommonsItemOrFeed(value)
      : undefined,
    wfw: namespaces?.has('wfw') ? retrieveWfwItem(value) : undefined,
    yt: namespaces?.has('yt') ? retrieveYtItem(value) : undefined,
    pingback: namespaces?.has('pingback') ? retrievePingbackItem(value) : undefined,
    trackback: namespaces?.has('trackback') ? retrieveTrackbackItem(value) : undefined,
    g: namespaces?.has('g') ? retrieveGItem(value) : undefined,
    xml: options?.asNamespace ? undefined : retrieveXmlItemOrFeed(value),
  }

  return trimObject(entry)
}

export const parseFeed: ParseUtilPartial<AtomFeed.Feed<DateAny>> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const namespaces = options?.asNamespace ? undefined : detectNamespaces(value)
  const get = createNamespaceGetter(value, options?.prefix)
  const feed = {
    authors: parseArrayOf(get('author'), (value) => parsePerson(value, options)),
    categories: parseArrayOf(get('category'), (value) => parseCategory(value, options)),
    contributors: parseArrayOf(get('contributor'), (value) => parsePerson(value, options)),
    generator: parseSingularOf(get('generator'), (value) => parseGenerator(value, options)),
    icon: parseSingularOf(get('icon'), (value) => parseString(retrieveText(value))),
    id: parseSingularOf(get('id'), (value) => parseString(retrieveText(value))),
    links: parseArrayOf(get('link'), (value) => parseLink(value, options)),
    logo: parseSingularOf(get('logo'), (value) => parseString(retrieveText(value))),
    rights: parseSingularOf(get('rights'), parseText),
    subtitle: retrieveSubtitle(value, options),
    title: parseSingularOf(get('title'), parseText),
    updated: retrieveUpdated(value, options),
    entries: parseArrayOf(get('entry'), (value) => parseEntry(value, options), options?.maxItems),
    cc: namespaces?.has('cc') ? retrieveCc(value) : undefined,
    dc: namespaces?.has('dc') ? retrieveDcItemOrFeed(value, options) : undefined,
    sy: namespaces?.has('sy') ? retrieveSyFeed(value, options) : undefined,
    itunes: namespaces?.has('itunes') ? retrieveItunesFeed(value) : undefined,
    googleplay: namespaces?.has('googleplay') ? retrieveGooglePlayFeed(value) : undefined,
    media: namespaces?.has('media') ? retrieveMediaItemOrFeed(value) : undefined,
    georss: namespaces?.has('georss') ? retrieveGeoRssItemOrFeed(value) : undefined,
    geo: namespaces?.has('geo') ? retrieveGeoItemOrFeed(value) : undefined,
    dcterms: namespaces?.has('dcterms') ? retrieveDcTermsItemOrFeed(value, options) : undefined,
    creativeCommons: namespaces?.has('creativecommons')
      ? retrieveCreativeCommonsItemOrFeed(value)
      : undefined,
    opensearch: namespaces?.has('opensearch') ? retrieveOpenSearchFeed(value) : undefined,
    yt: namespaces?.has('yt') ? retrieveYtFeed(value) : undefined,
    admin: namespaces?.has('admin') ? retrieveAdminFeed(value) : undefined,
    pingback: namespaces?.has('pingback') ? retrievePingbackFeed(value) : undefined,
    xml: options?.asNamespace ? undefined : retrieveXmlItemOrFeed(value),
  }

  return trimObject(feed)
}

export const retrieveFeed: ParseUtilPartial<AtomFeed.Feed<DateAny>> = (value, options) => {
  const notNamespaced = parseSingularOf(value?.feed, (value) => parseFeed(value, options))
  const namespaced = parseSingularOf(value?.['atom:feed'], (value) =>
    parseFeed(value, { ...options, prefix: 'atom:' }),
  )

  return notNamespaced || namespaced
}
