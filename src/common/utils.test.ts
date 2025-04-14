import { describe, expect, it } from 'bun:test'
import type { ParseFunction } from './types.js'
import {
  createCaseInsensitiveGetter,
  createNamespaceGetter,
  hasEntities,
  isNonEmptyStringOrNumber,
  isObject,
  isPresent,
  parseArray,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseSingular,
  parseString,
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

  it('should handle objects with inherited properties', () => {
    const proto = { inherited: 'value' }
    const obj = Object.create(proto)
    obj.own = 'property'
    obj.undef = undefined

    expect(trimObject(obj)).toEqual({ own: 'property' })
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
