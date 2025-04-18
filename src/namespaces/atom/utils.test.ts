import { describe, expect, it } from 'bun:test'
import { retrieveEntry, retrieveFeed } from './utils.js'

describe('retrieveEntry', () => {
  const expectedFull = {
    title: 'Entry Title',
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

  it('should parse partial entry with a10: prefix (with #text)', () => {
    const value = {
      'a10:title': { '#text': 'Entry Title' },
      'a10:id': { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      'a10:updated': { '#text': '2023-01-01T12:00:00Z' },
      'a10:author': [{ 'a10:name': { '#text': 'John Doe' } }],
    }

    expect(retrieveEntry(value)).toEqual(expectedFull)
  })

  it('should parse partial entry with a10: prefix (without #text)', () => {
    const value = {
      'a10:title': 'Entry Title',
      'a10:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      'a10:updated': '2023-01-01T12:00:00Z',
      'a10:author': [{ 'a10:name': 'John Doe' }],
    }

    expect(retrieveEntry(value)).toEqual(expectedFull)
  })

  it('should parse partial entry with a10: prefix (with array of values)', () => {
    const value = {
      'a10:title': ['Entry Title', 'Alternative Entry Title'],
      'a10:id': [
        'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
        'urn:uuid:2335d785-dfc9-5fcc-bbbb-90eb455efa7b',
      ],
      'a10:updated': ['2023-01-01T12:00:00Z', '2023-02-15T15:30:00Z'],
      'a10:author': [{ 'a10:name': 'John Doe' }],
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
})

describe('retrieveFeed', () => {
  const expectedFull = {
    title: 'Feed Title',
    id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
    updated: '2023-01-01T12:00:00Z',
    links: [{ href: 'https://example.com/', rel: 'alternate' }],
    entries: [
      {
        title: 'Entry Title',
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

  it('should parse feed with a10: prefix (with #text)', () => {
    const value = {
      'a10:title': { '#text': 'Feed Title' },
      'a10:id': { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      'a10:updated': { '#text': '2023-01-01T12:00:00Z' },
      'a10:link': [{ '@href': 'https://example.com/', '@rel': 'alternate' }],
      'a10:entry': [
        {
          'a10:title': { '#text': 'Entry Title' },
          'a10:id': { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with a10: prefix (without #text)', () => {
    const value = {
      'a10:title': 'Feed Title',
      'a10:id': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      'a10:updated': '2023-01-01T12:00:00Z',
      'a10:link': [{ '@href': 'https://example.com/', '@rel': 'alternate' }],
      'a10:entry': [
        {
          'a10:title': 'Entry Title',
          'a10:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with a10: prefix (with array of values)', () => {
    const value = {
      'a10:title': ['Feed Title', 'Alternative Feed Title'],
      'a10:id': [
        'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
        'urn:uuid:70b87d90-e4aa-22e9-c94D-1114949f1bf7',
      ],
      'a10:updated': ['2023-01-01T12:00:00Z', '2023-02-15T15:30:00Z'],
      'a10:link': [{ '@href': 'https://example.com/', '@rel': 'alternate' }],
      'a10:entry': [
        {
          'a10:title': 'Entry Title',
          'a10:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
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
})
