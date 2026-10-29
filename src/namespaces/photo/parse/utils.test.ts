import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  it('should parse item with all properties', () => {
    const value = {
      'photo:thumbnail': 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
      'photo:imgsrc': 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }
    const expected = {
      thumbnail: 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
      imgsrc: 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only imgsrc', () => {
    const value = {
      'photo:imgsrc': 'https://example.com/photo/art/imagette/97188016-67707650.jpg',
    }
    const expected = {
      imgsrc: 'https://example.com/photo/art/imagette/97188016-67707650.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only thumbnail', () => {
    const value = {
      'photo:thumbnail': 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
    }
    const expected = {
      thumbnail: 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse values given as #text', () => {
    const value = {
      'photo:thumbnail': {
        '#text': 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
      },
      'photo:imgsrc': { '#text': 'https://example.com/albums/Underwater/Carwash_basement.jpg' },
    }
    const expected = {
      thumbnail: 'https://example.com/albums/Underwater/Carwash_basement.thumb.jpg',
      imgsrc: 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should trim urls written on their own line', () => {
    const value = {
      'photo:imgsrc': '\n      https://example.com/albums/Underwater/Carwash_basement.jpg\n    ',
    }
    const expected = {
      imgsrc: 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should use the first value when an element repeats', () => {
    const value = {
      'photo:imgsrc': [
        'https://example.com/albums/Underwater/Carwash_basement.jpg',
        'https://example.com/albums/Underwater/Cenote_entrance.jpg',
      ],
    }
    const expected = {
      imgsrc: 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities', () => {
    const value = {
      'photo:imgsrc': 'https://example.com/main.php?g2_view=core.DownloadItem&amp;g2_itemId=42',
    }
    const expected = {
      imgsrc: 'https://example.com/main.php?g2_view=core.DownloadItem&g2_itemId=42',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'photo:imgsrc':
        '<![CDATA[https://example.com/main.php?g2_view=core.DownloadItem&g2_itemId=42]]>',
    }
    const expected = {
      imgsrc: 'https://example.com/main.php?g2_view=core.DownloadItem&g2_itemId=42',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'photo:thumbnail': '',
      'photo:imgsrc': 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }
    const expected = {
      imgsrc: 'https://example.com/albums/Underwater/Carwash_basement.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'photo:thumbnail': '   ',
      'photo:imgsrc': '\t\n',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined when no photo properties exist', () => {
    const value = {
      title: 'Sunset over the bay',
      'dc:creator': 'Jane Doe',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
