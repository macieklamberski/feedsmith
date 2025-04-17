import { decodeHTML, decodeXML } from 'entities'
import type { ParseFunction, Unreliable } from './types.js'

export const isPresent = (value: Unreliable): value is string | number | boolean => {
  return value !== undefined && value !== null
}

export const isObject = (value: Unreliable): value is Record<string, Unreliable> => {
  return (
    isPresent(value) &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

export const isNonEmptyStringOrNumber = (value: Unreliable): value is string | number => {
  return value !== '' && (typeof value === 'string' || typeof value === 'number')
}

export const retrieveText = (value: Unreliable): Unreliable => {
  return value?.['#text'] ?? value
}

export const trimObject = <T extends Record<string, unknown>>(
  object: T,
): Partial<T> | undefined => {
  const result: Partial<T> = {}
  const keys: Array<keyof T> = Object.keys(object)
  let hasProperties = false

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (isPresent(object[key])) {
      result[key] = object[key]
      hasProperties = true
    }
  }

  if (hasProperties) {
    return result
  }
}

export const trimArray = <T, R = T>(
  value: Array<T>,
  parse?: ParseFunction<R>,
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
  return text.indexOf('&') !== -1 && text.indexOf(';') !== -1
}

export const parseString: ParseFunction<string> = (value) => {
  if (typeof value === 'string') {
    return hasEntities(value)
      ? decodeHTML(decodeXML(stripCdata(value.trim())))
      : stripCdata(value.trim())
  }

  if (typeof value === 'number') {
    return value.toString()
  }
}

export const parseNumber: ParseFunction<number> = (value) => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' && value !== '') {
    const numeric = +value

    return Number.isNaN(numeric) ? undefined : numeric
  }
}

export const parseBoolean: ParseFunction<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const lowercased = value.toLowerCase()
    if (lowercased === 'true') return true
    if (lowercased === 'false') return false
  }
}

export const parseSingular = <T>(value: T | Array<T>): T => {
  return Array.isArray(value) ? value[0] : value
}

export const parseArray: ParseFunction<Array<Unreliable>> = (value) => {
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
  parse: ParseFunction<R>,
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
