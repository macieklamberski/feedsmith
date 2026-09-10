import { describe, expect, it } from 'bun:test'
import { retrieveEntry, retrieveFeed } from './utils.js'

describe('retrieveEntry', () => {
  const expectedFull = {
    title: { value: 'Entry Title' },
    id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
    updated: '2023-01-01T12:00:00Z',
    authors: [{ name: 'John Doe' }],
  }

  it('should parse partial entry with atom: prefix (with #text)', () => {
    const value = {
      'atom:title': { '#text': 'Entry Title' },
      'atom:id': { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      'atom:updated': { '#text': '2023-01-01T12:00:00Z' },
      'atom:author': [{ 'atom:name': { '#text': 'John Doe' } }],
    }

    expect(retrieveEntry(value)).toEqual(expectedFull)
  })

  it('should parse partial entry with atom: prefix (without #text)', () => {
    const value = {
      'atom:title': 'Entry Title',
      'atom:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      'atom:updated': '2023-01-01T12:00:00Z',
      'atom:author': [{ 'atom:name': 'John Doe' }],
    }

    expect(retrieveEntry(value)).toEqual(expectedFull)
  })

  it('should parse partial entry with atom: prefix (with array of values)', () => {
    const value = {
      'atom:title': ['Entry Title', 'Alternative Entry Title'],
      'atom:id': [
        'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
        'urn:uuid:2335d785-dfc9-5fcc-bbbb-90eb455efa7b',
      ],
      'atom:updated': ['2023-01-01T12:00:00Z', '2023-02-15T15:30:00Z'],
      'atom:author': [{ 'atom:name': 'John Doe' }],
    }

    expect(retrieveEntry(value)).toEqual(expectedFull)
  })

  it('should return undefined for non-atom entry', () => {
    const value = {
      title: { '#text': 'Regular Title' },
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should handle empty strings', () => {
    const value = {
      'atom:id': '',
      'atom:title': 'Entry Title',
    }
    const expected = {
      title: { value: 'Entry Title' },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'atom:id': '   ',
      'atom:title': '\t\n',
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should handle null and undefined properties', () => {
    const value = {
      'atom:id': null,
      'atom:title': undefined,
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveEntry('string')).toBeUndefined()
    expect(retrieveEntry(123)).toBeUndefined()
    expect(retrieveEntry(true)).toBeUndefined()
    expect(retrieveEntry(null)).toBeUndefined()
    expect(retrieveEntry(undefined)).toBeUndefined()
    expect(retrieveEntry([])).toBeUndefined()
  })

  it.todo('should parse updated date with custom parseDateFn', () => {
    // Pass options.parseDateFn that maps the updated string to a Date instance.
    // Expected: updated equals the value returned by the custom parser instead of the raw string.
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    title: { value: 'Feed Title' },
    id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
    updated: '2023-01-01T12:00:00Z',
    links: [{ href: 'https://example.com/', rel: 'alternate' }],
    entries: [
      {
        title: { value: 'Entry Title' },
        id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      },
    ],
  }

  it('should parse feed with atom: prefix (with #text)', () => {
    const value = {
      'atom:title': { '#text': 'Feed Title' },
      'atom:id': { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      'atom:updated': { '#text': '2023-01-01T12:00:00Z' },
      'atom:link': [{ '@href': 'https://example.com/', '@rel': 'alternate' }],
      'atom:entry': [
        {
          'atom:title': { '#text': 'Entry Title' },
          'atom:id': { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with atom: prefix (without #text)', () => {
    const value = {
      'atom:title': 'Feed Title',
      'atom:id': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      'atom:updated': '2023-01-01T12:00:00Z',
      'atom:link': [{ '@href': 'https://example.com/', '@rel': 'alternate' }],
      'atom:entry': [
        {
          'atom:title': 'Entry Title',
          'atom:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with atom: prefix (with array of values)', () => {
    const value = {
      'atom:title': ['Feed Title', 'Alternative Feed Title'],
      'atom:id': [
        'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
        'urn:uuid:70b87d90-e4aa-22e9-c94D-1114949f1bf7',
      ],
      'atom:updated': ['2023-01-01T12:00:00Z', '2023-02-15T15:30:00Z'],
      'atom:link': [{ '@href': 'https://example.com/', '@rel': 'alternate' }],
      'atom:entry': [
        {
          'atom:title': 'Entry Title',
          'atom:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should return undefined for non-atom feed', () => {
    const value = {
      title: { '#text': 'Regular Feed Title' },
      link: { '#text': 'https://example.com/' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle empty strings', () => {
    const value = {
      'atom:id': '',
      'atom:title': 'Feed Title',
    }
    const expected = {
      title: { value: 'Feed Title' },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'atom:id': '   ',
      'atom:title': '\t\n',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle null and undefined properties', () => {
    const value = {
      'atom:id': null,
      'atom:title': undefined,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(true)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })

  it.todo('should parse updated date with custom parseDateFn', () => {
    // Pass options.parseDateFn that maps the updated string to a Date instance.
    // Expected: updated equals the value returned by the custom parser instead of the raw string.
  })
})
