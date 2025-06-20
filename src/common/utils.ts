import { decodeHTML, decodeXML } from 'entities'
import type { XMLBuilder } from 'fast-xml-parser'
import { namespaceUrls } from './config.js'
import type { AnyOf, GenerateFunction, ParseExactFunction, Unreliable } from './types.js'

export const isPresent = <T>(value: T): value is NonNullable<T> => {
  return value != null
}

export const isObject = (value: Unreliable): value is Record<string, Unreliable> => {
  return (
    isPresent(value) &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

export const isNonEmptyString = (value: Unreliable): value is string => {
  return typeof value === 'string' && value !== '' && value.trim() !== ''
}

export const isNonEmptyStringOrNumber = (value: Unreliable): value is string | number => {
  return isNonEmptyString(value) || typeof value === 'number'
}

export const retrieveText = (value: Unreliable): Unreliable => {
  return value?.['#text'] ?? value
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
  parse?: ParseExactFunction<R>,
): Array<R> | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return
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

export type ValidatedAndTrimmedObject<T extends Record<string, unknown>, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>
}

export const validateAndTrimObject = <
  T extends Record<string, unknown>,
  K extends keyof T & (string | number),
>(
  object: T,
  ...keys: [K, ...K[]]
): ValidatedAndTrimmedObject<T, K> | undefined => {
  switch (keys.length) {
    case 1:
      if (!isPresent(object[keys[0]])) return
      break
    case 2:
      if (!isPresent(object[keys[0]])) return
      if (!isPresent(object[keys[1]])) return
      break
    case 3:
      if (!isPresent(object[keys[0]])) return
      if (!isPresent(object[keys[1]])) return
      if (!isPresent(object[keys[2]])) return
      break
    case 4:
      if (!isPresent(object[keys[0]])) return
      if (!isPresent(object[keys[1]])) return
      if (!isPresent(object[keys[2]])) return
      if (!isPresent(object[keys[3]])) return
      break
    case 5:
      if (!isPresent(object[keys[0]])) return
      if (!isPresent(object[keys[1]])) return
      if (!isPresent(object[keys[2]])) return
      if (!isPresent(object[keys[3]])) return
      if (!isPresent(object[keys[4]])) return
      break
    default:
      for (let i = 0; i < keys.length; i++) {
        if (!isPresent(object[keys[i]])) return
      }
  }

  return trimObject(object) as ValidatedAndTrimmedObject<T, K>
}

const cdataStartTag = '<![CDATA['
const cdataEndTag = ']]>'
const cdataRegex = /<!\[CDATA\[([\s\S]*?)\]\]>/g

export const stripCdata = (text: Unreliable) => {
  if (typeof text !== 'string') {
    return text
  }

  if (text.indexOf('[CDATA[') === -1) {
    return text
  }

  // For simple cases with only one CDATA section (common case).
  const startPos = text.indexOf(cdataStartTag)

  // If we have just one simple CDATA section, handle it without regex.
  if (startPos !== -1) {
    const endPos = text.indexOf(cdataEndTag, startPos + cdataStartTag.length)
    if (endPos !== -1 && text.indexOf(cdataStartTag, startPos + cdataStartTag.length) === -1) {
      // Single CDATA section case - avoid regex.
      return (
        text.substring(0, startPos) +
        text.substring(startPos + cdataStartTag.length, endPos) +
        text.substring(endPos + cdataEndTag.length)
      )
    }
  }

  // Fall back to regex for complex cases with multiple CDATA sections.
  // Reset lastIndex before use since the regex has global flag.
  cdataRegex.lastIndex = 0
  return text.replace(cdataRegex, '$1')
}

export const hasEntities = (text: string) => {
  const ampIndex = text.indexOf('&')
  return ampIndex !== -1 && text.indexOf(';', ampIndex) !== -1
}

export const parseString: ParseExactFunction<string> = (value) => {
  if (typeof value === 'string') {
    let string = stripCdata(value.trim())

    if (hasEntities(string)) {
      string = decodeXML(string)
    }

    if (hasEntities(string)) {
      string = decodeHTML(string)
    }

    return string || undefined
  }

  if (typeof value === 'number') {
    return value.toString()
  }
}

export const parseNumber: ParseExactFunction<number> = (value) => {
  if (typeof value === 'number') {
    return value
  }

  if (isNonEmptyString(value)) {
    const numeric = +value

    return Number.isNaN(numeric) ? undefined : numeric
  }
}

export const parseBoolean: ParseExactFunction<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (isNonEmptyString(value)) {
    const lowercased = value.toLowerCase()

    if (lowercased === 'true') return true
    if (lowercased === 'false') return false
  }
}

export const parseYesNoBoolean: ParseExactFunction<boolean> = (value) => {
  const boolean = parseBoolean(value)

  if (boolean !== undefined) {
    return boolean
  }

  if (isNonEmptyString(value)) {
    return value.toLowerCase() === 'yes'
  }
}

export const parseDate: ParseExactFunction<string> = (value) => {
  // This function is currently a placeholder for the actual date parsing functionality
  // which might be added at some point in the future. Currently it just uses treats
  // the date as string.
  return parseString(value)
}

export const parseArray: ParseExactFunction<Array<Unreliable>> = (value) => {
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
  parse: ParseExactFunction<R>,
): Array<R> | undefined => {
  const array = parseArray(value)

  if (array) {
    return trimArray(array, parse)
  }

  const parsed = parse(value)

  if (parsed) {
    return [parsed]
  }
}

export const parseSingular = <T>(value: T | Array<T>): T => {
  return Array.isArray(value) ? value[0] : value
}

export const parseSingularOf = <R>(
  value: Unreliable,
  parse: ParseExactFunction<R>,
): R | undefined => {
  return parse(parseSingular(value))
}

export const parseCsvOf = <T>(
  value: Unreliable,
  parse: ParseExactFunction<T>,
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
  generate?: GenerateFunction<T>,
): string | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return
  }

  return trimArray(value, generate)?.join()
}

// TODO: Write tests.
export const parseTextString: ParseExactFunction<string> = (value) => {
  return parseString(retrieveText(value))
}

// TODO: Write tests.
export const parseTextNumber: ParseExactFunction<number> = (value) => {
  return parseNumber(retrieveText(value))
}

export const generateXml = (builder: XMLBuilder, value: string): string => {
  let xml = builder.build(value)

  if (xml.includes('&apos;')) {
    xml = xml.replace(/&apos;/g, "'")
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${xml}`
}

export const generateRfc822Date: GenerateFunction<string | Date> = (value) => {
  // This function generates RFC 822 format dates which is also compatible with RFC 2822.

  if (typeof value === 'string') {
    // biome-ignore lint/style/noParameterAssign: No explanation.
    value = new Date(value)
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toUTCString()
  }
}

export const generateRfc3339Date: GenerateFunction<string | Date> = (value) => {
  // This function generates RFC 3339 format dates which is also compatible with W3C-DTF.

  if (typeof value === 'string') {
    // biome-ignore lint/style/noParameterAssign: No explanation.
    value = new Date(value)
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
}

export const generateYesNoBoolean: GenerateFunction<boolean> = (value) => {
  if (typeof value !== 'boolean') {
    return
  }

  return value ? 'yes' : 'no'
}

export const detectNamespaces = (value: unknown): Set<string> => {
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

        const keyWithoutAt = key.startsWith('@') ? key.slice(1) : key
        const colonIndex = keyWithoutAt.indexOf(':')

        if (colonIndex > 0) {
          namespaces.add(keyWithoutAt.slice(0, colonIndex))
        }

        traverse(current[key])
      }
    }
  }

  traverse(value)

  return namespaces
}

export const generateString: GenerateFunction<string> = (value) => {
  if (!isNonEmptyString(value)) {
    return
  }

  if (value.includes('<') || value.includes('>') || value.includes('&') || value.includes(']]>')) {
    return { '#cdata': value }
  }

  return value
}

export const generateNamespaceAttrs = (value: Unreliable): Record<string, string> | undefined => {
  if (!isObject(value)) {
    return
  }

  let namespaceAttrs: Record<string, string> | undefined
  const valueNamespaces = detectNamespaces(value)

  for (const slug in namespaceUrls) {
    if (!valueNamespaces.has(slug)) {
      continue
    }

    if (!namespaceAttrs) {
      namespaceAttrs = {}
    }

    namespaceAttrs[`@xmlns:${slug}`] = namespaceUrls[slug as keyof typeof namespaceUrls]
  }

  return namespaceAttrs
}
