import { decodeHTML } from 'entities'
import type { ParseFunction, Unreliable } from './types'

export const isObject = (value: Unreliable): value is Record<string, Unreliable> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

export const hasAnyProps = <T extends Record<string, Unreliable>, K extends keyof T>(
  value: T,
  props: Array<K>,
): boolean => {
  for (const prop of props) {
    if (value[prop] !== undefined) {
      return true
    }
  }

  return false
}

export const hasAllProps = <T extends Record<string, Unreliable>, K extends keyof T>(
  value: T,
  props: Array<K>,
): boolean => {
  for (const prop of props) {
    if (value[prop] === undefined) {
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

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && object[key] !== undefined) {
      result[key] = object[key]
    }
  }

  return result
}

export const omitNullish = <T>(array: Array<T | null | undefined>): Array<T> => {
  return array.filter((item): item is T => item !== null && item !== undefined)
}

export const stripCdata = (text: Unreliable) => {
  if (typeof text !== 'string' || text.indexOf('<![CDATA[') === -1) {
    return text
  }

  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, content) => content || '')
}

export const parseString: ParseFunction<string> = (value) => {
  if (typeof value === 'number') {
    return value.toString()
  }

  if (typeof value === 'string') {
    return decodeHTML(stripCdata(value).trim())
  }
}

export const parseNumber: ParseFunction<number> = (value) => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    // TODO: Maybe use the strnum package instead? It's already included with fast-xml-parser.
    const numeric = Number(value)

    return Number.isNaN(numeric) ? undefined : numeric
  }
}

export const parseBoolean: ParseFunction<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
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
    return omitNullish(array.map(parse))
  }

  const parsed = parse(value)

  return parsed ? [parsed] : undefined
}
