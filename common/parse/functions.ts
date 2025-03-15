import { decode } from 'html-entities'
import type { NonStrictParseLevel, ParseFunction } from './types'

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

export const isNonEmptyStringOrNumber = (value: unknown): value is string | number => {
  return value !== '' && (typeof value === 'string' || typeof value === 'number')
}

export const omitNullish = <T>(array: Array<T | null | undefined>): Array<T> => {
  return array.filter((item): item is T => item !== null && item !== undefined)
}

export const parseString: ParseFunction<string> = (value, level) => {
  if (typeof value === 'number') {
    return level === 'coerce' ? value.toString() : undefined
  }

  if (typeof value === 'string') {
    return decode(value)
  }

  return undefined
}

export const parseNumber: ParseFunction<number> = (value, level) => {
  if (typeof value === 'number') {
    return value
  }

  if (level === 'coerce' && typeof value === 'string') {
    const numeric = Number(value)

    return Number.isNaN(numeric) ? undefined : numeric
  }

  return undefined
}

export const parseBoolean: ParseFunction<boolean> = (value, level) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (level === 'coerce' && value === 'true') {
    return true
  }

  if (level === 'coerce' && value === 'false') {
    return false
  }

  return undefined
}

export const parseArray: ParseFunction<Array<unknown>> = (value, level) => {
  if (Array.isArray(value)) {
    return value
  }

  if (level === 'skip' || !isObject(value)) {
    return undefined
  }

  if (value.length) {
    return Array.from(value as unknown as ArrayLike<unknown>)
  }

  const keys = Object.keys(value)

  if (keys.length === 0) {
    return undefined
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const n = Number(key)

    if (!Number.isInteger(n) || n !== i) {
      return undefined
    }
  }

  return Object.values(value)
}

export const parseArrayOf = <P>(
  value: unknown,
  parse: ParseFunction<P>,
  level: NonStrictParseLevel,
  // Force is useful in cases where the value should be coerced to array regardless of level.
  // Example: JSON Feed v1/v1.1 author/authors field should be treated as array at all times.
  force?: boolean,
): Array<P> | undefined => {
  const array = parseArray(value, level)

  if (array) {
    return omitNullish(array.map((item) => parse(item, level)))
  }

  if (level === 'coerce' || force) {
    const parsed = parse(value, level)

    return parsed ? [parsed] : undefined
  }

  return undefined
}
