import { describe, expect, it } from 'bun:test'
import { parsePrimaryCategory, retrieveAuthor, retrieveEntry } from './utils.js'

describe('parsePrimaryCategory', () => {
  it('should parse primary_category with all attributes', () => {
    const value = {
      '@term': 'cs.LG',
      '@scheme': 'http://arxiv.org/schemas/atom',
      '@label': 'Machine Learning',
    }
    const expected = {
      term: 'cs.LG',
      scheme: 'http://arxiv.org/schemas/atom',
      label: 'Machine Learning',
    }

    expect(parsePrimaryCategory(value)).toEqual(expected)
  })

  it('should parse primary_category with term and scheme only', () => {
    const value = {
      '@term': 'cs.LG',
      '@scheme': 'http://arxiv.org/schemas/atom',
    }
    const expected = {
      term: 'cs.LG',
      scheme: 'http://arxiv.org/schemas/atom',
    }

    expect(parsePrimaryCategory(value)).toEqual(expected)
  })

  it('should parse primary_category with term only', () => {
    const value = {
      '@term': 'math.AP',
    }
    const expected = {
      term: 'math.AP',
    }

    expect(parsePrimaryCategory(value)).toEqual(expected)
  })

  it('should parse primary_category with scheme only', () => {
    const value = {
      '@scheme': 'http://arxiv.org/schemas/atom',
    }
    const expected = {
      scheme: 'http://arxiv.org/schemas/atom',
    }

    expect(parsePrimaryCategory(value)).toEqual(expected)
  })

  it('should parse primary_category with label only', () => {
    const value = {
      '@label': 'Machine Learning',
    }
    const expected = {
      label: 'Machine Learning',
    }

    expect(parsePrimaryCategory(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parsePrimaryCategory(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parsePrimaryCategory(null)).toBeUndefined()
    expect(parsePrimaryCategory(undefined)).toBeUndefined()
    expect(parsePrimaryCategory('string')).toBeUndefined()
    expect(parsePrimaryCategory(123)).toBeUndefined()
  })
})

describe('retrieveAuthor', () => {
  it('should parse author with affiliation', () => {
    const value = {
      'arxiv:affiliation': 'NMSU',
    }
    const expected = {
      affiliation: 'NMSU',
    }

    expect(retrieveAuthor(value)).toEqual(expected)
  })

  it('should parse author with affiliation containing HTML entities', () => {
    const value = {
      'arxiv:affiliation': { '#text': 'MIT &amp; Harvard' },
    }
    const expected = {
      affiliation: 'MIT & Harvard',
    }

    expect(retrieveAuthor(value)).toEqual(expected)
  })

  it('should handle empty affiliation', () => {
    const value = {
      'arxiv:affiliation': '',
    }

    expect(retrieveAuthor(value)).toBeUndefined()
  })

  it('should handle whitespace-only affiliation', () => {
    const value = {
      'arxiv:affiliation': '   ',
    }

    expect(retrieveAuthor(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveAuthor(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveAuthor(null)).toBeUndefined()
    expect(retrieveAuthor(undefined)).toBeUndefined()
    expect(retrieveAuthor('string')).toBeUndefined()
    expect(retrieveAuthor(123)).toBeUndefined()
  })
})

describe('retrieveEntry', () => {
  it('should parse entry with all arXiv properties', () => {
    const value = {
      'arxiv:comment': '23 pages, 8 figures and 4 tables',
      'arxiv:journal_ref': 'Eur.Phys.J. C31 (2003) 17-29',
      'arxiv:doi': '10.1529/biophysj.104.047340',
      'arxiv:primary_category': {
        '@term': 'hep-ex',
        '@scheme': 'http://arxiv.org/schemas/atom',
        '@label': 'High Energy Physics - Experiment',
      },
    }
    const expected = {
      comment: '23 pages, 8 figures and 4 tables',
      journalRef: 'Eur.Phys.J. C31 (2003) 17-29',
      doi: '10.1529/biophysj.104.047340',
      primaryCategory: {
        term: 'hep-ex',
        scheme: 'http://arxiv.org/schemas/atom',
        label: 'High Energy Physics - Experiment',
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse entry with partial properties', () => {
    const value = {
      'arxiv:comment': '23 pages',
      'arxiv:doi': '10.1234/example',
    }
    const expected = {
      comment: '23 pages',
      doi: '10.1234/example',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse entry with only primary_category', () => {
    const value = {
      'arxiv:primary_category': {
        '@term': 'cs.LG',
        '@scheme': 'http://arxiv.org/schemas/atom',
      },
    }
    const expected = {
      primaryCategory: {
        term: 'cs.LG',
        scheme: 'http://arxiv.org/schemas/atom',
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'arxiv:comment': { '#text': '5 &lt; 10' },
    }
    const expected = {
      comment: '5 < 10',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'arxiv:journal_ref': { '#text': '<![CDATA[Eur.Phys.J. C31 (2003) 17-29]]>' },
    }
    const expected = {
      journalRef: 'Eur.Phys.J. C31 (2003) 17-29',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'arxiv:comment': '',
      'arxiv:doi': '10.1234/example',
    }
    const expected = {
      doi: '10.1234/example',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'arxiv:comment': '   ',
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveEntry(null)).toBeUndefined()
    expect(retrieveEntry(undefined)).toBeUndefined()
    expect(retrieveEntry('string')).toBeUndefined()
    expect(retrieveEntry(123)).toBeUndefined()
  })
})
