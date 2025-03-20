import { describe, expect, it } from 'bun:test'
import { parseItem } from './utils'

describe('parseItem', () => {
  it('should parse complete item object with encoded content', () => {
    const value = {
      'content:encoded': { '#text': '<p>This is encoded content</p>' },
    }
    const expected = {
      encoded: '<p>This is encoded content</p>',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle HTML content in encoded field', () => {
    const value = {
      'content:encoded': {
        '#text': '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>',
      },
    }
    const expected = {
      encoded: '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle CDATA content in encoded field', () => {
    const value = {
      'content:encoded': {
        '#text': '<![CDATA[<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>]]>',
      },
    }
    const expected = {
      encoded: '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'content:encoded': { '#text': 123 },
    }
    const expected = {
      encoded: '123',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(parseItem('not an object')).toBeUndefined()
    expect(parseItem(undefined)).toBeUndefined()
    expect(parseItem(null)).toBeUndefined()
    expect(parseItem([])).toBeUndefined()
  })

  it('should handle object with content:encoded but missing #text property', () => {
    const value = {
      'content:encoded': {},
    }

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle object with unrelated properties', () => {
    const value = {
      'other:property': { '#text': 'value' },
      'something:else': { '#text': 'another value' },
    }

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle boolean values', () => {
    const value = {
      'content:encoded': { '#text': true },
    }

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle empty string in encoded field', () => {
    const value = {
      'content:encoded': { '#text': '' },
    }
    const expected = {
      encoded: '',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle null in encoded field', () => {
    const value = {
      'content:encoded': { '#text': null },
    }

    expect(parseItem(value)).toBeUndefined()
  })
})
