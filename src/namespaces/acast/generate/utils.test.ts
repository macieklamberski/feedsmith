import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem, generateNetwork, generateSignature } from './utils.js'

describe('generateSignature', () => {
  it('should generate signature with all properties', () => {
    const value = {
      key: 'EXAMPLE_KEY',
      algorithm: 'aes-256-cbc',
      value: 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }
    const expected = {
      '@key': 'EXAMPLE_KEY',
      '@algorithm': 'aes-256-cbc',
      '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }

    expect(generateSignature(value)).toEqual(expected)
  })

  it('should generate signature with only key and algorithm', () => {
    const value = {
      key: 'EXAMPLE_KEY',
      algorithm: 'aes-256-cbc',
    }
    const expected = {
      '@key': 'EXAMPLE_KEY',
      '@algorithm': 'aes-256-cbc',
    }

    expect(generateSignature(value)).toEqual(expected)
  })

  it('should generate signature with only value', () => {
    const value = {
      value: 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }
    const expected = {
      '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }

    expect(generateSignature(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      key: '',
      algorithm: 'aes-256-cbc',
    }
    const expected = {
      '@algorithm': 'aes-256-cbc',
    }

    expect(generateSignature(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      key: '   ',
      algorithm: '\t\n',
    }

    expect(generateSignature(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateSignature(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateSignature('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateSignature(123)).toBeUndefined()
    expect(generateSignature(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateSignature(null)).toBeUndefined()
  })
})

describe('generateNetwork', () => {
  it('should generate network with all properties', () => {
    const value = {
      id: '664fdd227c6b200013652ed6',
      slug: 'richard-feldman-664fdd227c6b200013652ed6',
      value: 'Richard Feldman',
    }
    const expected = {
      '@id': '664fdd227c6b200013652ed6',
      '@slug': 'richard-feldman-664fdd227c6b200013652ed6',
      '#text': 'Richard Feldman',
    }

    expect(generateNetwork(value)).toEqual(expected)
  })

  it('should generate network with only id and slug', () => {
    const value = {
      id: '664fdd227c6b200013652ed6',
      slug: 'network-slug',
    }
    const expected = {
      '@id': '664fdd227c6b200013652ed6',
      '@slug': 'network-slug',
    }

    expect(generateNetwork(value)).toEqual(expected)
  })

  it('should generate network with only value', () => {
    const value = {
      value: 'Network Name',
    }
    const expected = {
      '#text': 'Network Name',
    }

    expect(generateNetwork(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      id: '',
      slug: 'network-slug',
    }
    const expected = {
      '@slug': 'network-slug',
    }

    expect(generateNetwork(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      id: '   ',
      slug: '\t\n',
    }

    expect(generateNetwork(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateNetwork(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateNetwork('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateNetwork(123)).toBeUndefined()
    expect(generateNetwork(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateNetwork(null)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      showId: '664fde3eda02bb0012bad909',
      showUrl: 'software-unscripted',
      signature: {
        key: 'EXAMPLE_KEY',
        algorithm: 'aes-256-cbc',
        value: 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
      },
      settings: 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
      network: {
        id: '664fdd227c6b200013652ed6',
        slug: 'richard-feldman-664fdd227c6b200013652ed6',
        value: 'Richard Feldman',
      },
      importedFeed: 'https://feeds.resonaterecordings.com/software-unscripted',
    }
    const expected = {
      'acast:showId': '664fde3eda02bb0012bad909',
      'acast:showUrl': 'software-unscripted',
      'acast:signature': {
        '@key': 'EXAMPLE_KEY',
        '@algorithm': 'aes-256-cbc',
        '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
      },
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
      'acast:network': {
        '@id': '664fdd227c6b200013652ed6',
        '@slug': 'richard-feldman-664fdd227c6b200013652ed6',
        '#text': 'Richard Feldman',
      },
      'acast:importedFeed': 'https://feeds.resonaterecordings.com/software-unscripted',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only showId', () => {
    const value = {
      showId: '664fde3eda02bb0012bad909',
    }
    const expected = {
      'acast:showId': '664fde3eda02bb0012bad909',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only showUrl', () => {
    const value = {
      showUrl: 'software-unscripted',
    }
    const expected = {
      'acast:showUrl': 'software-unscripted',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only signature', () => {
    const value = {
      signature: {
        key: 'EXAMPLE_KEY',
        algorithm: 'aes-256-cbc',
      },
    }
    const expected = {
      'acast:signature': {
        '@key': 'EXAMPLE_KEY',
        '@algorithm': 'aes-256-cbc',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only settings', () => {
    const value = {
      settings: 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
    }
    const expected = {
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only network', () => {
    const value = {
      network: {
        id: '664fdd227c6b200013652ed6',
        value: 'Network Name',
      },
    }
    const expected = {
      'acast:network': {
        '@id': '664fdd227c6b200013652ed6',
        '#text': 'Network Name',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only importedFeed', () => {
    const value = {
      importedFeed: 'https://feeds.resonaterecordings.com/software-unscripted',
    }
    const expected = {
      'acast:importedFeed': 'https://feeds.resonaterecordings.com/software-unscripted',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle UUID format showId', () => {
    const value = {
      showId: '9d5c107b-68d6-4c1b-8c80-45ee6a84c947',
    }
    const expected = {
      'acast:showId': '9d5c107b-68d6-4c1b-8c80-45ee6a84c947',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      showId: '',
      showUrl: 'software-unscripted',
    }
    const expected = {
      'acast:showUrl': 'software-unscripted',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      showId: '   ',
      showUrl: '\t\n',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      showId: undefined,
      showUrl: undefined,
      signature: undefined,
      settings: undefined,
      network: undefined,
      importedFeed: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
  })

  it('should handle partial feed data', () => {
    const value = {
      showId: '664fde3eda02bb0012bad909',
      showUrl: 'software-unscripted',
      importedFeed: 'https://feeds.resonaterecordings.com/software-unscripted',
    }
    const expected = {
      'acast:showId': '664fde3eda02bb0012bad909',
      'acast:showUrl': 'software-unscripted',
      'acast:importedFeed': 'https://feeds.resonaterecordings.com/software-unscripted',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle mixed empty and valid strings', () => {
    const value = {
      showId: '',
      showUrl: 'software-unscripted',
      settings: '   ',
      importedFeed: 'https://feeds.resonaterecordings.com/software-unscripted',
    }
    const expected = {
      'acast:showUrl': 'software-unscripted',
      'acast:importedFeed': 'https://feeds.resonaterecordings.com/software-unscripted',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      episodeId: '6918f06ee42e3466f29467f9',
      showId: '664fde3eda02bb0012bad909',
      episodeUrl: 'jonathan-blow-on-programming-language-design',
      settings: 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }
    const expected = {
      'acast:episodeId': '6918f06ee42e3466f29467f9',
      'acast:showId': '664fde3eda02bb0012bad909',
      'acast:episodeUrl': 'jonathan-blow-on-programming-language-design',
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only episodeId', () => {
    const value = {
      episodeId: '6918f06ee42e3466f29467f9',
    }
    const expected = {
      'acast:episodeId': '6918f06ee42e3466f29467f9',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only showId', () => {
    const value = {
      showId: '664fde3eda02bb0012bad909',
    }
    const expected = {
      'acast:showId': '664fde3eda02bb0012bad909',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only episodeUrl', () => {
    const value = {
      episodeUrl: 'jonathan-blow-on-programming-language-design',
    }
    const expected = {
      'acast:episodeUrl': 'jonathan-blow-on-programming-language-design',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only settings', () => {
    const value = {
      settings: 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }
    const expected = {
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      episodeId: '',
      showId: '664fde3eda02bb0012bad909',
    }
    const expected = {
      'acast:showId': '664fde3eda02bb0012bad909',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      episodeId: '   ',
      showId: '\t\n',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      episodeId: undefined,
      showId: undefined,
      episodeUrl: undefined,
      settings: undefined,
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
  })

  it('should handle partial item data', () => {
    const value = {
      episodeId: '6918f06ee42e3466f29467f9',
      showId: '664fde3eda02bb0012bad909',
    }
    const expected = {
      'acast:episodeId': '6918f06ee42e3466f29467f9',
      'acast:showId': '664fde3eda02bb0012bad909',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle mixed empty and valid strings', () => {
    const value = {
      episodeId: '',
      showId: '664fde3eda02bb0012bad909',
      episodeUrl: '   ',
      settings: 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }
    const expected = {
      'acast:showId': '664fde3eda02bb0012bad909',
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }

    expect(generateItem(value)).toEqual(expected)
  })
})
