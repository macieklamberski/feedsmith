import { describe, expect, it } from 'bun:test'
import { parseNetwork, parseSignature, retrieveFeed, retrieveItem } from './utils.js'

describe('parseSignature', () => {
  it('should parse signature with all properties', () => {
    const value = {
      '@key': 'EXAMPLE_KEY',
      '@algorithm': 'aes-256-cbc',
      '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }
    const expected = {
      key: 'EXAMPLE_KEY',
      algorithm: 'aes-256-cbc',
      value: 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }

    expect(parseSignature(value)).toEqual(expected)
  })

  it('should parse signature with only key and algorithm', () => {
    const value = {
      '@key': 'EXAMPLE_KEY',
      '@algorithm': 'aes-256-cbc',
    }
    const expected = {
      key: 'EXAMPLE_KEY',
      algorithm: 'aes-256-cbc',
    }

    expect(parseSignature(value)).toEqual(expected)
  })

  it('should parse signature with only value', () => {
    const value = {
      '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }
    const expected = {
      value: 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
    }

    expect(parseSignature(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseSignature(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSignature('string')).toBeUndefined()
    expect(parseSignature(undefined)).toBeUndefined()
    expect(parseSignature(null)).toBeUndefined()
  })
})

describe('parseNetwork', () => {
  it('should parse network with all properties', () => {
    const value = {
      '@id': '664fdd227c6b200013652ed6',
      '@slug': 'richard-feldman-664fdd227c6b200013652ed6',
      '#text': 'Richard Feldman',
    }
    const expected = {
      id: '664fdd227c6b200013652ed6',
      slug: 'richard-feldman-664fdd227c6b200013652ed6',
      value: 'Richard Feldman',
    }

    expect(parseNetwork(value)).toEqual(expected)
  })

  it('should parse network with only id and slug', () => {
    const value = {
      '@id': '664fdd227c6b200013652ed6',
      '@slug': 'network-slug',
    }
    const expected = {
      id: '664fdd227c6b200013652ed6',
      slug: 'network-slug',
    }

    expect(parseNetwork(value)).toEqual(expected)
  })

  it('should parse network with only value', () => {
    const value = {
      '#text': 'Network Name',
    }
    const expected = {
      value: 'Network Name',
    }

    expect(parseNetwork(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseNetwork(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseNetwork('string')).toBeUndefined()
    expect(parseNetwork(undefined)).toBeUndefined()
    expect(parseNetwork(null)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
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

  it('should parse all Acast feed properties when present (with #text)', () => {
    const value = {
      'acast:showid': { '#text': '664fde3eda02bb0012bad909' },
      'acast:showurl': { '#text': 'software-unscripted' },
      'acast:signature': {
        '@key': 'EXAMPLE_KEY',
        '@algorithm': 'aes-256-cbc',
        '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
      },
      'acast:settings': {
        '#text': 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
      },
      'acast:network': {
        '@id': '664fdd227c6b200013652ed6',
        '@slug': 'richard-feldman-664fdd227c6b200013652ed6',
        '#text': 'Richard Feldman',
      },
      'acast:importedfeed': { '#text': 'https://feeds.resonaterecordings.com/software-unscripted' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all Acast feed properties when present (without #text)', () => {
    const value = {
      'acast:showid': '664fde3eda02bb0012bad909',
      'acast:showurl': 'software-unscripted',
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
      'acast:importedfeed': 'https://feeds.resonaterecordings.com/software-unscripted',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed properties from arrays (uses first)', () => {
    const value = {
      'acast:showid': ['664fde3eda02bb0012bad909', 'another-id'],
      'acast:showurl': ['software-unscripted', 'another-url'],
      'acast:signature': [
        {
          '@key': 'EXAMPLE_KEY',
          '@algorithm': 'aes-256-cbc',
          '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
        },
      ],
      'acast:settings': [
        'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
        'other-settings',
      ],
      'acast:network': [
        {
          '@id': '664fdd227c6b200013652ed6',
          '@slug': 'richard-feldman-664fdd227c6b200013652ed6',
          '#text': 'Richard Feldman',
        },
      ],
      'acast:importedfeed': [
        'https://feeds.resonaterecordings.com/software-unscripted',
        'https://other.feed.com',
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with only showId', () => {
    const value = {
      'acast:showid': '664fde3eda02bb0012bad909',
    }
    const expected = {
      showId: '664fde3eda02bb0012bad909',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only showUrl', () => {
    const value = {
      'acast:showurl': 'software-unscripted',
    }
    const expected = {
      showUrl: 'software-unscripted',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only signature', () => {
    const value = {
      'acast:signature': {
        '@key': 'EXAMPLE_KEY',
        '@algorithm': 'aes-256-cbc',
      },
    }
    const expected = {
      signature: {
        key: 'EXAMPLE_KEY',
        algorithm: 'aes-256-cbc',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only settings', () => {
    const value = {
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
    }
    const expected = {
      settings: 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only network', () => {
    const value = {
      'acast:network': {
        '@id': '664fdd227c6b200013652ed6',
        '#text': 'Network Name',
      },
    }
    const expected = {
      network: {
        id: '664fdd227c6b200013652ed6',
        value: 'Network Name',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only importedFeed', () => {
    const value = {
      'acast:importedfeed': 'https://feeds.resonaterecordings.com/software-unscripted',
    }
    const expected = {
      importedFeed: 'https://feeds.resonaterecordings.com/software-unscripted',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle UUID format showId', () => {
    const value = {
      'acast:showid': '9d5c107b-68d6-4c1b-8c80-45ee6a84c947',
    }
    const expected = {
      showId: '9d5c107b-68d6-4c1b-8c80-45ee6a84c947',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'acast:showurl': { '#text': 'show-name&amp;podcast' },
      'acast:importedfeed': { '#text': 'https://example.com?foo=1&amp;bar=2' },
    }
    const expected = {
      showUrl: 'show-name&podcast',
      importedFeed: 'https://example.com?foo=1&bar=2',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'acast:settings': { '#text': '<![CDATA[encrypted-settings-blob]]>' },
    }
    const expected = {
      settings: 'encrypted-settings-blob',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing #text properties', () => {
    const value = {
      'acast:showid': {},
      'acast:showurl': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle null or undefined properties', () => {
    const value = {
      'acast:showid': null,
      'acast:showurl': undefined,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined when no valid feed properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(true)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
    expect(retrieveFeed(() => {})).toBeUndefined()
  })

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'acast:showid': {},
      'acast:showurl': null,
      'acast:settings': undefined,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle empty string values', () => {
    const value = {
      'acast:showid': { '#text': '' },
      'acast:showurl': { '#text': 'software-unscripted' },
    }
    const expected = {
      showUrl: 'software-unscripted',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'acast:showid': { '#text': '   ' },
      'acast:showurl': { '#text': '\t\n' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  const expectedFull = {
    episodeId: '6918f06ee42e3466f29467f9',
    showId: '664fde3eda02bb0012bad909',
    episodeUrl: 'jonathan-blow-on-programming-language-design',
    settings: 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
  }

  it('should parse all Acast item properties when present (with #text)', () => {
    const value = {
      'acast:episodeid': { '#text': '6918f06ee42e3466f29467f9' },
      'acast:showid': { '#text': '664fde3eda02bb0012bad909' },
      'acast:episodeurl': { '#text': 'jonathan-blow-on-programming-language-design' },
      'acast:settings': {
        '#text': 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
      },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse all Acast item properties when present (without #text)', () => {
    const value = {
      'acast:episodeid': '6918f06ee42e3466f29467f9',
      'acast:showid': '664fde3eda02bb0012bad909',
      'acast:episodeurl': 'jonathan-blow-on-programming-language-design',
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item properties from arrays (uses first)', () => {
    const value = {
      'acast:episodeid': ['6918f06ee42e3466f29467f9', 'another-id'],
      'acast:showid': ['664fde3eda02bb0012bad909', 'another-show'],
      'acast:episodeurl': ['jonathan-blow-on-programming-language-design', 'other-url'],
      'acast:settings': [
        'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
        'other-settings',
      ],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only episodeId', () => {
    const value = {
      'acast:episodeid': '6918f06ee42e3466f29467f9',
    }
    const expected = {
      episodeId: '6918f06ee42e3466f29467f9',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only showId', () => {
    const value = {
      'acast:showid': '664fde3eda02bb0012bad909',
    }
    const expected = {
      showId: '664fde3eda02bb0012bad909',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only episodeUrl', () => {
    const value = {
      'acast:episodeurl': 'jonathan-blow-on-programming-language-design',
    }
    const expected = {
      episodeUrl: 'jonathan-blow-on-programming-language-design',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only settings', () => {
    const value = {
      'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }
    const expected = {
      settings: 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'acast:episodeurl': { '#text': 'episode-name&amp;part-2' },
    }
    const expected = {
      episodeUrl: 'episode-name&part-2',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'acast:settings': { '#text': '<![CDATA[encrypted-episode-settings]]>' },
    }
    const expected = {
      settings: 'encrypted-episode-settings',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle missing #text properties', () => {
    const value = {
      'acast:episodeid': {},
      'acast:showid': {},
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle null or undefined properties', () => {
    const value = {
      'acast:episodeid': null,
      'acast:showid': undefined,
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no valid item properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem(true)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
    expect(retrieveItem(() => {})).toBeUndefined()
  })

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'acast:episodeid': {},
      'acast:showid': null,
      'acast:settings': undefined,
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle empty string values', () => {
    const value = {
      'acast:episodeid': { '#text': '' },
      'acast:showid': { '#text': '664fde3eda02bb0012bad909' },
    }
    const expected = {
      showId: '664fde3eda02bb0012bad909',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'acast:episodeid': { '#text': '   ' },
      'acast:showid': { '#text': '\t\n' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })
})
