import { describe, expect, it } from 'bun:test'
import { generateAuthor, generateEntry, generatePrimaryCategory } from './utils.js'

describe('generatePrimaryCategory', () => {
  it('should generate primary_category with all attributes', () => {
    const value = {
      term: 'cs.LG',
      scheme: 'http://arxiv.org/schemas/atom',
      label: 'Machine Learning',
    }
    const expected = {
      '@term': 'cs.LG',
      '@scheme': 'http://arxiv.org/schemas/atom',
      '@label': 'Machine Learning',
    }

    expect(generatePrimaryCategory(value)).toEqual(expected)
  })

  it('should generate primary_category with term and scheme only', () => {
    const value = {
      term: 'cs.LG',
      scheme: 'http://arxiv.org/schemas/atom',
    }
    const expected = {
      '@term': 'cs.LG',
      '@scheme': 'http://arxiv.org/schemas/atom',
    }

    expect(generatePrimaryCategory(value)).toEqual(expected)
  })

  it('should generate primary_category with term only', () => {
    const value = {
      term: 'math.AP',
    }
    const expected = {
      '@term': 'math.AP',
    }

    expect(generatePrimaryCategory(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      term: '',
      scheme: 'http://arxiv.org/schemas/atom',
    }
    const expected = {
      '@scheme': 'http://arxiv.org/schemas/atom',
    }

    expect(generatePrimaryCategory(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      term: '   ',
    }

    expect(generatePrimaryCategory(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generatePrimaryCategory(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: Testing invalid input
    expect(generatePrimaryCategory('string')).toBeUndefined()
    // @ts-expect-error: Testing invalid input
    expect(generatePrimaryCategory(123)).toBeUndefined()
    expect(generatePrimaryCategory(undefined)).toBeUndefined()
    // @ts-expect-error: Testing invalid input
    expect(generatePrimaryCategory(null)).toBeUndefined()
  })
})

describe('generateAuthor', () => {
  it('should generate author with affiliation', () => {
    const value = {
      affiliation: 'NMSU',
    }
    const expected = {
      'arxiv:affiliation': 'NMSU',
    }

    expect(generateAuthor(value)).toEqual(expected)
  })

  it('should generate author with long affiliation', () => {
    const value = {
      affiliation: 'Massachusetts Institute of Technology',
    }
    const expected = {
      'arxiv:affiliation': 'Massachusetts Institute of Technology',
    }

    expect(generateAuthor(value)).toEqual(expected)
  })

  it('should handle empty affiliation', () => {
    const value = {
      affiliation: '',
    }

    expect(generateAuthor(value)).toBeUndefined()
  })

  it('should handle whitespace-only affiliation', () => {
    const value = {
      affiliation: '   ',
    }

    expect(generateAuthor(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateAuthor(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: Testing invalid input
    expect(generateAuthor('string')).toBeUndefined()
    // @ts-expect-error: Testing invalid input
    expect(generateAuthor(123)).toBeUndefined()
    expect(generateAuthor(undefined)).toBeUndefined()
    // @ts-expect-error: Testing invalid input
    expect(generateAuthor(null)).toBeUndefined()
  })
})

describe('generateEntry', () => {
  it('should generate entry with all properties', () => {
    const value = {
      comment: '23 pages, 8 figures and 4 tables',
      journalRef: 'Eur.Phys.J. C31 (2003) 17-29',
      doi: '10.1529/biophysj.104.047340',
      primaryCategory: {
        term: 'hep-ex',
        scheme: 'http://arxiv.org/schemas/atom',
        label: 'High Energy Physics - Experiment',
      },
    }
    const expected = {
      'arxiv:comment': '23 pages, 8 figures and 4 tables',
      'arxiv:journal_ref': 'Eur.Phys.J. C31 (2003) 17-29',
      'arxiv:doi': '10.1529/biophysj.104.047340',
      'arxiv:primary_category': {
        '@term': 'hep-ex',
        '@scheme': 'http://arxiv.org/schemas/atom',
        '@label': 'High Energy Physics - Experiment',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with partial properties', () => {
    const value = {
      comment: '23 pages',
      doi: '10.1234/example',
    }
    const expected = {
      'arxiv:comment': '23 pages',
      'arxiv:doi': '10.1234/example',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with only primary_category', () => {
    const value = {
      primaryCategory: {
        term: 'cs.LG',
        scheme: 'http://arxiv.org/schemas/atom',
      },
    }
    const expected = {
      'arxiv:primary_category': {
        '@term': 'cs.LG',
        '@scheme': 'http://arxiv.org/schemas/atom',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      comment: '',
      doi: '10.1234/example',
    }
    const expected = {
      'arxiv:doi': '10.1234/example',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      comment: '   ',
    }

    expect(generateEntry(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateEntry(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: Testing invalid input
    expect(generateEntry('string')).toBeUndefined()
    // @ts-expect-error: Testing invalid input
    expect(generateEntry(123)).toBeUndefined()
    expect(generateEntry(undefined)).toBeUndefined()
    // @ts-expect-error: Testing invalid input
    expect(generateEntry(null)).toBeUndefined()
  })

  it('should handle special characters in text (CDATA wrapping)', () => {
    const value = {
      comment: 'Uses <special> characters & symbols',
    }
    const expected = {
      'arxiv:comment': {
        '#cdata': 'Uses <special> characters & symbols',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })
})
