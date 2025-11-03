import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils.js'

describe('retrieveFeed', () => {
  it('should parse feed with all properties', () => {
    const value = {
      'admin:errorreportsto': 'mailto:admin@example.com',
      'admin:generatoragent': 'http://www.example.com/generator/1.0',
    }
    const expected = {
      errorReportsTo: 'mailto:admin@example.com',
      generatorAgent: 'http://www.example.com/generator/1.0',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only errorReportsTo', () => {
    const value = {
      'admin:errorreportsto': 'mailto:webmaster@example.org',
    }
    const expected = {
      errorReportsTo: 'mailto:webmaster@example.org',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only generatorAgent', () => {
    const value = {
      'admin:generatoragent': 'http://www.movabletype.org/?v=3.2',
    }
    const expected = {
      generatorAgent: 'http://www.movabletype.org/?v=3.2',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'admin:errorreportsto': { '#text': 'mailto:admin@example.com?subject=Feed&amp;body=Error' },
    }
    const expected = {
      errorReportsTo: 'mailto:admin@example.com?subject=Feed&body=Error',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'admin:generatoragent': { '#text': '<![CDATA[http://www.example.com/generator]]>' },
    }
    const expected = {
      generatorAgent: 'http://www.example.com/generator',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'admin:errorreportsto': '',
      'admin:generatoragent': 'http://www.example.com/generator',
    }
    const expected = {
      generatorAgent: 'http://www.example.com/generator',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'admin:errorreportsto': '   ',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
  })

  it('should handle array inputs by using first element', () => {
    const value = {
      'admin:errorreportsto': ['mailto:admin@example.com', 'mailto:webmaster@example.com'],
    }
    const expected = {
      errorReportsTo: 'mailto:admin@example.com',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with @rdf:resource attributes', () => {
    const value = {
      'admin:errorreportsto': {
        '@rdf:resource': 'mailto:admin@example.com',
      },
      'admin:generatoragent': {
        '@rdf:resource': 'http://www.movabletype.org/?v=2.5',
      },
    }
    const expected = {
      errorReportsTo: 'mailto:admin@example.com',
      generatorAgent: 'http://www.movabletype.org/?v=2.5',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should prefer @rdf:resource over #text when both present', () => {
    const value = {
      'admin:errorreportsto': {
        '@rdf:resource': 'mailto:admin@example.com',
        '#text': 'mailto:other@example.com',
      },
    }
    const expected = {
      errorReportsTo: 'mailto:admin@example.com',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse mixed @rdf:resource and text content', () => {
    const value = {
      'admin:errorreportsto': {
        '@rdf:resource': 'mailto:admin@example.com',
      },
      'admin:generatoragent': 'http://www.example.com/generator',
    }
    const expected = {
      errorReportsTo: 'mailto:admin@example.com',
      generatorAgent: 'http://www.example.com/generator',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
