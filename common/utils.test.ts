import { describe, expect, it } from 'bun:test'
import {
  hasAllProps,
  hasAnyProps,
  isNonEmptyStringOrNumber,
  isObject,
  omitNullish,
  parseArray,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
} from './utils'
import type { ParseFunction } from './types'

describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toEqual(true)
    expect(isObject({ a: 1 })).toEqual(true)
    expect(isObject({ a: null, b: undefined })).toEqual(true)
    expect(isObject({ toString: () => 'custom' })).toEqual(true)
  })

  it('should return false for arrays', () => {
    expect(isObject([])).toEqual(false)
    expect(isObject([1, 2, 3])).toEqual(false)
    expect(isObject(new Array(5))).toEqual(false)
  })

  it('should return false for null', () => {
    expect(isObject(null)).toEqual(false)
  })

  it('should return false for undefined', () => {
    expect(isObject(undefined)).toEqual(false)
  })

  it('should return false for primitive types', () => {
    expect(isObject(42)).toEqual(false)
    expect(isObject('string')).toEqual(false)
    expect(isObject(true)).toEqual(false)
    expect(isObject(Symbol('sym'))).toEqual(false)
    expect(isObject(BigInt(123))).toEqual(false)
  })

  it('should return false for functions', () => {
    expect(isObject(() => {})).toEqual(false)
    // biome-ignore lint/complexity/useArrowFunction: It's for testing purposes.
    expect(isObject(function () {})).toEqual(false)
    expect(isObject(Math.sin)).toEqual(false)
  })

  it('should return false for objects with custom prototypes', () => {
    expect(isObject(Object.create(null))).toEqual(false)
    expect(isObject(Object.create({}))).toEqual(false)

    class CustomClass {}
    expect(isObject(new CustomClass())).toEqual(false)
  })

  it('should return false for built-in objects', () => {
    expect(isObject(new Date())).toEqual(false)
    expect(isObject(new Error())).toEqual(false)
    expect(isObject(new Map())).toEqual(false)
    expect(isObject(new Set())).toEqual(false)
    expect(isObject(new WeakMap())).toEqual(false)
    expect(isObject(new WeakSet())).toEqual(false)
    // biome-ignore lint/complexity/useRegexLiterals: It's for testing purposes.
    expect(isObject(new RegExp('.'))).toEqual(false)
    expect(isObject(new ArrayBuffer(10))).toEqual(false)
  })
})

describe('hasAnyProps', () => {
  it('should return true when any of the specified properties has a defined value', () => {
    const value = { a: 1, b: 'string', c: false }

    expect(hasAnyProps(value, ['a', 'b'])).toBe(true)
    expect(hasAnyProps(value, ['a', 'b', 'c'])).toBe(true)
    // @ts-ignore: This is for testing purposes.
    expect(hasAnyProps(value, ['a', 'd'])).toBe(true)
  })

  it('should return false when all specified properties are undefined or do not exist', () => {
    const value = { a: undefined, b: undefined, c: 1 }

    expect(hasAnyProps(value, ['a', 'b'])).toBe(false)
    // @ts-ignore: This is for testing purposes.
    expect(hasAnyProps(value, ['a', 'b', 'd'])).toBe(false)
    expect(hasAnyProps(value, ['c'])).toBe(true)
  })

  it('should return false when none of the specified properties exist', () => {
    const value = { a: 1, b: 'string' }

    // @ts-ignore: This is for testing purposes.
    expect(hasAnyProps(value, ['c', 'd'])).toBe(false)
  })

  it('should return false for empty array of props', () => {
    const value = { a: 1, b: 'string' }

    expect(hasAnyProps(value, [])).toBe(false)
  })

  it('should handle properties with falsy values correctly', () => {
    const value = { a: 0, b: '', c: false, d: null, e: undefined }

    expect(hasAnyProps(value, ['a', 'e'])).toBe(true)
    expect(hasAnyProps(value, ['b', 'c'])).toBe(true)
    expect(hasAnyProps(value, ['d'])).toBe(true)
    expect(hasAnyProps(value, ['e'])).toBe(false)
    // @ts-ignore: This is for testing purposes.
    expect(hasAnyProps(value, ['f'])).toBe(false)
  })
})


describe('hasAllProps', () => {
  it('should return true when all required properties have defined values', () => {
    const value = { a: 1, b: 'string', c: false }

    expect(hasAllProps(value, ['a', 'b'])).toBe(true)
    expect(hasAllProps(value, ['a', 'b', 'c'])).toBe(true)
    expect(hasAllProps(value, [])).toBe(true)
  })

  it('should return false when any required property is undefined', () => {
    const value = { a: 1, b: undefined, c: null }

    expect(hasAllProps(value, ['a', 'b'])).toBe(false)
    expect(hasAllProps(value, ['a', 'c'])).toBe(true)
  })

  it('should return false when any required property does not exist', () => {
    const value = { a: 1, b: 'string' }

    // @ts-ignore: This is for testing purposes.
    expect(hasAllProps(value, ['a', 'c'])).toBe(false)
    // @ts-ignore: This is for testing purposes.
    expect(hasAllProps(value, ['c', 'd'])).toBe(false)
  })

  it('should handle properties with falsy values correctly', () => {
    const value = { a: 0, b: '', c: false, d: null }

    expect(hasAllProps(value, ['a', 'b', 'c', 'd'])).toBe(true)
  })
})

describe('isNonEmptyStringOrNumber', () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyStringOrNumber('hello')).toEqual(true)
    expect(isNonEmptyStringOrNumber('0')).toEqual(true)
    expect(isNonEmptyStringOrNumber(' ')).toEqual(true)
    expect(isNonEmptyStringOrNumber('undefined')).toEqual(true)
    expect(isNonEmptyStringOrNumber('null')).toEqual(true)
  })

  it('should return false for empty strings', () => {
    expect(isNonEmptyStringOrNumber('')).toEqual(false)
  })

  it('should return true for numbers (including zero and negative numbers)', () => {
    expect(isNonEmptyStringOrNumber(42)).toEqual(true)
    expect(isNonEmptyStringOrNumber(0)).toEqual(true)
    expect(isNonEmptyStringOrNumber(-10)).toEqual(true)
    expect(isNonEmptyStringOrNumber(3.14)).toEqual(true)
    expect(isNonEmptyStringOrNumber(Number.POSITIVE_INFINITY)).toEqual(true)
    expect(isNonEmptyStringOrNumber(Number.NaN)).toEqual(true)
  })

  it('should return false for arrays', () => {
    expect(isNonEmptyStringOrNumber([])).toEqual(false)
    expect(isNonEmptyStringOrNumber([1, 2, 3])).toEqual(false)
    expect(isNonEmptyStringOrNumber(['hello'])).toEqual(false)
  })

  it('should return false for objects', () => {
    expect(isNonEmptyStringOrNumber({})).toEqual(false)
    expect(isNonEmptyStringOrNumber({ key: 'value' })).toEqual(false)
    expect(isNonEmptyStringOrNumber(new Date())).toEqual(false)
  })

  it('should return false for null and undefined', () => {
    expect(isNonEmptyStringOrNumber(null)).toEqual(false)
    expect(isNonEmptyStringOrNumber(undefined)).toEqual(false)
  })

  it('should return false for booleans', () => {
    expect(isNonEmptyStringOrNumber(true)).toEqual(false)
    expect(isNonEmptyStringOrNumber(false)).toEqual(false)
  })

  it('should return false for functions', () => {
    expect(isNonEmptyStringOrNumber(() => {})).toEqual(false)
    // biome-ignore lint/complexity/useArrowFunction: It's for testing purposes.
    expect(isNonEmptyStringOrNumber(function () {})).toEqual(false)
  })

  it('should return false for symbols', () => {
    expect(isNonEmptyStringOrNumber(Symbol('test'))).toEqual(false)
  })

  it('should return false for BigInt', () => {
    expect(isNonEmptyStringOrNumber(BigInt(123))).toEqual(false)
  })

  it('should handle edge cases', () => {
    const stringObject = new String('hello')
    const numberObject = new Number(42)

    expect(isNonEmptyStringOrNumber(stringObject)).toEqual(false)
    expect(isNonEmptyStringOrNumber(numberObject)).toEqual(false)
  })
})

describe('omitNullish', () => {
  it('should filter out null and undefined values', () => {
    expect(omitNullish([1, null, 2, undefined, 3])).toEqual([1, 2, 3])
    expect(omitNullish(['a', null, 'b', undefined])).toEqual(['a', 'b'])
    expect(omitNullish([null, undefined])).toEqual([])
  })

  it('should preserve empty arrays', () => {
    expect(omitNullish([])).toEqual([])
  })

  it('should keep falsy values that are not null or undefined', () => {
    expect(omitNullish([0, '', false, null, undefined, Number.NaN])).toEqual([
      0,
      '',
      false,
      Number.NaN,
    ])
  })

  it('should work with complex objects', () => {
    const value1 = { id: 1 }
    const value2 = { id: 2 }

    expect(omitNullish([value1, null, value2, undefined])).toEqual([value1, value2])
  })

  it('should preserve the order of non-nullish elements', () => {
    const value = ['first', null, 'second', undefined, 'third']

    expect(omitNullish(value)).toEqual(['first', 'second', 'third'])
  })

  it('should handle arrays with only nullish values', () => {
    expect(omitNullish([null, undefined, null])).toEqual([])
  })

  it('should handle mixed type arrays', () => {
    const value = [1, 'string', true, null, { key: 'value' }, undefined, []]

    expect(omitNullish(value)).toEqual([1, 'string', true, { key: 'value' }, []])
  })
})

describe('parseString', () => {
  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseString(value, 'coerce')).toBeUndefined()
    expect(parseString(value, 'skip')).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseString(value, 'coerce')).toBeUndefined()
    expect(parseString(value, 'skip')).toBeUndefined()
  })

  it('should handle non-empty string', () => {
    const value = 'javascript'

    expect(parseString(value, 'coerce')).toEqual(value)
    expect(parseString(value, 'skip')).toEqual(value)
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseString(value, 'coerce')).toEqual(value)
    expect(parseString(value, 'skip')).toEqual(value)
  })

  it('should handle HTML entities in string', () => {
    const value = '&amp;'

    expect(parseString(value, 'coerce')).toEqual('&')
    expect(parseString(value, 'skip')).toEqual('&')
  })

  it('should return number', () => {
    const value = 420

    expect(parseString(value, 'coerce')).toEqual('420')
    expect(parseString(value, 'skip')).toBeUndefined()
  })

  it('should return boolean', () => {
    const value = true

    expect(parseString(value, 'coerce')).toBeUndefined()
    expect(parseString(value, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseString(value, 'coerce')).toBeUndefined()
    expect(parseString(value, 'skip')).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseString(value, 'coerce')).toBeUndefined()
    expect(parseString(value, 'skip')).toBeUndefined()
  })
})

describe('parseNumber', () => {
  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseNumber(value, 'coerce')).toBeUndefined()
    expect(parseNumber(value, 'skip')).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseNumber(value, 'coerce')).toBeUndefined()
    expect(parseNumber(value, 'skip')).toBeUndefined()
  })

  it('should handle non-numeric string', () => {
    const value = 'javascript'

    expect(parseNumber(value, 'coerce')).toBeUndefined()
    expect(parseNumber(value, 'skip')).toBeUndefined()
  })

  it('should handle numeric string', () => {
    const value = '36.6'

    expect(parseNumber(value, 'coerce')).toEqual(36.6)
    expect(parseNumber(value, 'skip')).toBeUndefined()
  })

  it('should return number', () => {
    const value = 420

    expect(parseNumber(value, 'coerce')).toEqual(value)
    expect(parseNumber(value, 'skip')).toEqual(value)
  })

  it('should return boolean', () => {
    const value = true

    expect(parseNumber(value, 'coerce')).toBeUndefined()
    expect(parseNumber(value, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseNumber(value, 'coerce')).toBeUndefined()
    expect(parseNumber(value, 'skip')).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseNumber(value, 'coerce')).toBeUndefined()
    expect(parseNumber(value, 'skip')).toBeUndefined()
  })
})

describe('parseBoolean', () => {
  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseBoolean(value, 'coerce')).toBeUndefined()
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseBoolean(value, 'coerce')).toBeUndefined()
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })

  it('should handle non-boolean string', () => {
    const value = 'javascript'

    expect(parseBoolean(value, 'coerce')).toBeUndefined()
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })

  it('should handle true string', () => {
    const value = 'true'

    expect(parseBoolean(value, 'coerce')).toEqual(true)
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })

  it('should handle false string', () => {
    const value = 'false'

    expect(parseBoolean(value, 'coerce')).toEqual(false)
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })

  it('should return number', () => {
    const value = 420

    expect(parseBoolean(value, 'coerce')).toBeUndefined()
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })

  it('should return boolean', () => {
    const value = true

    expect(parseBoolean(value, 'coerce')).toEqual(value)
    expect(parseBoolean(value, 'skip')).toEqual(value)
  })

  it('should handle null', () => {
    const value = null

    expect(parseBoolean(value, 'coerce')).toBeUndefined()
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseBoolean(value, 'coerce')).toBeUndefined()
    expect(parseBoolean(value, 'skip')).toBeUndefined()
  })
})

describe('parseArray', () => {
  it('should handle arrays', () => {
    const value1 = [] as Array<string>
    const value2 = [1, 2, 3]
    const value3 = new Array(5)

    expect(parseArray(value1, 'coerce')).toEqual(value1)
    expect(parseArray(value2, 'coerce')).toEqual(value2)
    expect(parseArray(value3, 'coerce')).toEqual(value3)
    expect(parseArray(value1, 'skip')).toEqual(value1)
    expect(parseArray(value2, 'skip')).toEqual(value2)
    expect(parseArray(value3, 'skip')).toEqual(value3)
  })

  it('should handle objects with sequential numeric keys starting from 0', () => {
    const value1 = { 0: 'a', 1: 'b', 2: 'c' }
    const value2 = { 0: 'only one item' }

    expect(parseArray(value1, 'coerce')).toEqual(['a', 'b', 'c'])
    expect(parseArray(value2, 'coerce')).toEqual(['only one item'])
    expect(parseArray(value1, 'skip')).toBeUndefined()
    expect(parseArray(value2, 'skip')).toBeUndefined()
  })

  it('should handle object with length property', () => {
    const value1 = { 0: 'a', 1: 'b', length: 2 }
    const value2 = { length: 3 }

    expect(parseArray(value1, 'coerce')).toEqual(['a', 'b'])
    expect(parseArray(value2, 'coerce')).toEqual([undefined, undefined, undefined])
    expect(parseArray(value1, 'skip')).toBeUndefined()
    expect(parseArray(value2, 'skip')).toBeUndefined()
  })

  it('should return false for non-sequential or non-zero-indexed objects', () => {
    const value1 = { 1: 'a', 2: 'b' }
    const value2 = { 0: 'a', 2: 'b' }
    const value3 = { a: 1, b: 2 }
    const value4 = { 0: 'a', 1: 'b', 5: 'c' }

    expect(parseArray(value1, 'coerce')).toBeUndefined()
    expect(parseArray(value2, 'coerce')).toBeUndefined()
    expect(parseArray(value3, 'coerce')).toBeUndefined()
    expect(parseArray(value4, 'coerce')).toBeUndefined()
    expect(parseArray(value1, 'skip')).toBeUndefined()
    expect(parseArray(value2, 'skip')).toBeUndefined()
    expect(parseArray(value3, 'skip')).toBeUndefined()
    expect(parseArray(value4, 'skip')).toBeUndefined()
  })

  it('should return false for primitive types', () => {
    const value1 = null
    const value2 = undefined
    const value3 = 42
    const value4 = 'string'
    const value5 = true
    const value6 = Symbol('sym')
    const value7 = BigInt(123)

    expect(parseArray(value1, 'coerce')).toBeUndefined()
    expect(parseArray(value2, 'coerce')).toBeUndefined()
    expect(parseArray(value3, 'coerce')).toBeUndefined()
    expect(parseArray(value4, 'coerce')).toBeUndefined()
    expect(parseArray(value5, 'coerce')).toBeUndefined()
    expect(parseArray(value6, 'coerce')).toBeUndefined()
    expect(parseArray(value7, 'coerce')).toBeUndefined()
    expect(parseArray(value1, 'skip')).toBeUndefined()
    expect(parseArray(value2, 'skip')).toBeUndefined()
    expect(parseArray(value3, 'skip')).toBeUndefined()
    expect(parseArray(value4, 'skip')).toBeUndefined()
    expect(parseArray(value5, 'skip')).toBeUndefined()
    expect(parseArray(value6, 'skip')).toBeUndefined()
    expect(parseArray(value7, 'skip')).toBeUndefined()
  })

  it('should return false for other object types', () => {
    const value1 = {}
    const value2 = new Set([1, 2, 3])
    const value3 = new Map()
    const value4 = new Date()
    const value5 = /regex/
    const value6 = () => {}

    expect(parseArray(value1, 'coerce')).toBeUndefined()
    expect(parseArray(value2, 'coerce')).toBeUndefined()
    expect(parseArray(value3, 'coerce')).toBeUndefined()
    expect(parseArray(value4, 'coerce')).toBeUndefined()
    expect(parseArray(value5, 'coerce')).toBeUndefined()
    expect(parseArray(value6, 'coerce')).toBeUndefined()
    expect(parseArray(value1, 'skip')).toBeUndefined()
    expect(parseArray(value2, 'skip')).toBeUndefined()
    expect(parseArray(value3, 'skip')).toBeUndefined()
    expect(parseArray(value4, 'skip')).toBeUndefined()
    expect(parseArray(value5, 'skip')).toBeUndefined()
    expect(parseArray(value6, 'skip')).toBeUndefined()
  })
})

describe('parseArrayOf', () => {
  const parser: ParseFunction<string> = (value, level) => {
    if (level === 'coerce' && typeof value === 'number') {
      return value.toString()
    }

    return typeof value === 'string' ? value : undefined
  }

  it('should handle string', () => {
    const value = 'Jack'

    expect(parseArrayOf(value, parser, 'coerce')).toEqual(['Jack'])
    expect(parseArrayOf(value, parser, 'skip')).toBeUndefined()
  })

  it('should handle string when in force mode', () => {
    const value = 'Jack'

    expect(parseArrayOf(value, parser, 'coerce', true)).toEqual(['Jack'])
    expect(parseArrayOf(value, parser, 'skip', true)).toEqual(['Jack'])
  })

  it('should handle array of strings', () => {
    const value = ['John', 123]

    expect(parseArrayOf(value, parser, 'coerce')).toEqual(['John', '123'])
    expect(parseArrayOf(value, parser, 'skip')).toEqual(['John'])
  })

  it('should handle array of mixed values', () => {
    const value = [true, {}, [], null, 'John', 123]

    expect(parseArrayOf(value, parser, 'coerce')).toEqual(['John', '123'])
    expect(parseArrayOf(value, parser, 'skip')).toEqual(['John'])
  })

  it('should handle number', () => {
    const value = 420

    expect(parseArrayOf(value, parser, 'coerce')).toEqual(['420'])
    expect(parseArrayOf(value, parser, 'skip')).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseArrayOf(value, parser, 'coerce')).toBeUndefined()
    expect(parseArrayOf(value, parser, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseArrayOf(value, parser, 'coerce')).toBeUndefined()
    expect(parseArrayOf(value, parser, 'skip')).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseArrayOf(value, parser, 'coerce')).toBeUndefined()
    expect(parseArrayOf(value, parser, 'skip')).toBeUndefined()
  })
})
