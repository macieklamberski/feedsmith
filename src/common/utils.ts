import { decodeHTML, decodeXML } from 'entities'
import type { ParseFunction, Unreliable } from './types.js'

export const isObject = (value: Unreliable): value is Record<string, Unreliable> => {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

export const isNonEmptyObject = (value: Unreliable): value is Record<string, Unreliable> => {
  if (!isObject(value)) {
    return false
  }

  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      return true
    }
  }

  return false
}

export const hasAnyProps = <T extends Record<string, Unreliable>, K extends keyof T>(
  value: T,
  props: Array<K>,
): boolean => {
  for (let i = 0; i < props.length; i++) {
    if (value[props[i]] !== undefined) {
      return true
    }
  }

  return false
}

export const hasAllProps = <T extends Record<string, Unreliable>, K extends keyof T>(
  value: T,
  props: Array<K>,
): boolean => {
  for (let i = 0; i < props.length; i++) {
    if (value[props[i]] === undefined) {
      return false
    }
  }

  return true
}

export const isNonEmptyStringOrNumber = (value: Unreliable): value is string | number => {
  return value !== '' && (typeof value === 'string' || typeof value === 'number')
}

export const omitUndefinedFromObject = <T extends Record<string, unknown>>(
  object: T,
): Partial<T> => {
  const result: Partial<T> = {}
  const keys: Array<keyof T> = Object.keys(object)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (object[key] !== undefined) {
      result[key] = object[key]
    }
  }

  return result
}

export const omitNullishFromArray = <T>(array: Array<T | null | undefined>): Array<T> => {
  return array.filter((item): item is T => item !== null && item !== undefined)
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
    // TODO: Maybe use the strnum package instead? It's already included with fast-xml-parser.
    const numeric = Number(value)

    return Number.isNaN(numeric) ? undefined : numeric
  }
}

export const parseBoolean: ParseFunction<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value !== 'string') {
    return
  }

  if (value.toLowerCase() === 'true') {
    return true
  }

  if (value.toLowerCase() === 'false') {
    return false
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
    return omitNullishFromArray(array.map((subValue) => parse(subValue)))
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
  return (key: string): Unreliable => {
    return value[`${prefix || ''}${key}`]
  }
}

export const createCaseInsensitiveGetter = (value: Record<string, unknown>) => {
  const keyMap = new Map<string, string>()

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      keyMap.set(key.toLowerCase(), key)
    }
  }

  return (requestedKey: string) => {
    const originalKey = keyMap.get(requestedKey.toLowerCase())
    return originalKey ? value[originalKey] : undefined
  }
}
