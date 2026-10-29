import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      reference: 'http://forum.example.com/viewtopic.php?p=3194#3194',
    }
    const expected = {
      'annotate:reference': {
        '@rdf:resource': 'http://forum.example.com/viewtopic.php?p=3194#3194',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should trim whitespace from values', () => {
    const value = {
      reference: '  https://example.com/discuss/1  ',
    }
    const expected = {
      'annotate:reference': {
        '@rdf:resource': 'https://example.com/discuss/1',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      reference: '',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      reference: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
