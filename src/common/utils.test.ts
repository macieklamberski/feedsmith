import { describe, expect, it } from 'bun:test'
import { type XMLBuilder, XMLParser } from 'fast-xml-parser'
import { namespacePrefixes, namespaceUris } from './config.js'
import type { ParseExactUtil } from './types.js'
import {
  createNamespaceNormalizator,
  detectNamespaces,
  generateArrayOrSingular,
  generateBoolean,
  generateCdataString,
  generateCsvOf,
  generateNamespaceAttrs,
  generateNumber,
  generatePlainString,
  generateRdfResource,
  generateRfc822Date,
  generateRfc3339Date,
  generateSingularOrArray,
  generateXml,
  generateXmlStylesheet,
  generateYesNoBoolean,
  hasEntities,
  isNonEmptyString,
  isNonEmptyStringOrNumber,
  isObject,
  isPresent,
  limitArray,
  parseArray,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseDate,
  parseJsonObject,
  parseNumber,
  parseSingular,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveRdfResourceOrText,
  retrieveText,
  stripCdata,
  trimArray,
  trimObject,
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
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
    expect(isObject({ a: null, b: undefined })).toBe(true)
    expect(isObject({ toString: () => 'custom' })).toBe(true)
  })

  it('should return false for arrays', () => {
    expect(isObject([])).toBe(false)
    expect(isObject([1, 2, 3])).toBe(false)
    expect(isObject(new Array(5))).toBe(false)
  })

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isObject(undefined)).toBe(false)
  })

  it('should return false for primitive types', () => {
    expect(isObject(42)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(Symbol('sym'))).toBe(false)
    expect(isObject(BigInt(123))).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isObject(() => {})).toBe(false)
    // biome-ignore lint/complexity/useArrowFunction: It's for testing purposes.
    expect(isObject(function () {})).toBe(false)
    expect(isObject(Math.sin)).toBe(false)
  })

  it('should return false for objects with custom prototypes', () => {
    class CustomClass {}

    expect(isObject(new CustomClass())).toBe(false)
  })

  it('should return false for built-in objects', () => {
    expect(isObject(new Date())).toBe(false)
    expect(isObject(new Error())).toBe(false)
    expect(isObject(new Map())).toBe(false)
    expect(isObject(new Set())).toBe(false)
    expect(isObject(new WeakMap())).toBe(false)
    expect(isObject(new WeakSet())).toBe(false)
    // biome-ignore lint/complexity/useRegexLiterals: It's for testing purposes.
    expect(isObject(new RegExp('.'))).toBe(false)
    expect(isObject(new ArrayBuffer(10))).toBe(false)
  })
})

describe('isNonEmptyString', () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true)
    expect(isNonEmptyString('0')).toBe(true)
    expect(isNonEmptyString('undefined')).toBe(true)
    expect(isNonEmptyString('null')).toBe(true)
  })

  it('should handle edge cases', () => {
    const stringObject = new String('hello')

    expect(isNonEmptyString(stringObject)).toBe(false)
  })

  it('should return false for empty strings', () => {
    expect(isNonEmptyString('')).toBe(false)
    expect(isNonEmptyString(' ')).toBe(false)
  })

  it('should return false for number', () => {
    expect(isNonEmptyString(2)).toBe(false)
  })

  it('should return false for arrays', () => {
    expect(isNonEmptyString([])).toBe(false)
    expect(isNonEmptyString([1, 2, 3])).toBe(false)
    expect(isNonEmptyString(['hello'])).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isNonEmptyString({})).toBe(false)
    expect(isNonEmptyString({ key: 'value' })).toBe(false)
    expect(isNonEmptyString(new Date())).toBe(false)
  })

  it('should return false for null and undefined', () => {
    expect(isNonEmptyString(null)).toBe(false)
    expect(isNonEmptyString(undefined)).toBe(false)
  })

  it('should return false for booleans', () => {
    expect(isNonEmptyString(true)).toBe(false)
    expect(isNonEmptyString(false)).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isNonEmptyString(() => {})).toBe(false)
    // biome-ignore lint/complexity/useArrowFunction: It's for testing purposes.
    expect(isNonEmptyString(function () {})).toBe(false)
  })

  it('should return false for symbols', () => {
    expect(isNonEmptyString(Symbol('test'))).toBe(false)
  })

  it('should return false for BigInt', () => {
    expect(isNonEmptyString(BigInt(123))).toBe(false)
  })
})

describe('isNonEmptyStringOrNumber', () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyStringOrNumber('hello')).toBe(true)
    expect(isNonEmptyStringOrNumber('0')).toBe(true)
    expect(isNonEmptyStringOrNumber('undefined')).toBe(true)
    expect(isNonEmptyStringOrNumber('null')).toBe(true)
  })

  it('should return false for empty strings', () => {
    expect(isNonEmptyStringOrNumber('')).toBe(false)
    expect(isNonEmptyStringOrNumber(' ')).toBe(false)
  })

  it('should return true for numbers (including zero and negative numbers)', () => {
    expect(isNonEmptyStringOrNumber(42)).toBe(true)
    expect(isNonEmptyStringOrNumber(0)).toBe(true)
    expect(isNonEmptyStringOrNumber(-10)).toBe(true)
    expect(isNonEmptyStringOrNumber(3.14)).toBe(true)
    expect(isNonEmptyStringOrNumber(Number.POSITIVE_INFINITY)).toBe(true)
    expect(isNonEmptyStringOrNumber(Number.NaN)).toBe(true)
  })

  it('should handle edge cases', () => {
    const stringObject = new String('hello')
    const numberObject = new Number(42)

    expect(isNonEmptyStringOrNumber(stringObject)).toBe(false)
    expect(isNonEmptyStringOrNumber(numberObject)).toBe(false)
  })

  it('should return false for arrays', () => {
    expect(isNonEmptyStringOrNumber([])).toBe(false)
    expect(isNonEmptyStringOrNumber([1, 2, 3])).toBe(false)
    expect(isNonEmptyStringOrNumber(['hello'])).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isNonEmptyStringOrNumber({})).toBe(false)
    expect(isNonEmptyStringOrNumber({ key: 'value' })).toBe(false)
    expect(isNonEmptyStringOrNumber(new Date())).toBe(false)
  })

  it('should return false for null and undefined', () => {
    expect(isNonEmptyStringOrNumber(null)).toBe(false)
    expect(isNonEmptyStringOrNumber(undefined)).toBe(false)
  })

  it('should return false for booleans', () => {
    expect(isNonEmptyStringOrNumber(true)).toBe(false)
    expect(isNonEmptyStringOrNumber(false)).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isNonEmptyStringOrNumber(() => {})).toBe(false)
    // biome-ignore lint/complexity/useArrowFunction: It's for testing purposes.
    expect(isNonEmptyStringOrNumber(function () {})).toBe(false)
  })

  it('should return false for symbols', () => {
    expect(isNonEmptyStringOrNumber(Symbol('test'))).toBe(false)
  })

  it('should return false for BigInt', () => {
    expect(isNonEmptyStringOrNumber(BigInt(123))).toBe(false)
  })
})

describe('retrieveText', () => {
  it('should extract #text property when present', () => {
    const value = { '#text': 'Hello world' }

    expect(retrieveText(value)).toBe('Hello world')
  })

  it('should return the original value when #text property is not present', () => {
    const value = { title: 'Example Title' }

    expect(retrieveText(value)).toEqual(value)
  })
  it('should return #text property even if it has falsy value (except null/undefined)', () => {
    expect(retrieveText({ '#text': '' })).toBe('')
    expect(retrieveText({ '#text': 0 })).toEqual(0)
    expect(retrieveText({ '#text': false })).toBe(false)
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

    expect(retrieveText(value)).toBe('Text only')
  })

  it('should handle object with #text property among others', () => {
    const value = { '#text': 'Main text', title: 'Title', count: 42 }

    expect(retrieveText(value)).toBe('Main text')
  })

  it('should return primitive values as is', () => {
    expect(retrieveText('string value')).toBe('string value')
    expect(retrieveText(42)).toEqual(42)
    expect(retrieveText(true)).toBe(true)
    expect(retrieveText(false)).toBe(false)
  })

  it('should handle null and undefined correctly', () => {
    expect(retrieveText(null)).toBeNull()
    expect(retrieveText(undefined)).toBeUndefined()
  })
})

describe('retrieveRdfResourceOrText', () => {
  describe('with parseString', () => {
    it('should parse direct string value', () => {
      const value = 'https://creativecommons.org/licenses/by/4.0/'
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should extract value from @rdf:resource attribute', () => {
      const value = {
        '@rdf:resource': 'https://creativecommons.org/licenses/by/4.0/',
      }
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should extract value from #text property', () => {
      const value = {
        '#text': 'https://creativecommons.org/licenses/by/4.0/',
      }
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should handle HTML entities in @rdf:resource', () => {
      const value = {
        '@rdf:resource': 'https://example.com?foo=bar&amp;baz=qux',
      }
      const expected = 'https://example.com?foo=bar&baz=qux'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should handle HTML entities in #text', () => {
      const value = {
        '#text': 'https://example.com?foo=bar&amp;baz=qux',
      }
      const expected = 'https://example.com?foo=bar&baz=qux'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should handle CDATA sections in @rdf:resource', () => {
      const value = {
        '@rdf:resource': '<![CDATA[https://creativecommons.org/licenses/by/4.0/]]>',
      }
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should handle CDATA sections in #text', () => {
      const value = {
        '#text': '<![CDATA[https://creativecommons.org/licenses/by/4.0/]]>',
      }
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should prefer @rdf:resource over #text when both present', () => {
      const value = {
        '@rdf:resource': 'https://creativecommons.org/licenses/by/4.0/',
        '#text': 'https://example.com/other-license',
      }
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should fall back to #text when @rdf:resource is empty', () => {
      const value = {
        '@rdf:resource': '',
        '#text': 'https://creativecommons.org/licenses/by/4.0/',
      }
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should fall back to #text when @rdf:resource is whitespace-only', () => {
      const value = {
        '@rdf:resource': '   ',
        '#text': 'https://creativecommons.org/licenses/by/4.0/',
      }
      const expected = 'https://creativecommons.org/licenses/by/4.0/'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })

    it('should return undefined for empty string', () => {
      expect(retrieveRdfResourceOrText('', parseString)).toBeUndefined()
    })

    it('should return undefined for whitespace-only string', () => {
      expect(retrieveRdfResourceOrText('   ', parseString)).toBeUndefined()
    })

    it('should return undefined for null', () => {
      expect(retrieveRdfResourceOrText(null, parseString)).toBeUndefined()
    })

    it('should return undefined for undefined', () => {
      expect(retrieveRdfResourceOrText(undefined, parseString)).toBeUndefined()
    })

    it('should return undefined for empty object', () => {
      expect(retrieveRdfResourceOrText({}, parseString)).toBeUndefined()
    })

    it('should return undefined when both @rdf:resource and #text are empty', () => {
      const value = {
        '@rdf:resource': '',
        '#text': '',
      }

      expect(retrieveRdfResourceOrText(value, parseString)).toBeUndefined()
    })

    it('should handle object without @rdf:resource or #text', () => {
      const value = {
        otherProperty: 'some value',
      }

      expect(retrieveRdfResourceOrText(value, parseString)).toBeUndefined()
    })

    it('should trim whitespace from values', () => {
      const value = {
        '@rdf:resource': '  https://example.com/license  ',
      }
      const expected = 'https://example.com/license'

      expect(retrieveRdfResourceOrText(value, parseString)).toBe(expected)
    })
  })

  describe('with parseNumber', () => {
    it('should parse number from @rdf:resource', () => {
      const value = {
        '@rdf:resource': '42',
      }

      expect(retrieveRdfResourceOrText(value, parseNumber)).toBe(42)
    })

    it('should parse number from #text', () => {
      const value = {
        '#text': '123.45',
      }

      expect(retrieveRdfResourceOrText(value, parseNumber)).toBe(123.45)
    })

    it('should return undefined for non-numeric @rdf:resource', () => {
      const value = {
        '@rdf:resource': 'not a number',
      }

      expect(retrieveRdfResourceOrText(value, parseNumber)).toBeUndefined()
    })

    it('should prefer @rdf:resource over #text for numbers', () => {
      const value = {
        '@rdf:resource': '42',
        '#text': '100',
      }

      expect(retrieveRdfResourceOrText(value, parseNumber)).toBe(42)
    })
  })

  describe('with custom parse function', () => {
    it('should apply custom parse logic', () => {
      const customParse = (value: unknown): string | undefined => {
        const str = parseString(value)
        return str ? str.toUpperCase() : undefined
      }

      const value = {
        '@rdf:resource': 'hello world',
      }

      expect(retrieveRdfResourceOrText(value, customParse)).toBe('HELLO WORLD')
    })

    it('should handle parse function returning undefined', () => {
      const alwaysUndefined = (): undefined => undefined

      const value = {
        '@rdf:resource': 'test',
        '#text': 'fallback',
      }

      expect(retrieveRdfResourceOrText(value, alwaysUndefined)).toBeUndefined()
    })
  })
})

describe('trimObject', () => {
  it('should remove nullish properties from objects', () => {
    const value = { a: 1, b: undefined, c: 'string', d: undefined, e: null, f: false, g: 0, h: '' }
    const expected = { a: 1, c: 'string', f: false, g: 0, h: '' }

    expect(trimObject(value)).toEqual(expected)
  })

  it('should return the same object when no properties are nullish', () => {
    const value = { a: 1, b: 'string', c: false, d: [], e: {} }

    expect(trimObject(value)).toEqual(value)
  })

  it('should preserve falsy non-undefined values', () => {
    const value = { a: 0, b: '', c: false, d: Number.NaN }

    expect(trimObject(value)).toEqual(value)
  })

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test')
    const value = { a: 1, b: undefined, [sym]: 'symbol value' }
    const expected = { a: 1 }

    // Symbol keys are not enumerable with for..in, so they won't be included.
    expect(trimObject(value)).toEqual(expected)
  })

  it('should handle complex nested objects', () => {
    const value = {
      a: { nested: 'value', undef: undefined },
      b: undefined,
      c: [1, undefined, 3],
    }
    const expected = {
      a: { nested: 'value', undef: undefined },
      c: [1, undefined, 3],
    }

    // The function only removes top-level undefined properties, not those in nested objects.
    expect(trimObject(value)).toEqual(expected)
  })

  it('should handle object with getters', () => {
    const value = {
      get a() {
        return 1
      },
      get b() {
        return undefined
      },
    }
    const expected = { a: 1 }

    expect(trimObject(value)).toEqual(expected)
  })

  it('should return undefined object when all properties are nullish', () => {
    const value = { a: undefined, b: undefined, c: null }

    expect(trimObject(value)).toBeUndefined()
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
    const value = [0, '', false, null, undefined, Number.NaN]
    const expected = [0, '', false, Number.NaN]

    expect(trimArray(value)).toEqual(expected)
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

      expect(trimArray(value, parseString)).toEqual(expected)
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
      const extractFirstItem = (obj: { items: Array<number> }) => {
        return obj.items && obj.items.length > 0 ? obj.items[0] : null
      }

      expect(trimArray(value, extractFirstItem)).toEqual(expected)
    })
  })
})

describe('stripCdata', () => {
  it('should return string without CDATA markers when present', () => {
    expect(stripCdata('<![CDATA[content]]>')).toBe('content')
    expect(stripCdata('prefix<![CDATA[content]]>suffix')).toBe('prefixcontentsuffix')
    expect(stripCdata('<![CDATA[]]>')).toBe('')
  })

  it('should handle multiple CDATA sections in a single string', () => {
    expect(stripCdata('<![CDATA[first]]>middle<![CDATA[second]]>')).toBe('firstmiddlesecond')
    expect(stripCdata('start<![CDATA[one]]>between<![CDATA[two]]>end')).toEqual(
      'startonebetweentwoend',
    )
    expect(stripCdata('<![CDATA[a]]><![CDATA[b]]><![CDATA[c]]>')).toBe('abc')
  })

  it('should return the original string when no CDATA markers are present', () => {
    expect(stripCdata('regular text')).toBe('regular text')
    expect(stripCdata('')).toBe('')
    expect(stripCdata('text with <tags> but no CDATA')).toBe('text with <tags> but no CDATA')
  })

  it('should handle CDATA with special XML characters', () => {
    expect(stripCdata('<![CDATA[<div>HTML content</div>]]>')).toBe('<div>HTML content</div>')
    expect(stripCdata('<![CDATA[&lt;p&gt;encoded entities&lt;/p&gt;]]>')).toEqual(
      '&lt;p&gt;encoded entities&lt;/p&gt;',
    )
    expect(stripCdata('<![CDATA[5 < 10 && 10 > 5]]>')).toBe('5 < 10 && 10 > 5')
  })

  it('should handle CDATA with newlines and whitespace', () => {
    expect(stripCdata('<![CDATA[\n  multiline\n  content\n]]>')).toEqual(
      '\n  multiline\n  content\n',
    )
    expect(stripCdata('<![CDATA[   space   ]]>')).toBe('   space   ')
    expect(stripCdata('  <![CDATA[trimming]]>  ')).toBe('  trimming  ')
  })

  it('should handle malformed or partial CDATA properly', () => {
    expect(stripCdata('Incomplete <![CDATA[content')).toBe('Incomplete <![CDATA[content')
    expect(stripCdata('Missing end content]]>')).toBe('Missing end content]]>')
    expect(stripCdata('<![CDATA[nested <![CDATA[content]]>]]>')).toEqual(
      'nested <![CDATA[content]]>',
    )
  })

  it('should handle case-sensitivity properly', () => {
    expect(stripCdata('<![cdata[lowercase]]>')).toBe('<![cdata[lowercase]]>')
    expect(stripCdata('<![CDATA[correct case]]>')).toBe('correct case')
  })

  it('should handle empty values correctly', () => {
    expect(stripCdata('')).toBe('')
    expect(stripCdata('   ')).toBe('   ')
  })

  it('should return the same value for non-string inputs', () => {
    expect(stripCdata(null)).toBeNull()
    expect(stripCdata(undefined)).toBeUndefined()
    expect(stripCdata(123)).toEqual(123)
    expect(stripCdata(true)).toBe(true)
    expect(stripCdata(false)).toBe(false)
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
  it('should handle non-empty string', () => {
    const value = 'javascript'

    expect(parseString(value)).toEqual(value)
  })

  it('Should handle entities #1', () => {
    // Single-pass decode of double-escaped named entities like &amp;amp; to &amp;.
    const value =
      'Testing &lt;b&gt;bold text&lt;/b&gt; and &lt;i&gt;italic text&lt;/i&gt; with &amp;amp; ampersand, &amp;quot; quotes, &amp;apos; apostrophe and &amp;nbsp; non-breaking space.'
    const expected = `Testing <b>bold text</b> and <i>italic text</i> with &amp; ampersand, &quot; quotes, &apos; apostrophe and &nbsp; non-breaking space.`
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #2', () => {
    // Decode named HTML entities inside CDATA sections.
    const value =
      '<![CDATA[Testing <b>bold text</b> and <i>italic text</i> with &amp; ampersand, &quot; quotes, &apos; apostrophe and &nbsp; non-breaking space.]]>'
    const expected = `Testing <b>bold text</b> and <i>italic text</i> with & ampersand, " quotes, ' apostrophe and   non-breaking space.`
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #3', () => {
    // Single-pass decode of double-escaped special char entities like &amp;lt; to &lt;.
    const value =
      'Special chars: &amp;lt; &amp;gt; &amp;euro; € &amp;copy; © &amp;reg; ® &amp;pound; £ &amp;yen; ¥'
    const expected = 'Special chars: &lt; &gt; &euro; € &copy; © &reg; ® &pound; £ &yen; ¥'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #4', () => {
    // Decode special char entities inside CDATA sections.
    const value = '<![CDATA[Special chars: &lt; &gt; &euro; € &copy; © &reg; ® &pound; £ &yen; ¥]]>'
    const expected = 'Special chars: < > € € © © ® ® £ £ ¥ ¥'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #5', () => {
    // Single-pass decode of double-escaped numeric entities like &amp;#169; to &#169;.
    const value =
      'Numeric entities: &amp;#169; &#169; &amp;#8364; &#8364; &amp;#8482; &#8482; &amp;#x2122; &#x2122;'
    const expected = 'Numeric entities: &#169; © &#8364; € &#8482; ™ &#x2122; ™'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #6', () => {
    // Decode numeric entities inside CDATA sections.
    const value = '<![CDATA[Numeric entities: &#169; &#8364; &#8482; &#x2122;]]>'
    const expected = 'Numeric entities: © € ™ ™'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #7', () => {
    // Single-pass decode of complex HTML with mixed double-escaped entities.
    const value =
      '&lt;p&gt;HTML mixed with entities: &amp;copy; ©, &amp;reg; ®, &amp;#8364; € and &lt;a href=&quot;https://example.com?param1=value1&amp;param2=value2&quot;&gt;URL with ampersand&lt;/a&gt;&lt;/p&gt;'
    const expected =
      '<p>HTML mixed with entities: &copy; ©, &reg; ®, &#8364; € and <a href="https://example.com?param1=value1&param2=value2">URL with ampersand</a></p>'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #8', () => {
    // Decode complex HTML with mixed entities inside CDATA sections.
    const value =
      '<![CDATA[<p>HTML mixed with entities: &copy; ©, &reg; ®, &#8364; € and <a href="https://example.com?param1=value1&param2=value2">URL with ampersand</a></p>]]>'
    const expected =
      '<p>HTML mixed with entities: © ©, ® ®, € € and <a href="https://example.com?param1=value1¶m2=value2">URL with ampersand</a></p>'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #9', () => {
    // Preserve brackets and code syntax inside CDATA sections.
    const value =
      '<![CDATA[Testing CDATA with brackets: [This is in brackets] and <code>if (x > y) { doSomething(); }</code>]]>'
    const expected =
      'Testing CDATA with brackets: [This is in brackets] and <code>if (x > y) { doSomething(); }</code>'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #10', () => {
    // Decode escaped script tag with entities in non-CDATA content.
    const value =
      '&lt;script&gt;function test() { if (x &lt; y &amp;&amp; z &gt; 0) { alert(&quot;Hello!&quot;); } }&lt;/script&gt;'
    const expected = '<script>function test() { if (x < y && z > 0) { alert("Hello!"); } }</script>'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle entities #11', () => {
    // Preserve script tag content inside CDATA sections.
    const value =
      '<![CDATA[<script>function test() { if (x < y && z > 0) { alert("Hello!"); } }</script>]]>'
    const expected = '<script>function test() { if (x < y && z > 0) { alert("Hello!"); } }</script>'
    expect(parseString(value)).toBe(expected)
  })

  it('Should handle empty string in CDATA', () => {
    const value = '<![CDATA[        ]]>'
    expect(parseString(value)).toBeUndefined()
  })

  it('Should trim string in CDATA', () => {
    const value = '<![CDATA[    test    ]]>'
    expect(parseString(value)).toBe('test')
  })

  it('should return number', () => {
    const value = 420

    expect(parseString(value)).toBe('420')
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseString(value)).toBeUndefined()
  })

  it('should handle only whitespaces string', () => {
    const value = '     '

    expect(parseString(value)).toBeUndefined()
  })

  it('should handle array', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseString(value)).toBeUndefined()
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseString(value)).toBeUndefined()
  })

  it('should return boolean', () => {
    const value = true

    expect(parseString(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseString(value)).toBeUndefined()
  })

  it('should return undefined for undefined input', () => {
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

  it('should handle string with only whitespace', () => {
    const value = '   '

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

  it('should return undefined for undefined input', () => {
    const value = undefined

    expect(parseNumber(value)).toBeUndefined()
  })
})

describe('parseBoolean', () => {
  it('should return boolean true', () => {
    const value = true

    expect(parseBoolean(value)).toBe(true)
  })

  it('should return boolean false', () => {
    const value = false

    expect(parseBoolean(value)).toBe(false)
  })

  it('should handle true string', () => {
    const value = 'true'

    expect(parseBoolean(value)).toBe(true)
  })

  it('should handle false string', () => {
    const value = 'false'

    expect(parseBoolean(value)).toBe(false)
  })

  it('should handle case insensitive false string', () => {
    const value = 'FaLse'

    expect(parseBoolean(value)).toBe(false)
  })

  it('should handle values with whitespace around', () => {
    expect(parseBoolean(' true ')).toBe(true)
    expect(parseBoolean('\ttrue\t')).toBe(true)
    expect(parseBoolean('\nTRUE\n')).toBe(true)
    expect(parseBoolean(' \t\nTrUe\n\t ')).toBe(true)
    expect(parseBoolean(' false ')).toBe(false)
    expect(parseBoolean('\tfalse\t')).toBe(false)
    expect(parseBoolean('\nFALSE\n')).toBe(false)
    expect(parseBoolean(' \t\nFaLsE\n\t ')).toBe(false)
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

  it('should return undefined for undefined input', () => {
    const value = undefined

    expect(parseBoolean(value)).toBeUndefined()
  })
})

describe('parseYesNoBoolean', () => {
  it('should return boolean true', () => {
    const value = true

    expect(parseYesNoBoolean(value)).toBe(true)
  })

  it('should return boolean false', () => {
    const value = false

    expect(parseYesNoBoolean(value)).toBe(false)
  })

  it('should handle true string', () => {
    const value = 'true'

    expect(parseYesNoBoolean(value)).toBe(true)
  })

  it('should handle false string', () => {
    const value = 'false'

    expect(parseYesNoBoolean(value)).toBe(false)
  })

  it('should handle case insensitive false string', () => {
    const value = 'FaLse'

    expect(parseYesNoBoolean(value)).toBe(false)
  })

  it('should handle "yes" string as true', () => {
    const value = 'yes'

    expect(parseYesNoBoolean(value)).toBe(true)
  })

  it('should handle case insensitive "yes" string', () => {
    const value = 'YeS'

    expect(parseYesNoBoolean(value)).toBe(true)
  })

  it('should handle values with whitespace around', () => {
    expect(parseYesNoBoolean(' yes ')).toBe(true)
    expect(parseYesNoBoolean('\tyes\t')).toBe(true)
    expect(parseYesNoBoolean('\nYES\n')).toBe(true)
    expect(parseYesNoBoolean(' \t\nYeS\n\t ')).toBe(true)
    expect(parseYesNoBoolean(' true ')).toBe(true)
    expect(parseYesNoBoolean('\tfalse\t')).toBe(false)
    expect(parseYesNoBoolean(' no ')).toBe(false)
    expect(parseYesNoBoolean('\tNO\t')).toBe(false)
  })

  it('should handle "no" string as false', () => {
    const value = 'no'

    expect(parseYesNoBoolean(value)).toBe(false)
  })

  it('should handle non-"yes" strings as false', () => {
    const value = 'anything'

    expect(parseYesNoBoolean(value)).toBe(false)
  })

  it('should handle empty string as undefined', () => {
    const value = ''

    expect(parseYesNoBoolean(value)).toBeUndefined()
  })

  it('should handle string with only whitespace as undefined', () => {
    const value = '   '

    expect(parseYesNoBoolean(value)).toBeUndefined()
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

describe('parseDate', () => {
  it('should handle valid date strings', () => {
    const value = '2023-03-15T12:00:00Z'
    const expected = '2023-03-15T12:00:00Z'

    expect(parseDate(value)).toBe(expected)
  })

  it('should handle date strings with entities', () => {
    const value = '2023-03-15T12:00:00&lt;test&gt;'
    const expected = '2023-03-15T12:00:00<test>'

    expect(parseDate(value)).toBe(expected)
  })

  it('should handle date strings wrapped in CDATA', () => {
    const value = '<![CDATA[2023-03-15T12:00:00Z]]>'
    const expected = '2023-03-15T12:00:00Z'

    expect(parseDate(value)).toBe(expected)
  })

  it('should handle number input by converting to string', () => {
    const value = 1679140800000

    expect(parseDate(value)).toBe('1679140800000')
  })

  it('should handle string with whitespace', () => {
    const value = '  2023-03-15T12:00:00Z  '
    const expected = '2023-03-15T12:00:00Z'

    expect(parseDate(value)).toBe(expected)
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseDate(value)).toBeUndefined()
  })

  it('should handle string with only whitespace', () => {
    const value = '   '

    expect(parseDate(value)).toBeUndefined()
  })

  it('should return undefined for arrays', () => {
    const value = ['2023-03-15T12:00:00Z']

    expect(parseDate(value)).toBeUndefined()
  })

  it('should return undefined for objects', () => {
    const value = { date: '2023-03-15T12:00:00Z' }

    expect(parseDate(value)).toBeUndefined()
  })

  it('should return undefined for boolean', () => {
    const value = true

    expect(parseDate(value)).toBeUndefined()
  })

  it('should return undefined for null', () => {
    const value = null

    expect(parseDate(value)).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    const value = undefined

    expect(parseDate(value)).toBeUndefined()
  })
})

describe('generateBoolean', () => {
  it('should return true for boolean true', () => {
    const value = true

    expect(generateBoolean(value)).toBe(true)
  })

  it('should return false for boolean false', () => {
    const value = false

    expect(generateBoolean(value)).toBe(false)
  })

  it('should return undefined for undefined', () => {
    expect(generateBoolean(undefined)).toBeUndefined()
  })
})

describe('generateYesNoBoolean', () => {
  it('should return "yes" for boolean true', () => {
    const value = true

    expect(generateYesNoBoolean(value)).toBe('yes')
  })

  it('should return "no" for boolean false', () => {
    const value = false

    expect(generateYesNoBoolean(value)).toBe('no')
  })

  it('should return undefined for undefined', () => {
    expect(generateYesNoBoolean(undefined)).toBeUndefined()
  })
})

describe('parseSingular', () => {
  it('should return the first element of an array', () => {
    expect(parseSingular([1, 2, 3])).toEqual(1)
    expect(parseSingular(['a', 'b', 'c'])).toBe('a')
    expect(parseSingular([{ key: 'value' }, { another: 'object' }])).toEqual({ key: 'value' })
  })

  it('should return the value itself when not an array', () => {
    expect(parseSingular(42)).toEqual(42)
    expect(parseSingular('string')).toBe('string')
    expect(parseSingular(true)).toBe(true)
    expect(parseSingular({ key: 'value' })).toEqual({ key: 'value' })
  })

  it('should handle empty arrays', () => {
    expect(parseSingular([])).toBeUndefined()
  })

  it('should handle arrays with undefined or null first elements', () => {
    expect(parseSingular([undefined, 1, 2])).toBeUndefined()
    expect(parseSingular([null, 1, 2])).toBeNull()
  })

  it('should handle array-like objects correctly', () => {
    const arrayLike = { 0: 'first', 1: 'second', length: 2 }

    expect(parseSingular(arrayLike)).toEqual(arrayLike)
  })

  it('should preserve the type of the input', () => {
    const numberResult = parseSingular<number>([42])
    const stringResult = parseSingular<string>('test')
    const objectResult = parseSingular<{ id: number }>({ id: 1 })

    expect(numberResult).toBeTypeOf('number')
    expect(stringResult).toBeTypeOf('string')
    expect(objectResult).toBeTypeOf('object')
  })

  it('should handle null and undefined', () => {
    expect(parseSingular(null)).toBeNull()
    expect(parseSingular(undefined)).toBeUndefined()
  })
})

describe('parseSingularOf', () => {
  it('should apply parse function to the first element of an array', () => {
    expect(parseSingularOf([1, 2, 3], parseString)).toBe('1')
    expect(parseSingularOf(['a', 'b', 'c'], parseString)).toBe('a')
    expect(parseSingularOf([42, 'text'], parseString)).toBe('42')
  })

  it('should apply parse function to non-array values', () => {
    expect(parseSingularOf(42, parseString)).toBe('42')
    expect(parseSingularOf('123', parseNumber)).toEqual(123)
    expect(parseSingularOf('true', parseBoolean)).toBe(true)
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

    expect(numberResult).toBeTypeOf('number')
    expect(stringResult).toBeTypeOf('string')
    expect(booleanResult).toBeTypeOf('boolean')
  })

  it('should work with custom parse functions', () => {
    const parseUpperCase: ParseExactUtil<string> = (value) => {
      return typeof value === 'string' ? value.toUpperCase() : undefined
    }

    expect(parseSingularOf('hello', parseUpperCase)).toBe('HELLO')
    expect(parseSingularOf(['hello', 'world'], parseUpperCase)).toBe('HELLO')
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
  const parser: ParseExactUtil<string> = (value) => {
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

  it('should return undefined for undefined input', () => {
    const value = undefined

    expect(parseArrayOf(value, parser)).toBeUndefined()
  })
})

describe('limitArray', () => {
  it('should return original array when limit is undefined', () => {
    const value = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4, 5]

    expect(limitArray(value, undefined)).toEqual(expected)
  })

  it('should return first N items when limit is provided', () => {
    const value = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3]

    expect(limitArray(value, 3)).toEqual(expected)
  })

  it('should return empty array when limit is 0', () => {
    const value = [1, 2, 3, 4, 5]

    expect(limitArray(value, 0)).toEqual([])
  })

  it('should return all items when limit exceeds array length', () => {
    const value = [1, 2, 3]
    const expected = [1, 2, 3]

    expect(limitArray(value, 10)).toEqual(expected)
  })

  it('should handle empty array', () => {
    const value: Array<number> = []

    expect(limitArray(value, 5)).toEqual([])
  })

  it('should handle single item array with limit 1', () => {
    const value = [1]

    expect(limitArray(value, 1)).toEqual([1])
  })

  it('should handle single item array with limit 0', () => {
    const value = [1]

    expect(limitArray(value, 0)).toEqual([])
  })

  it('should return original array when limit is negative', () => {
    const value = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4, 5]

    expect(limitArray(value, -1)).toEqual(expected)
  })

  it('should return original array when limit is large negative number', () => {
    const value = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4, 5]

    expect(limitArray(value, -10)).toEqual(expected)
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

describe('generateCsvOf', () => {
  it('should generate comma-separated string from array', () => {
    const value = ['podcast', 'technology', 'programming']
    const expected = 'podcast,technology,programming'

    expect(generateCsvOf(value)).toEqual(expected)
  })

  it('should generate comma-separated string from numbers', () => {
    const value = [1, 2, 3, 4, 5]
    const expected = '1,2,3,4,5'

    expect(generateCsvOf(value)).toEqual(expected)
  })

  it('should handle single item array', () => {
    const value = ['podcast']
    const expected = 'podcast'

    expect(generateCsvOf(value)).toEqual(expected)
  })

  it('should handle mixed types', () => {
    const value = [1, 'podcast', true, null]
    const expected = '1,podcast,true'

    expect(generateCsvOf(value)).toEqual(expected)
  })

  it('should use generate function when provided', () => {
    const value = ['  podcast  ', '  technology  ', '  programming  ']
    const expected = 'podcast,technology,programming'

    expect(generateCsvOf(value, parseString)).toEqual(expected)
  })

  it('should filter out undefined values with generate function', () => {
    const value = ['1', 'invalid', '2', 'also invalid', '3']
    const expected = '1,2,3'

    expect(generateCsvOf(value, parseNumber)).toEqual(expected)
  })

  it('should return undefined for empty array', () => {
    const value: Array<string> = []

    expect(generateCsvOf(value)).toBeUndefined()
  })

  it('should return undefined for undefined value', () => {
    const value = undefined

    expect(generateCsvOf(value)).toBeUndefined()
  })

  it('should return undefined when all values are filtered out', () => {
    const value = ['invalid', 'also invalid', 'still invalid']

    expect(generateCsvOf(value, parseNumber)).toBeUndefined()
  })

  it('should handle array with falsy values', () => {
    const value = [0, '', false]
    const expected = '0,,false'

    expect(generateCsvOf(value)).toEqual(expected)
  })
})

describe('generateXmlStylesheet', () => {
  describe('Required attributes', () => {
    it('should generate stylesheet with only required attributes', () => {
      const value = {
        type: 'text/xsl',
        href: '/styles/feed.xsl',
      }
      const expected = '<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })

    it('should handle CSS stylesheets', () => {
      const value = {
        type: 'text/css',
        href: 'https://example.com/styles.css',
      }
      const expected = '<?xml-stylesheet type="text/css" href="https://example.com/styles.css"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })
  })

  describe('Optional attributes', () => {
    it('should include title when provided', () => {
      const value = {
        type: 'text/xsl',
        href: '/styles/feed.xsl',
        title: 'Feed Stylesheet',
      }
      const expected =
        '<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl" title="Feed Stylesheet"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })

    it('should include media when provided', () => {
      const value = {
        type: 'text/css',
        href: '/styles/mobile.css',
        media: 'screen and (max-width: 768px)',
      }
      const expected =
        '<?xml-stylesheet type="text/css" href="/styles/mobile.css" media="screen and (max-width: 768px)"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })

    it('should include all provided optional attributes', () => {
      const value = {
        type: 'text/xsl',
        href: '/styles/feed.xsl',
        title: 'Pretty Feed',
        media: 'screen',
        charset: 'utf-8',
        alternate: false,
      }
      const expected =
        '<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl" title="Pretty Feed" media="screen" charset="utf-8" alternate="no"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })

    it('should skip undefined optional attributes', () => {
      const value = {
        type: 'text/css',
        href: '/styles/print.css',
        title: 'Print Styles',
        media: undefined,
        charset: undefined,
        alternate: undefined,
      }
      const expected =
        '<?xml-stylesheet type="text/css" href="/styles/print.css" title="Print Styles"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })
  })

  describe('Special characters', () => {
    it('should handle URLs with query parameters', () => {
      const value = {
        type: 'text/xsl',
        href: '/styles/feed.xsl?version=1.2&theme=dark',
      }
      const expected =
        '<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl?version=1.2&theme=dark"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })

    it('should handle titles with spaces', () => {
      const value = {
        type: 'text/css',
        href: '/styles/feed.css',
        title: 'My Custom Feed Style',
      }
      const expected =
        '<?xml-stylesheet type="text/css" href="/styles/feed.css" title="My Custom Feed Style"?>'

      expect(generateXmlStylesheet(value)).toBe(expected)
    })
  })

  describe('Edge cases', () => {
    it('should return undefined when all fields are empty strings', () => {
      const value = {
        type: '',
        href: '',
        title: '',
        media: '',
        charset: '',
      }

      expect(generateXmlStylesheet(value)).toBeUndefined()
    })

    it('should return undefined when all fields are whitespace', () => {
      const value = {
        type: '   ',
        href: '  ',
      }

      expect(generateXmlStylesheet(value)).toBeUndefined()
    })

    it('should return undefined when all fields are undefined', () => {
      const value = {
        type: undefined,
        href: undefined,
        title: undefined,
      }

      // @ts-expect-error: This is for testing purposes.
      expect(generateXmlStylesheet(value)).toBeUndefined()
    })
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

  it('should include single stylesheet when provided', () => {
    const value = 'test content'
    const options = {
      stylesheets: [{ type: 'text/xsl', href: '/styles/feed.xsl' }],
    }
    const expected =
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl"?>\n<root>test content</root>'

    expect(generateXml(mockBuilder, value, options)).toEqual(expected)
  })

  it('should include multiple stylesheets when provided', () => {
    const value = 'test content'
    const options = {
      stylesheets: [
        { type: 'text/xsl', href: '/styles/feed.xsl' },
        { type: 'text/css', href: '/styles/feed.css', media: 'screen' },
      ],
    }
    const expected =
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/styles/feed.xsl"?>\n<?xml-stylesheet type="text/css" href="/styles/feed.css" media="screen"?>\n<root>test content</root>'

    expect(generateXml(mockBuilder, value, options)).toEqual(expected)
  })

  it('should generate XML without stylesheets when array is empty', () => {
    const value = 'test content'
    const options = {
      stylesheets: [],
    }
    const expected = '<?xml version="1.0" encoding="utf-8"?>\n<root>test content</root>'

    expect(generateXml(mockBuilder, value, options)).toEqual(expected)
  })

  it('should generate XML without stylesheets when stylesheets is undefined', () => {
    const value = 'test content'
    const options = {}
    const expected = '<?xml version="1.0" encoding="utf-8"?>\n<root>test content</root>'

    expect(generateXml(mockBuilder, value, options)).toEqual(expected)
  })

  it('should generate XML without stylesheets when options parameter is undefined', () => {
    const value = 'test content'
    const expected = '<?xml version="1.0" encoding="utf-8"?>\n<root>test content</root>'

    expect(generateXml(mockBuilder, value, undefined)).toEqual(expected)
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

  it('should handle date string with milliseconds', () => {
    const value = '2023-05-17T15:02:07.123Z'
    const expected = 'Wed, 17 May 2023 15:02:07 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should handle date string without milliseconds', () => {
    const value = '2023-05-17T15:02:07Z'
    const expected = 'Wed, 17 May 2023 15:02:07 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should handle Date object with milliseconds', () => {
    const value = new Date('2023-05-17T15:02:07.123Z')
    const expected = 'Wed, 17 May 2023 15:02:07 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should handle timezone conversion to UTC', () => {
    const value = new Date('2023-05-17T15:02:07.000+02:00')
    const expected = 'Wed, 17 May 2023 13:02:07 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should handle edge case dates', () => {
    const unixEpoch = new Date('1970-01-01T00:00:00.000Z')
    const expected = 'Thu, 01 Jan 1970 00:00:00 GMT'

    expect(generateRfc822Date(unixEpoch)).toEqual(expected)
  })

  it('should handle future dates', () => {
    const futureDate = new Date('2099-12-31T23:59:59.999Z')
    const expected = 'Thu, 31 Dec 2099 23:59:59 GMT'

    expect(generateRfc822Date(futureDate)).toEqual(expected)
  })

  it('should return original string for invalid date string', () => {
    expect(generateRfc822Date('not a date')).toEqual('not a date')
    expect(generateRfc822Date('invalid date string')).toEqual('invalid date string')
    expect(generateRfc822Date('2023-13-45')).toEqual('2023-13-45')
  })

  it('should return undefined for invalid Date object', () => {
    const invalidDate = new Date('invalid')
    expect(generateRfc822Date(invalidDate)).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    expect(generateRfc822Date(undefined)).toBeUndefined()
  })

  it('should return empty string for empty string', () => {
    expect(generateRfc822Date('')).toBeUndefined()
  })
})

describe('generateRfc3339Date', () => {
  it('should format Date object to RFC3339 string', () => {
    const value = new Date('2023-03-15T12:00:00Z')
    const expected = '2023-03-15T12:00:00.000Z'

    expect(generateRfc3339Date(value)).toEqual(expected)
  })

  it('should format valid date string to RFC3339 string', () => {
    const value = '2023-03-15T12:00:00Z'
    const expected = '2023-03-15T12:00:00.000Z'

    expect(generateRfc3339Date(value)).toEqual(expected)
  })

  it('should handle date string with milliseconds', () => {
    const value = '2023-05-17T15:02:07.123Z'
    const expected = '2023-05-17T15:02:07.123Z'

    expect(generateRfc3339Date(value)).toEqual(expected)
  })

  it('should handle date string without milliseconds', () => {
    const value = '2023-05-17T15:02:07Z'
    const expected = '2023-05-17T15:02:07.000Z'

    expect(generateRfc3339Date(value)).toEqual(expected)
  })

  it('should handle Date object with milliseconds', () => {
    const value = new Date('2023-05-17T15:02:07.123Z')
    const expected = '2023-05-17T15:02:07.123Z'

    expect(generateRfc3339Date(value)).toEqual(expected)
  })

  it('should handle timezone conversion to UTC', () => {
    const value = new Date('2023-05-17T15:02:07.000+02:00')
    const expected = '2023-05-17T13:02:07.000Z'

    expect(generateRfc3339Date(value)).toEqual(expected)
  })

  it('should handle edge case dates', () => {
    const unixEpoch = new Date('1970-01-01T00:00:00.000Z')
    const expected = '1970-01-01T00:00:00.000Z'

    expect(generateRfc3339Date(unixEpoch)).toEqual(expected)
  })

  it('should handle future dates', () => {
    const futureDate = new Date('2099-12-31T23:59:59.999Z')
    const expected = '2099-12-31T23:59:59.999Z'

    expect(generateRfc3339Date(futureDate)).toEqual(expected)
  })

  it('should return original string for invalid date string', () => {
    expect(generateRfc3339Date('not a date')).toEqual('not a date')
    expect(generateRfc3339Date('invalid date string')).toEqual('invalid date string')
    expect(generateRfc3339Date('2023-13-45')).toEqual('2023-13-45')
  })

  it('should return undefined for invalid Date object', () => {
    const invalidDate = new Date('invalid')
    expect(generateRfc3339Date(invalidDate)).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    expect(generateRfc3339Date(undefined)).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    expect(generateRfc3339Date('')).toBeUndefined()
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

  it('should detect namespaces in nested RSS feed structures', () => {
    const value = {
      rss: {
        '@version': '2.0',
        channel: {
          title: 'Tech Podcast',
          'atom:link': {
            '@href': 'https://example.com/feed.xml',
            '@rel': 'self',
            '@type': 'application/rss+xml',
          },
          item: [
            {
              title: 'Understanding JavaScript',
              'dc:creator': 'John Doe',
              'itunes:duration': '45:30',
              'slash:comments': '12',
            },
            {
              title: 'React Best Practices',
              'content:encoded': '<p>In this episode...</p>',
              'georss:point': '37.7749 -122.4194',
            },
          ],
        },
      },
    }
    const expected = new Set(['atom', 'dc', 'itunes', 'slash', 'content', 'georss'])

    expect(detectNamespaces(value, true)).toEqual(expected)
  })

  it('should detect threading namespace in link attributes', () => {
    const value = {
      rss: {
        '@version': '2.0',
        channel: {
          item: {
            title: 'Blog Post with Discussion',
            link: {
              '@href': 'https://example.com/post/123',
              '@thr:count': '25',
              '@thr:updated': '2023-12-15T14:30:00Z',
            },
          },
        },
      },
    }
    const expected = new Set(['thr'])

    expect(detectNamespaces(value, true)).toEqual(expected)
  })

  it('should only detect top-level namespaces when recursive=false (default)', () => {
    const nestedValue = {
      'top:level': 'value',
      normalKey: 'no namespace',
      nested: {
        'inner:namespace': 'value',
        'another:inner': 'value',
        deepNested: {
          'deep:namespace': 'value',
        },
      },
      array: [
        {
          'array:namespace': 'value',
        },
      ],
    }
    const expected = new Set(['top'])
    expect(detectNamespaces(nestedValue)).toEqual(expected)
    expect(detectNamespaces(nestedValue, false)).toEqual(expected)
  })

  it('should detect all namespaces when recursive=true', () => {
    const nestedValue = {
      'top:level': 'value',
      normalKey: 'no namespace',
      nested: {
        'inner:namespace': 'value',
        'another:inner': 'value',
        deepNested: {
          'deep:namespace': 'value',
        },
      },
      array: [
        {
          'array:namespace': 'value',
        },
      ],
    }
    const expected = new Set(['top', 'inner', 'another', 'deep', 'array'])
    expect(detectNamespaces(nestedValue, true)).toEqual(expected)
  })

  it('should handle arrays recursively when recursive=true', () => {
    const value = {
      'top:level': 'value',
      items: [
        { 'item1:namespace': 'value' },
        { 'item2:namespace': 'value' },
        {
          'item3:namespace': 'value',
          nested: {
            'nested:namespace': 'value',
          },
        },
      ],
    }
    const expectedNonRecursive = new Set(['top'])
    const expectedRecursive = new Set(['top', 'item1', 'item2', 'item3', 'nested'])

    expect(detectNamespaces(value, false)).toEqual(expectedNonRecursive)
    expect(detectNamespaces(value, true)).toEqual(expectedRecursive)
  })

  it('should handle deeply nested objects when recursive=true', () => {
    const value = {
      'level1:ns': 'value',
      level2: {
        'level2:ns': 'value',
        level3: {
          'level3:ns': 'value',
          level4: {
            'level4:ns': 'value',
          },
        },
      },
    }
    const expectedNonRecursive = new Set(['level1'])
    const expectedRecursive = new Set(['level1', 'level2', 'level3', 'level4'])

    expect(detectNamespaces(value, false)).toEqual(expectedNonRecursive)
    expect(detectNamespaces(value, true)).toEqual(expectedRecursive)
  })

  it('should handle empty nested objects correctly with recursive parameter', () => {
    const value = {
      'top:namespace': 'value',
      empty: {},
      emptyArray: [],
      nested: {
        alsoEmpty: {},
      },
    }
    const expectedNonRecursive = new Set(['top'])
    const expectedRecursive = new Set(['top'])

    expect(detectNamespaces(value, false)).toEqual(expectedNonRecursive)
    expect(detectNamespaces(value, true)).toEqual(expectedRecursive)
  })

  it('should respect seenKeys optimization in recursive mode', () => {
    const value = {
      'duplicate:key': 'value1',
      nested1: {
        'duplicate:key': 'value2',
        'other:namespace': 'value',
      },
      nested2: {
        'duplicate:key': 'value3',
        'another:namespace': 'value',
      },
    }
    const expectedNonRecursive = new Set(['duplicate'])
    const expectedRecursive = new Set(['duplicate', 'other', 'another'])

    expect(detectNamespaces(value, false)).toEqual(expectedNonRecursive)
    expect(detectNamespaces(value, true)).toEqual(expectedRecursive)
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
      '@xmlns:georss': 'http://www.georss.org/georss',
      '@xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
      '@xmlns:podcast': 'https://podcastindex.org/namespace/1.0',
      '@xmlns:slash': 'http://purl.org/rss/1.0/modules/slash/',
      '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      '@xmlns:thr': 'http://purl.org/syndication/thread/1.0',
    }

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
  })

  it('should generate namespace attributes for single known namespace', () => {
    const value = {
      title: 'Example Feed',
      'atom:link': 'http://example.com/feed.xml',
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    }

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
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

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
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

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
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

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
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

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
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

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
  })

  it('should return undefined when no namespaced properties are present', () => {
    const value = {
      title: 'Example Title',
      description: 'Description without namespaces',
      link: 'http://example.com',
      author: 'John Doe',
    }

    expect(generateNamespaceAttrs(value, namespaceUris)).toBeUndefined()
  })

  it('should return undefined when object has namespaces not in known URLs', () => {
    const value = {
      title: 'Example Title',
      'unknown:namespace': 'some value',
      'custom:property': 'another value',
    }

    expect(generateNamespaceAttrs(value, namespaceUris)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    expect(generateNamespaceAttrs({}, namespaceUris)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateNamespaceAttrs(null, namespaceUris)).toBeUndefined()
    expect(generateNamespaceAttrs(undefined, namespaceUris)).toBeUndefined()
    expect(generateNamespaceAttrs('string', namespaceUris)).toBeUndefined()
    expect(generateNamespaceAttrs(42, namespaceUris)).toBeUndefined()
    expect(generateNamespaceAttrs(true, namespaceUris)).toBeUndefined()
    expect(generateNamespaceAttrs([], namespaceUris)).toBeUndefined()
    expect(generateNamespaceAttrs(() => {}, namespaceUris)).toBeUndefined()
  })

  it('should detect namespaces in nested structures using recursive detection', () => {
    const value = {
      title: 'Feed Title',
      'atom:link': 'http://example.com/feed.xml',
      items: [
        {
          title: 'Item 1',
          'dc:creator': 'John Doe',
          nested: {
            'itunes:duration': '30:45',
          },
        },
      ],
    }
    const expected = {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      '@xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    }

    expect(generateNamespaceAttrs(value, namespaceUris)).toEqual(expected)
  })
})

describe('generateCdataString', () => {
  it('should wrap HTML content in CDATA object', () => {
    const value1 = '<p>HTML content</p>'
    const value2 = 'Text with <strong>bold</strong> formatting'
    const value3 = 'Content with > greater than'
    const expected1 = { '#cdata': '<p>HTML content</p>' }
    const expected2 = { '#cdata': 'Text with <strong>bold</strong> formatting' }
    const expected3 = { '#cdata': 'Content with > greater than' }

    expect(generateCdataString(value1)).toEqual(expected1)
    expect(generateCdataString(value2)).toEqual(expected2)
    expect(generateCdataString(value3)).toEqual(expected3)
  })

  it('should wrap content with ampersands in CDATA object', () => {
    const value1 = 'Text with & ampersand'
    const value2 = 'Multiple & ampersands & here'
    const expected1 = { '#cdata': 'Text with & ampersand' }
    const expected2 = { '#cdata': 'Multiple & ampersands & here' }

    expect(generateCdataString(value1)).toEqual(expected1)
    expect(generateCdataString(value2)).toEqual(expected2)
  })

  it('should wrap content with CDATA end markers in CDATA object', () => {
    const value = 'Text with ]]> marker'
    const expected = { '#cdata': 'Text with ]]> marker' }

    expect(generateCdataString(value)).toEqual(expected)
  })

  it('should return simple text as string', () => {
    const value1 = 'Simple text content'
    const value2 = 'Text with numbers 123 and spaces'
    const value3 = 'Text with special chars !@#$%^*()_+-='
    const expected1 = 'Simple text content'
    const expected2 = 'Text with numbers 123 and spaces'
    const expected3 = 'Text with special chars !@#$%^*()_+-='

    expect(generateCdataString(value1)).toEqual(expected1)
    expect(generateCdataString(value2)).toEqual(expected2)
    expect(generateCdataString(value3)).toEqual(expected3)
  })

  it('should handle empty string', () => {
    const value = ''

    expect(generateCdataString(value)).toBeUndefined()
  })

  it('should handle string with only whitespace', () => {
    const value = '   '

    expect(generateCdataString(value)).toBeUndefined()
  })

  it('should handle non-string inputs', () => {
    expect(generateCdataString(undefined)).toBeUndefined()
  })
})

describe('generatePlainString', () => {
  it('should return trimmed string for simple text', () => {
    const value1 = 'Simple text content'
    const value2 = '  Text with spaces  '
    const value3 = 'Text with special chars !@#$%^*()_+-='
    const expected1 = 'Simple text content'
    const expected2 = 'Text with spaces'
    const expected3 = 'Text with special chars !@#$%^*()_+-='

    expect(generatePlainString(value1)).toEqual(expected1)
    expect(generatePlainString(value2)).toEqual(expected2)
    expect(generatePlainString(value3)).toEqual(expected3)
  })

  it('should return string even if it contains XML characters', () => {
    const value1 = '<p>HTML content</p>'
    const value2 = 'Text with & ampersand'
    const value3 = 'Content with > greater than'
    const expected1 = '<p>HTML content</p>'
    const expected2 = 'Text with & ampersand'
    const expected3 = 'Content with > greater than'

    expect(generatePlainString(value1)).toEqual(expected1)
    expect(generatePlainString(value2)).toEqual(expected2)
    expect(generatePlainString(value3)).toEqual(expected3)
  })

  it('should handle empty string', () => {
    const value = ''

    expect(generatePlainString(value)).toBeUndefined()
  })

  it('should handle string with only whitespace', () => {
    const value = '   '

    expect(generatePlainString(value)).toBeUndefined()
  })

  it('should handle non-string inputs', () => {
    expect(generatePlainString(undefined)).toBeUndefined()
  })
})

describe('generateNumber', () => {
  it('should return number when input is a number', () => {
    const values = [0, 42, -123, 3.1343e3, -0.001, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]

    for (const value of values) {
      expect(generateNumber(value)).toBe(value)
    }
  })

  it('should return undefined for special number values', () => {
    const values = [Infinity, -Infinity, NaN]

    for (const value of values) {
      expect(generateNumber(value)).toBeUndefined()
    }
  })

  it('should return undefined for non-number inputs', () => {
    expect(generateNumber(undefined)).toBeUndefined()
  })
})

describe('generateRdfResource', () => {
  it('should generate object with @rdf:resource attribute for valid string', () => {
    const value = 'https://example.com/resource'
    const expected = {
      '@rdf:resource': 'https://example.com/resource',
    }

    expect(generateRdfResource(value, generatePlainString)).toEqual(expected)
  })

  it('should generate object with @rdf:resource for mailto URI', () => {
    const value = 'mailto:admin@example.com'
    const expected = {
      '@rdf:resource': 'mailto:admin@example.com',
    }

    expect(generateRdfResource(value, generatePlainString)).toEqual(expected)
  })

  it('should trim whitespace via generate function', () => {
    const value = '  https://example.com/resource  '
    const expected = {
      '@rdf:resource': 'https://example.com/resource',
    }

    expect(generateRdfResource(value, generatePlainString)).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    expect(generateRdfResource('', generatePlainString)).toBeUndefined()
  })

  it('should return undefined for whitespace-only string', () => {
    expect(generateRdfResource('   ', generatePlainString)).toBeUndefined()
  })

  it('should return undefined for undefined value', () => {
    expect(generateRdfResource(undefined, generatePlainString)).toBeUndefined()
  })

  it('should work with custom generate function', () => {
    const customGenerate = (value: string | undefined): string | undefined => {
      return value ? value.toUpperCase() : undefined
    }
    const value = 'https://example.com'
    const expected = {
      '@rdf:resource': 'HTTPS://EXAMPLE.COM',
    }

    expect(generateRdfResource(value, customGenerate)).toEqual(expected)
  })

  it('should return undefined when generate function returns undefined', () => {
    const alwaysUndefined = (): undefined => undefined
    const value = 'https://example.com'

    expect(generateRdfResource(value, alwaysUndefined)).toBeUndefined()
  })

  it('should return rdf:resource with empty string if generate function returns it', () => {
    const returnsEmpty = (): string => ''
    const value = 'https://example.com'
    const expected = {
      '@rdf:resource': '',
    }

    expect(generateRdfResource(value, returnsEmpty)).toEqual(expected)
  })

  it('should handle number values with generateNumber', () => {
    const value = 42
    const expected = {
      '@rdf:resource': 42,
    }

    expect(generateRdfResource(value, generateNumber)).toEqual(expected)
  })

  it('should preserve special characters in URIs', () => {
    const value = 'https://example.com/path?foo=bar&baz=qux#anchor'
    const expected = {
      '@rdf:resource': 'https://example.com/path?foo=bar&baz=qux#anchor',
    }

    expect(generateRdfResource(value, generatePlainString)).toEqual(expected)
  })
})

describe('createNamespaceNormalizator', () => {
  describe('XML parsing integration tests', () => {
    const parser = new XMLParser({
      trimValues: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      attributeNamePrefix: '@',
      transformTagName: (name: string) => name.toLowerCase(),
      transformAttributeName: (name: string) => name.toLowerCase(),
    })

    describe('default namespace handling', () => {
      it('should handle default Atom namespace with primary namespace', () => {
        const normalizeNamespaces = createNamespaceNormalizator(
          namespaceUris,
          namespacePrefixes,
          'atom',
        )
        const value = parser.parse(`
          <?xml version="1.0"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test Feed</title>
            <entry>
              <title>Test Entry</title>
            </entry>
          </feed>
        `)
        const expected = {
          feed: {
            title: 'Test Feed',
            entry: {
              title: 'Test Entry',
            },
            '@xmlns': 'http://www.w3.org/2005/Atom',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle default namespace without primary namespace', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test Feed</title>
          </feed>
        `)
        const expected = {
          'atom:feed': {
            'atom:title': 'Test Feed',
            '@xmlns': 'http://www.w3.org/2005/Atom',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('prefixed namespace handling', () => {
      it('should normalize custom prefixes to standard prefixes', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <rss xmlns:custom="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>RSS Feed</title>
              <item>
                <title>Item Title</title>
                <custom:creator>John Doe</custom:creator>
              </item>
            </channel>
          </rss>
        `)
        const expected = {
          rss: {
            channel: {
              title: 'RSS Feed',
              item: {
                title: 'Item Title',
                'dc:creator': 'John Doe',
              },
            },
            '@xmlns:custom': 'http://purl.org/dc/elements/1.1/',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle custom Atom prefix with primary namespace', () => {
        const normalizeNamespaces = createNamespaceNormalizator(
          namespaceUris,
          namespacePrefixes,
          'atom',
        )
        const value = parser.parse(`
          <?xml version="1.0"?>
          <a:feed xmlns:a="http://www.w3.org/2005/Atom">
            <a:title>Test Feed</a:title>
            <a:entry>
              <a:title>Test Entry</a:title>
            </a:entry>
          </a:feed>
        `)
        const expected = {
          feed: {
            title: 'Test Feed',
            entry: {
              title: 'Test Entry',
            },
            '@xmlns:a': 'http://www.w3.org/2005/Atom',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('nested namespace declarations', () => {
      it('should handle namespace declarations in nested elements', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <rss>
            <channel>
              <item xmlns:dc="http://purl.org/dc/elements/1.1/">
                <title>Item Title</title>
                <dc:creator>John Doe</dc:creator>
                <dc:date>2023-01-01</dc:date>
              </item>
              <item>
                <title>Item Without Namespace</title>
              </item>
            </channel>
          </rss>
        `)
        const expected = {
          rss: {
            channel: {
              item: [
                {
                  title: 'Item Title',
                  'dc:creator': 'John Doe',
                  'dc:date': '2023-01-01',
                  '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                },
                {
                  title: 'Item Without Namespace',
                },
              ],
            },
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle namespace redefinition in nested elements', () => {
        const normalizeNamespaces = createNamespaceNormalizator(
          {
            v1: ['http://example.com/v1'],
            v2: ['http://example.com/v2'],
          },
          {
            'http://example.com/v1': 'v1',
            'http://example.com/v2': 'v2',
          },
        )
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root xmlns:ns="http://example.com/v1">
            <ns:element>Version 1</ns:element>
            <child xmlns:ns="http://example.com/v2">
              <ns:element>Version 2</ns:element>
            </child>
            <ns:element>Version 1 Again</ns:element>
          </root>
        `)
        const expected = {
          root: {
            'v1:element': ['Version 1', 'Version 1 Again'],
            child: {
              'v2:element': 'Version 2',
              '@xmlns:ns': 'http://example.com/v2',
            },
            '@xmlns:ns': 'http://example.com/v1',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('mixed case handling', () => {
      it('should normalize element names to lowercase while preserving namespace logic', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <RSS xmlns:DC="http://purl.org/dc/elements/1.1/">
            <Channel>
              <TITLE>Feed Title</TITLE>
              <Item>
                <Title>Item Title</Title>
                <DC:Creator>John Doe</DC:Creator>
              </Item>
            </Channel>
          </RSS>
        `)
        const expected = {
          rss: {
            channel: {
              title: 'Feed Title',
              item: {
                title: 'Item Title',
                'dc:creator': 'John Doe',
              },
            },
            '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('self-closing elements with namespaces', () => {
      it('should handle self-closing elements with namespace declarations', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <rss>
            <channel>
              <item>
                <title>Item 1</title>
                <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="http://example.com/thumb.jpg"/>
              </item>
              <item>
                <title>Item 2</title>
                <description>No media namespace here</description>
              </item>
            </channel>
          </rss>
        `)
        const expected = {
          rss: {
            channel: {
              item: [
                {
                  title: 'Item 1',
                  'media:thumbnail': {
                    '@url': 'http://example.com/thumb.jpg',
                    '@xmlns:media': 'http://search.yahoo.com/mrss/',
                  },
                },
                {
                  title: 'Item 2',
                  description: 'No media namespace here',
                },
              ],
            },
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('multiple namespaces in same document', () => {
      it('should handle multiple namespaces simultaneously', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <rss
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:content="http://purl.org/rss/1.0/modules/content/"
            xmlns:media="http://search.yahoo.com/mrss/"
          >
            <channel>
              <item>
                <title>Multi-namespace Item</title>
                <dc:creator>John Doe</dc:creator>
                <dc:date>2023-01-01</dc:date>
                <content:encoded><![CDATA[Rich content]]></content:encoded>
                <media:group>
                  <media:content url="video.mp4" type="video/mp4"/>
                  <media:description>Video description</media:description>
                </media:group>
              </item>
            </channel>
          </rss>
        `)
        const expected = {
          rss: {
            channel: {
              item: {
                title: 'Multi-namespace Item',
                'dc:creator': 'John Doe',
                'dc:date': '2023-01-01',
                'content:encoded': 'Rich content',
                'media:group': {
                  'media:content': {
                    '@url': 'video.mp4',
                    '@type': 'video/mp4',
                  },
                  'media:description': 'Video description',
                },
              },
            },
            '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
            '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
            '@xmlns:media': 'http://search.yahoo.com/mrss/',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('edge cases', () => {
      it('should handle empty namespace URIs', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root xmlns="">
            <element>No namespace</element>
          </root>
        `)
        const expected = {
          root: {
            element: 'No namespace',
            '@xmlns': '',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle unknown namespaces gracefully', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root xmlns:unknown="http://unknown.example.com/">
            <unknown:element>Unknown namespace</unknown:element>
          </root>
        `)
        const expected = {
          root: {
            'unknown:element': 'Unknown namespace',
            '@xmlns:unknown': 'http://unknown.example.com/',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle case-insensitive xmlns attributes', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root
            XMLNS:DC="http://purl.org/dc/elements/1.1/"
            xmlns:ATOM="http://www.w3.org/2005/Atom"
          >
            <DC:creator>Author Name</DC:creator>
            <ATOM:title>Title</ATOM:title>
          </root>
        `)
        const expected = {
          root: {
            'dc:creator': 'Author Name',
            'atom:title': 'Title',
            '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
            '@xmlns:atom': 'http://www.w3.org/2005/Atom',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle complex nesting with namespace inheritance', () => {
        const normalizeNamespaces = createNamespaceNormalizator(
          namespaceUris,
          namespacePrefixes,
          'atom',
        )
        const value = parser.parse(`
          <?xml version="1.0"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <entry xmlns:dc="http://purl.org/dc/elements/1.1/">
              <title>Entry Title</title>
              <dc:creator>Author</dc:creator>
              <content xmlns:xhtml="http://www.w3.org/1999/xhtml">
                <xhtml:div>
                  <xhtml:p>Rich content</xhtml:p>
                </xhtml:div>
              </content>
            </entry>
          </feed>
        `)
        const expected = {
          feed: {
            entry: {
              title: 'Entry Title',
              'dc:creator': 'Author',
              content: {
                'xhtml:div': {
                  'xhtml:p': 'Rich content',
                },
                '@xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
              },
              '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
            },
            '@xmlns': 'http://www.w3.org/2005/Atom',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('unhappy path scenarios', () => {
      it('should handle non-object input gracefully', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)

        expect(normalizeNamespaces(null)).toBe(null)
        expect(normalizeNamespaces(undefined)).toBe(undefined)
        expect(normalizeNamespaces('string')).toBe('string')
        expect(normalizeNamespaces(123)).toBe(123)
        expect(normalizeNamespaces(true)).toBe(true)
      })

      it('should handle conflicting namespace declarations in siblings', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root>
            <item1 xmlns:custom="http://purl.org/dc/elements/1.1/">
              <custom:creator>Author 1</custom:creator>
            </item1>
            <item2 xmlns:custom="http://search.yahoo.com/mrss/">
              <custom:title>Title 2</custom:title>
            </item2>
          </root>
        `)
        const expected = {
          root: {
            item1: {
              'dc:creator': 'Author 1',
              '@xmlns:custom': 'http://purl.org/dc/elements/1.1/',
            },
            item2: {
              'media:title': 'Title 2',
              '@xmlns:custom': 'http://search.yahoo.com/mrss/',
            },
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should normalize when standard prefix used by unknown namespace', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root
            xmlns:atom="http://example.com/unknown"
            xmlns:feed="http://www.w3.org/2005/Atom"
          >
            <atom:unknown>ignored</atom:unknown>
            <feed:title>Test Title</feed:title>
          </root>
        `)
        const expected = {
          root: {
            'atom:unknown': 'ignored',
            'atom:title': 'Test Title',
            '@xmlns:atom': 'http://example.com/unknown',
            '@xmlns:feed': 'http://www.w3.org/2005/Atom',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should normalize multiple conflicts with same namespace URI', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root
            xmlns:dc1="http://purl.org/dc/elements/1.1/"
            xmlns:dc2="http://purl.org/dc/elements/1.1"
          >
            <dc1:creator>John Doe</dc1:creator>
            <dc2:creator>Jane Smith</dc2:creator>
          </root>
        `)
        const expected = {
          root: {
            'dc:creator': ['John Doe', 'Jane Smith'],
            '@xmlns:dc1': 'http://purl.org/dc/elements/1.1/',
            '@xmlns:dc2': 'http://purl.org/dc/elements/1.1',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle namespace declarations without usage', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = parser.parse(`
          <?xml version="1.0"?>
          <root
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:media="http://search.yahoo.com/mrss/"
          >
            <title>No namespaced elements</title>
            <description>Just plain elements</description>
          </root>
        `)
        const expected = {
          root: {
            title: 'No namespaced elements',
            description: 'Just plain elements',
            '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
            '@xmlns:media': 'http://search.yahoo.com/mrss/',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })

      it('should handle mixed valid and invalid namespace values', () => {
        const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
        const value = {
          root: {
            '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
            '@xmlns:invalid1': '',
            '@xmlns:invalid2': '   ',
            '@xmlns:valid': 'http://example.com/',
            'dc:creator': 'John Doe',
            'invalid1:element': 'Value 1',
            'invalid2:element': 'Value 2',
            'valid:element': 'Value 3',
          },
        }
        const expected = {
          root: {
            '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
            '@xmlns:invalid1': '',
            '@xmlns:invalid2': '   ',
            '@xmlns:valid': 'http://example.com/',
            'dc:creator': 'John Doe',
            'invalid1:element': 'Value 1',
            'invalid2:element': 'Value 2',
            'valid:element': 'Value 3',
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })

    describe('RDF primary namespace handling', () => {
      it('should normalize RDF namespace elements and attributes including arrays', () => {
        const normalizeNamespaces = createNamespaceNormalizator(
          namespaceUris,
          namespacePrefixes,
          'rdf',
        )
        const value = parser.parse(`
          <?xml version="1.0" encoding="UTF-8"?>
          <rdf:RDF
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://purl.org/rss/1.0/"
          >
            <channel rdf:about="http://example.com">
              <title>Test Feed</title>
              <items>
                <rdf:Seq>
                  <rdf:li resource="http://example.com/item1"/>
                  <rdf:li rdf:resource="http://example.com/item2"/>
                </rdf:Seq>
              </items>
            </channel>
            <item rdf:about="http://example.com/item1">
              <title>Item 1</title>
            </item>
            <item rdf:about="http://example.com/item2">
              <title>Item 2</title>
            </item>
          </rdf:RDF>
        `)
        const expected = {
          rdf: {
            '@xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            '@xmlns': 'http://purl.org/rss/1.0/',
            channel: {
              title: 'Test Feed',
              items: {
                seq: {
                  li: [
                    { '@resource': 'http://example.com/item1' },
                    { '@resource': 'http://example.com/item2' },
                  ],
                },
              },
              '@about': 'http://example.com',
            },
            item: [
              { title: 'Item 1', '@about': 'http://example.com/item1' },
              { title: 'Item 2', '@about': 'http://example.com/item2' },
            ],
          },
        }

        expect(normalizeNamespaces(value)).toEqual(expected)
      })
    })
  })

  describe('non-standard namespace URIs', () => {
    it('should work with HTTPS variant and custom prefix', () => {
      const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
      const value = {
        item: {
          '@xmlns:dublincore': 'https://purl.org/dc/elements/1.1/',
          'dublincore:creator': 'John',
        },
      }
      const expected = {
        item: {
          '@xmlns:dublincore': 'https://purl.org/dc/elements/1.1/',
          'dc:creator': 'John',
        },
      }

      expect(normalizeNamespaces(value)).toEqual(expected)
    })

    it('should work without trailing slash and custom prefix', () => {
      const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
      const value = {
        item: {
          '@xmlns:dublincore': 'http://purl.org/dc/elements/1.1',
          'dublincore:creator': 'John',
        },
      }
      const expected = {
        item: {
          '@xmlns:dublincore': 'http://purl.org/dc/elements/1.1',
          'dc:creator': 'John',
        },
      }

      expect(normalizeNamespaces(value)).toEqual(expected)
    })

    it('should work with uppercase URI and custom prefix', () => {
      const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
      const value = {
        item: {
          '@xmlns:dublincore': 'HTTP://PURL.ORG/DC/ELEMENTS/1.1/',
          'dublincore:creator': 'John',
        },
      }
      const expected = {
        item: {
          '@xmlns:dublincore': 'HTTP://PURL.ORG/DC/ELEMENTS/1.1/',
          'dc:creator': 'John',
        },
      }

      expect(normalizeNamespaces(value)).toEqual(expected)
    })

    it('should work with mixed case URI and custom prefix', () => {
      const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
      const value = {
        item: {
          '@xmlns:dublincore': 'Http://Purl.Org/Dc/Elements/1.1/',
          'dublincore:creator': 'John',
        },
      }
      const expected = {
        item: {
          '@xmlns:dublincore': 'Http://Purl.Org/Dc/Elements/1.1/',
          'dc:creator': 'John',
        },
      }

      expect(normalizeNamespaces(value)).toEqual(expected)
    })

    it('should work with uppercase HTTPS URI and custom prefix', () => {
      const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
      const value = {
        item: {
          '@xmlns:dublincore': 'HTTPS://PURL.ORG/DC/ELEMENTS/1.1/',
          'dublincore:creator': 'John',
        },
      }
      const expected = {
        item: {
          '@xmlns:dublincore': 'HTTPS://PURL.ORG/DC/ELEMENTS/1.1/',
          'dc:creator': 'John',
        },
      }

      expect(normalizeNamespaces(value)).toEqual(expected)
    })

    it('should work with URI containing whitespace around it', () => {
      const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)
      const value = {
        item: {
          '@xmlns:dublincore': '  http://purl.org/dc/elements/1.1/ ',
          'dublincore:creator': 'John',
        },
      }
      const expected = {
        item: {
          '@xmlns:dublincore': '  http://purl.org/dc/elements/1.1/ ',
          'dc:creator': 'John',
        },
      }

      expect(normalizeNamespaces(value)).toEqual(expected)
    })
  })
})

describe('generateArrayOrSingular', () => {
  it('should prioritize plural values over singular values', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateArrayOrSingular(['a', 'b', 'c'], 'x', generator)

    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should use singular value when plural is undefined', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateArrayOrSingular(undefined, 'x', generator)

    expect(result).toEqual('X')
  })

  it('should return undefined when both values are undefined', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateArrayOrSingular(undefined, undefined, generator)

    expect(result).toBeUndefined()
  })

  it('should filter out undefined results from array', () => {
    const generator = (value: string | undefined) => (value === 'skip' ? undefined : value)
    const result = generateArrayOrSingular(['a', 'skip', 'b'], 'x', generator)

    expect(result).toEqual(['a', 'b'])
  })

  it('should return undefined when all array items generate undefined', () => {
    const generator = () => undefined
    const result = generateArrayOrSingular(['a', 'b'], 'x', generator)

    expect(result).toBeUndefined()
  })

  it('should work with generateCdataString', () => {
    const result = generateArrayOrSingular(
      ['<p>HTML</p>', 'Plain text'],
      undefined,
      generateCdataString,
    )

    expect(result).toEqual([{ '#cdata': '<p>HTML</p>' }, 'Plain text'])
  })

  it('should work with generatePlainString', () => {
    const result = generateArrayOrSingular(['  value1  ', 'value2'], undefined, generatePlainString)

    expect(result).toEqual(['value1', 'value2'])
  })

  it('should work with generateNumber', () => {
    const result = generateArrayOrSingular([42, 100], undefined, generateNumber)

    expect(result).toEqual([42, 100])
  })

  it('should handle empty plural array', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateArrayOrSingular([], 'x', generator)

    expect(result).toBeUndefined()
  })

  it('should handle singular value that generates undefined', () => {
    const generator = (value: string) => (value === 'skip' ? undefined : value)
    const result = generateArrayOrSingular(undefined, 'skip', generator)

    expect(result).toBeUndefined()
  })

  it('should preserve order of array elements', () => {
    const generator = (value: number) => value * 2
    const result = generateArrayOrSingular([1, 2, 3, 4, 5], 99, generator)

    expect(result).toEqual([2, 4, 6, 8, 10])
  })

  it('should work with complex object transformations', () => {
    const generator = (value: string) => ({ name: value, length: value.length })
    const result = generateArrayOrSingular(['foo', 'bar'], 'baz', generator)

    expect(result).toEqual([
      { name: 'foo', length: 3 },
      { name: 'bar', length: 3 },
    ])
  })

  it('should ignore singular when plural is empty array', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateArrayOrSingular([], 'x', generator)

    expect(result).toBeUndefined()
  })
})

describe('generateSingularOrArray', () => {
  it('should prioritize singular value over plural values', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateSingularOrArray('x', ['a', 'b', 'c'], generator)

    expect(result).toEqual('X')
  })

  it('should use plural values when singular is undefined', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateSingularOrArray(undefined, ['a', 'b', 'c'], generator)

    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should return undefined when both values are undefined', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateSingularOrArray(undefined, undefined, generator)

    expect(result).toBeUndefined()
  })

  it('should filter out undefined results from array', () => {
    const generator = (value: string | undefined) => (value === 'skip' ? undefined : value)
    const result = generateSingularOrArray(undefined, ['a', 'skip', 'b'], generator)

    expect(result).toEqual(['a', 'b'])
  })

  it('should return undefined when all array items generate undefined', () => {
    const generator = () => undefined
    const result = generateSingularOrArray(undefined, ['a', 'b'], generator)

    expect(result).toBeUndefined()
  })

  it('should work with generateCdataString', () => {
    const result = generateSingularOrArray('<p>HTML</p>', undefined, generateCdataString)

    expect(result).toEqual({ '#cdata': '<p>HTML</p>' })
  })

  it('should work with generatePlainString', () => {
    const result = generateSingularOrArray('  value  ', undefined, generatePlainString)

    expect(result).toEqual('value')
  })

  it('should work with generateNumber', () => {
    const result = generateSingularOrArray(42, undefined, generateNumber)

    expect(result).toEqual(42)
  })

  it('should handle empty plural array', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateSingularOrArray(undefined, [], generator)

    expect(result).toBeUndefined()
  })

  it('should handle singular value that generates undefined', () => {
    const generator = (value: string) => (value === 'skip' ? undefined : value)
    const result = generateSingularOrArray('skip', ['a', 'b'], generator)

    expect(result).toBeUndefined()
  })

  it('should preserve order of array elements when using plural', () => {
    const generator = (value: number) => value * 2
    const result = generateSingularOrArray(undefined, [1, 2, 3, 4, 5], generator)

    expect(result).toEqual([2, 4, 6, 8, 10])
  })

  it('should work with complex object transformations', () => {
    const generator = (value: string) => ({ name: value, length: value.length })
    const result = generateSingularOrArray('foo', undefined, generator)

    expect(result).toEqual({ name: 'foo', length: 3 })
  })

  it('should ignore plural when singular is defined', () => {
    const generator = (value: string) => value.toUpperCase()
    const result = generateSingularOrArray('x', ['a', 'b', 'c'], generator)

    expect(result).toEqual('X')
  })
})

describe('parseJsonObject', () => {
  it('should return object unchanged when input is object', () => {
    const value = { title: 'Test', count: 42 }

    expect(parseJsonObject(value)).toEqual(value)
  })

  it('should parse valid JSON string', () => {
    const value = '{"title":"Test","count":42}'
    const expected = { title: 'Test', count: 42 }

    expect(parseJsonObject(value)).toEqual(expected)
  })

  it('should parse JSON string with whitespace on start', () => {
    const value = '  {"title":"Test"}'
    const expected = { title: 'Test' }

    expect(parseJsonObject(value)).toEqual(expected)
  })

  it('should parse JSON string with whitespace on end', () => {
    const value = '{"title":"Test"}  '
    const expected = { title: 'Test' }

    expect(parseJsonObject(value)).toEqual(expected)
  })

  it('should parse JSON string with whitespace on both ends', () => {
    const value = '  {"title":"Test"}  '
    const expected = { title: 'Test' }

    expect(parseJsonObject(value)).toEqual(expected)
  })

  it('should return undefined for array string', () => {
    const value = '[1,2,3]'

    expect(parseJsonObject(value)).toBeUndefined()
  })

  it('should return undefined for array string with whitespace', () => {
    const value = '   [1,2,3]   '

    expect(parseJsonObject(value)).toBeUndefined()
  })

  it('should return undefined for XML string', () => {
    const value = '<rss><channel><title>Test</title></channel></rss>'

    expect(parseJsonObject(value)).toBeUndefined()
  })

  it('should return undefined for plain text', () => {
    const value = 'not json'

    expect(parseJsonObject(value)).toBeUndefined()
  })

  it('should return undefined for malformed JSON', () => {
    const value = '{"title":"Test"'

    expect(parseJsonObject(value)).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    const value = ''

    expect(parseJsonObject(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseJsonObject(123)).toBeUndefined()
    expect(parseJsonObject(true)).toBeUndefined()
    expect(parseJsonObject(null)).toBeUndefined()
    expect(parseJsonObject(undefined)).toBeUndefined()
    expect(parseJsonObject([1, 2, 3])).toBeUndefined()
  })
})
