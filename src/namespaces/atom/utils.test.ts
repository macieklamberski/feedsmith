import { describe, expect, it } from 'bun:test'
import { parseEntry, parseFeed } from './utils.js'

describe('parseEntry', () => {
  it('should parse entry with atom: prefix (with #text)', () => {
    const value = {
      'atom:title': { '#text': 'Entry Title' },
      'atom:id': { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      'atom:updated': { '#text': '2023-01-01T12:00:00Z' },
      'atom:author': [{ 'atom:name': { '#text': 'John Doe' } }],
    }
    const expected = {
      title: 'Entry Title',
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      updated: '2023-01-01T12:00:00Z',
      authors: [{ name: 'John Doe' }],
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should parse entry with atom: prefix (without #text)', () => {
    const value = {
      'atom:title': 'Entry Title',
      'atom:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      'atom:updated': '2023-01-01T12:00:00Z',
      'atom:author': [{ 'atom:name': 'John Doe' }],
    }
    const expected = {
      title: 'Entry Title',
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      updated: '2023-01-01T12:00:00Z',
      authors: [{ name: 'John Doe' }],
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should parse entry with a10: prefix (with #text)', () => {
    const value = {
      'a10:title': { '#text': 'Entry Title' },
      'a10:id': { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      'a10:updated': { '#text': '2023-01-01T12:00:00Z' },
      'a10:author': [{ 'a10:name': { '#text': 'John Doe' } }],
    }
    const expected = {
      title: 'Entry Title',
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      updated: '2023-01-01T12:00:00Z',
      authors: [{ name: 'John Doe' }],
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should parse entry with a10: prefix (without #text)', () => {
    const value = {
      'a10:title': 'Entry Title',
      'a10:id': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      'a10:updated': '2023-01-01T12:00:00Z',
      'a10:author': [{ 'a10:name': 'John Doe' }],
    }
    const expected = {
      title: 'Entry Title',
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      updated: '2023-01-01T12:00:00Z',
      authors: [{ name: 'John Doe' }],
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should return undefined for non-atom entry', () => {
    const value = {
      title: { '#text': 'Regular Title' },
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
    }

    expect(parseEntry(value)).toBeUndefined()
  })
})

describe('parseFeed', () => {
  it('should parse feed with atom: prefix', () => {
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
    const expected = {
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

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should parse feed with a10: prefix', () => {
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
    const expected = {
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

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should return undefined for non-atom feed', () => {
    const value = {
      title: { '#text': 'Regular Feed Title' },
      link: { '#text': 'https://example.com/' },
    }

    expect(parseFeed(value)).toBeUndefined()
  })
})
