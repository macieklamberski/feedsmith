import { describe, expect, it } from 'bun:test'
import { parseTopic, parseTopics, retrieveFeed, retrieveItemOrFeed } from './utils.js'

describe('parseTopics', () => {
  it('should parse topic URIs from rdf:resource', () => {
    const value = {
      bag: {
        li: [
          { '@resource': 'https://example.com/u:user/t:rss' },
          { '@resource': 'https://example.com/u:user/t:xml' },
        ],
      },
    }
    const expected = ['https://example.com/u:user/t:rss', 'https://example.com/u:user/t:xml']

    expect(parseTopics(value)).toEqual(expected)
  })

  it('should parse single topic URI', () => {
    const value = {
      bag: { li: { '@resource': 'https://example.com/u:user/t:rss' } },
    }
    const expected = ['https://example.com/u:user/t:rss']

    expect(parseTopics(value)).toEqual(expected)
  })

  it('should parse prefixed rdf:resource attribute', () => {
    const value = {
      bag: { li: { '@rdf:resource': 'https://example.com/u:user/t:rss' } },
    }
    const expected = ['https://example.com/u:user/t:rss']

    expect(parseTopics(value)).toEqual(expected)
  })

  it('should parse topic given as text', () => {
    const value = {
      bag: { li: { '#text': 'https://example.com/u:user/t:rss' } },
    }
    const expected = ['https://example.com/u:user/t:rss']

    expect(parseTopics(value)).toEqual(expected)
  })

  it('should handle HTML entities in topic URI', () => {
    const value = {
      bag: { li: { '@resource': 'https://example.com/tags?name=rss&amp;lang=en' } },
    }
    const expected = ['https://example.com/tags?name=rss&lang=en']

    expect(parseTopics(value)).toEqual(expected)
  })

  it('should skip empty and whitespace-only topics', () => {
    const value = {
      bag: {
        li: [
          { '@resource': '' },
          { '@resource': '   ' },
          { '@resource': 'https://example.com/u:user/t:rss' },
        ],
      },
    }
    const expected = ['https://example.com/u:user/t:rss']

    expect(parseTopics(value)).toEqual(expected)
  })

  it('should return undefined for empty bag', () => {
    expect(parseTopics({ bag: {} })).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseTopics({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseTopics('not an object')).toBeUndefined()
    expect(parseTopics(undefined)).toBeUndefined()
    expect(parseTopics(null)).toBeUndefined()
    expect(parseTopics([])).toBeUndefined()
  })
})

describe('parseTopic', () => {
  it('should parse complete topic', () => {
    const value = {
      '@about': 'https://example.com/category/xml',
      'taxo:link': { '#text': 'https://example.com/category/xml' },
      'taxo:topics': {
        bag: { li: { '@resource': 'https://example.com/category/sgml' } },
      },
    }
    const expected = {
      about: 'https://example.com/category/xml',
      link: 'https://example.com/category/xml',
      topics: ['https://example.com/category/sgml'],
    }

    expect(parseTopic(value)).toEqual(expected)
  })

  it('should parse Dublin Core elements on topic', () => {
    const value = {
      '@about': 'https://example.com/category/xml',
      'taxo:link': { '#text': 'https://example.com/category/xml' },
      'dc:title': { '#text': 'XML' },
      'dc:subject': { '#text': 'XML' },
      'dc:description': { '#text': 'Directory category' },
    }
    const expected = {
      about: 'https://example.com/category/xml',
      link: 'https://example.com/category/xml',
      dc: {
        titles: ['XML'],
        subjects: ['XML'],
        descriptions: ['Directory category'],
      },
    }

    expect(parseTopic(value)).toEqual(expected)
  })

  it('should parse topic with only rdf:about', () => {
    const value = {
      '@about': 'https://example.com/category/xml',
    }
    const expected = {
      about: 'https://example.com/category/xml',
    }

    expect(parseTopic(value)).toEqual(expected)
  })

  it('should parse prefixed rdf:about attribute', () => {
    const value = {
      '@rdf:about': 'https://example.com/category/xml',
    }
    const expected = {
      about: 'https://example.com/category/xml',
    }

    expect(parseTopic(value)).toEqual(expected)
  })

  it('should handle HTML entities in link', () => {
    const value = {
      'taxo:link': { '#text': 'https://example.com/category?name=xml&amp;lang=en' },
    }
    const expected = {
      link: 'https://example.com/category?name=xml&lang=en',
    }

    expect(parseTopic(value)).toEqual(expected)
  })

  it('should handle CDATA in link', () => {
    const value = {
      'taxo:link': { '#text': '<![CDATA[https://example.com/category/xml]]>' },
    }
    const expected = {
      link: 'https://example.com/category/xml',
    }

    expect(parseTopic(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      '@about': '',
      'taxo:link': { '#text': '' },
    }

    expect(parseTopic(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      '@about': '   ',
      'taxo:link': { '#text': '   ' },
    }

    expect(parseTopic(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseTopic({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseTopic('not an object')).toBeUndefined()
    expect(parseTopic(undefined)).toBeUndefined()
    expect(parseTopic(null)).toBeUndefined()
    expect(parseTopic([])).toBeUndefined()
  })
})

describe('retrieveItemOrFeed', () => {
  it('should parse topics', () => {
    const value = {
      'taxo:topics': {
        bag: {
          li: [
            { '@resource': 'https://example.com/tag/llm' },
            { '@resource': 'https://example.com/tag/ai' },
          ],
        },
      },
    }
    const expected = {
      topics: ['https://example.com/tag/llm', 'https://example.com/tag/ai'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should use first taxo:topics when repeated', () => {
    const value = {
      'taxo:topics': [
        { bag: { li: { '@resource': 'https://example.com/tag/llm' } } },
        { bag: { li: { '@resource': 'https://example.com/tag/ai' } } },
      ],
    }
    const expected = {
      topics: ['https://example.com/tag/llm'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty topics', () => {
    const value = {
      'taxo:topics': { '#text': '' },
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItemOrFeed('not an object')).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse channel topics and root topics', () => {
    const value = {
      channel: {
        'taxo:topics': {
          bag: { li: { '@resource': 'https://example.com/category/xml' } },
        },
      },
      'taxo:topic': [
        {
          '@about': 'https://example.com/category/xml',
          'taxo:link': { '#text': 'https://example.com/category/xml' },
        },
        {
          '@about': 'https://example.com/category/sgml',
          'taxo:link': { '#text': 'https://example.com/category/sgml' },
        },
      ],
    }
    const expected = {
      topics: ['https://example.com/category/xml'],
      topicDefinitions: [
        {
          about: 'https://example.com/category/xml',
          link: 'https://example.com/category/xml',
        },
        {
          about: 'https://example.com/category/sgml',
          link: 'https://example.com/category/sgml',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse channel topics alone', () => {
    const value = {
      channel: {
        'taxo:topics': {
          bag: { li: { '@resource': 'https://example.com/category/xml' } },
        },
      },
    }
    const expected = {
      topics: ['https://example.com/category/xml'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse root topic alone', () => {
    const value = {
      channel: {},
      'taxo:topic': {
        '@about': 'https://example.com/category/xml',
      },
    }
    const expected = {
      topicDefinitions: [{ about: 'https://example.com/category/xml' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should pass options to Dublin Core on root topics', () => {
    const value = {
      channel: {},
      'taxo:topic': {
        '@about': 'https://example.com/category/xml',
        'dc:date': { '#text': '2024-01-02T03:04:05Z' },
      },
    }
    const options = { parseDateFn: (raw: string) => new Date(raw) }
    const expected = {
      topicDefinitions: [
        {
          about: 'https://example.com/category/xml',
          dc: { dates: [new Date('2024-01-02T03:04:05Z')] },
        },
      ],
    }

    expect(retrieveFeed(value, options)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})
