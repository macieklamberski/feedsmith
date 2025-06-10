import { decodeHTML, decodeXML } from 'entities'
import type { XMLBuilder } from 'fast-xml-parser'
import type { AnyOf, ParseExactFunction, Unreliable } from './types.js'

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
  const result: Partial<T> = {}
  const keys: Array<keyof T> = Object.keys(object)
  let hasProperties = false

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = object[key]

    if (isPresent(value)) {
      result[key] = value
      hasProperties = true
    }
  }

  if (hasProperties) {
    return result as AnyOf<T>
  }
}

export const trimArray = <T, R = T>(
  value: Array<T> | undefined,
  parse?: ParseExactFunction<R>,
): Array<R> | undefined => {
  if (!Array.isArray(value)) {
    return
  }

  const result: Array<R> = []

  for (let i = 0; i < value.length; i++) {
    const item = parse ? parse(value[i]) : value[i]

    if (isPresent(item)) {
      result.push(item as R)
    }
  }

  if (result.length > 0) {
    return result
  }
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

export const stripCdata = (text: Unreliable) => {
  if (typeof text !== 'string') {
    return text
  }

  if (text.indexOf('[CDATA[') === -1) {
    return text
  }

  // For simple cases with only one CDATA section (common case).
  const startTag = '<![CDATA['
  const endTag = ']]>'
  const startPos = text.indexOf(startTag)

  // If we have just one simple CDATA section, handle it without regex.
  if (startPos !== -1) {
    const endPos = text.indexOf(endTag, startPos + startTag.length)
    if (endPos !== -1 && text.indexOf(startTag, startPos + startTag.length) === -1) {
      // Single CDATA section case - avoid regex.
      return (
        text.substring(0, startPos) +
        text.substring(startPos + startTag.length, endPos) +
        text.substring(endPos + endTag.length)
      )
    }
  }

  // Fall back to regex for complex cases with multiple CDATA sections.
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
}

export const hasEntities = (text: string) => {
  const ampIndex = text.indexOf('&')
  return ampIndex !== -1 && text.indexOf(';', ampIndex) !== -1
}

export const parseString: ParseExactFunction<string> = (value) => {
  if (typeof value === 'string') {
    return hasEntities(value)
      ? decodeHTML(decodeXML(stripCdata(value.trim())))
      : stripCdata(value.trim())
  }

  if (typeof value === 'number') {
    return value.toString()
  }
}

export const parseNumber: ParseExactFunction<number> = (value) => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' && value !== '') {
    const numeric = +value

    return Number.isNaN(numeric) ? undefined : numeric
  }
}

export const parseBoolean: ParseExactFunction<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
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

  if (typeof value === 'string') {
    return value.toLowerCase() === 'yes'
  }
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
    return trimArray(items, (item) => parse(item) || undefined)
  }
}

export const createNamespaceGetter = (
  value: Record<string, Unreliable>,
  prefix: string | undefined,
) => {
  return prefix ? (key: string) => value[prefix + key] : (key: string) => value[key]
}

export const createCaseInsensitiveGetter = (value: Record<string, unknown>) => {
  const keyMap = new Map<string, string>()

  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      keyMap.set(key.toLowerCase(), key)
    }
  }

  return (requestedKey: string) => {
    const originalKey = keyMap.get(requestedKey.toLowerCase())
    return originalKey ? value[originalKey] : undefined
  }
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
    // TODO: Consider replacing the .replaceAll() call with some more efficent way as using
    // the current approach with longer XML structures might be memory intensive.
    xml = xml.replaceAll('&apos;', "'")
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${xml}`
}
