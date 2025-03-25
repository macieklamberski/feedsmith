import { describe, expect, it } from 'bun:test'
import type { ParseFunction } from './types'
import {
  hasAllProps,
  hasAnyProps,
  isNonEmptyStringOrNumber,
  isObject,
  omitNullishFromArray,
  omitUndefinedFromObject,
  parseArray,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseSingular,
  parseString,
  stripCdata,
} from './utils'

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

describe('omitUndefinedFromObject', () => {
  it('should remove undefined properties from objects', () => {
    const input = { a: 1, b: undefined, c: 'string', d: undefined, e: null, f: false, g: 0, h: '' }
    const expected = { a: 1, c: 'string', e: null, f: false, g: 0, h: '' }

    expect(omitUndefinedFromObject(input)).toEqual(expected)
  })

  it('should return an empty object when all properties are undefined', () => {
    const input = { a: undefined, b: undefined, c: undefined }
    const expected = {}

    expect(omitUndefinedFromObject(input)).toEqual(expected)
  })

  it('should return the same object when no properties are undefined', () => {
    const input = { a: 1, b: 'string', c: null, d: false, e: [], f: {} }

    expect(omitUndefinedFromObject(input)).toEqual(input)
  })

  it('should handle empty objects', () => {
    expect(omitUndefinedFromObject({})).toEqual({})
  })

  it('should handle objects with inherited properties', () => {
    const proto = { inherited: 'value' }
    const obj = Object.create(proto)
    obj.own = 'property'
    obj.undef = undefined

    expect(omitUndefinedFromObject(obj)).toEqual({ own: 'property' })
  })

  it('should preserve falsy non-undefined values', () => {
    const input = { a: 0, b: '', c: false, d: null, e: Number.NaN }

    expect(omitUndefinedFromObject(input)).toEqual(input)
  })

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test')
    const input = { a: 1, b: undefined, [sym]: 'symbol value' }

    const result = omitUndefinedFromObject(input)
    expect(result.a).toEqual(1)
    expect(result.b).toBeUndefined()
    expect(result[sym]).toBeUndefined() // Symbol keys are not enumerable with for..in.
  })

  it('should handle complex nested objects', () => {
    const input = {
      a: { nested: 'value', undef: undefined },
      b: undefined,
      c: [1, undefined, 3],
    }
    const expected = {
      a: { nested: 'value', undef: undefined },
      c: [1, undefined, 3],
    }

    // The function only removes top-level undefined properties, not those in nested objects.
    expect(omitUndefinedFromObject(input)).toEqual(expected)
  })

  it('should handle object with getters', () => {
    const input = {
      get a() {
        return 1
      },
      get b() {
        return undefined
      },
    }

    const result = omitUndefinedFromObject(input)
    expect(result.a).toEqual(1)
    expect(result.b).toBeUndefined()
    expect('b' in result).toBe(false)
  })
})

describe('omitNullishFromArray', () => {
  it('should filter out null and undefined values', () => {
    expect(omitNullishFromArray([1, null, 2, undefined, 3])).toEqual([1, 2, 3])
    expect(omitNullishFromArray(['a', null, 'b', undefined])).toEqual(['a', 'b'])
    expect(omitNullishFromArray([null, undefined])).toEqual([])
  })

  it('should preserve empty arrays', () => {
    expect(omitNullishFromArray([])).toEqual([])
  })

  it('should keep falsy values that are not null or undefined', () => {
    const input = [0, '', false, null, undefined, Number.NaN]
    const expected = [0, '', false, Number.NaN]

    expect(omitNullishFromArray(input)).toEqual(expected)
  })

  it('should work with complex objects', () => {
    const value1 = { id: 1 }
    const value2 = { id: 2 }

    expect(omitNullishFromArray([value1, null, value2, undefined])).toEqual([value1, value2])
  })

  it('should preserve the order of non-nullish elements', () => {
    const value = ['first', null, 'second', undefined, 'third']
    const expected = ['first', 'second', 'third']

    expect(omitNullishFromArray(value)).toEqual(expected)
  })

  it('should handle arrays with only nullish values', () => {
    expect(omitNullishFromArray([null, undefined, null])).toEqual([])
  })

  it('should handle mixed type arrays', () => {
    const value = [1, 'string', true, null, { key: 'value' }, undefined, []]
    const expected = [1, 'string', true, { key: 'value' }, []]

    expect(omitNullishFromArray(value)).toEqual(expected)
  })
})

describe('stripCdata', () => {
  it('should return string without CDATA markers when present', () => {
    expect(stripCdata('<![CDATA[content]]>')).toEqual('content')
    expect(stripCdata('prefix<![CDATA[content]]>suffix')).toEqual('prefixcontentsuffix')
    expect(stripCdata('<![CDATA[]]>')).toEqual('')
  })

  it('should handle multiple CDATA sections in a single string', () => {
    expect(stripCdata('<![CDATA[first]]>middle<![CDATA[second]]>')).toEqual('firstmiddlesecond')
    expect(stripCdata('start<![CDATA[one]]>between<![CDATA[two]]>end')).toEqual(
      'startonebetweentwoend',
    )
    expect(stripCdata('<![CDATA[a]]><![CDATA[b]]><![CDATA[c]]>')).toEqual('abc')
  })

  it('should return the original string when no CDATA markers are present', () => {
    expect(stripCdata('regular text')).toEqual('regular text')
    expect(stripCdata('')).toEqual('')
    expect(stripCdata('text with <tags> but no CDATA')).toEqual('text with <tags> but no CDATA')
  })

  it('should handle CDATA with special XML characters', () => {
    expect(stripCdata('<![CDATA[<div>HTML content</div>]]>')).toEqual('<div>HTML content</div>')
    expect(stripCdata('<![CDATA[&lt;p&gt;encoded entities&lt;/p&gt;]]>')).toEqual(
      '&lt;p&gt;encoded entities&lt;/p&gt;',
    )
    expect(stripCdata('<![CDATA[5 < 10 && 10 > 5]]>')).toEqual('5 < 10 && 10 > 5')
  })

  it('should handle CDATA with newlines and whitespace', () => {
    expect(stripCdata('<![CDATA[\n  multiline\n  content\n]]>')).toEqual(
      '\n  multiline\n  content\n',
    )
    expect(stripCdata('<![CDATA[   space   ]]>')).toEqual('   space   ')
    expect(stripCdata('  <![CDATA[trimming]]>  ')).toEqual('  trimming  ')
  })

  it('should handle malformed or partial CDATA properly', () => {
    expect(stripCdata('Incomplete <![CDATA[content')).toEqual('Incomplete <![CDATA[content')
    expect(stripCdata('Missing end content]]>')).toEqual('Missing end content]]>')
    expect(stripCdata('<![CDATA[nested <![CDATA[content]]>]]>')).toEqual(
      'nested <![CDATA[content]]>',
    )
  })

  it('should handle case-sensitivity properly', () => {
    expect(stripCdata('<![cdata[lowercase]]>')).toEqual('<![cdata[lowercase]]>')
    expect(stripCdata('<![CDATA[correct case]]>')).toEqual('correct case')
  })

  it('should handle empty values correctly', () => {
    expect(stripCdata('')).toEqual('')
    expect(stripCdata('   ')).toEqual('   ')
  })

  it('should return the same value for non-string inputs', () => {
    expect(stripCdata(null)).toEqual(null)
    expect(stripCdata(undefined)).toEqual(undefined)
    expect(stripCdata(123)).toEqual(123)
    expect(stripCdata(true)).toEqual(true)
    expect(stripCdata(false)).toEqual(false)
    expect(stripCdata([])).toEqual([])
    expect(stripCdata({})).toEqual({})
    expect(stripCdata(() => {})).toBeTypeOf('function')
  })
})

describe('parseString', () => {
  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseString(value)).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseString(value)).toBeUndefined()
  })

  it('should handle non-empty string', () => {
    const value = 'javascript'

    expect(parseString(value)).toEqual(value)
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseString(value)).toEqual(value)
  })

  it('should handle HTML entities in string', () => {
    const value = '&amp;'

    expect(parseString(value)).toEqual('&')
  })

  it('should return number', () => {
    const value = 420

    expect(parseString(value)).toEqual('420')
  })

  it('should return boolean', () => {
    const value = true

    expect(parseString(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseString(value)).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseString(value)).toBeUndefined()
  })
})

describe('parseNumber', () => {
  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseNumber(value)).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseNumber(value)).toBeUndefined()
  })

  it('should handle non-numeric string', () => {
    const value = 'javascript'

    expect(parseNumber(value)).toBeUndefined()
  })

  it('should handle numeric string', () => {
    const value = '36.6'

    expect(parseNumber(value)).toEqual(36.6)
  })

  it('should return number', () => {
    const value = 420

    expect(parseNumber(value)).toEqual(value)
  })

  it('should return boolean', () => {
    const value = true

    expect(parseNumber(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseNumber(value)).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseNumber(value)).toBeUndefined()
  })
})

describe('parseBoolean', () => {
  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should handle non-boolean string', () => {
    const value = 'javascript'

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should handle true string', () => {
    const value = 'true'

    expect(parseBoolean(value)).toEqual(true)
  })

  it('should handle false string', () => {
    const value = 'false'

    expect(parseBoolean(value)).toEqual(false)
  })

  it('should return number', () => {
    const value = 420

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should return boolean', () => {
    const value = true

    expect(parseBoolean(value)).toEqual(value)
  })

  it('should handle null', () => {
    const value = null

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseBoolean(value)).toBeUndefined()
  })
})

describe('parseSingular', () => {
  it('should return the first element of an array', () => {
    expect(parseSingular([1, 2, 3])).toEqual(1)
    expect(parseSingular(['a', 'b', 'c'])).toEqual('a')
    expect(parseSingular([{ key: 'value' }, { another: 'object' }])).toEqual({ key: 'value' })
  })

  it('should return the value itself when not an array', () => {
    expect(parseSingular(42)).toEqual(42)
    expect(parseSingular('string')).toEqual('string')
    expect(parseSingular(true)).toEqual(true)
    expect(parseSingular({ key: 'value' })).toEqual({ key: 'value' })
  })

  it('should handle empty arrays', () => {
    expect(parseSingular([])).toBeUndefined()
  })

  it('should handle arrays with undefined or null first elements', () => {
    expect(parseSingular([undefined, 1, 2])).toBeUndefined()
    expect(parseSingular([null, 1, 2])).toEqual(null)
  })

  it('should handle array-like objects correctly', () => {
    const arrayLike = { 0: 'first', 1: 'second', length: 2 }
    expect(parseSingular(arrayLike)).toEqual(arrayLike)
  })

  it('should preserve the type of the input', () => {
    const numberResult = parseSingular<number>([42])
    const stringResult = parseSingular<string>('test')
    const objectResult = parseSingular<{ id: number }>({ id: 1 })

    expect(typeof numberResult).toEqual('number')
    expect(typeof stringResult).toEqual('string')
    expect(typeof objectResult).toEqual('object')
  })

  it('should handle null and undefined', () => {
    expect(parseSingular(null)).toEqual(null)
    expect(parseSingular(undefined)).toBeUndefined()
  })
})

describe('parseArray', () => {
  it('should handle arrays', () => {
    const value1 = [] as Array<string>
    const value2 = [1, 2, 3]
    const value3 = new Array(5)

    expect(parseArray(value1)).toEqual(value1)
    expect(parseArray(value2)).toEqual(value2)
    expect(parseArray(value3)).toEqual(value3)
  })

  it('should handle objects with sequential numeric keys starting from 0', () => {
    const value1 = { 0: 'a', 1: 'b', 2: 'c' }
    const value2 = { 0: 'only one item' }

    expect(parseArray(value1)).toEqual(['a', 'b', 'c'])
    expect(parseArray(value2)).toEqual(['only one item'])
  })

  it('should handle object with length property', () => {
    const value1 = { 0: 'a', 1: 'b', length: 2 }
    const value2 = { length: 3 }

    expect(parseArray(value1)).toEqual(['a', 'b'])
    expect(parseArray(value2)).toEqual([undefined, undefined, undefined])
  })

  it('should return false for non-sequential or non-zero-indexed objects', () => {
    const value1 = { 1: 'a', 2: 'b' }
    const value2 = { 0: 'a', 2: 'b' }
    const value3 = { a: 1, b: 2 }
    const value4 = { 0: 'a', 1: 'b', 5: 'c' }

    expect(parseArray(value1)).toBeUndefined()
    expect(parseArray(value2)).toBeUndefined()
    expect(parseArray(value3)).toBeUndefined()
    expect(parseArray(value4)).toBeUndefined()
  })

  it('should return false for primitive types', () => {
    const value1 = null
    const value2 = undefined
    const value3 = 42
    const value4 = 'string'
    const value5 = true
    const value6 = Symbol('sym')
    const value7 = BigInt(123)

    expect(parseArray(value1)).toBeUndefined()
    expect(parseArray(value2)).toBeUndefined()
    expect(parseArray(value3)).toBeUndefined()
    expect(parseArray(value4)).toBeUndefined()
    expect(parseArray(value5)).toBeUndefined()
    expect(parseArray(value6)).toBeUndefined()
    expect(parseArray(value7)).toBeUndefined()
  })

  it('should return false for other object types', () => {
    const value1 = {}
    const value2 = new Set([1, 2, 3])
    const value3 = new Map()
    const value4 = new Date()
    const value5 = /regex/
    const value6 = () => {}

    expect(parseArray(value1)).toBeUndefined()
    expect(parseArray(value2)).toBeUndefined()
    expect(parseArray(value3)).toBeUndefined()
    expect(parseArray(value4)).toBeUndefined()
    expect(parseArray(value5)).toBeUndefined()
    expect(parseArray(value6)).toBeUndefined()
  })
})

describe('parseArrayOf', () => {
  const parser: ParseFunction<string> = (value) => {
    if (typeof value === 'number') {
      return value.toString()
    }

    return typeof value === 'string' ? value : undefined
  }

  it('should handle string', () => {
    const value = 'Jack'

    expect(parseArrayOf(value, parser)).toEqual(['Jack'])
  })

  it('should handle array of strings', () => {
    const value = ['John', 123]

    expect(parseArrayOf(value, parser)).toEqual(['John', '123'])
  })

  it('should handle array of mixed values', () => {
    const value = [true, {}, [], null, 'John', 123]

    expect(parseArrayOf(value, parser)).toEqual(['John', '123'])
  })

  it('should handle number', () => {
    const value = 420

    expect(parseArrayOf(value, parser)).toEqual(['420'])
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseArrayOf(value, parser)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseArrayOf(value, parser)).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseArrayOf(value, parser)).toBeUndefined()
  })
})
