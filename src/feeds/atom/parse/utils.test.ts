import { describe, expect, it } from 'bun:test'
import {
  parseCategory,
  parseEntry,
  parseFeed,
  parseGenerator,
  parseLink,
  parsePerson,
  parseSource,
  retrieveFeed,
  retrieveGeneratorUri,
  retrievePersonUri,
  retrievePublished,
  retrieveSubtitle,
  retrieveUpdated,
} from './utils'

describe('parseLink', () => {
  it('should parse complete link object', () => {
    const value = {
      '@href': 'https://example.com/feed',
      '@rel': 'self',
      '@type': 'application/atom+xml',
      '@hreflang': 'en-US',
      '@title': 'Feed Link',
      '@length': 12345,
    }
    const expected = {
      href: 'https://example.com/feed',
      rel: 'self',
      type: 'application/atom+xml',
      hreflang: 'en-US',
      title: 'Feed Link',
      length: 12345,
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should parse link with only required href', () => {
    const value = {
      '@href': 'https://example.com/feed',
    }
    const expected = {
      href: 'https://example.com/feed',
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@href': 'https://example.com/feed',
      '@rel': 123,
      '@type': true,
      '@length': '5000',
    }

    const expected = {
      href: 'https://example.com/feed',
      rel: '123',
      length: 5000,
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should return undefined if href is missing', () => {
    const value = {
      rel: 'alternate',
      type: 'text/html',
    }

    expect(parseLink(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseLink('not an object')).toBeUndefined()
    expect(parseLink(undefined)).toBeUndefined()
    expect(parseLink(null)).toBeUndefined()
    expect(parseLink([])).toBeUndefined()
  })
})

describe('retrievePersonUri', () => {
  it('should prioritize uri (Atom 1.0)', () => {
    const value = {
      uri: { '#text': 'http://example-uri.com' },
      url: { '#text': 'http://example-url.com' },
    }

    expect(retrievePersonUri(value)).toBe('http://example-uri.com')
  })

  it('should fall back to url (Atom 0.3) if uri is missing', () => {
    const value = {
      url: { '#text': 'http://example-url.com' },
    }

    expect(retrievePersonUri(value)).toBe('http://example-url.com')
  })

  it('should return undefined if no uri fields exist', () => {
    const value = {
      name: { '#text': 'No uris here' },
    }

    expect(retrievePersonUri(value)).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      uri: { '#text': 20230101 },
    }

    expect(retrievePersonUri(value)).toBe('20230101')
  })

  it('should return undefined for non-object input', () => {
    expect(retrievePersonUri('not an object')).toBeUndefined()
    expect(retrievePersonUri(undefined)).toBeUndefined()
    expect(retrievePersonUri(null)).toBeUndefined()
    expect(retrievePersonUri([])).toBeUndefined()
  })
})

describe('parsePerson', () => {
  it('should parse complete person object (Atom 1.0)', () => {
    const value = {
      name: { '#text': 'John Doe' },
      uri: { '#text': 'https://example.com/johndoe' },
      email: { '#text': 'john@example.com' },
    }
    const expected = {
      name: 'John Doe',
      uri: 'https://example.com/johndoe',
      email: 'john@example.com',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse complete person object (Atom 0.3)', () => {
    const value = {
      name: { '#text': 'John Doe' },
      url: { '#text': 'https://example.com/johndoe' },
      email: { '#text': 'john@example.com' },
    }
    const expected = {
      name: 'John Doe',
      uri: 'https://example.com/johndoe',
      email: 'john@example.com',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse person with only required name', () => {
    const value = {
      name: { '#text': 'John Doe' },
    }
    const expected = {
      name: 'John Doe',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      name: { '#text': 123 },
      uri: { '#text': true },
      email: { '#text': 456 },
    }
    const expected = {
      name: '123',
      email: '456',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should return undefined if name is missing', () => {
    const value = {
      uri: { '#text': 'https://example.com/johndoe' },
      email: { '#text': 'john@example.com' },
    }

    expect(parsePerson(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parsePerson('not an object')).toBeUndefined()
    expect(parsePerson(undefined)).toBeUndefined()
    expect(parsePerson(null)).toBeUndefined()
    expect(parsePerson([])).toBeUndefined()
  })
})

describe('parseCategory', () => {
  it('should parse complete category object', () => {
    const value = {
      '@term': 'technology',
      '@scheme': 'http://example.com/categories/',
      '@label': 'Technology',
    }
    const expected = {
      term: 'technology',
      scheme: 'http://example.com/categories/',
      label: 'Technology',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should parse category with only required term', () => {
    const value = {
      '@term': 'technology',
    }
    const expected = {
      term: 'technology',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@term': 123,
      '@scheme': true,
      '@label': 456,
    }
    const expected = {
      term: '123',
      label: '456',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should return undefined if term is missing', () => {
    const value = {
      '@scheme': 'http://example.com/categories/',
      '@label': 'Technology',
    }

    expect(parseCategory(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseCategory('not an object')).toBeUndefined()
    expect(parseCategory(undefined)).toBeUndefined()
    expect(parseCategory(null)).toBeUndefined()
    expect(parseCategory([])).toBeUndefined()
  })
})

describe('retrieveGeneratorUri', () => {
  it('should prioritize uri (Atom 1.0)', () => {
    const value = {
      '@uri': 'http://example-uri.com',
      '@url': 'http://example-url.com',
    }

    expect(retrieveGeneratorUri(value)).toBe('http://example-uri.com')
  })

  it('should fall back to url (Atom 0.3) if uri is missing', () => {
    const value = {
      '@url': 'http://example-url.com',
    }

    expect(retrieveGeneratorUri(value)).toBe('http://example-url.com')
  })

  it('should return undefined if no uri attributes exist', () => {
    const value = {
      text: { '#text': 'Generator name' },
    }

    expect(retrieveGeneratorUri(value)).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      '@uri': 20230101,
    }

    expect(retrieveGeneratorUri(value)).toBe('20230101')
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveGeneratorUri('not an object')).toBeUndefined()
    expect(retrieveGeneratorUri(undefined)).toBeUndefined()
    expect(retrieveGeneratorUri(null)).toBeUndefined()
    expect(retrieveGeneratorUri([])).toBeUndefined()
  })
})

describe('parseGenerator', () => {
  it('should parse complete generator object (Atom 1.0)', () => {
    const value = {
      '#text': 'Example Generator',
      '@uri': 'https://example.com/generator',
      '@version': '1.0',
    }
    const expected = {
      text: 'Example Generator',
      uri: 'https://example.com/generator',
      version: '1.0',
    }

    expect(parseGenerator(value)).toEqual(expected)
  })

  it('should parse complete generator object (Atom 0.3)', () => {
    const value = {
      '#text': 'Example Generator',
      '@url': 'https://example.com/generator',
      '@version': '1.0',
    }
    const expected = {
      text: 'Example Generator',
      uri: 'https://example.com/generator',
      version: '1.0',
    }

    expect(parseGenerator(value)).toEqual(expected)
  })

  it('should parse generator with only required text', () => {
    const value = {
      '#text': 'Example Generator',
    }
    const expected = {
      text: 'Example Generator',
    }

    expect(parseGenerator(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@uri': true,
      '@version': 456,
    }
    const expected = {
      text: '123',
      version: '456',
    }

    expect(parseGenerator(value)).toEqual(expected)
  })

  it('should return undefined if text is missing', () => {
    const value = {
      '@uri': 'https://example.com/generator',
      '@version': '1.0',
    }

    expect(parseGenerator(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseGenerator('not an object')).toBeUndefined()
    expect(parseGenerator(undefined)).toBeUndefined()
    expect(parseGenerator(null)).toBeUndefined()
    expect(parseGenerator([])).toBeUndefined()
  })
})

describe('parseSource', () => {
  it('should parse complete source object', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6' },
      title: { '#text': 'Example Feed' },
      updated: { '#text': '2003-12-13T18:30:02Z' },
      author: [{ name: { '#text': 'John Doe' } }],
      link: [{ '@href': 'https://example.com/' }],
      category: [{ '@term': 'technology' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      generator: { '#text': 'Example Generator' },
      icon: { '#text': 'https://example.com/favicon.ico' },
      logo: { '#text': 'https://example.com/logo.png' },
      rights: { '#text': 'Copyright 2003, Example Corp.' },
      subtitle: { '#text': 'A blog about examples' },
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6',
      title: 'Example Feed',
      updated: '2003-12-13T18:30:02Z',
      authors: [{ name: 'John Doe' }],
      links: [{ href: 'https://example.com/' }],
      categories: [{ term: 'technology' }],
      contributors: [{ name: 'Jane Smith' }],
      generator: { text: 'Example Generator' },
      icon: 'https://example.com/favicon.ico',
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2003, Example Corp.',
      subtitle: 'A blog about examples',
    }
    expect(parseSource(value)).toEqual(expected)
  })

  it('should parse source with minimal properties', () => {
    const value = {
      title: { '#text': 'Example Feed' },
    }
    const expected = {
      title: 'Example Feed',
    }
    expect(parseSource(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      id: { '#text': '123' },
      title: { '#text': '456' },
      link: [{ '@href': 'https://example.com/' }],
    }
    const expected = {
      id: '123',
      title: '456',
      links: [{ href: 'https://example.com/' }],
    }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should return undefined if no properties are valid', () => {
    const value = {
      nonExistingProp: { '#text': 'value' },
    }
    expect(parseSource(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSource('not an object')).toBeUndefined()
    expect(parseSource(undefined)).toBeUndefined()
    expect(parseSource(null)).toBeUndefined()
    expect(parseSource([])).toBeUndefined()
  })
})

describe('retrievePublished', () => {
  it('should prioritize published (Atom 1.0)', () => {
    const value = {
      published: { '#text': '2023-01-01T12:00:00Z' },
      issued: { '#text': '2023-01-02T12:00:00Z' },
      created: { '#text': '2023-01-03T12:00:00Z' },
    }

    expect(retrievePublished(value)).toBe('2023-01-01T12:00:00Z')
  })

  it('should fall back to issued (Atom 0.3) if published is missing', () => {
    const value = {
      issued: { '#text': '2023-01-02T12:00:00Z' },
      created: { '#text': '2023-01-03T12:00:00Z' },
    }

    expect(retrievePublished(value)).toBe('2023-01-02T12:00:00Z')
  })

  it('should fall back to created (Atom 0.3) if published and issued are missing', () => {
    const value = {
      created: { '#text': '2023-01-03T12:00:00Z' },
    }

    expect(retrievePublished(value)).toBe('2023-01-03T12:00:00Z')
  })

  it('should return undefined if no date fields exist', () => {
    const value = {
      title: { '#text': 'No dates here' },
    }

    expect(retrievePublished(value)).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      published: { '#text': '20230101' },
    }

    expect(retrievePublished(value)).toBe('20230101')
  })

  it('should return undefined for non-object input', () => {
    expect(retrievePublished('not an object')).toBeUndefined()
    expect(retrievePublished(undefined)).toBeUndefined()
    expect(retrievePublished(null)).toBeUndefined()
    expect(retrievePublished([])).toBeUndefined()
  })
})

describe('retrieveUpdated', () => {
  it('should prioritize updated (Atom 1.0)', () => {
    const value = {
      updated: { '#text': '2023-01-01T12:00:00Z' },
      modified: { '#text': '2023-01-02T12:00:00Z' },
    }

    expect(retrieveUpdated(value)).toBe('2023-01-01T12:00:00Z')
  })

  it('should fall back to modified (Atom 0.3) if updated is missing', () => {
    const value = {
      modified: { '#text': '2023-01-02T12:00:00Z' },
    }

    expect(retrieveUpdated(value)).toBe('2023-01-02T12:00:00Z')
  })

  it('should return undefined if no date fields exist', () => {
    const value = {
      title: { '#text': 'No dates here' },
    }

    expect(retrieveUpdated(value)).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      updated: { '#text': 20230101 },
    }

    expect(retrieveUpdated(value)).toBe('20230101')
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveUpdated('not an object')).toBeUndefined()
    expect(retrieveUpdated(undefined)).toBeUndefined()
    expect(retrieveUpdated(null)).toBeUndefined()
    expect(retrieveUpdated([])).toBeUndefined()
  })
})

describe('retrieveSubtitle', () => {
  it('should prioritize subtitle (Atom 1.0)', () => {
    const value = {
      subtitle: { '#text': 'Feed subtitle' },
      tagline: { '#text': 'Feed tagline' },
    }

    expect(retrieveSubtitle(value)).toBe('Feed subtitle')
  })

  it('should fall back to tagline (Atom 0.3) if subtitle is missing', () => {
    const value = {
      tagline: { '#text': 'Feed tagline' },
    }

    expect(retrieveSubtitle(value)).toBe('Feed tagline')
  })

  it('should return undefined if no subtitle fields exist', () => {
    const value = {
      title: { '#text': 'No subtitle here' },
    }

    expect(retrieveSubtitle(value)).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      subtitle: { '#text': 123 },
    }

    expect(retrieveSubtitle(value)).toBe('123')
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveSubtitle('not an object')).toBeUndefined()
    expect(retrieveSubtitle(undefined)).toBeUndefined()
    expect(retrieveSubtitle(null)).toBeUndefined()
    expect(retrieveSubtitle([])).toBeUndefined()
  })
})

describe('parseEntry', () => {
  it('should parse complete entry object', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Entry Title' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
      author: [{ name: { '#text': 'John Doe' } }],
      content: { '#text': '<p>Entry content</p>' },
      summary: { '#text': 'Entry summary' },
      published: { '#text': '2023-01-01T10:00:00Z' },
      link: [
        { '@href': 'https://example.com/entry', '@rel': 'alternate' },
        { '@href': 'https://example.com/comments', '@rel': 'replies' },
      ],
      category: [{ '@term': 'technology' }, { '@term': 'web' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      rights: { '#text': 'Copyright 2023' },
      source: {
        id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6' },
        title: { '#text': 'Source Feed' },
      },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Entry Title',
      updated: '2023-01-01T12:00:00Z',
      authors: [{ name: 'John Doe' }],
      content: '<p>Entry content</p>',
      summary: 'Entry summary',
      published: '2023-01-01T10:00:00Z',
      links: [
        { href: 'https://example.com/entry', rel: 'alternate' },
        { href: 'https://example.com/comments', rel: 'replies' },
      ],
      categories: [{ term: 'technology' }, { term: 'web' }],
      contributors: [{ name: 'Jane Smith' }],
      rights: 'Copyright 2023',
      source: {
        id: 'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6',
        title: 'Source Feed',
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should parse entry with only required fields', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Entry Title' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Entry Title',
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle entry with legacy date fields', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Entry Title' },
      issued: { '#text': '2003-12-13T08:29:29-04:00' },
      modified: { '#text': '2003-12-13T18:30:02Z' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Entry Title',
      published: '2003-12-13T08:29:29-04:00',
      updated: '2003-12-13T18:30:02Z',
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      id: { '#text': 123 },
      title: { '#text': 456 },
      content: { '#text': 789 },
      link: [{ '@href': 'https://example.com/' }],
    }
    const expected = {
      id: '123',
      title: '456',
      content: '789',
      links: [{ href: 'https://example.com/' }],
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should return undefined if id is missing', () => {
    const value = {
      title: { '#text': 'Entry Title' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }

    expect(parseEntry(value)).toBeUndefined()
  })

  it('should return undefined if title is missing', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }

    expect(parseEntry(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseEntry('not an object')).toBeUndefined()
    expect(parseEntry(undefined)).toBeUndefined()
    expect(parseEntry(null)).toBeUndefined()
    expect(parseEntry([])).toBeUndefined()
  })

  it('should handle dc namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'dc:creator': { '#text': 'John Doe' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      dc: { creator: 'John Doe' },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle slash namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'slash:comments': { '#text': '10' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      slash: { comments: 10 },
    }

    expect(parseEntry(value)).toEqual(expected)
  })
})

describe('parseFeed', () => {
  it('should parse complete feed object', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      title: { '#text': 'Example Feed' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
      author: [{ name: { '#text': 'John Doe' } }],
      subtitle: { '#text': 'A subtitle for my feed' },
      link: [
        { '@href': 'https://example.com/', '@rel': 'alternate' },
        { '@href': 'https://example.com/feed', '@rel': 'self' },
      ],
      category: [{ '@term': 'technology' }, { '@term': 'web' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      generator: {
        '#text': 'Example Generator',
        '@uri': 'https://example.com/gen',
        '@version': '1.0',
      },
      icon: { '#text': 'https://example.com/favicon.ico' },
      logo: { '#text': 'https://example.com/logo.png' },
      rights: { '#text': 'Copyright 2023, Example Corp.' },
      entry: [
        {
          id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
          title: { '#text': 'First Entry' },
          updated: { '#text': '2023-01-01T10:00:00Z' },
          content: { '#text': '<p>First entry content</p>' },
        },
        {
          id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a' },
          title: { '#text': 'Second Entry' },
          updated: { '#text': '2023-01-02T10:00:00Z' },
          content: { '#text': '<p>Second entry content</p>' },
        },
      ],
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      title: 'Example Feed',
      updated: '2023-01-01T12:00:00Z',
      authors: [{ name: 'John Doe' }],
      subtitle: 'A subtitle for my feed',
      links: [
        { href: 'https://example.com/', rel: 'alternate' },
        { href: 'https://example.com/feed', rel: 'self' },
      ],
      categories: [{ term: 'technology' }, { term: 'web' }],
      contributors: [{ name: 'Jane Smith' }],
      generator: { text: 'Example Generator', uri: 'https://example.com/gen', version: '1.0' },
      icon: 'https://example.com/favicon.ico',
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2023, Example Corp.',
      entries: [
        {
          id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
          title: 'First Entry',
          updated: '2023-01-01T10:00:00Z',
          content: '<p>First entry content</p>',
        },
        {
          id: 'urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a',
          title: 'Second Entry',
          updated: '2023-01-02T10:00:00Z',
          content: '<p>Second entry content</p>',
        },
      ],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should parse feed with only required fields', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      title: { '#text': 'Example Feed' },
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      title: 'Example Feed',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle feed with legacy elements', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      title: { '#text': 'Example Feed' },
      modified: { '#text': '2003-12-13T18:30:02Z' },
      tagline: { '#text': 'A tagline for my feed' },
      entry: [
        {
          id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
          title: { '#text': 'First Entry' },
          issued: { '#text': '2003-12-13T08:29:29-04:00' },
        },
      ],
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      title: 'Example Feed',
      updated: '2003-12-13T18:30:02Z',
      subtitle: 'A tagline for my feed',
      entries: [
        {
          id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
          title: 'First Entry',
          published: '2003-12-13T08:29:29-04:00',
        },
      ],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      id: { '#text': 123 },
      title: { '#text': 456 },
      link: [{ '@href': 'https://example.com/' }],
      entry: [{ id: { '#text': 789 }, title: { '#text': 'First Entry' } }],
    }
    const expected = {
      id: '123',
      title: '456',
      links: [{ href: 'https://example.com/' }],
      entries: [{ id: '789', title: 'First Entry' }],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should return undefined if id is missing', () => {
    const value = {
      title: { '#text': 'Example Feed' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should return undefined if title is missing', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeed('not an object')).toBeUndefined()
    expect(parseFeed(undefined)).toBeUndefined()
    expect(parseFeed(null)).toBeUndefined()
    expect(parseFeed([])).toBeUndefined()
  })

  it('should handle entries that are not valid', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      title: { '#text': 'Example Feed' },
      entry: [
        {
          id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
          title: { '#text': 'Valid Entry' },
        },
        { title: { '#text': 'Invalid Entry' } },
        { id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-cccc-80da344efa6a' } },
      ],
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      title: 'Example Feed',
      entries: [{ id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a', title: 'Valid Entry' }],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle dc namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Feed' },
      'dc:creator': { '#text': 'John Doe' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Feed',
      dc: { creator: 'John Doe' },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle sy namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Feed' },
      'sy:updatefrequency': { '#text': '5' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Feed',
      sy: { updateFrequency: 5 },
    }

    expect(parseFeed(value)).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  it('should retrieve feed with only required fields', () => {
    const value = {
      feed: {
        id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
        title: { '#text': 'Example Feed' },
      },
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      title: 'Example Feed',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should retrieve feed prefixed with atom: with only required fields', () => {
    const value = {
      'atom:feed': {
        'atom:id': { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
        'atom:title': { '#text': 'Example Feed' },
      },
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      title: 'Example Feed',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined if feed is not nested under the "feed"', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      title: { '#text': 'Example Feed' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })
})

// TODO: Write tests for supporting asNAmespace option.
// - Should return items with given namespace prefix, allow partial and not use namespaces.
