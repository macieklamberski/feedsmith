import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils'

describe('retrieveItem', () => {
  it('should parse complete item object with encoded content', () => {
    const value = {
      'content:encoded': { '#text': '<p>This is encoded content</p>' },
    }
    const expected = {
      encoded: '<p>This is encoded content</p>',
    }

    expect(retrieveItem(value, 'coerce')).toEqual(expected)
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

    expect(retrieveItem(value, 'coerce')).toEqual(expected)
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

    expect(retrieveItem(value, 'coerce')).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'content:encoded': { '#text': 123 },
    }
    const expected = {
      encoded: '123',
    }

    expect(retrieveItem(value, 'coerce')).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(retrieveItem('not an object', 'coerce')).toBeUndefined()
    expect(retrieveItem(undefined, 'coerce')).toBeUndefined()
    expect(retrieveItem(null, 'coerce')).toBeUndefined()
    expect(retrieveItem([], 'coerce')).toBeUndefined()
  })

  it('should handle object with content:encoded but missing #text property', () => {
    const value = {
      'content:encoded': {},
    }

    expect(retrieveItem(value, 'coerce')).toBeUndefined()
  })

  it('should handle object with unrelated properties', () => {
    const value = {
      'other:property': { '#text': 'value' },
      'something:else': { '#text': 'another value' },
    }

    expect(retrieveItem(value, 'coerce')).toBeUndefined()
  })

  it('should handle boolean values', () => {
    const value = {
      'content:encoded': { '#text': true },
    }

    expect(retrieveItem(value, 'coerce')).toBeUndefined()
  })

  it('should handle empty string in encoded field', () => {
    const value = {
      'content:encoded': { '#text': '' },
    }
    const expected = {
      encoded: '',
    }

    expect(retrieveItem(value, 'coerce')).toEqual(expected)
  })

  it('should handle null in encoded field', () => {
    const value = {
      'content:encoded': { '#text': null },
    }

    expect(retrieveItem(value, 'coerce')).toBeUndefined()
  })
})
