import { describe, expect, it } from 'bun:test'
import {
  createNamespaceGetter,
  parseCategory,
  parseContent,
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
} from './utils.js'

describe('createNamespaceGetter', () => {
  it('should retrieve value with prefix when prefix is provided', () => {
    const value = {
      'ns:key': 'prefixed value',
      key: 'unprefixed value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toBe('prefixed value')
  })

  it('should handle empty prefix', () => {
    const value = {
      key: 'value',
    }
    const get = createNamespaceGetter(value, '')

    expect(get('key')).toBe('value')
  })

  it('should handle undefined prefix', () => {
    const value = {
      key: 'value',
    }
    const get = createNamespaceGetter(value, undefined)

    expect(get('key')).toBe('value')
  })

  it('should handle complex objects as values', () => {
    const complexValue = { nested: 'object' }
    const value = {
      'ns:key': complexValue,
      key: 'simple value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toBe(complexValue)
  })

  it('should handle arrays as values', () => {
    const arrayValue = [1, 2, 3]
    const value = {
      'ns:key': arrayValue,
      key: 'simple value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toBe(arrayValue)
  })

  it('should handle non-string keys gracefully', () => {
    const value = {
      'ns:123': 'numeric key with prefix',
      '123': 'numeric key',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('123')).toBe('numeric key with prefix')
  })

  it('should handle various prefix formats', () => {
    const value = {
      'namespace:key': 'value with colon',
      'namespace-key': 'value with dash',
      namespace_key: 'value with underscore',
    }

    const colonGetter = createNamespaceGetter(value, 'namespace:')
    const dashGetter = createNamespaceGetter(value, 'namespace-')
    const underscoreGetter = createNamespaceGetter(value, 'namespace_')

    expect(colonGetter('key')).toBe('value with colon')
    expect(dashGetter('key')).toBe('value with dash')
    expect(underscoreGetter('key')).toBe('value with underscore')
  })

  it('should return undefined when prefixed key does not exist', () => {
    const value = {
      key: 'unprefixed value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('key')).toBeUndefined()
  })

  it('should return undefined for non-existent keys (with prefix)', () => {
    const value = {
      'ns:existingKey': 'value',
    }
    const get = createNamespaceGetter(value, 'ns:')

    expect(get('nonExistentKey')).toBeUndefined()
  })
})

describe('parseContent', () => {
  it('should parse simple string value', () => {
    const value = 'Simple content'
    const expected = { value: 'Simple content' }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should parse object with text content', () => {
    const value = { '#text': 'Content text' }
    const expected = { value: 'Content text' }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should parse object with text, type and src', () => {
    const value = {
      '#text': 'Content text',
      '@type': 'html',
      '@src': 'https://example.com/content',
    }
    const expected = {
      value: 'Content text',
      type: 'html',
      src: 'https://example.com/content',
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should parse content with only src attribute', () => {
    const value = {
      '@type': 'video/mp4',
      '@src': 'https://example.com/video.mp4',
    }
    const expected = {
      type: 'video/mp4',
      src: 'https://example.com/video.mp4',
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    expect(parseContent('')).toBeUndefined()
  })

  it('should return undefined for whitespace-only string', () => {
    expect(parseContent('   ')).toBeUndefined()
  })

  it('should parse object with xml namespace attributes', () => {
    const value = {
      '#text': '<div>XHTML content</div>',
      '@type': 'xhtml',
      '@xml:base': 'http://example.org/entry/1',
      '@xml:lang': 'en-US',
    }
    const expected = {
      value: '<div>XHTML content</div>',
      type: 'xhtml',
      xml: {
        base: 'http://example.org/entry/1',
        lang: 'en-US',
      },
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should return undefined for non-object, non-string input', () => {
    expect(parseContent(null)).toBeUndefined()
    expect(parseContent(undefined)).toBeUndefined()
    expect(parseContent(123)).toBeUndefined()
  })
})

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
  const expectedFull = {
    name: 'John Doe',
    uri: 'https://example.com/johndoe',
    email: 'john@example.com',
  }

  it('should parse complete person object (Atom 1.0) (with #text)', () => {
    const value = {
      name: { '#text': 'John Doe' },
      uri: { '#text': 'https://example.com/johndoe' },
      email: { '#text': 'john@example.com' },
    }

    expect(parsePerson(value)).toEqual(expectedFull)
  })

  it('should parse complete person object (Atom 1.0) (without #text)', () => {
    const value = {
      name: 'John Doe',
      uri: 'https://example.com/johndoe',
      email: 'john@example.com',
    }

    expect(parsePerson(value)).toEqual(expectedFull)
  })

  it('should parse complete person object (Atom 1.0) (with array of values)', () => {
    const value = {
      name: ['John Doe', 'Jane Smith'],
      uri: ['https://example.com/johndoe', 'https://example.com/janesmith'],
      email: ['john@example.com', 'jane@example.com'],
    }

    expect(parsePerson(value)).toEqual(expectedFull)
  })

  it('should parse complete person object (Atom 0.3) (with #text)', () => {
    const value = {
      name: { '#text': 'John Doe' },
      url: { '#text': 'https://example.com/johndoe' },
      email: { '#text': 'john@example.com' },
    }

    expect(parsePerson(value)).toEqual(expectedFull)
  })

  it('should parse complete person object (Atom 0.3) (without #text)', () => {
    const value = {
      name: 'John Doe',
      url: 'https://example.com/johndoe',
      email: 'john@example.com',
    }

    expect(parsePerson(value)).toEqual(expectedFull)
  })

  it('should parse complete person object (Atom 0.3) (with array of values)', () => {
    const value = {
      name: ['John Doe', 'Jane Smith'],
      url: ['https://example.com/johndoe', 'https://example.com/janesmith'],
      email: ['john@example.com', 'jane@example.com'],
    }

    expect(parsePerson(value)).toEqual(expectedFull)
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

  it('should handle partial objects (missing name)', () => {
    const value = {
      uri: { '#text': 'https://example.com/johndoe' },
      email: { '#text': 'john@example.com' },
    }
    const expected = {
      uri: 'https://example.com/johndoe',
      email: 'john@example.com',
    }

    expect(parsePerson(value)).toEqual(expected)
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

  it('should handle partial objects (missing term)', () => {
    const value = {
      '@scheme': 'http://example.com/categories/',
      '@label': 'Technology',
    }
    const expected = {
      scheme: 'http://example.com/categories/',
      label: 'Technology',
    }

    expect(parseCategory(value)).toEqual(expected)
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
  it('should parse complete generator object (Atom 1.0) (with #text)', () => {
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

  it('should parse complete generator object (Atom 1.0) (without #text)', () => {
    const value = {
      '@uri': 'https://example.com/generator',
      '@version': '1.0',
    }
    const expected = {
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

  it('should parse generator with only required text (with #text)', () => {
    const value = {
      '#text': 'Example Generator',
    }
    const expected = {
      text: 'Example Generator',
    }

    expect(parseGenerator(value)).toEqual(expected)
  })

  it('should parse generator with only required text (without #text)', () => {
    const value = 'Example Generator'
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

  it('should handle partial objects (missing text)', () => {
    const value = {
      '@uri': 'https://example.com/generator',
      '@version': '1.0',
    }
    const expected = {
      uri: 'https://example.com/generator',
      version: '1.0',
    }

    expect(parseGenerator(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseGenerator(undefined)).toBeUndefined()
    expect(parseGenerator(null)).toBeUndefined()
    expect(parseGenerator([])).toBeUndefined()
  })
})

describe('parseSource', () => {
  const expectedFull = {
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

  it('should parse complete source object (with #text)', () => {
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

    expect(parseSource(value)).toEqual(expectedFull)
  })

  it('should parse complete source object (without #text)', () => {
    const value = {
      id: 'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6',
      title: 'Example Feed',
      updated: '2003-12-13T18:30:02Z',
      author: [{ name: { '#text': 'John Doe' } }],
      link: [{ '@href': 'https://example.com/' }],
      category: [{ '@term': 'technology' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      generator: 'Example Generator',
      icon: 'https://example.com/favicon.ico',
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2003, Example Corp.',
      subtitle: 'A blog about examples',
    }

    expect(parseSource(value)).toEqual(expectedFull)
  })

  it('should parse complete source object (with array of values)', () => {
    const value = {
      id: [
        'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6',
        'urn:uuid:70b87d90-e4aa-22e9-c94D-1114949f1bf7',
      ],
      title: ['Example Feed', 'Alternative Example Feed'],
      updated: ['2003-12-13T18:30:02Z', '2023-05-21T14:45:30Z'],
      author: [{ name: { '#text': 'John Doe' } }],
      link: [{ '@href': 'https://example.com/' }],
      category: [{ '@term': 'technology' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      generator: ['Example Generator', 'Alternative Generator'],
      icon: ['https://example.com/favicon.ico', 'https://example.com/alternate-favicon.ico'],
      logo: ['https://example.com/logo.png', 'https://example.com/alternate-logo.png'],
      rights: ['Copyright 2003, Example Corp.', 'All Rights Reserved 2023, Example Inc.'],
      subtitle: ['A blog about examples', 'Alternative subtitle for the blog'],
    }

    expect(parseSource(value)).toEqual(expectedFull)
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
    const expected = '2023-01-01T12:00:00Z'

    expect(retrievePublished(value)).toBe(expected)
  })

  it('should fall back to issued (Atom 0.3) if published is missing', () => {
    const value = {
      issued: { '#text': '2023-01-02T12:00:00Z' },
      created: { '#text': '2023-01-03T12:00:00Z' },
    }
    const expected = '2023-01-02T12:00:00Z'

    expect(retrievePublished(value)).toBe(expected)
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
    const expected = '2023-01-01T12:00:00Z'

    expect(retrieveUpdated(value)).toBe(expected)
  })

  it('should fall back to modified (Atom 0.3) if updated is missing', () => {
    const value = {
      modified: { '#text': '2023-01-02T12:00:00Z' },
    }
    const expected = '2023-01-02T12:00:00Z'

    expect(retrieveUpdated(value)).toBe(expected)
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
    const expected = '20230101'

    expect(retrieveUpdated(value)).toBe(expected)
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
    const expected = 'Feed subtitle'

    expect(retrieveSubtitle(value)).toBe(expected)
  })

  it('should fall back to tagline (Atom 0.3) if subtitle is missing', () => {
    const value = {
      tagline: { '#text': 'Feed tagline' },
    }
    const expected = 'Feed tagline'

    expect(retrieveSubtitle(value)).toBe(expected)
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
    const expected = '123'

    expect(retrieveSubtitle(value)).toBe(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveSubtitle('not an object')).toBeUndefined()
    expect(retrieveSubtitle(undefined)).toBeUndefined()
    expect(retrieveSubtitle(null)).toBeUndefined()
    expect(retrieveSubtitle([])).toBeUndefined()
  })
})

describe('parseEntry', () => {
  const expectedFull = {
    id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
    title: 'Entry Title',
    updated: '2023-01-01T12:00:00Z',
    authors: [{ name: 'John Doe' }],
    content: { value: '<p>Entry content</p>' },
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

  it('should parse complete entry object (with #text)', () => {
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

    expect(parseEntry(value)).toEqual(expectedFull)
  })

  it('should parse complete entry object (without #text)', () => {
    const value = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Entry Title',
      updated: '2023-01-01T12:00:00Z',
      author: [{ name: { '#text': 'John Doe' } }],
      content: '<p>Entry content</p>',
      summary: 'Entry summary',
      published: '2023-01-01T10:00:00Z',
      link: [
        { '@href': 'https://example.com/entry', '@rel': 'alternate' },
        { '@href': 'https://example.com/comments', '@rel': 'replies' },
      ],
      category: [{ '@term': 'technology' }, { '@term': 'web' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      rights: 'Copyright 2023',
      source: {
        id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6' },
        title: { '#text': 'Source Feed' },
      },
    }

    expect(parseEntry(value)).toEqual(expectedFull)
  })

  it('should parse complete entry object (with array of values)', () => {
    const value = {
      id: [
        'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
        'urn:uuid:2335d785-dfc9-5fcc-bbbb-90eb455efa7b',
      ],
      title: ['Entry Title', 'Alternative Entry Title'],
      updated: ['2023-01-01T12:00:00Z', '2023-01-02T15:30:00Z'],
      author: [{ name: { '#text': 'John Doe' } }],
      content: ['<p>Entry content</p>', '<p>Alternative entry content</p>'],
      summary: ['Entry summary', 'Extended entry summary'],
      published: ['2023-01-01T10:00:00Z', '2023-01-02T09:15:00Z'],
      link: [
        { '@href': 'https://example.com/entry', '@rel': 'alternate' },
        { '@href': 'https://example.com/comments', '@rel': 'replies' },
      ],
      category: [{ '@term': 'technology' }, { '@term': 'web' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      rights: ['Copyright 2023', 'Copyleft 1999'],
      source: [
        {
          id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6' },
          title: { '#text': 'Source Feed' },
        },
        {
          id: { '#text': 'urn:uuid:50a76c80-d399-11d9-b91C-23234324aj34' },
          title: { '#text': 'Source Feed 2' },
        },
      ],
    }

    expect(parseEntry(value)).toEqual(expectedFull)
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
      content: { value: '789' },
      links: [{ href: 'https://example.com/' }],
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle partial objects (missing id)', () => {
    const value = {
      title: { '#text': 'Entry Title' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      title: 'Entry Title',
      updated: '2023-01-01T12:00:00Z',
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle partial objects (missing title)', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      updated: '2023-01-01T12:00:00Z',
    }

    expect(parseEntry(value)).toEqual(expected)
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
      dc: {
        creators: ['John Doe'],
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle psc namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Podcast Episode Entry' },
      'psc:chapters': {
        'psc:chapter': [
          {
            '@start': '00:00:00.000',
            '@title': 'Introduction',
          },
          {
            '@start': '00:03:15.000',
            '@title': 'Discussion',
          },
        ],
      },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Podcast Episode Entry',
      psc: {
        chapters: [
          {
            start: '00:00:00.000',
            title: 'Introduction',
          },
          {
            start: '00:03:15.000',
            title: 'Discussion',
          },
        ],
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle dcterms namespace in entry', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'dcterms:created': { '#text': '2023-02-01T00:00:00Z' },
      'dcterms:license': { '#text': 'MIT License' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      dcterms: {
        licenses: ['MIT License'],
        created: ['2023-02-01T00:00:00Z'],
      },
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

  it('should handle itunes namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'itunes:duration': { '#text': '3600' },
      'itunes:explicit': { '#text': 'false' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      itunes: {
        duration: 3600,
        explicit: false,
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle media namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'media:content': { '@url': 'https://example.com/video.mp4', '@type': 'video/mp4' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      media: {
        contents: [{ url: 'https://example.com/video.mp4', type: 'video/mp4' }],
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle georss namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'georss:point': { '#text': '42.3601 -71.0589' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      georss: {
        point: { lat: 42.3601, lng: -71.0589 },
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle thr namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'thr:in-reply-to': {
        '@ref': 'http://example.com/posts/1',
        '@href': 'http://example.com/posts/1',
      },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      thr: {
        inReplyTos: [{ ref: 'http://example.com/posts/1', href: 'http://example.com/posts/1' }],
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle wfw namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'wfw:comment': { '#text': 'https://example.com/comment' },
      'wfw:commentrss': { '#text': 'https://example.com/comments/feed' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      wfw: {
        comment: 'https://example.com/comment',
        commentRss: 'https://example.com/comments/feed',
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })

  it('should handle yt namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Entry' },
      'yt:videoid': { '#text': 'abc123' },
      'yt:channelid': { '#text': 'UCexample' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Entry',
      yt: {
        videoId: 'abc123',
        channelId: 'UCexample',
      },
    }

    expect(parseEntry(value)).toEqual(expected)
  })
})

describe('parseFeed', () => {
  const expectedFull = {
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
        content: { value: '<p>First entry content</p>' },
      },
      {
        id: 'urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a',
        title: 'Second Entry',
        updated: '2023-01-02T10:00:00Z',
        content: { value: '<p>Second entry content</p>' },
      },
    ],
  }

  it('should parse complete feed object (with #text)', () => {
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

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object (without #text)', () => {
    const value = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      title: 'Example Feed',
      updated: '2023-01-01T12:00:00Z',
      author: [{ name: { '#text': 'John Doe' } }],
      subtitle: 'A subtitle for my feed',
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
      icon: 'https://example.com/favicon.ico',
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2023, Example Corp.',
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

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object (with array of values)', () => {
    const value = {
      id: [
        'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
        'urn:uuid:70b87d90-e4aa-22e9-c94D-1114949f1bf7',
      ],
      title: ['Example Feed', 'Alternative Example Feed'],
      updated: ['2023-01-01T12:00:00Z', '2023-02-15T15:30:00Z'],
      author: [{ name: { '#text': 'John Doe' } }],
      subtitle: ['A subtitle for my feed', 'An alternative subtitle for the feed'],
      link: [
        { '@href': 'https://example.com/', '@rel': 'alternate' },
        { '@href': 'https://example.com/feed', '@rel': 'self' },
      ],
      category: [{ '@term': 'technology' }, { '@term': 'web' }],
      contributor: [{ name: { '#text': 'Jane Smith' } }],
      generator: [
        {
          '#text': 'Example Generator',
          '@uri': 'https://example.com/gen',
          '@version': '1.0',
        },
        {
          '#text': 'Alternative Generator',
          '@uri': 'https://example.com/alt-gen',
          '@version': '2.0',
        },
      ],
      icon: ['https://example.com/favicon.ico', 'https://example.com/alternate-favicon.ico'],
      logo: ['https://example.com/logo.png', 'https://example.com/alternate-logo.png'],
      rights: ['Copyright 2023, Example Corp.', 'All Rights Reserved 2023, Example Inc.'],
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

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with required ID field', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should parse feed with required title field', () => {
    const value = {
      title: { '#text': 'Example Feed' },
    }
    const expected = {
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

  it('should handle case if id is missing', () => {
    const value = {
      title: { '#text': 'Example Feed' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      title: 'Example Feed',
      updated: '2023-01-01T12:00:00Z',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle case if title is missing', () => {
    const value = {
      id: { '#text': 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6' },
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      updated: '2023-01-01T12:00:00Z',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle partial objects (missing id and title)', () => {
    const value = {
      updated: { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      updated: '2023-01-01T12:00:00Z',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeed('not an object')).toBeUndefined()
    expect(parseFeed(undefined)).toBeUndefined()
    expect(parseFeed(null)).toBeUndefined()
    expect(parseFeed([])).toBeUndefined()
  })

  it('should handle entries that may have partial data', () => {
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
      entries: [
        { id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a', title: 'Valid Entry' },
        { title: 'Invalid Entry' },
        { id: 'urn:uuid:1225c695-cfb8-4ebb-cccc-80da344efa6a' },
      ],
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
      dc: {
        creators: ['John Doe'],
      },
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

  it('should handle dcterms namespace in feed', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Feed' },
      'dcterms:created': { '#text': '2023-01-01T00:00:00Z' },
      'dcterms:license': { '#text': 'Creative Commons Attribution 4.0' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Feed',
      dcterms: {
        licenses: ['Creative Commons Attribution 4.0'],
        created: ['2023-01-01T00:00:00Z'],
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle yt namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Feed' },
      'yt:channelid': { '#text': 'UCexample' },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Feed',
      yt: {
        channelId: 'UCexample',
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle admin namespace', () => {
    const value = {
      id: { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      title: { '#text': 'Example Feed' },
      'admin:errorreportsto': {
        '@rdf:resource': 'mailto:webmaster@example.com',
      },
      'admin:generatoragent': {
        '@rdf:resource': 'http://www.movabletype.org/?v=3.2',
      },
    }
    const expected = {
      id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      title: 'Example Feed',
      admin: {
        errorReportsTo: 'mailto:webmaster@example.com',
        generatorAgent: 'http://www.movabletype.org/?v=3.2',
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should limit entries to specified maxItems', () => {
    const value = {
      id: { '#text': 'urn:uuid:feed-id' },
      title: { '#text': 'Test Feed' },
      entry: [
        {
          id: { '#text': 'urn:uuid:entry-1' },
          title: { '#text': 'Entry 1' },
        },
        {
          id: { '#text': 'urn:uuid:entry-2' },
          title: { '#text': 'Entry 2' },
        },
        {
          id: { '#text': 'urn:uuid:entry-3' },
          title: { '#text': 'Entry 3' },
        },
      ],
    }
    const expected = {
      id: 'urn:uuid:feed-id',
      title: 'Test Feed',
      entries: [
        {
          id: 'urn:uuid:entry-1',
          title: 'Entry 1',
        },
        {
          id: 'urn:uuid:entry-2',
          title: 'Entry 2',
        },
      ],
    }

    expect(parseFeed(value, { maxItems: 2 })).toEqual(expected)
  })

  it('should skip all entries when maxItems is 0', () => {
    const value = {
      id: { '#text': 'urn:uuid:feed-id' },
      title: { '#text': 'Test Feed' },
      entry: [
        {
          id: { '#text': 'urn:uuid:entry-1' },
          title: { '#text': 'Entry 1' },
        },
        {
          id: { '#text': 'urn:uuid:entry-2' },
          title: { '#text': 'Entry 2' },
        },
      ],
    }
    const expected = {
      id: 'urn:uuid:feed-id',
      title: 'Test Feed',
    }

    expect(parseFeed(value, { maxItems: 0 })).toEqual(expected)
  })

  it('should return all entries when maxItems is undefined', () => {
    const value = {
      id: { '#text': 'urn:uuid:feed-id' },
      title: { '#text': 'Test Feed' },
      entry: [
        {
          id: { '#text': 'urn:uuid:entry-1' },
          title: { '#text': 'Entry 1' },
        },
        {
          id: { '#text': 'urn:uuid:entry-2' },
          title: { '#text': 'Entry 2' },
        },
      ],
    }
    const expected = {
      id: 'urn:uuid:feed-id',
      title: 'Test Feed',
      entries: [
        {
          id: 'urn:uuid:entry-1',
          title: 'Entry 1',
        },
        {
          id: 'urn:uuid:entry-2',
          title: 'Entry 2',
        },
      ],
    }

    expect(parseFeed(value, { maxItems: undefined })).toEqual(expected)
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
