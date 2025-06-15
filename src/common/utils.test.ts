import { describe, expect, it } from 'bun:test'
import type { XMLBuilder } from 'fast-xml-parser'
import type { ParseExactFunction } from './types.js'
import {
  createCaseInsensitiveGetter,
  createNamespaceGetter,
  detectNamespaces,
  generateNamespaceAttrs,
  generateRfc822Date,
  generateXml,
  hasEntities,
  isNonEmptyString,
  isNonEmptyStringOrNumber,
  isObject,
  isPresent,
  parseArray,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseNumber,
  parseSingular,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
  stripCdata,
  trimArray,
  trimObject,
  validateAndTrimObject,
} from './utils.js'

describe('isPresent', () => {
  it('should return false for null', () => {
    expect(isPresent(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isPresent(undefined)).toBe(false)
  })

  it('should return true for empty string', () => {
    expect(isPresent('')).toBe(true)
  })

  it('should return true for zero', () => {
    expect(isPresent(0)).toBe(true)
  })

  it('should return true for NaN', () => {
    expect(isPresent(Number.NaN)).toBe(true)
  })

  it('should return true for false', () => {
    expect(isPresent(false)).toBe(true)
  })

  it('should return true for empty objects', () => {
    expect(isPresent({})).toBe(true)
  })

  it('should return true for empty arrays', () => {
    expect(isPresent([])).toBe(true)
  })

  it('should return true for string values', () => {
    expect(isPresent('hello')).toBe(true)
  })

  it('should return true for number values', () => {
    expect(isPresent(123)).toBe(true)
  })

  it('should return true for object values', () => {
    expect(isPresent({ key: 'value' })).toBe(true)
  })

  it('should return true for array values', () => {
    expect(isPresent([1, 2, 3])).toBe(true)
  })

  it('should return true for function values', () => {
    expect(isPresent(() => {})).toBe(true)
  })

  it('should return true for Date objects', () => {
    expect(isPresent(new Date())).toBe(true)
  })

  it('should return true for RegExp objects', () => {
    expect(isPresent(/test/)).toBe(true)
  })
})

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

describe('isNonEmptyString', () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyString('hello')).toEqual(true)
    expect(isNonEmptyString('0')).toEqual(true)
    expect(isNonEmptyString('undefined')).toEqual(true)
    expect(isNonEmptyString('null')).toEqual(true)
  })

  it('should handle edge cases', () => {
    const stringObject = new String('hello')

    expect(isNonEmptyString(stringObject)).toEqual(false)
  })

  it('should return false for empty strings', () => {
    expect(isNonEmptyString('')).toEqual(false)
    expect(isNonEmptyString(' ')).toEqual(false)
  })

  it('should return false for number', () => {
    expect(isNonEmptyString(2)).toEqual(false)
  })

  it('should return false for arrays', () => {
    expect(isNonEmptyString([])).toEqual(false)
    expect(isNonEmptyString([1, 2, 3])).toEqual(false)
    expect(isNonEmptyString(['hello'])).toEqual(false)
  })

  it('should return false for objects', () => {
    expect(isNonEmptyString({})).toEqual(false)
    expect(isNonEmptyString({ key: 'value' })).toEqual(false)
    expect(isNonEmptyString(new Date())).toEqual(false)
  })

  it('should return false for null and undefined', () => {
    expect(isNonEmptyString(null)).toEqual(false)
    expect(isNonEmptyString(undefined)).toEqual(false)
  })

  it('should return false for booleans', () => {
    expect(isNonEmptyString(true)).toEqual(false)
    expect(isNonEmptyString(false)).toEqual(false)
  })

  it('should return false for functions', () => {
    expect(isNonEmptyString(() => {})).toEqual(false)
    // biome-ignore lint/complexity/useArrowFunction: It's for testing purposes.
    expect(isNonEmptyString(function () {})).toEqual(false)
  })

  it('should return false for symbols', () => {
    expect(isNonEmptyString(Symbol('test'))).toEqual(false)
  })

  it('should return false for BigInt', () => {
    expect(isNonEmptyString(BigInt(123))).toEqual(false)
  })
})

describe('isNonEmptyStringOrNumber', () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyStringOrNumber('hello')).toEqual(true)
    expect(isNonEmptyStringOrNumber('0')).toEqual(true)
    expect(isNonEmptyStringOrNumber('undefined')).toEqual(true)
    expect(isNonEmptyStringOrNumber('null')).toEqual(true)
  })

  it('should return false for empty strings', () => {
    expect(isNonEmptyStringOrNumber('')).toEqual(false)
    expect(isNonEmptyStringOrNumber(' ')).toEqual(false)
  })

  it('should return true for numbers (including zero and negative numbers)', () => {
    expect(isNonEmptyStringOrNumber(42)).toEqual(true)
    expect(isNonEmptyStringOrNumber(0)).toEqual(true)
    expect(isNonEmptyStringOrNumber(-10)).toEqual(true)
    expect(isNonEmptyStringOrNumber(3.14)).toEqual(true)
    expect(isNonEmptyStringOrNumber(Number.POSITIVE_INFINITY)).toEqual(true)
    expect(isNonEmptyStringOrNumber(Number.NaN)).toEqual(true)
  })

  it('should handle edge cases', () => {
    const stringObject = new String('hello')
    const numberObject = new Number(42)

    expect(isNonEmptyStringOrNumber(stringObject)).toEqual(false)
    expect(isNonEmptyStringOrNumber(numberObject)).toEqual(false)
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
})

describe('retrieveText', () => {
  it('should extract #text property when present', () => {
    const value = { '#text': 'Hello world' }
    expect(retrieveText(value)).toEqual('Hello world')
  })

  it('should return the original value when #text property is not present', () => {
    const value = { title: 'Example Title' }
    expect(retrieveText(value)).toEqual(value)
  })
  it('should return #text property even if it has falsy value (except null/undefined)', () => {
    expect(retrieveText({ '#text': '' })).toEqual('')
    expect(retrieveText({ '#text': 0 })).toEqual(0)
    expect(retrieveText({ '#text': false })).toEqual(false)
  })

  it('should return original value when #text property is null or undefined', () => {
    const valueWithNullText = { '#text': null, other: 'property' }
    const valueWithUndefinedText = { '#text': undefined, other: 'property' }

    expect(retrieveText(valueWithNullText)).toEqual(valueWithNullText)
    expect(retrieveText(valueWithUndefinedText)).toEqual(valueWithUndefinedText)
  })

  it('should handle nested structures correctly', () => {
    const nestedObject = { '#text': { nested: 'value' } }
    const nestedArray = { '#text': [1, 2, 3] }

    expect(retrieveText(nestedObject)).toEqual({ nested: 'value' })
    expect(retrieveText(nestedArray)).toEqual([1, 2, 3])
  })

  it('should work with arrays', () => {
    const array = [1, 2, 3]
    expect(retrieveText(array)).toEqual(array)
  })

  it('should work with dates', () => {
    const date = new Date()
    expect(retrieveText(date)).toEqual(date)
  })

  it('should work with functions', () => {
    const func = () => {}
    expect(retrieveText(func)).toBe(func)
  })

  it('should handle object with only #text property', () => {
    const value = { '#text': 'Text only' }
    expect(retrieveText(value)).toEqual('Text only')
  })

  it('should handle object with #text property among others', () => {
    const value = { '#text': 'Main text', title: 'Title', count: 42 }
    expect(retrieveText(value)).toEqual('Main text')
  })

  it('should return primitive values as is', () => {
    expect(retrieveText('string value')).toEqual('string value')
    expect(retrieveText(42)).toEqual(42)
    expect(retrieveText(true)).toEqual(true)
    expect(retrieveText(false)).toEqual(false)
  })

  it('should handle null and undefined correctly', () => {
    expect(retrieveText(null)).toEqual(null)
    expect(retrieveText(undefined)).toEqual(undefined)
  })
})

describe('trimObject', () => {
  it('should remove nullish properties from objects', () => {
    const input = { a: 1, b: undefined, c: 'string', d: undefined, e: null, f: false, g: 0, h: '' }
    const expected = { a: 1, c: 'string', f: false, g: 0, h: '' }

    expect(trimObject(input)).toEqual(expected)
  })

  it('should return the same object when no properties are nullish', () => {
    const input = { a: 1, b: 'string', c: false, d: [], e: {} }

    expect(trimObject(input)).toEqual(input)
  })

  it('should preserve falsy non-undefined values', () => {
    const input = { a: 0, b: '', c: false, d: Number.NaN }

    expect(trimObject(input)).toEqual(input)
  })

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test')
    const input = { a: 1, b: undefined, [sym]: 'symbol value' }

    const result = trimObject(input)
    expect(result?.a).toEqual(1)
    expect(result?.b).toBeUndefined()
    expect(result?.[sym]).toBeUndefined() // Symbol keys are not enumerable with for..in.
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
    expect(trimObject(input)).toEqual(expected)
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
    const result = trimObject(input)

    expect(result?.a).toEqual(1)
    expect(result?.b).toBeUndefined()
  })

  it('should return undefined object when all properties are nullish', () => {
    const input = { a: undefined, b: undefined, c: null }

    expect(trimObject(input)).toBeUndefined()
  })

  it('should handle empty objects', () => {
    expect(trimObject({})).toBeUndefined()
  })
})

describe('trimArray', () => {
  it('should filter out null and undefined values', () => {
    expect(trimArray([1, null, 2, undefined, 3])).toEqual([1, 2, 3])
    expect(trimArray(['a', null, 'b', undefined])).toEqual(['a', 'b'])
  })

  it('should keep falsy values that are not null or undefined', () => {
    const input = [0, '', false, null, undefined, Number.NaN]
    const expected = [0, '', false, Number.NaN]

    expect(trimArray(input)).toEqual(expected)
  })

  it('should work with complex objects', () => {
    const value1 = { id: 1 }
    const value2 = { id: 2 }

    expect(trimArray([value1, null, value2, undefined])).toEqual([value1, value2])
  })

  it('should preserve the order of non-nullish elements', () => {
    const value = ['first', null, 'second', undefined, 'third']
    const expected = ['first', 'second', 'third']

    expect(trimArray(value)).toEqual(expected)
  })

  it('should handle mixed type arrays', () => {
    const value = [1, 'string', true, null, { key: 'value' }, undefined, []]
    const expected = [1, 'string', true, { key: 'value' }, []]

    expect(trimArray(value)).toEqual(expected)
  })

  it('should preserve empty arrays', () => {
    expect(trimArray([])).toBeUndefined()
  })

  it('should handle arrays with only nullish values', () => {
    expect(trimArray([null, undefined, null])).toBeUndefined()
  })

  describe('with parsing function', () => {
    it('should apply the parsing function to each element', () => {
      const value = [1, 2, 3]
      const expected = ['1', '2', '3']
      const parseToString = (val: number) => val.toString()

      expect(trimArray(value, parseToString)).toEqual(expected)
    })

    it('should filter out values that become null or undefined after parsing', () => {
      const value = [1, 2, 3, 4]
      const expected = [2, 4]
      const parseEvenNumbers = (val: number) => (val % 2 === 0 ? val : null)

      expect(trimArray(value, parseEvenNumbers)).toEqual(expected)
    })

    it('should handle type transformations', () => {
      const value = [1, 2, 3]
      const expected = [{ value: 1 }, { value: 2 }, { value: 3 }]
      const parseToObject = (val: number) => ({ value: val })

      expect(trimArray(value, parseToObject)).toEqual(expected)
    })

    it('should combine parsing and filtering of nullish values', () => {
      const value = [1, null, 2, undefined, 3]
      const expected = [2, 4, 6]
      const double = (val: number | null | undefined) => {
        return val !== null && val !== undefined ? val * 2 : val
      }

      expect(trimArray(value, double)).toEqual(expected)
    })

    it('should return undefined when parsing results in empty array', () => {
      const value = [1, 2, 3]
      const parseToAllNull = () => null

      expect(trimArray(value, parseToAllNull)).toBeUndefined()
    })

    it('should handle complex parsing logic', () => {
      const value = ['a', 3, 'b', 6, null, true]
      const expected = ['A', 'B', 12, true]
      const parseWithConditions = (val: unknown) => {
        if (typeof val === 'string') return val.toUpperCase()
        if (typeof val === 'number' && val > 5) return val * 2
        if (typeof val === 'number') return null
        return val
      }

      expect(trimArray(value, parseWithConditions)).toEqual(expected)
    })

    it('should handle nested data structures with parsing', () => {
      const value = [{ items: [1, 2] }, { items: [3, 4] }]
      const expected = [1, 3]
      const extractFirstItem = (obj: { items: number[] }) => {
        return obj.items && obj.items.length > 0 ? obj.items[0] : null
      }

      expect(trimArray(value, extractFirstItem)).toEqual(expected)
    })
  })
})

describe('validateAndTrimObject', () => {
  it('should return object when all required fields are present', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
    }
    const expected = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
    }

    expect(validateAndTrimObject(value, 'url', 'length', 'type')).toEqual(expected)
  })

  it('should return object with required fields and keep optional fields', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
      description: 'Optional description',
      title: 'Optional title',
    }
    const expected = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
      description: 'Optional description',
      title: 'Optional title',
    }

    expect(validateAndTrimObject(value, 'url', 'length', 'type')).toEqual(expected)
  })

  it('should trim undefined optional fields while keeping required fields', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
      description: undefined,
      title: null,
      extra: 'kept',
    }
    const expected = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
      extra: 'kept',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'url', 'length', 'type')).toEqual(expected)
  })

  it('should preserve falsy non-undefined values in required fields', () => {
    const value = {
      name: '',
      count: 0,
      active: false,
      optional: undefined,
    }
    const expected = {
      name: '',
      count: 0,
      active: false,
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'name', 'count', 'active')).toEqual(expected)
  })

  it('should return undefined when required field is missing', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      type: 'audio/mpeg',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'url', 'length', 'type')).toBeUndefined()
  })

  it('should return undefined when required field is undefined', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      length: undefined,
      type: 'audio/mpeg',
    }

    expect(validateAndTrimObject(value, 'url', 'length', 'type')).toBeUndefined()
  })

  it('should return undefined when required field is null', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      length: null,
      type: 'audio/mpeg',
    }

    expect(validateAndTrimObject(value, 'url', 'length', 'type')).toBeUndefined()
  })

  it('should handle single required field', () => {
    const value = {
      title: 'Example Title',
      description: undefined,
      optional: 'kept',
    }
    const expected = {
      title: 'Example Title',
      optional: 'kept',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toEqual(expected)
  })

  it('should return undefined when single required field is missing', () => {
    const value = {
      description: 'Some description',
      optional: 'value',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toBeUndefined()
  })

  it('should handle objects with many required fields', () => {
    const value = {
      field1: 'value1',
      field2: 'value2',
      field3: 'value3',
      field4: 'value4',
      optional: undefined,
      extra: 'kept',
    }
    const expected = {
      field1: 'value1',
      field2: 'value2',
      field3: 'value3',
      field4: 'value4',
      extra: 'kept',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'field1', 'field2', 'field3', 'field4')).toEqual(expected)
  })

  it('should return undefined when any of many required fields is missing', () => {
    const value = {
      field1: 'value1',
      field2: 'value2',
      field3: undefined,
      field4: 'value4',
      field5: 'value5',
    }

    expect(
      validateAndTrimObject(value, 'field1', 'field2', 'field3', 'field4', 'field5'),
    ).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toBeUndefined()
  })

  it('should return undefined when all properties are nullish', () => {
    const value = {
      field1: undefined,
      field2: null,
      field3: undefined,
    }

    expect(validateAndTrimObject(value, 'field1')).toBeUndefined()
  })

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test')
    const value = {
      title: 'Example Title',
      description: undefined,
      [sym]: 'symbol value',
    }
    const expected = {
      title: 'Example Title',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toEqual(expected)
  })

  it('should handle objects with getters', () => {
    const value = {
      get title() {
        return 'Dynamic Title'
      },
      get description() {
        return undefined
      },
      static: 'static value',
    }
    const expected = {
      title: 'Dynamic Title',
      static: 'static value',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toEqual(expected)
  })

  it('should handle complex nested objects as values', () => {
    const complexValue = { nested: 'object' }
    const arrayValue = [1, 2, 3]
    const value = {
      title: 'Title',
      complex: complexValue,
      array: arrayValue,
      nullish: undefined,
    }
    const expected = {
      title: 'Title',
      complex: complexValue,
      array: arrayValue,
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toEqual(expected)
  })

  it('should handle objects with numeric keys', () => {
    const value = {
      '0': 'first',
      '1': 'second',
      title: 'Example',
      description: undefined,
    }
    const expected = {
      '0': 'first',
      '1': 'second',
      title: 'Example',
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toEqual(expected)
  })

  it('should preserve Date objects correctly', () => {
    const date = new Date('2023-01-01')
    const value = {
      title: 'Example',
      date: date,
      description: undefined,
    }
    const expected = {
      title: 'Example',
      date: date,
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'title')).toEqual(expected)
  })

  it('should handle objects with mixed data types', () => {
    const value = {
      string: 'text',
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      object: { key: 'value' },
      nullValue: null,
      undefinedValue: undefined,
      zero: 0,
      emptyString: '',
      falseBoolean: false,
    }
    const expected = {
      string: 'text',
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      object: { key: 'value' },
      zero: 0,
      emptyString: '',
      falseBoolean: false,
    }

    // @ts-ignore: This is for testing purposes.
    expect(validateAndTrimObject(value, 'string', 'number')).toEqual(expected)
  })

  it('should return undefined when no properties remain after trimming', () => {
    const value = {
      field1: undefined,
      field2: null,
    }

    // Even though field1 is "present" as a key, its value is undefined.
    expect(validateAndTrimObject(value, 'field1')).toBeUndefined()
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

describe('hasEntities', () => {
  it('should detect basic HTML entities', () => {
    expect(hasEntities('This contains &lt;')).toBe(true)
    expect(hasEntities('This contains &gt;')).toBe(true)
    expect(hasEntities('This contains &amp;')).toBe(true)
    expect(hasEntities('This contains &quot;')).toBe(true)
    expect(hasEntities('This contains &apos;')).toBe(true)
  })

  it('should detect named HTML entities', () => {
    expect(hasEntities('This contains &copy;')).toBe(true)
    expect(hasEntities('This contains &reg;')).toBe(true)
    expect(hasEntities('This contains &euro;')).toBe(true)
    expect(hasEntities('This contains &trade;')).toBe(true)
    expect(hasEntities('This contains &nbsp;')).toBe(true)
  })

  it('should detect numeric HTML entities', () => {
    expect(hasEntities('This contains &#169;')).toBe(true)
    expect(hasEntities('This contains &#8364;')).toBe(true)
    expect(hasEntities('This contains &#x00A9;')).toBe(true)
    expect(hasEntities('This contains &#x20AC;')).toBe(true)
  })

  it('should detect multiple entities in the same string', () => {
    expect(hasEntities('This &lt;tag&gt; has multiple &amp; entities')).toBe(true)
    expect(hasEntities('Copyright &copy; 2023, &reg; trademark')).toBe(true)
  })

  it('should detect entities in different positions', () => {
    expect(hasEntities('&lt;p&gt;At the beginning')).toBe(true)
    expect(hasEntities('In the middle &amp; of the string')).toBe(true)
    expect(hasEntities('At the end &gt;')).toBe(true)
  })

  it('should detect nested entities', () => {
    expect(hasEntities('This contains &amp;lt;')).toBe(true)
    expect(hasEntities('Complex &amp;amp; nested entities')).toBe(true)
  })

  it('should detect XML entities', () => {
    expect(hasEntities('<tag attribute="&apos;value&apos;">')).toBe(true)
    expect(hasEntities('<![CDATA[content with &lt; entity]]>')).toBe(true)
  })

  it('should return false when no entities are present', () => {
    expect(hasEntities('This string has no entities')).toBe(false)
    expect(hasEntities('Plain <tag> without entities')).toBe(false)
    expect(hasEntities('Regular & ampersand')).toBe(false)
    expect(hasEntities('Symbol ; semicolon')).toBe(false)
  })

  it('should handle strings with ampersand but no semicolon', () => {
    expect(hasEntities('This & that')).toBe(false)
    expect(hasEntities('Company & Co.')).toBe(false)
    expect(hasEntities('A&B Corporation')).toBe(false)
  })

  it('should handle strings with semicolon but no ampersand', () => {
    expect(hasEntities('This; that')).toBe(false)
    expect(hasEntities('List: item1; item2; item3')).toBe(false)
  })

  it('should return false for unusual cases', () => {
    expect(hasEntities('& amp;')).toBe(true)
    expect(hasEntities('&amp')).toBe(false)
    expect(hasEntities('')).toBe(false)
  })

  it('should handle cases that might produce false positives', () => {
    expect(hasEntities('Fish & Chips; best in town')).toBe(true)
    expect(hasEntities('Salt & pepper; sugar & spice')).toBe(true)
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

  it('Should handle entities #1', () => {
    const value =
      'Testing &lt;b&gt;bold text&lt;/b&gt; and &lt;i&gt;italic text&lt;/i&gt; with &amp;amp; ampersand, &amp;quot; quotes, &amp;apos; apostrophe and &amp;nbsp; non-breaking space.'
    const expected = `Testing <b>bold text</b> and <i>italic text</i> with & ampersand, " quotes, ' apostrophe and   non-breaking space.`
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #2', () => {
    const value =
      '<![CDATA[Testing <b>bold text</b> and <i>italic text</i> with &amp; ampersand, &quot; quotes, &apos; apostrophe and &nbsp; non-breaking space.]]>'
    const expected = `Testing <b>bold text</b> and <i>italic text</i> with & ampersand, " quotes, ' apostrophe and   non-breaking space.`
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #3', () => {
    const value =
      'Special chars: &amp;lt; &amp;gt; &amp;euro; € &amp;copy; © &amp;reg; ® &amp;pound; £ &amp;yen; ¥'
    const expected = 'Special chars: < > € € © © ® ® £ £ ¥ ¥'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #4', () => {
    const value = '<![CDATA[Special chars: &lt; &gt; &euro; € &copy; © &reg; ® &pound; £ &yen; ¥]]>'
    const expected = 'Special chars: < > € € © © ® ® £ £ ¥ ¥'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #5', () => {
    const value =
      'Numeric entities: &amp;#169; &#169; &amp;#8364; &#8364; &amp;#8482; &#8482; &amp;#x2122; &#x2122;'
    const expected = 'Numeric entities: © © € € ™ ™ ™ ™'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #6', () => {
    const value = '<![CDATA[Numeric entities: &#169; &#8364; &#8482; &#x2122;]]>'
    const expected = 'Numeric entities: © € ™ ™'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #7', () => {
    const value =
      '&lt;p&gt;HTML mixed with entities: &amp;copy; ©, &amp;reg; ®, &amp;#8364; € and &lt;a href=&quot;https://example.com?param1=value1&amp;param2=value2&quot;&gt;URL with ampersand&lt;/a&gt;&lt;/p&gt;'
    const expected =
      '<p>HTML mixed with entities: © ©, ® ®, € € and <a href="https://example.com?param1=value1¶m2=value2">URL with ampersand</a></p>'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #8', () => {
    const value =
      '<![CDATA[<p>HTML mixed with entities: &copy; ©, &reg; ®, &#8364; € and <a href="https://example.com?param1=value1&param2=value2">URL with ampersand</a></p>]]>'
    const expected =
      '<p>HTML mixed with entities: © ©, ® ®, € € and <a href="https://example.com?param1=value1¶m2=value2">URL with ampersand</a></p>'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #9', () => {
    const value =
      '<![CDATA[Testing CDATA with brackets: [This is in brackets] and <code>if (x > y) { doSomething(); }</code>]]>'
    const expected =
      'Testing CDATA with brackets: [This is in brackets] and <code>if (x > y) { doSomething(); }</code>'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #10', () => {
    const value =
      '&lt;script&gt;function test() { if (x &lt; y &amp;&amp; z &gt; 0) { alert(&quot;Hello!&quot;); } }&lt;/script&gt;'
    const expected = '<script>function test() { if (x < y && z > 0) { alert("Hello!"); } }</script>'
    expect(parseString(value)).toEqual(expected)
  })

  it('Should handle entities #11', () => {
    const value =
      '<![CDATA[<script>function test() { if (x < y && z > 0) { alert("Hello!"); } }</script>]]>'
    const expected = '<script>function test() { if (x < y && z > 0) { alert("Hello!"); } }</script>'
    expect(parseString(value)).toEqual(expected)
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

  it('should handle empty string', () => {
    const value = ''

    expect(parseNumber(value)).toBeUndefined()
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
  it('should return boolean true', () => {
    const value = true

    expect(parseBoolean(value)).toEqual(true)
  })

  it('should return boolean false', () => {
    const value = false

    expect(parseBoolean(value)).toEqual(false)
  })

  it('should handle true string', () => {
    const value = 'true'

    expect(parseBoolean(value)).toEqual(true)
  })

  it('should handle false string', () => {
    const value = 'false'

    expect(parseBoolean(value)).toEqual(false)
  })

  it('should handle case insensitive false string', () => {
    const value = 'FaLse'

    expect(parseBoolean(value)).toEqual(false)
  })

  it('should handle non-boolean string', () => {
    const value = 'javascript'

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should return number', () => {
    const value = 420

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseBoolean(value)).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseBoolean(value)).toBeUndefined()
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

describe('parseYesNoBoolean', () => {
  it('should return boolean true', () => {
    const value = true

    expect(parseYesNoBoolean(value)).toEqual(true)
  })

  it('should return boolean false', () => {
    const value = false

    expect(parseYesNoBoolean(value)).toEqual(false)
  })

  it('should handle true string', () => {
    const value = 'true'

    expect(parseYesNoBoolean(value)).toEqual(true)
  })

  it('should handle false string', () => {
    const value = 'false'

    expect(parseYesNoBoolean(value)).toEqual(false)
  })

  it('should handle case insensitive false string', () => {
    const value = 'FaLse'

    expect(parseYesNoBoolean(value)).toEqual(false)
  })

  it('should handle "yes" string as true', () => {
    const value = 'yes'

    expect(parseYesNoBoolean(value)).toEqual(true)
  })

  it('should handle case insensitive "yes" string', () => {
    const value = 'YeS'

    expect(parseYesNoBoolean(value)).toEqual(true)
  })

  it('should handle "no" string as false', () => {
    const value = 'no'

    expect(parseYesNoBoolean(value)).toEqual(false)
  })

  it('should handle non-"yes" strings as false', () => {
    const value = 'anything'

    expect(parseYesNoBoolean(value)).toEqual(false)
  })

  it('should handle empty string as false', () => {
    const value = ''

    expect(parseYesNoBoolean(value)).toEqual(false)
  })

  it('should return number as undefined', () => {
    const value = 420

    expect(parseYesNoBoolean(value)).toBeUndefined()
  })

  it('should handle array as undefined', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseYesNoBoolean(value)).toBeUndefined()
  })

  it('should handle object as undefined', () => {
    const value = { name: 'javascript' }

    expect(parseYesNoBoolean(value)).toBeUndefined()
  })

  it('should handle null as undefined', () => {
    const value = null

    expect(parseYesNoBoolean(value)).toBeUndefined()
  })

  it('should handle undefined as undefined', () => {
    const value = undefined

    expect(parseYesNoBoolean(value)).toBeUndefined()
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

describe('parseSingularOf', () => {
  it('should apply parse function to the first element of an array', () => {
    const parseToString: ParseExactFunction<string> = (value) => {
      return typeof value === 'number' || typeof value === 'string' ? String(value) : undefined
    }

    expect(parseSingularOf([1, 2, 3], parseToString)).toEqual('1')
    expect(parseSingularOf(['a', 'b', 'c'], parseToString)).toEqual('a')
    expect(parseSingularOf([42, 'text'], parseString)).toEqual('42')
  })

  it('should apply parse function to non-array values', () => {
    expect(parseSingularOf(42, parseString)).toEqual('42')
    expect(parseSingularOf('123', parseNumber)).toEqual(123)
    expect(parseSingularOf('true', parseBoolean)).toEqual(true)
  })

  it('should return undefined when the parse function returns undefined', () => {
    expect(parseSingularOf({}, parseNumber)).toBeUndefined()
    expect(parseSingularOf('not-a-number', parseNumber)).toBeUndefined()
    expect(parseSingularOf([{}, 'string'], parseNumber)).toBeUndefined()
  })

  it('should handle empty arrays', () => {
    expect(parseSingularOf([], parseString)).toBeUndefined()
  })

  it('should handle arrays with undefined or null first elements', () => {
    expect(parseSingularOf([undefined, 1, 2], parseNumber)).toBeUndefined()
    expect(parseSingularOf([null, 1, 2], parseNumber)).toBeUndefined()
  })

  it('should preserve the type returned by the parse function', () => {
    const numberResult = parseSingularOf<number>('42', parseNumber)
    const stringResult = parseSingularOf<string>(42, parseString)
    const booleanResult = parseSingularOf<boolean>('true', parseBoolean)

    expect(typeof numberResult).toEqual('number')
    expect(typeof stringResult).toEqual('string')
    expect(typeof booleanResult).toEqual('boolean')
  })

  it('should work with custom parse functions', () => {
    const parseUpperCase: ParseExactFunction<string> = (value) => {
      return typeof value === 'string' ? value.toUpperCase() : undefined
    }

    expect(parseSingularOf('hello', parseUpperCase)).toEqual('HELLO')
    expect(parseSingularOf(['hello', 'world'], parseUpperCase)).toEqual('HELLO')
    expect(parseSingularOf(123, parseUpperCase)).toBeUndefined()
  })

  it('should handle null and undefined input values', () => {
    expect(parseSingularOf(null, parseString)).toBeUndefined()
    expect(parseSingularOf(undefined, parseNumber)).toBeUndefined()
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
  const parser: ParseExactFunction<string> = (value) => {
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

describe('parseCsvOf', () => {
  it('should parse comma-separated string', () => {
    const value = 'podcast,technology,programming'
    const expected = ['podcast', 'technology', 'programming']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should handle whitespace around keywords', () => {
    const value = 'podcast, technology , programming'
    const expected = ['podcast', 'technology', 'programming']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should handle single keyword', () => {
    const value = 'podcast'
    const expected = ['podcast']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should parse comma-separated numbers', () => {
    const value = '1,2,3,4,5'
    const expected = [1, 2, 3, 4, 5]

    expect(parseCsvOf(value, parseNumber)).toEqual(expected)
  })

  it('should handle single number keyword', () => {
    const value = 123
    const expected = ['123']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should handle consecutive commas', () => {
    const value = 'podcast,,technology,,,programming'
    const expected = ['podcast', 'technology', 'programming']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should handle keywords with HTML entities', () => {
    const value = 'podcast,tech &amp; programming,science'
    const expected = ['podcast', 'tech & programming', 'science']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should handle keywords wrapped in CDATA', () => {
    const value = '<![CDATA[podcast,technology,programming]]>'
    const expected = ['podcast', 'technology', 'programming']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should normalize keywords with special characters', () => {
    const value = 'pod-cast,tech_nology,programming!'
    const expected = ['pod-cast', 'tech_nology', 'programming!']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should handle case sensitivity', () => {
    const value = 'Podcast,TECHNOLOGY,Programming'
    const expected = ['Podcast', 'TECHNOLOGY', 'Programming']

    expect(parseCsvOf(value, parseString)).toEqual(expected)
  })

  it('should filter out values that cannot be parsed', () => {
    const value = '1,a,2,b,3'
    const expected = [1, 2, 3]

    expect(parseCsvOf(value, parseNumber)).toEqual(expected)
  })

  it('should handle strings with trailing comma', () => {
    const value = '1,2,3,'
    const expected = [1, 2, 3]

    expect(parseCsvOf(value, parseNumber)).toEqual(expected)
  })

  it('should handle strings with only unparseable values', () => {
    const value = 'a,b,c'

    expect(parseCsvOf(value, parseNumber)).toBeUndefined()
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseCsvOf(value, parseNumber)).toBeUndefined()
  })

  it('should handle empty keywords (just commas)', () => {
    const value = ',,'

    expect(parseCsvOf(value, parseString)).toBeUndefined()
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseCsvOf(value, parseString)).toBeUndefined()
  })

  it('should handle string with only whitespace', () => {
    const value = '   '

    expect(parseCsvOf(value, parseString)).toBeUndefined()
  })

  it('should handle non-string values', () => {
    expect(parseCsvOf(true, parseString)).toBeUndefined()
    expect(parseCsvOf(null, parseString)).toBeUndefined()
    expect(parseCsvOf(undefined, parseString)).toBeUndefined()
    expect(parseCsvOf([], parseString)).toBeUndefined()
    expect(parseCsvOf({}, parseString)).toBeUndefined()
  })
})

describe('createNamespaceGetter', () => {
  it('should retrieve value with prefix when prefix is provided', () => {
    const value = {
      'ns:key': 'prefixed value',
      key: 'unprefixed value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toEqual('prefixed value')
  })

  it('should handle empty prefix', () => {
    const value = {
      key: 'value',
    }
    const get = createNamespaceGetter(value, '')

    expect(get('key')).toEqual('value')
  })

  it('should handle undefined prefix', () => {
    const value = {
      key: 'value',
    }
    const get = createNamespaceGetter(value, undefined)

    expect(get('key')).toEqual('value')
  })

  it('should handle complex objects as values', () => {
    const complexValue = { nested: 'object' }
    const value = {
      'ns:key': complexValue,
      key: 'simple value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toBe(complexValue)
  })

  it('should handle arrays as values', () => {
    const arrayValue = [1, 2, 3]
    const value = {
      'ns:key': arrayValue,
      key: 'simple value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toBe(arrayValue)
  })

  it('should handle non-string keys gracefully', () => {
    const value = {
      'ns:123': 'numeric key with prefix',
      '123': 'numeric key',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('123')).toEqual('numeric key with prefix')
  })

  it('should handle various prefix formats', () => {
    const value = {
      'namespace:key': 'value with colon',
      'namespace-key': 'value with dash',
      namespace_key: 'value with underscore',
    }

    const colonGetter = createNamespaceGetter(value, 'namespace:')
    const dashGetter = createNamespaceGetter(value, 'namespace-')
    const underscoreGetter = createNamespaceGetter(value, 'namespace_')

    expect(colonGetter('key')).toEqual('value with colon')
    expect(dashGetter('key')).toEqual('value with dash')
    expect(underscoreGetter('key')).toEqual('value with underscore')
  })

  it('should return undefined when prefixed key does not exist', () => {
    const value = {
      key: 'unprefixed value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toBeUndefined()
  })

  it('should return undefined for non-existent keys (with prefix)', () => {
    const value = {
      'ns:existingKey': 'value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('nonExistentKey')).toBeUndefined()
  })
})

describe('createCaseInsensitiveGetter', () => {
  it('should retrieve value using case-insensitive key lookup', () => {
    const value = {
      Title: 'Example Title',
      AUTHOR: 'John Doe',
      content: 'Some content here',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('title')).toEqual('Example Title')
    expect(get('author')).toEqual('John Doe')
    expect(get('CONTENT')).toEqual('Some content here')
  })

  it('should preserve the original value types', () => {
    const value = {
      Number: 42,
      Boolean: true,
      Object: { key: 'value' },
      Array: [1, 2, 3],
      Null: null,
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('number')).toBe(42)
    expect(get('boolean')).toBe(true)
    expect(get('object')).toEqual({ key: 'value' })
    expect(get('array')).toEqual([1, 2, 3])
    expect(get('null')).toBeNull()
  })

  it('should handle keys that differ only in case', () => {
    // Note: In JavaScript objects, keys that differ only in case would overwrite each other
    // This test verifies that the last key-value pair wins.
    const value = {
      key: 'lowercase value',
      KEY: 'uppercase value',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('key')).toEqual('uppercase value')
    expect(get('KEY')).toEqual('uppercase value')
  })

  it('should handle non-string key lookups by coercing to string', () => {
    const value = {
      '123': 'numeric key',
      true: 'boolean key',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('123')).toEqual('numeric key')
    expect(get('TRUE')).toEqual('boolean key')
  })

  it('should handle special characters in keys', () => {
    const value = {
      'Special-Key': 'with dash',
      Special_Key: 'with underscore',
      'Special.Key': 'with dot',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('special-key')).toEqual('with dash')
    expect(get('SPECIAL_KEY')).toEqual('with underscore')
    expect(get('special.key')).toEqual('with dot')
  })

  it('should only consider own properties', () => {
    const proto = { PrototypeProp: 'from prototype' }
    const value = Object.create(proto)
    value.OwnProp = 'own property'

    const get = createCaseInsensitiveGetter(value)
    expect(get('ownprop')).toEqual('own property')
    expect(get('prototypeprop')).toBeUndefined()
  })

  it('should handle Unicode characters correctly', () => {
    const value = {
      CaféItem: 'coffee',
      RÉSUMÉ: 'document',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('caféitem')).toEqual('coffee')
    expect(get('résumé')).toEqual('document')
  })

  it('should handle multiple lookups on the same getter', () => {
    const value = {
      First: 'first value',
      Second: 'second value',
      Third: 'third value',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('first')).toEqual('first value')
    expect(get('SECOND')).toEqual('second value')
    expect(get('THiRd')).toEqual('third value')
  })

  it('should handle undefined values in the object', () => {
    const value = {
      DefinedKey: 'defined value',
      UndefinedKey: undefined,
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('definedkey')).toEqual('defined value')
    expect(get('undefinedkey')).toBeUndefined()
    // Make sure we can distinguish between non-existent keys and keys with undefined values.
    expect('UndefinedKey' in value).toBe(true)
  })

  it('should return undefined for non-existent keys', () => {
    const value = {
      ExistingKey: 'value',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('nonexistentkey')).toBeUndefined()
  })

  it('should handle empty objects', () => {
    const value = {}
    const get = createCaseInsensitiveGetter(value)

    expect(get('anykey')).toBeUndefined()
  })
})

describe('generateXml', () => {
  const mockBuilder: XMLBuilder = {
    build: (value: string) => `<root>${value}</root>`,
  }

  it('should generate XML with proper declaration header', () => {
    const value = 'test content'
    const expected = '<?xml version="1.0" encoding="utf-8"?>\n<root>test content</root>'

    expect(generateXml(mockBuilder, value)).toEqual(expected)
  })

  it('should replace single apostrophe entity', () => {
    const value = 'don&apos;t'
    const expected = '<?xml version="1.0" encoding="utf-8"?>\n<root>don\'t</root>'

    expect(generateXml(mockBuilder, value)).toEqual(expected)
  })

  it('should replace multiple apostrophe entities', () => {
    const value = 'don&apos;t worry, it&apos;s fine'
    const expected = '<?xml version="1.0" encoding="utf-8"?>\n<root>don\'t worry, it\'s fine</root>'

    expect(generateXml(mockBuilder, value)).toEqual(expected)
  })

  it('should handle empty value input', () => {
    const value = ''
    const expected = '<?xml version="1.0" encoding="utf-8"?>\n<root></root>'

    expect(generateXml(mockBuilder, value)).toEqual(expected)
  })
})

describe('generateRfc822Date', () => {
  it('should format Date object to RFC822 string', () => {
    const value = new Date('2023-03-15T12:00:00Z')
    const expected = 'Wed, 15 Mar 2023 12:00:00 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should format valid date string to RFC822 string', () => {
    const value = '2023-03-15T12:00:00Z'
    const expected = 'Wed, 15 Mar 2023 12:00:00 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should return undefined for invalid date string', () => {
    expect(generateRfc822Date('not a date')).toBeUndefined()
  })
})

describe('detectNamespaces', () => {
  it('should detect single namespace', () => {
    const value = {
      title: 'Test',
      'atom:link': 'http://example.com',
      description: 'Test description',
    }
    const expected = new Set(['atom'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should detect multiple namespaces', () => {
    const value = {
      title: 'Test',
      'atom:link': 'http://example.com',
      'dc:creator': 'John Doe',
      'itunes:author': 'Jane Doe',
      description: 'Test description',
    }
    const expected = new Set(['atom', 'dc', 'itunes'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should detect namespaces with various formats', () => {
    const value = {
      'namespace:key': 'value',
      'ns2:another': 'value',
      'x:short': 'value',
      'very-long-namespace:key': 'value',
    }
    const expected = new Set(['namespace', 'ns2', 'x', 'very-long-namespace'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle keys without namespaces', () => {
    const value = {
      title: 'Test',
      description: 'Description',
      link: 'http://example.com',
    }
    const expected = new Set<string>()

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}
    const expected = new Set<string>()

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle keys with multiple colons', () => {
    const value = {
      'ns:key:subkey': 'value',
      'prefix:middle:suffix': 'value',
    }
    const expected = new Set(['ns', 'prefix'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle keys with colon at the end', () => {
    const value = {
      'trailing:': 'value',
      'normal:key': 'value',
    }
    const expected = new Set(['trailing', 'normal'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle keys with colon but no namespace', () => {
    const value = {
      ':leadingColon': 'value',
      'normal:key': 'value',
    }
    const expected = new Set(['normal'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle numeric keys with namespaces', () => {
    const value = {
      'ns:123': 'value',
      'prefix:456': 'value',
      '789': 'no namespace',
    }
    const expected = new Set(['ns', 'prefix'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle special characters in namespace', () => {
    const value = {
      'my-namespace:key': 'value',
      'my_namespace:key': 'value',
      'my.namespace:key': 'value',
      'MY-NAMESPACE:key': 'value',
    }
    const expected = new Set(['my-namespace', 'my_namespace', 'my.namespace', 'MY-NAMESPACE'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should deduplicate same namespaces', () => {
    const value = {
      'atom:link': 'http://example.com',
      'atom:author': 'John Doe',
      'atom:title': 'Test',
      'dc:creator': 'Jane Doe',
      'dc:date': '2023-01-01',
    }
    const expected = new Set(['atom', 'dc'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle mixed content with and without namespaces', () => {
    const value = {
      title: 'Regular Title',
      'atom:link': { '@href': 'http://example.com', '@rel': 'self' },
      description: 'Regular description',
      'itunes:author': 'Podcast Author',
      'itunes:category': { '@text': 'Technology' },
      pubDate: 'Mon, 15 Mar 2023 12:00:00 GMT',
      'dc:creator': 'Creator Name',
    }
    const expected = new Set(['atom', 'itunes', 'dc'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle real-world RSS/Atom namespace examples', () => {
    const value = {
      'atom:link': 'http://example.com',
      'content:encoded': '<p>HTML content</p>',
      'dc:creator': 'John Doe',
      'georss:point': '45.256 -71.92',
      'itunes:author': 'Podcast Author',
      'media:content': { '@url': 'http://example.com/media.jpg' },
      'podcast:transcript': { '@url': 'http://example.com/transcript.json' },
      'slash:comments': '10',
      'sy:updatefrequency': '1',
      'thr:total': '5',
    }
    const expected = new Set([
      'atom',
      'content',
      'dc',
      'georss',
      'itunes',
      'media',
      'podcast',
      'slash',
      'sy',
      'thr',
    ])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test')
    const value = {
      'atom:link': 'http://example.com',
      [sym]: 'symbol value',
      'dc:creator': 'John Doe',
    }
    const expected = new Set(['atom', 'dc'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle objects with numeric string keys', () => {
    const value = {
      '0': 'numeric key',
      '1:2': 'looks like namespace',
      'atom:link': 'http://example.com',
    }
    const expected = new Set(['1', 'atom'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle edge case with only colon', () => {
    const value = {
      ':': 'just colon',
      'a:b': 'normal namespace',
    }
    const expected = new Set(['a'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle very long namespace names', () => {
    const value = {
      'this-is-a-very-long-namespace-name:key': 'value',
      'short:key': 'value',
    }
    const expected = new Set(['this-is-a-very-long-namespace-name', 'short'])

    expect(detectNamespaces(value)).toEqual(expected)
  })

  it('should handle Unicode characters in namespaces', () => {
    const value = {
      'café:item': 'coffee',
      'naïve:approach': 'test',
      'normal:key': 'value',
    }
    const expected = new Set(['café', 'naïve', 'normal'])

    expect(detectNamespaces(value)).toEqual(expected)
  })
})

describe('generateNamespaceAttrs', () => {
  it('should generate namespace attributes for all known namespaces when present', () => {
    const value = {
      title: 'Comprehensive Feed',
      'atom:link': 'http://example.com/feed.xml',
      'content:encoded': '<p>HTML content</p>',
      'dc:creator': 'John Doe',
      'georss:point': '45.256 -71.92',
      'itunes:author': 'Podcast Author',
      'media:content': { '@url': 'http://example.com/media.jpg' },
      'podcast:transcript': { '@url': 'http://example.com/transcript.json' },
      'slash:comments': '10',
      'sy:updatePeriod': 'hourly',
      'thr:total': '5',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      '@xmlns:georss': 'http://www.georss.org/georss/',
      '@xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
      '@xmlns:podcast': 'https://podcastindex.org/namespace/1.0',
      '@xmlns:slash': 'http://purl.org/rss/1.0/modules/slash/',
      '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      '@xmlns:thr': 'http://purl.org/syndication/thread/1.0',
    }

    expect(generateNamespaceAttrs(value)).toEqual(expected)
  })

  it('should generate namespace attributes for single known namespace', () => {
    const value = {
      title: 'Example Feed',
      'atom:link': 'http://example.com/feed.xml',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    }

    expect(generateNamespaceAttrs(value)).toEqual(expected)
  })

  it('should ignore unknown namespaces and only include known ones', () => {
    const value = {
      title: 'Mixed Feed',
      'atom:link': 'http://example.com/feed.xml',
      'unknown:namespace': 'ignored value',
      'dc:creator': 'John Doe',
      'custom:property': 'also ignored',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    }

    expect(generateNamespaceAttrs(value)).toEqual(expected)
  })

  it('should handle properties with multiple colons correctly', () => {
    const value = {
      title: 'Example Feed',
      'atom:link:href': 'http://example.com/feed.xml',
      'dc:creator:name': 'John Doe',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    }

    expect(generateNamespaceAttrs(value)).toEqual(expected)
  })

  it('should handle properties with colon at the end', () => {
    const value = {
      title: 'Example Feed',
      'atom:': 'trailing colon',
      'dc:creator': 'John Doe',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    }

    expect(generateNamespaceAttrs(value)).toEqual(expected)
  })

  it('should ignore properties with colon at the beginning', () => {
    const value = {
      title: 'Example Feed',
      ':leadingColon': 'ignored',
      'atom:link': 'http://example.com/feed.xml',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    }

    expect(generateNamespaceAttrs(value)).toEqual(expected)
  })

  it('should handle duplicate namespace detection correctly', () => {
    const value = {
      'atom:link': 'http://example.com/feed.xml',
      'atom:author': 'John Doe',
      'atom:title': 'Example Title',
      'dc:creator': 'Jane Smith',
      'dc:date': '2023-01-01',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    }

    expect(generateNamespaceAttrs(value)).toEqual(expected)
  })

  it('should return undefined when no namespaced properties are present', () => {
    const value = {
      title: 'Example Title',
      description: 'Description without namespaces',
      link: 'http://example.com',
      author: 'John Doe',
    }

    expect(generateNamespaceAttrs(value)).toBeUndefined()
  })

  it('should return undefined when object has namespaces not in known URLs', () => {
    const value = {
      title: 'Example Title',
      'unknown:namespace': 'some value',
      'custom:property': 'another value',
    }

    expect(generateNamespaceAttrs(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    expect(generateNamespaceAttrs({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(generateNamespaceAttrs(null)).toBeUndefined()
    expect(generateNamespaceAttrs(undefined)).toBeUndefined()
    expect(generateNamespaceAttrs('string')).toBeUndefined()
    expect(generateNamespaceAttrs(42)).toBeUndefined()
    expect(generateNamespaceAttrs(true)).toBeUndefined()
    expect(generateNamespaceAttrs([])).toBeUndefined()
    expect(generateNamespaceAttrs(() => {})).toBeUndefined()
  })
})
