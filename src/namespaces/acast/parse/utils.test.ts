import { describe, expect, it } from 'bun:test'
import { parseNetwork, parseSignature, retrieveFeed, retrieveItem } from './utils.js'

describe('parseSignature', () => {
  it('should parse signature with all properties', () => {
    const value = {
      '@key': 'signature-key-123',
      '@algorithm': 'aes-256-cbc',
      '#text': 'U2lnbmF0dXJlVmFsdWU=',
    }
    const expected = {
      key: 'signature-key-123',
      algorithm: 'aes-256-cbc',
      value: 'U2lnbmF0dXJlVmFsdWU=',
    }

    expect(parseSignature(value)).toEqual(expected)
  })

  it('should parse signature with only key and algorithm', () => {
    const value = {
      '@key': 'signature-key-123',
      '@algorithm': 'aes-256-cbc',
    }
    const expected = {
      key: 'signature-key-123',
      algorithm: 'aes-256-cbc',
    }

    expect(parseSignature(value)).toEqual(expected)
  })

  it('should parse signature with only value', () => {
    const value = {
      '#text': 'U2lnbmF0dXJlVmFsdWU=',
    }
    const expected = {
      value: 'U2lnbmF0dXJlVmFsdWU=',
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
      '@id': 'net123abc456def789ghi012',
      '@slug': 'example-network-net123abc456',
      '#text': 'Example Network',
    }
    const expected = {
      id: 'net123abc456def789ghi012',
      slug: 'example-network-net123abc456',
      value: 'Example Network',
    }

    expect(parseNetwork(value)).toEqual(expected)
  })

  it('should parse network with only id and slug', () => {
    const value = {
      '@id': 'net123abc456def789ghi012',
      '@slug': 'network-slug',
    }
    const expected = {
      id: 'net123abc456def789ghi012',
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
    showId: 'abc123def456ghi789jkl012',
    showUrl: 'example-podcast',
    signature: {
      key: 'signature-key-123',
      algorithm: 'aes-256-cbc',
      value: 'U2lnbmF0dXJlVmFsdWU=',
    },
    settings: 'RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0',
    network: {
      id: 'net123abc456def789ghi012',
      slug: 'example-network-net123abc456',
      value: 'Example Network',
    },
    importedFeed: 'https://example.com/original-feed',
  }

  it('should parse all Acast feed properties when present (with #text)', () => {
    const value = {
      'acast:showid': { '#text': 'abc123def456ghi789jkl012' },
      'acast:showurl': { '#text': 'example-podcast' },
      'acast:signature': {
        '@key': 'signature-key-123',
        '@algorithm': 'aes-256-cbc',
        '#text': 'U2lnbmF0dXJlVmFsdWU=',
      },
      'acast:settings': {
        '#text': 'RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0',
      },
      'acast:network': {
        '@id': 'net123abc456def789ghi012',
        '@slug': 'example-network-net123abc456',
        '#text': 'Example Network',
      },
      'acast:importedfeed': { '#text': 'https://example.com/original-feed' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all Acast feed properties when present (without #text)', () => {
    const value = {
      'acast:showid': 'abc123def456ghi789jkl012',
      'acast:showurl': 'example-podcast',
      'acast:signature': {
        '@key': 'signature-key-123',
        '@algorithm': 'aes-256-cbc',
        '#text': 'U2lnbmF0dXJlVmFsdWU=',
      },
      'acast:settings': 'RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0',
      'acast:network': {
        '@id': 'net123abc456def789ghi012',
        '@slug': 'example-network-net123abc456',
        '#text': 'Example Network',
      },
      'acast:importedfeed': 'https://example.com/original-feed',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed properties from arrays (uses first)', () => {
    const value = {
      'acast:showid': ['abc123def456ghi789jkl012', 'another-id'],
      'acast:showurl': ['example-podcast', 'another-url'],
      'acast:signature': [
        {
          '@key': 'signature-key-123',
          '@algorithm': 'aes-256-cbc',
          '#text': 'U2lnbmF0dXJlVmFsdWU=',
        },
      ],
      'acast:settings': ['RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0', 'other-settings'],
      'acast:network': [
        {
          '@id': 'net123abc456def789ghi012',
          '@slug': 'example-network-net123abc456',
          '#text': 'Example Network',
        },
      ],
      'acast:importedfeed': ['https://example.com/original-feed', 'https://other.feed.com'],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with only showId', () => {
    const value = {
      'acast:showid': 'abc123def456ghi789jkl012',
    }
    const expected = {
      showId: 'abc123def456ghi789jkl012',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only showUrl', () => {
    const value = {
      'acast:showurl': 'example-podcast',
    }
    const expected = {
      showUrl: 'example-podcast',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only signature', () => {
    const value = {
      'acast:signature': {
        '@key': 'signature-key-123',
        '@algorithm': 'aes-256-cbc',
      },
    }
    const expected = {
      signature: {
        key: 'signature-key-123',
        algorithm: 'aes-256-cbc',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only settings', () => {
    const value = {
      'acast:settings': 'RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0',
    }
    const expected = {
      settings: 'RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only network', () => {
    const value = {
      'acast:network': {
        '@id': 'net123abc456def789ghi012',
        '#text': 'Network Name',
      },
    }
    const expected = {
      network: {
        id: 'net123abc456def789ghi012',
        value: 'Network Name',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only importedFeed', () => {
    const value = {
      'acast:importedfeed': 'https://example.com/original-feed',
    }
    const expected = {
      importedFeed: 'https://example.com/original-feed',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle UUID format showId', () => {
    const value = {
      'acast:showid': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }
    const expected = {
      showId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
      'acast:showurl': { '#text': 'example-podcast' },
    }
    const expected = {
      showUrl: 'example-podcast',
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
    episodeId: 'ep1234abc567def890ghi123',
    showId: 'abc123def456ghi789jkl012',
    episodeUrl: 'example-episode-title',
    settings: 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
  }

  it('should parse all Acast item properties when present (with #text)', () => {
    const value = {
      'acast:episodeid': { '#text': 'ep1234abc567def890ghi123' },
      'acast:showid': { '#text': 'abc123def456ghi789jkl012' },
      'acast:episodeurl': { '#text': 'example-episode-title' },
      'acast:settings': {
        '#text': 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
      },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse all Acast item properties when present (without #text)', () => {
    const value = {
      'acast:episodeid': 'ep1234abc567def890ghi123',
      'acast:showid': 'abc123def456ghi789jkl012',
      'acast:episodeurl': 'example-episode-title',
      'acast:settings': 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item properties from arrays (uses first)', () => {
    const value = {
      'acast:episodeid': ['ep1234abc567def890ghi123', 'another-id'],
      'acast:showid': ['abc123def456ghi789jkl012', 'another-show'],
      'acast:episodeurl': ['example-episode-title', 'other-url'],
      'acast:settings': ['RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==', 'other-settings'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only episodeId', () => {
    const value = {
      'acast:episodeid': 'ep1234abc567def890ghi123',
    }
    const expected = {
      episodeId: 'ep1234abc567def890ghi123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only showId', () => {
    const value = {
      'acast:showid': 'abc123def456ghi789jkl012',
    }
    const expected = {
      showId: 'abc123def456ghi789jkl012',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only episodeUrl', () => {
    const value = {
      'acast:episodeurl': 'example-episode-title',
    }
    const expected = {
      episodeUrl: 'example-episode-title',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only settings', () => {
    const value = {
      'acast:settings': 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }
    const expected = {
      settings: 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
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
      'acast:showid': { '#text': 'abc123def456ghi789jkl012' },
    }
    const expected = {
      showId: 'abc123def456ghi789jkl012',
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
