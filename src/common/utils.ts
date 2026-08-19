import { decodeHTML } from 'entities'
import type { XMLBuilder } from 'fast-xml-parser'
import {
  coerceBoolean,
  coerceNumber,
  coerceSingular,
  isJsonLike,
  isNonEmptyString,
  isNumber,
  isPlainObject,
  isPresent,
  trimObject,
} from 'trousse'
import type {
  DateAny,
  DateLike,
  GenerateUtil,
  ParseUtilExact,
  Unreliable,
  XmlStylesheet,
} from './types.js'

export const isNonEmptyStringOrNumber = (value: Unreliable): value is string | number => {
  return isNumber(value) || isNonEmptyString(value)
}

export const isXmlAttributeKey = (key: string) => {
  // Matches the `@` (charCode 64) from attributeNamePrefix in config.ts.
  return key.charCodeAt(0) === 64
}

export const retrieveText = (value: Unreliable): Unreliable => {
  return value?.['#text'] ?? value
}

export const retrieveRdfResourceOrText = <T>(
  value: Unreliable,
  parse: (value: Unreliable) => T | undefined,
): T | undefined => {
  if (isPlainObject(value)) {
    const rdfResource = parse(value['@rdf:resource'])

    if (isPresent(rdfResource)) {
      return rdfResource
    }

    const resource = parse(value['@resource'])

    if (isPresent(resource)) {
      return resource
    }
  }

  return parse(retrieveText(value))
}

export { trimObject }

export const trimArray = <T, R = T>(
  value: Array<T> | undefined,
  parse?: ParseUtilExact<R>,
): Array<R> | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return
  }

  // Do not re-create the array if it all elements are present and no parsing is required.
  if (!parse) {
    let needsTrimming = false

    for (const item of value) {
      if (!isPresent(item)) {
        needsTrimming = true
        break
      }
    }

    if (!needsTrimming) {
      return value as unknown as Array<R>
    }
  }

  // Pre-allocation in case of Array is more performant than doing the lazy-allocation
  // similar to the one used in trimObject.
  const result: Array<R> = []

  for (const element of value) {
    const item = parse ? parse(element) : element

    if (isPresent(item)) {
      result.push(item as R)
    }
  }

  return result.length > 0 ? result : undefined
}

const cdataStartTag = '<![CDATA['
const cdataEndTag = ']]>'
const commentStartTag = '<!--'
const commentEndTag = '-->'

export const hasEntities = (text: string) => {
  const ampIndex = text.indexOf('&')
  return ampIndex !== -1 && text.indexOf(';', ampIndex) !== -1
}

const stripComments = (text: string): string => {
  let currentIndex = text.indexOf(commentStartTag)

  if (currentIndex === -1) {
    return text
  }

  let result = ''
  let lastIndex = 0

  while (currentIndex !== -1) {
    result += text.slice(lastIndex, currentIndex)
    const endIndex = text.indexOf(commentEndTag, currentIndex + commentStartTag.length)

    if (endIndex === -1) {
      return text
    }

    lastIndex = endIndex + commentEndTag.length
    currentIndex = text.indexOf(commentStartTag, lastIndex)
  }

  result += text.slice(lastIndex)

  return result
}

const decodeWithCdata = (text: string): string => {
  // Per XML spec, CDATA content should be passed through verbatim without entity decoding.
  // Text outside CDATA should have entities decoded normally.

  let currentIndex = text.indexOf(cdataStartTag)

  if (currentIndex === -1) {
    return hasEntities(text) ? decodeHTML(text) : text
  }

  let result = ''
  let lastIndex = 0

  while (currentIndex !== -1) {
    // Decode entities in text before CDATA.
    const textBefore = text.slice(lastIndex, currentIndex)
    result += hasEntities(textBefore) ? decodeHTML(textBefore) : textBefore

    // Find end of CDATA section.
    const endIndex = text.indexOf(cdataEndTag, currentIndex + cdataStartTag.length)

    if (endIndex === -1) {
      // Malformed - return original text decoded.
      return hasEntities(text) ? decodeHTML(text) : text
    }

    // Add CDATA content verbatim (without markers).
    result += text.slice(currentIndex + cdataStartTag.length, endIndex)
    lastIndex = endIndex + cdataEndTag.length
    currentIndex = text.indexOf(cdataStartTag, lastIndex)
  }

  // Decode entities in remaining text after last CDATA.
  const textAfter = text.slice(lastIndex)
  result += hasEntities(textAfter) ? decodeHTML(textAfter) : textAfter

  return result
}

export const parseString: ParseUtilExact<string> = (value) => {
  if (typeof value === 'string') {
    if (value === '') {
      return
    }

    const string = decodeWithCdata(stripComments(value)).trim()

    return string || undefined
  }

  if (typeof value === 'number') {
    return value.toString()
  }
}

// Variant of parseString for values that are already final markup: skips XML entity
// decoding and HTML comment stripping. Used where a `&lt;` / `<!--` belongs to the payload
// rather than encoding it — JSON Feed's `content_html`, whose string comes straight out of
// JSON.parse, and Atom's xhtml constructs, whose entities stand for literal characters.
export const parseVerbatimString: ParseUtilExact<string> = (value) => {
  if (typeof value === 'string') {
    if (value === '') {
      return
    }

    const string = value.trim()

    return string || undefined
  }

  if (typeof value === 'number') {
    return value.toString()
  }
}

export const parseNumber: ParseUtilExact<number> = (value) => {
  return coerceNumber(value)
}

const yesRegex = /^\p{White_Space}*yes\p{White_Space}*$/iu

export const parseBoolean: ParseUtilExact<boolean> = (value) => {
  return coerceBoolean(value)
}

export const parseYesNoBoolean: ParseUtilExact<boolean> = (value) => {
  const boolean = parseBoolean(value)

  if (boolean !== undefined) {
    return boolean
  }

  if (isNonEmptyString(value)) {
    return yesRegex.test(value)
  }
}

export const parseDate = (
  value: Unreliable,
  parseDateFn?: (raw: string) => DateAny,
): DateAny | undefined => {
  const raw = parseString(value)

  if (raw === undefined) {
    return
  }

  return parseDateFn ? parseDateFn(raw) : raw
}

export const parseArray: ParseUtilExact<Array<Unreliable>> = (value) => {
  if (Array.isArray(value)) {
    return value
  }

  if (!isPlainObject(value)) {
    return
  }

  if (value.length) {
    return Array.from(value as Unreliable as ArrayLike<Unreliable>)
  }

  const keys = Object.keys(value)

  if (keys.length === 0) {
    return
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const n = Number(key)

    if (!Number.isInteger(n) || n !== i) {
      return
    }
  }

  return Object.values(value)
}

export const parseArrayOf = <R>(
  value: Unreliable,
  parse: ParseUtilExact<R>,
  limit?: number,
): Array<R> | undefined => {
  let array = parseArray(value)

  if (!array && isPresent(value)) {
    array = [value]
  }

  if (array) {
    return trimArray(limitArray(array, limit), parse)
  }
}

export const limitArray = <T>(array: Array<T>, limit: number | undefined): Array<T> => {
  if (limit === undefined || limit < 0) {
    return array
  }

  if (limit === 0) {
    return []
  }

  return array.slice(0, limit)
}

export const parseSingular = <T>(value: T | Array<T>): T => {
  return coerceSingular(value)
}

export const parseSingularOf = <R>(value: Unreliable, parse: ParseUtilExact<R>): R | undefined => {
  return parse(parseSingular(value))
}

export const parseCsvOf = <T>(
  value: Unreliable,
  parse: ParseUtilExact<T>,
): Array<T> | undefined => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  const items = parseString(value)?.split(',')

  if (items) {
    return trimArray(items, parse)
  }
}

export const generateCsvOf = <T>(
  value: Array<T> | undefined,
  generate?: GenerateUtil<T>,
): string | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return
  }

  return trimArray(value, generate)?.join()
}

export const generateXmlStylesheet = (stylesheet: XmlStylesheet): string | undefined => {
  const generated = trimObject({
    type: generatePlainString(stylesheet.type),
    href: generatePlainString(stylesheet.href),
    title: generatePlainString(stylesheet.title),
    media: generatePlainString(stylesheet.media),
    charset: generatePlainString(stylesheet.charset),
    alternate: generateYesNoBoolean(stylesheet.alternate),
  })

  if (!generated) {
    return
  }

  let attributes = ''

  // biome-ignore lint/suspicious/noForIn: Plain object; avoids per-call Object.keys allocation.
  for (const key in generated) {
    const value = generated[key as keyof typeof generated]
    if (value !== undefined) {
      attributes += ` ${key}="${value}"`
    }
  }

  return `<?xml-stylesheet${attributes}?>`
}

export const generateXml = (
  builder: XMLBuilder,
  value: string,
  options?: { stylesheets?: Array<XmlStylesheet> },
): string => {
  let body = builder.build(value)

  if (body.includes('&apos;')) {
    body = body.replace(/&apos;/g, "'")
  }

  let declaration = '<?xml version="1.0" encoding="utf-8"?>'

  if (options?.stylesheets?.length) {
    for (const stylesheetObject of options.stylesheets) {
      const stylesheetString = generateXmlStylesheet(stylesheetObject)

      if (stylesheetString) {
        declaration += `\n${stylesheetString}`
      }
    }
  }

  return `${declaration}\n${body}`
}

export const generateRfc822Date: GenerateUtil<DateLike> = (value) => {
  // This function generates RFC 822 format dates which is also compatible with RFC 2822.

  if (!isPresent(value)) {
    return
  }

  const isString = typeof value === 'string'

  if (isString && !isNonEmptyString(value)) {
    return
  }

  const date = isString ? new Date(value) : value
  const isValid = !Number.isNaN(date.getTime())

  if (isValid) {
    return date.toUTCString()
  }

  if (isString) {
    return value
  }
}

export const generateRfc3339Date: GenerateUtil<DateLike> = (value) => {
  // This function generates RFC 3339 format dates which is also compatible with W3C-DTF.
  // The only difference between ISO 8601 (produced by toISOString) and RFC 3339 is that
  // RFC 3339 allows a space between date and time parts instead of 'T', but the 'T' format
  // is actually valid in RFC 3339 as well, so we can just return the ISO string.

  if (!isPresent(value)) {
    return
  }

  const isString = typeof value === 'string'

  if (isString && !isNonEmptyString(value)) {
    return
  }

  const date = isString ? new Date(value) : value
  const isValid = !Number.isNaN(date.getTime())

  if (isValid) {
    return date.toISOString()
  }

  if (isString) {
    return value
  }
}

export const generateBoolean: GenerateUtil<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }
}

export const generateYesNoBoolean: GenerateUtil<boolean> = (value) => {
  if (typeof value !== 'boolean') {
    return
  }

  return value ? 'yes' : 'no'
}

export const detectNamespaces = (value: unknown, recursive = false): Set<string> => {
  const namespaces = new Set<string>()
  const seenKeys = recursive ? new Set<string>() : undefined

  const traverse = (current: unknown): void => {
    if (Array.isArray(current)) {
      for (const item of current) {
        traverse(item)
      }

      return
    }

    if (isPlainObject(current)) {
      // biome-ignore lint/suspicious/noForIn: Plain object; avoids per-call Object.keys allocation.
      for (const key in current) {
        if (seenKeys?.has(key)) {
          continue
        }

        seenKeys?.add(key)

        const keyWithoutAt = isXmlAttributeKey(key) ? key.slice(1) : key
        const colonIndex = keyWithoutAt.indexOf(':')

        if (colonIndex > 0) {
          namespaces.add(keyWithoutAt.slice(0, colonIndex))
        }

        if (recursive) {
          traverse(current[key])
        }
      }
    }
  }

  traverse(value)

  return namespaces
}

const cdataSpecialCharsRegex = /[<>&]|]]>/

export const generateCdataString: GenerateUtil<string> = (value) => {
  if (!isNonEmptyString(value)) {
    return
  }

  if (cdataSpecialCharsRegex.test(value)) {
    return { '#cdata': value.trim() }
  }

  return value.trim()
}

export const generateTextOrCdataString: GenerateUtil<string> = (value) => {
  const result = generateCdataString(value)

  if (!result || isPlainObject(result)) {
    return result
  }

  return { '#text': result }
}

export const generatePlainString: GenerateUtil<string> = (value) => {
  if (!isNonEmptyString(value)) {
    return
  }

  return value.trim()
}

export const generateNumber: GenerateUtil<number> = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
}

export const generateRdfResource = <T, R>(
  value: T,
  generate: (value: T) => R | undefined,
): { '@rdf:resource': R } | undefined => {
  const rdfResource = generate(value)

  if (!isPresent(rdfResource)) {
    return
  }

  return {
    '@rdf:resource': rdfResource,
  }
}

export const generateNamespaceAttrs = (
  value: Unreliable,
  namespaceUris: Record<string, Array<string>>,
): Record<string, string> | undefined => {
  if (!isPlainObject(value)) {
    return
  }

  let namespaceAttrs: Record<string, string> | undefined
  const valueNamespaces = detectNamespaces(value, true)

  // biome-ignore lint/suspicious/noForIn: Plain object; avoids per-call Object.keys allocation.
  for (const prefix in namespaceUris) {
    if (!valueNamespaces.has(prefix)) {
      continue
    }

    if (!namespaceAttrs) {
      namespaceAttrs = {}
    }

    namespaceAttrs[`@xmlns:${prefix}`] = namespaceUris[prefix][0]
  }

  return namespaceAttrs
}

// Renames namespace prefixes to their canonical form while the document is being parsed,
// so stop nodes can match `a10:title` as `atom:title`. Renaming after parsing would be
// too late: stop nodes fire during it.
//
// Document order is what makes this work. By the time the parser hands over an element's
// name, it has already read every ancestor's attributes, including their `xmlns:`
// declarations, which attributeValueProcessor records into a map. transformTagName can
// therefore rename the element right away. The one exception is an element that declares
// its own prefix: its name arrives before its attributes, so updateTag renames it once
// more after they are read.
//
// The map is flat and first-wins: real feeds declare namespaces once, on the root, and
// re-binding a prefix deeper in a document has no observed usage. Add scope tracking if
// such feeds ever appear.
export const createNamespaceResolver = <T extends Record<string, Array<string>>>(options: {
  namespaceUris: T
  namespacePrefixes: Record<string, string>
  primaryNamespaces?: Array<keyof T>
}) => {
  const { namespaceUris, namespacePrefixes, primaryNamespaces } = options

  const primaryUris = new Set(
    primaryNamespaces?.flatMap((key) => {
      return namespaceUris[key]?.map((uri) => uri.toLowerCase()) ?? []
    }),
  )

  // Canonical prefix for the URI, or an empty string when the URI is a primary namespace,
  // whose elements go unprefixed. Undefined means the URI is not recognized.
  const resolveUri = (uri: string): string | undefined => {
    const normalized = uri.trim().toLowerCase()

    if (primaryUris.has(normalized)) {
      return ''
    }

    return namespacePrefixes[normalized]
  }

  // Far above the deepest alternate-prefix declaration observed in real feeds.
  const seedScanLimit = 65536

  // Everything before the root element is a comment, a processing instruction or a
  // doctype, none of which can carry a declaration. A document with no root is not a feed
  // and never reaches the parser; the scan then simply starts at the beginning.
  const findRootIndex = (document: string): number => {
    let index = document.indexOf('<')

    while (index !== -1) {
      const marker = document.charCodeAt(index + 1)

      // A letter or underscore starts a tag name, so this is the root.
      if (marker !== 63 && marker !== 33) {
        return index
      }

      const end = document.startsWith('<!--', index)
        ? document.indexOf('-->', index)
        : document.indexOf('>', index)

      if (end === -1) {
        return -1
      }

      index = document.indexOf('<', end)
    }

    return -1
  }

  // Every declaration a document makes lives in this call, so nothing survives the parse
  // it belongs to and no state can leak into the next document.
  return (document?: string) => {
    const prefixMap = new Map<string, string>()
    const seededPrefixes = new Set<string>()
    let defaultCanonical: string | undefined
    // Stays false while every declaration binds its conventional prefix, which keeps the
    // per-tag work at a single boolean check for the overwhelming majority of feeds.
    let hasRemapping = false
    let tagsSeen = 0

    const recordPrefix = (prefix: string, uri: string) => {
      if (!prefixMap.has(prefix)) {
        const canonical = resolveUri(uri)

        if (canonical !== undefined) {
          prefixMap.set(prefix, canonical)

          if (canonical !== prefix) {
            hasRemapping = true
          }
        }
      }
    }

    // The parser matches stop nodes against an element's name before reading its own
    // attributes, so an element that declares its own prefix would miss them. Seeding the
    // map from the raw document first closes that gap. Only prefixed declarations are
    // seeded: a default `xmlns` cannot be scoped without parsing. The scan starts at the
    // root element because junk before it is the one case a later real declaration cannot
    // repair, the root's own name being resolved before its attributes are read.
    if (document) {
      // Only the head of the document is scanned, which keeps the cost flat on
      // multi-megabyte feeds. Alternate prefixes, the reason the seed exists, are declared
      // at the top of real documents; declarations found deeper either already spell the
      // canonical prefix or resolve to no known namespace, so seeding them would change
      // nothing. An alternate past the cap falls back to in-order discovery, the behavior
      // every element had before seeding existed.
      const head = document.length > seedScanLimit ? document.slice(0, seedScanLimit) : document

      // indexOf jumps from one `xmlns:` occurrence to the next, and the sticky regex then
      // reads just the `prefix="uri"` pair at that spot, so no regex ever scans the
      // document itself.
      const declarationTailRegex = /([\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/y

      let index = head.indexOf('xmlns:', findRootIndex(head))

      while (index !== -1) {
        declarationTailRegex.lastIndex = index + 6
        const match = declarationTailRegex.exec(head)

        if (match) {
          const prefix = match[1].toLowerCase()

          recordPrefix(prefix, match[2] ?? match[3])
          seededPrefixes.add(prefix)
        }

        index = head.indexOf('xmlns:', match ? declarationTailRegex.lastIndex : index + 6)
      }
    }

    const recordDeclaration = (rawAttrName: string, value: unknown) => {
      // Anything not starting with "x" cannot be an xmlns declaration; bail before the
      // string comparisons since this runs for every attribute in the document. The name
      // arrives as written, so both cases are checked.
      const firstCharCode = rawAttrName.charCodeAt(0)

      if ((firstCharCode !== 120 && firstCharCode !== 88) || typeof value !== 'string') {
        return
      }

      const attrName = rawAttrName.toLowerCase()

      if (attrName === 'xmlns') {
        // Only the root's default namespace is honored. A default declared deeper scopes
        // to its own subtree, which the parser gives no way to track, and applying it
        // document wide would rename every later element: a feed carrying
        // `<atom:link xmlns="...atom"/>` inside its channel would lose the items after it.
        if (tagsSeen === 1 && defaultCanonical === undefined) {
          defaultCanonical = resolveUri(value)

          if (defaultCanonical) {
            hasRemapping = true
          }
        }

        return
      }

      if (attrName.startsWith('xmlns:')) {
        const prefix = attrName.slice(6)

        // A seeded entry is a guess read out of the raw text; the parser reporting the
        // declaration is the document itself, so it replaces the guess.
        if (seededPrefixes.delete(prefix)) {
          prefixMap.delete(prefix)
        }

        recordPrefix(prefix, value)
      }
    }

    const transformName = (name: string, useDefault: boolean): string => {
      const lowered = name.toLowerCase()

      if (!hasRemapping) {
        return lowered
      }

      const colonIndex = lowered.indexOf(':')

      if (colonIndex === -1) {
        if (useDefault && defaultCanonical) {
          return `${defaultCanonical}:${lowered}`
        }

        return lowered
      }

      const prefix = lowered.slice(0, colonIndex)

      if (prefix === 'xmlns' || prefix === 'xml') {
        return lowered
      }

      const canonical = prefixMap.get(prefix)

      if (canonical === undefined) {
        return lowered
      }

      const local = lowered.slice(colonIndex + 1)

      return canonical === '' ? local : `${canonical}:${local}`
    }

    const transformTagName = (name: string) => {
      tagsSeen++

      return transformName(name, true)
    }

    // The parser hands attribute names in with the `@` marker already applied.
    const transformAttributeName = (name: string) => `@${transformName(name.slice(1), false)}`

    const attributeValueProcessor = (attrName: string, value: unknown) => {
      recordDeclaration(attrName, value)

      return value
    }

    // Re-canonicalize with the now-complete maps: a name transformed before its own
    // element's declarations were read gets its final form here. The name arrives already
    // lowercased and usually already canonical, so every unchanged path returns the same
    // string without allocating.
    const updateTag = (tagName: string) => {
      if (!hasRemapping) {
        return tagName
      }

      const colonIndex = tagName.indexOf(':')

      if (colonIndex === -1) {
        return defaultCanonical ? `${defaultCanonical}:${tagName}` : tagName
      }

      // The reserved xmlns/xml prefixes never appear as element names and are never
      // recorded in the map, so the lookup alone leaves them unchanged.
      const prefix = tagName.slice(0, colonIndex)
      const canonical = prefixMap.get(prefix)

      if (canonical === undefined || canonical === prefix) {
        return tagName
      }

      const local = tagName.slice(colonIndex + 1)

      return canonical === '' ? local : `${canonical}:${local}`
    }

    return { transformTagName, transformAttributeName, attributeValueProcessor, updateTag }
  }
}

export const parseJsonObject = (value: unknown): unknown => {
  if (isPlainObject(value)) {
    return value
  }

  if (!isNonEmptyString(value) || !isJsonLike(value)) {
    return
  }

  try {
    const parsed = JSON.parse(value)

    if (isPlainObject(parsed)) {
      return parsed
    }
  } catch {}
}
