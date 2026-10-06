import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      thumbnail: 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
      imgsrc: 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }
    const expected = {
      'photo:thumbnail': 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
      'photo:imgsrc': 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only imgsrc', () => {
    const value = {
      imgsrc: 'https://example.com/photo/art/imagette/97188016-67707650.jpg',
    }
    const expected = {
      'photo:imgsrc': 'https://example.com/photo/art/imagette/97188016-67707650.jpg',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should wrap a value containing an ampersand in CDATA', () => {
    const value = {
      imgsrc: 'https://example.com/main.php?g2_view=core.DownloadItem&g2_itemId=42',
    }
    const expected = {
      'photo:imgsrc': {
        '#cdata': 'https://example.com/main.php?g2_view=core.DownloadItem&g2_itemId=42',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      thumbnail: '',
      imgsrc: 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }
    const expected = {
      'photo:imgsrc': 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      thumbnail: '   ',
      imgsrc: '\t\n',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
