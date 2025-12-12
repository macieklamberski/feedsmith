import { decodeHTML } from 'entities'
import type { XMLBuilder } from 'fast-xml-parser'
import type {
  AnyOf,
  DateLike,
  GenerateUtil,
  ParseExactUtil,
  Unreliable,
  XmlStylesheet,
} from './types.js'

export const isPresent = <T>(value: T): value is NonNullable<T> => {
  return value != null
}

export const isObject = (value: Unreliable): value is Record<string, Unreliable> => {
  return (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value.constructor === Object
  )
}

const whitespaceOnlyRegex = /^\p{White_Space}*$/u

export const isNonEmptyString = (value: Unreliable): value is string => {
  return typeof value === 'string' && value !== '' && !whitespaceOnlyRegex.test(value)
}

export const isNonEmptyStringOrNumber = (value: Unreliable): value is string | number => {
  return typeof value === 'number' || isNonEmptyString(value)
}

export const retrieveText = (value: Unreliable): Unreliable => {
  return value?.['#text'] ?? value
}

export const retrieveRdfResourceOrText = <T>(
  value: Unreliable,
  parse: (value: Unreliable) => T | undefined,
): T | undefined => {
  if (isObject(value)) {
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

export const trimObject = <T extends Record<string, unknown>>(object: T): AnyOf<T> | undefined => {
  let result: Partial<T> | undefined

  for (const key in object) {
    const value = object[key]

    if (isPresent(value)) {
      if (!result) {
        result = {}
      }

      result[key] = value
    }
  }

  return result as AnyOf<T> | undefined
}

export const trimArray = <T, R = T>(
  value: Array<T> | undefined,
  parse?: ParseExactUtil<R>,
): Array<R> | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return
  }

  // Do not re-create the array if it all elements are present and no parsing is required.
  if (!parse) {
    let needsTrimming = false

    for (let i = 0; i < value.length; i++) {
      if (!isPresent(value[i])) {
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

  for (let i = 0; i < value.length; i++) {
    const item = parse ? parse(value[i]) : value[i]

    if (isPresent(item)) {
      result.push(item as R)
    }
  }

  return result.length > 0 ? result : undefined
}

// TODO: Remove this once deprecated fields are removed in next major version.
export const generateArrayOrSingular = <V>(
  pluralValues: Array<V> | undefined,
  singularValue: V | undefined,
  generator: (value: V) => unknown,
) => {
  if (isPresent(pluralValues)) {
    return trimArray(pluralValues.map(generator))
  }

  if (isPresent(singularValue)) {
    return generator(singularValue)
  }
}

// TODO: Remove this once deprecated fields are removed in next major version.
export const generateSingularOrArray = <V>(
  singularValue: V | undefined,
  pluralValues: Array<V> | undefined,
  generator: (value: V) => unknown,
) => {
  if (isPresent(singularValue)) {
    return generator(singularValue)
  }

  if (isPresent(pluralValues)) {
    return trimArray(pluralValues.map(generator))
  }
}

const cdataStartTag = '<![CDATA['
const cdataEndTag = ']]>'

export const hasEntities = (text: string) => {
  const ampIndex = text.indexOf('&')
  return ampIndex !== -1 && text.indexOf(';', ampIndex) !== -1
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
    const textBefore = text.substring(lastIndex, currentIndex)
    result += hasEntities(textBefore) ? decodeHTML(textBefore) : textBefore

    // Find end of CDATA section.
    const endIndex = text.indexOf(cdataEndTag, currentIndex + 9)

    if (endIndex === -1) {
      // Malformed - return original text decoded.
      return hasEntities(text) ? decodeHTML(text) : text
    }

    // Add CDATA content verbatim (without markers).
    result += text.substring(currentIndex + 9, endIndex)
    lastIndex = endIndex + 3
    currentIndex = text.indexOf(cdataStartTag, lastIndex)
  }

  // Decode entities in remaining text after last CDATA.
  const textAfter = text.substring(lastIndex)
  result += hasEntities(textAfter) ? decodeHTML(textAfter) : textAfter

  return result
}

export const parseString: ParseExactUtil<string> = (value) => {
  if (typeof value === 'string') {
    if (value === '') {
      return
    }

    const string = decodeWithCdata(value).trim()

    return string || undefined
  }

  if (typeof value === 'number') {
    return value.toString()
  }
}

export const parseNumber: ParseExactUtil<number> = (value) => {
  if (typeof value === 'number') {
    return value
  }

  if (isNonEmptyString(value)) {
    const numeric = +value

    return Number.isNaN(numeric) ? undefined : numeric
  }
}

const trueRegex = /^\p{White_Space}*true\p{White_Space}*$/iu
const falseRegex = /^\p{White_Space}*false\p{White_Space}*$/iu
const yesRegex = /^\p{White_Space}*yes\p{White_Space}*$/iu

export const parseBoolean: ParseExactUtil<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (isNonEmptyString(value)) {
    if (trueRegex.test(value)) return true
    if (falseRegex.test(value)) return false
  }
}

export const parseYesNoBoolean: ParseExactUtil<boolean> = (value) => {
  const boolean = parseBoolean(value)

  if (boolean !== undefined) {
    return boolean
  }

  if (isNonEmptyString(value)) {
    return yesRegex.test(value)
  }
}

export const parseDate: ParseExactUtil<string> = (value) => {
  // This function is currently a placeholder for the actual date parsing functionality
  // which might be added at some point in the future. Currently it just uses treats
  // the date as string.
  return parseString(value)
}

export const parseArray: ParseExactUtil<Array<Unreliable>> = (value) => {
  if (Array.isArray(value)) {
    return value
  }

  if (!isObject(value)) {
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
  parse: ParseExactUtil<R>,
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
  return Array.isArray(value) ? value[0] : value
}

export const parseSingularOf = <R>(value: Unreliable, parse: ParseExactUtil<R>): R | undefined => {
  return parse(parseSingular(value))
}

export const parseCsvOf = <T>(
  value: Unreliable,
  parse: ParseExactUtil<T>,
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
    return undefined
  }

  let attributes = ''

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
  const seenKeys = new Set<string>()

  const traverse = (current: unknown): void => {
    if (Array.isArray(current)) {
      for (const item of current) {
        traverse(item)
      }

      return
    }

    if (isObject(current)) {
      for (const key in current) {
        if (seenKeys.has(key)) {
          continue
        }

        seenKeys.add(key)

        const keyWithoutAt = key.charCodeAt(0) === 64 ? key.slice(1) : key
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

  if (!result || isObject(result)) {
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
  if (!isObject(value)) {
    return
  }

  let namespaceAttrs: Record<string, string> | undefined
  const valueNamespaces = detectNamespaces(value, true)

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

export const createNamespaceNormalizator = <T extends Record<string, Array<string>>>(
  namespaceUris: T,
  namespacePrefixes: Record<string, string>,
  primaryNamespace?: keyof T,
) => {
  const normalizeNamespaceUri = (uri: string): string => {
    return typeof uri === 'string' ? uri.trim().toLowerCase() : uri
  }

  const primaryNamespaceUris =
    primaryNamespace && namespaceUris[primaryNamespace]
      ? namespaceUris[primaryNamespace].map(normalizeNamespaceUri)
      : undefined

  const resolveNamespacePrefix = (uri: string, localName: string, fallback: string): string => {
    const normalizedUri = normalizeNamespaceUri(uri)

    if (primaryNamespaceUris?.includes(normalizedUri)) {
      return localName
    }

    const standardPrefix = namespacePrefixes[normalizedUri]

    if (standardPrefix) {
      return `${standardPrefix}:${localName}`
    }

    return fallback
  }

  const extractNamespaceDeclarations = (element: Unreliable): Record<string, string> => {
    const declarations: Record<string, string> = {}

    if (isObject(element)) {
      for (const key in element) {
        if (key === '@xmlns') {
          declarations[''] = normalizeNamespaceUri(element[key])
        } else if (key.indexOf('@xmlns:') === 0) {
          const prefix = key.substring('@xmlns:'.length)
          declarations[prefix] = normalizeNamespaceUri(element[key])
        }
      }
    }

    return declarations
  }

  const normalizeWithContext = (
    name: string,
    context: Record<string, string>,
    useDefault = false,
  ): string => {
    const colonIndex = name.indexOf(':')

    if (colonIndex === -1) {
      if (useDefault && context['']) {
        return resolveNamespacePrefix(context[''], name, name)
      }

      return name
    }

    const prefix = name.substring(0, colonIndex)
    const unprefixedName = name.substring(colonIndex + 1)
    const uri = context[prefix]

    if (uri) {
      return resolveNamespacePrefix(uri, unprefixedName, name)
    }

    return name
  }

  const normalizeKey = (key: string, context: Record<string, string>): string => {
    if (key.charCodeAt(0) === 64) {
      const attrName = key.substring(1)
      const normalizedAttrName = normalizeWithContext(attrName, context, false)

      return `@${normalizedAttrName}`
    }

    return normalizeWithContext(key, context, true)
  }

  const traverseAndNormalize = (
    object: Unreliable,
    parentContext: Record<string, string> = {},
  ): Unreliable => {
    // Check arrays first since isObject() excludes arrays.
    if (Array.isArray(object)) {
      return object.map((item) => traverseAndNormalize(item, parentContext))
    }

    if (!isObject(object)) {
      return object
    }

    const normalizedObject: Unreliable = {}
    const keyGroups: Map<string, Array<Unreliable>> = new Map()

    const declarations = extractNamespaceDeclarations(object)
    const currentContext = { ...parentContext, ...declarations }

    for (const key in object) {
      const value = object[key]

      if (key.indexOf('@xmlns') === 0) {
        normalizedObject[key] = value
        continue
      }

      const normalizedKey = normalizeKey(key, currentContext)
      const normalizedValue = traverseAndNormalize(value, currentContext)

      if (!keyGroups.has(normalizedKey)) {
        keyGroups.set(normalizedKey, [])
      }

      const group = keyGroups.get(normalizedKey)

      if (group) {
        group.push(normalizedValue)
      }
    }

    for (const [normalizedKey, values] of keyGroups) {
      normalizedObject[normalizedKey] = values.length === 1 ? values[0] : values
    }

    return normalizedObject
  }

  // For the root level, we need to handle the special case where the root element
  // itself has namespace declarations that apply to its own normalization.
  const normalizeRoot = (object: Unreliable): Unreliable => {
    if (!isObject(object)) {
      return object
    }

    if (Array.isArray(object)) {
      return object.map(normalizeRoot)
    }

    const normalizedObject: Unreliable = {}

    for (const key in object) {
      const value = object[key]

      // Extract namespace declarations from the value to see if they apply to the key.
      const declarations = extractNamespaceDeclarations(value)
      // If this element has declarations, use them to normalize its own key.
      const normalizedKey = Object.keys(declarations).length ? normalizeKey(key, declarations) : key
      // Process the value with empty parent context since this is root.
      const normalizedValue = traverseAndNormalize(value)

      normalizedObject[normalizedKey] = normalizedValue
    }

    return normalizedObject
  }

  return normalizeRoot
}

export const parseJsonObject = (value: unknown): unknown => {
  if (isObject(value)) {
    return value
  }

  if (!isNonEmptyString(value) || value.length < 2) {
    return
  }

  const startsWithBrace = value.charAt(0) === '{' || /^\s*\{/.test(value)
  const endsWithBrace = value.charAt(value.length - 1) === '}' || /\}\s*$/.test(value)

  if (!startsWithBrace || !endsWithBrace) {
    return
  }

  try {
    return JSON.parse(value)
  } catch {}
}
