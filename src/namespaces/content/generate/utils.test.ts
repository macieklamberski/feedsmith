import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate content with CDATA for HTML content', () => {
    const value = {
      encoded: '<p>Full HTML content here</p>',
    }
    const expected = {
      'content:encoded': { '#cdata': '<p>Full HTML content here</p>' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate content without CDATA for simple text', () => {
    const value = {
      encoded: 'Simple text content without HTML',
    }
    const expected = {
      'content:encoded': 'Simple text content without HTML',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate content with CDATA for text containing ampersands', () => {
    const value = {
      encoded: 'Text with & ampersand characters',
    }
    const expected = {
      'content:encoded': { '#cdata': 'Text with & ampersand characters' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle undefined input', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })
})
