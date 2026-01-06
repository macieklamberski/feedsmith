import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem, generateNetwork, generateSignature } from './utils.js'

describe('generateSignature', () => {
  it('should generate signature with all properties', () => {
    const value = {
      key: 'signature-key-123',
      algorithm: 'aes-256-cbc',
      value: 'U2lnbmF0dXJlVmFsdWU=',
    }
    const expected = {
      '@key': 'signature-key-123',
      '@algorithm': 'aes-256-cbc',
      '#text': 'U2lnbmF0dXJlVmFsdWU=',
    }

    expect(generateSignature(value)).toEqual(expected)
  })

  it('should generate signature with only key and algorithm', () => {
    const value = {
      key: 'signature-key-123',
      algorithm: 'aes-256-cbc',
    }
    const expected = {
      '@key': 'signature-key-123',
      '@algorithm': 'aes-256-cbc',
    }

    expect(generateSignature(value)).toEqual(expected)
  })

  it('should generate signature with only value', () => {
    const value = {
      value: 'U2lnbmF0dXJlVmFsdWU=',
    }
    const expected = {
      '#text': 'U2lnbmF0dXJlVmFsdWU=',
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
      id: 'net123abc456def789ghi012',
      slug: 'example-network-net123abc456',
      value: 'Example Network',
    }
    const expected = {
      '@id': 'net123abc456def789ghi012',
      '@slug': 'example-network-net123abc456',
      '#text': 'Example Network',
    }

    expect(generateNetwork(value)).toEqual(expected)
  })

  it('should generate network with only id and slug', () => {
    const value = {
      id: 'net123abc456def789ghi012',
      slug: 'network-slug',
    }
    const expected = {
      '@id': 'net123abc456def789ghi012',
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
    const expected = {
      'acast:showId': 'abc123def456ghi789jkl012',
      'acast:showUrl': 'example-podcast',
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
      'acast:importedFeed': 'https://example.com/original-feed',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only showId', () => {
    const value = {
      showId: 'abc123def456ghi789jkl012',
    }
    const expected = {
      'acast:showId': 'abc123def456ghi789jkl012',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only showUrl', () => {
    const value = {
      showUrl: 'example-podcast',
    }
    const expected = {
      'acast:showUrl': 'example-podcast',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only signature', () => {
    const value = {
      signature: {
        key: 'signature-key-123',
        algorithm: 'aes-256-cbc',
      },
    }
    const expected = {
      'acast:signature': {
        '@key': 'signature-key-123',
        '@algorithm': 'aes-256-cbc',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only settings', () => {
    const value = {
      settings: 'RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0',
    }
    const expected = {
      'acast:settings': 'RW5jcnlwdGVkU2V0dGluZ3NEYXRhQmFzZTY0',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only network', () => {
    const value = {
      network: {
        id: 'net123abc456def789ghi012',
        value: 'Network Name',
      },
    }
    const expected = {
      'acast:network': {
        '@id': 'net123abc456def789ghi012',
        '#text': 'Network Name',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only importedFeed', () => {
    const value = {
      importedFeed: 'https://example.com/original-feed',
    }
    const expected = {
      'acast:importedFeed': 'https://example.com/original-feed',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle UUID format showId', () => {
    const value = {
      showId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }
    const expected = {
      'acast:showId': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      showId: '',
      showUrl: 'example-podcast',
    }
    const expected = {
      'acast:showUrl': 'example-podcast',
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
      showId: 'abc123def456ghi789jkl012',
      showUrl: 'example-podcast',
      importedFeed: 'https://example.com/original-feed',
    }
    const expected = {
      'acast:showId': 'abc123def456ghi789jkl012',
      'acast:showUrl': 'example-podcast',
      'acast:importedFeed': 'https://example.com/original-feed',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle mixed empty and valid strings', () => {
    const value = {
      showId: '',
      showUrl: 'example-podcast',
      settings: '   ',
      importedFeed: 'https://example.com/original-feed',
    }
    const expected = {
      'acast:showUrl': 'example-podcast',
      'acast:importedFeed': 'https://example.com/original-feed',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      episodeId: 'ep1234abc567def890ghi123',
      showId: 'abc123def456ghi789jkl012',
      episodeUrl: 'example-episode-title',
      settings: 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }
    const expected = {
      'acast:episodeId': 'ep1234abc567def890ghi123',
      'acast:showId': 'abc123def456ghi789jkl012',
      'acast:episodeUrl': 'example-episode-title',
      'acast:settings': 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only episodeId', () => {
    const value = {
      episodeId: 'ep1234abc567def890ghi123',
    }
    const expected = {
      'acast:episodeId': 'ep1234abc567def890ghi123',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only showId', () => {
    const value = {
      showId: 'abc123def456ghi789jkl012',
    }
    const expected = {
      'acast:showId': 'abc123def456ghi789jkl012',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only episodeUrl', () => {
    const value = {
      episodeUrl: 'example-episode-title',
    }
    const expected = {
      'acast:episodeUrl': 'example-episode-title',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only settings', () => {
    const value = {
      settings: 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }
    const expected = {
      'acast:settings': 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      episodeId: '',
      showId: 'abc123def456ghi789jkl012',
    }
    const expected = {
      'acast:showId': 'abc123def456ghi789jkl012',
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
      episodeId: 'ep1234abc567def890ghi123',
      showId: 'abc123def456ghi789jkl012',
    }
    const expected = {
      'acast:episodeId': 'ep1234abc567def890ghi123',
      'acast:showId': 'abc123def456ghi789jkl012',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle mixed empty and valid strings', () => {
    const value = {
      episodeId: '',
      showId: 'abc123def456ghi789jkl012',
      episodeUrl: '   ',
      settings: 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }
    const expected = {
      'acast:showId': 'abc123def456ghi789jkl012',
      'acast:settings': 'RXBpc29kZVNldHRpbmdzQmFzZTY0RW5jb2RlZA==',
    }

    expect(generateItem(value)).toEqual(expected)
  })
})
