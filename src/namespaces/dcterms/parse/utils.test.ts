import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  const expectedFull = {
    abstract: 'Sample abstract content',
    accessRights: 'Open Access',
    accrualMethod: 'Manual upload',
    accrualPeriodicity: 'Annual',
    accrualPolicy: 'Open submission',
    alternative: 'Alternative Title',
    audience: 'General Public',
    available: '2023-06-01T00:00:00Z',
    bibliographicCitation: 'Doe, J. (2023). Sample Work. Publisher.',
    conformsTo: 'Dublin Core Metadata Terms',
    contributor: 'Jane Smith',
    coverage: 'Global',
    created: '2023-05-01T12:00:00Z',
    creator: 'John Doe',
    date: '2023-05-02T08:30:00Z',
    dateAccepted: '2023-05-10T09:00:00Z',
    dateCopyrighted: '2023-05-15T00:00:00Z',
    dateSubmitted: '2023-05-05T14:30:00Z',
    description: 'A comprehensive description',
    educationLevel: 'Graduate level',
    extent: '250 pages',
    format: 'application/pdf',
    hasFormat: 'https://example.org/formats/pdf',
    hasPart: 'https://example.org/parts/chapter1',
    hasVersion: 'https://example.org/versions/v2',
    identifier: 'ISBN:978-0123456789',
    instructionalMethod: 'Online learning',
    isFormatOf: 'https://example.org/original',
    isPartOf: 'https://example.org/collection',
    isReferencedBy: 'https://example.org/references/citation1',
    isReplacedBy: 'https://example.org/replacement',
    isRequiredBy: 'https://example.org/dependent',
    issued: '2023-05-20T10:00:00Z',
    isVersionOf: 'https://example.org/original-work',
    language: 'en-US',
    license: 'Creative Commons Attribution 4.0',
    mediator: 'Library System',
    medium: 'Digital',
    modified: '2023-05-25T16:45:00Z',
    provenance: 'Digitized from original manuscript',
    publisher: 'Academic Press',
    references: 'https://example.org/ref/source1',
    relation: 'https://example.org/related',
    replaces: 'https://example.org/old-version',
    requires: 'https://example.org/prerequisite',
    rights: 'Copyright 2023',
    rightsHolder: 'Example University',
    source: 'https://example.org/source',
    spatial: 'Boston, MA, USA',
    subject: 'Academic Research',
    tableOfContents: 'Chapter 1, Chapter 2, Chapter 3',
    temporal: '2023',
    title: 'Sample Title',
    type: 'Text',
    valid: '2024-05-25T23:59:59Z',
  }

  it('should parse complete item or feed object with all properties (with #text)', () => {
    const value = {
      'dcterms:abstract': { '#text': 'Sample abstract content' },
      'dcterms:accessrights': { '#text': 'Open Access' },
      'dcterms:accrualmethod': { '#text': 'Manual upload' },
      'dcterms:accrualperiodicity': { '#text': 'Annual' },
      'dcterms:accrualpolicy': { '#text': 'Open submission' },
      'dcterms:alternative': { '#text': 'Alternative Title' },
      'dcterms:audience': { '#text': 'General Public' },
      'dcterms:available': { '#text': '2023-06-01T00:00:00Z' },
      'dcterms:bibliographiccitation': { '#text': 'Doe, J. (2023). Sample Work. Publisher.' },
      'dcterms:conformsto': { '#text': 'Dublin Core Metadata Terms' },
      'dcterms:contributor': { '#text': 'Jane Smith' },
      'dcterms:coverage': { '#text': 'Global' },
      'dcterms:created': { '#text': '2023-05-01T12:00:00Z' },
      'dcterms:creator': { '#text': 'John Doe' },
      'dcterms:date': { '#text': '2023-05-02T08:30:00Z' },
      'dcterms:dateaccepted': { '#text': '2023-05-10T09:00:00Z' },
      'dcterms:datecopyrighted': { '#text': '2023-05-15T00:00:00Z' },
      'dcterms:datesubmitted': { '#text': '2023-05-05T14:30:00Z' },
      'dcterms:description': { '#text': 'A comprehensive description' },
      'dcterms:educationlevel': { '#text': 'Graduate level' },
      'dcterms:extent': { '#text': '250 pages' },
      'dcterms:format': { '#text': 'application/pdf' },
      'dcterms:hasformat': { '#text': 'https://example.org/formats/pdf' },
      'dcterms:haspart': { '#text': 'https://example.org/parts/chapter1' },
      'dcterms:hasversion': { '#text': 'https://example.org/versions/v2' },
      'dcterms:identifier': { '#text': 'ISBN:978-0123456789' },
      'dcterms:instructionalmethod': { '#text': 'Online learning' },
      'dcterms:isformatof': { '#text': 'https://example.org/original' },
      'dcterms:ispartof': { '#text': 'https://example.org/collection' },
      'dcterms:isreferencedby': { '#text': 'https://example.org/references/citation1' },
      'dcterms:isreplacedby': { '#text': 'https://example.org/replacement' },
      'dcterms:isrequiredby': { '#text': 'https://example.org/dependent' },
      'dcterms:issued': { '#text': '2023-05-20T10:00:00Z' },
      'dcterms:isversionof': { '#text': 'https://example.org/original-work' },
      'dcterms:language': { '#text': 'en-US' },
      'dcterms:license': { '#text': 'Creative Commons Attribution 4.0' },
      'dcterms:mediator': { '#text': 'Library System' },
      'dcterms:medium': { '#text': 'Digital' },
      'dcterms:modified': { '#text': '2023-05-25T16:45:00Z' },
      'dcterms:provenance': { '#text': 'Digitized from original manuscript' },
      'dcterms:publisher': { '#text': 'Academic Press' },
      'dcterms:references': { '#text': 'https://example.org/ref/source1' },
      'dcterms:relation': { '#text': 'https://example.org/related' },
      'dcterms:replaces': { '#text': 'https://example.org/old-version' },
      'dcterms:requires': { '#text': 'https://example.org/prerequisite' },
      'dcterms:rights': { '#text': 'Copyright 2023' },
      'dcterms:rightsholder': { '#text': 'Example University' },
      'dcterms:source': { '#text': 'https://example.org/source' },
      'dcterms:spatial': { '#text': 'Boston, MA, USA' },
      'dcterms:subject': { '#text': 'Academic Research' },
      'dcterms:tableofcontents': { '#text': 'Chapter 1, Chapter 2, Chapter 3' },
      'dcterms:temporal': { '#text': '2023' },
      'dcterms:title': { '#text': 'Sample Title' },
      'dcterms:type': { '#text': 'Text' },
      'dcterms:valid': { '#text': '2024-05-25T23:59:59Z' },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete item or feed object with all properties (without #text)', () => {
    const value = {
      'dcterms:abstract': 'Sample abstract content',
      'dcterms:accessrights': 'Open Access',
      'dcterms:accrualmethod': 'Manual upload',
      'dcterms:accrualperiodicity': 'Annual',
      'dcterms:accrualpolicy': 'Open submission',
      'dcterms:alternative': 'Alternative Title',
      'dcterms:audience': 'General Public',
      'dcterms:available': '2023-06-01T00:00:00Z',
      'dcterms:bibliographiccitation': 'Doe, J. (2023). Sample Work. Publisher.',
      'dcterms:conformsto': 'Dublin Core Metadata Terms',
      'dcterms:contributor': 'Jane Smith',
      'dcterms:coverage': 'Global',
      'dcterms:created': '2023-05-01T12:00:00Z',
      'dcterms:creator': 'John Doe',
      'dcterms:date': '2023-05-02T08:30:00Z',
      'dcterms:dateaccepted': '2023-05-10T09:00:00Z',
      'dcterms:datecopyrighted': '2023-05-15T00:00:00Z',
      'dcterms:datesubmitted': '2023-05-05T14:30:00Z',
      'dcterms:description': 'A comprehensive description',
      'dcterms:educationlevel': 'Graduate level',
      'dcterms:extent': '250 pages',
      'dcterms:format': 'application/pdf',
      'dcterms:hasformat': 'https://example.org/formats/pdf',
      'dcterms:haspart': 'https://example.org/parts/chapter1',
      'dcterms:hasversion': 'https://example.org/versions/v2',
      'dcterms:identifier': 'ISBN:978-0123456789',
      'dcterms:instructionalmethod': 'Online learning',
      'dcterms:isformatof': 'https://example.org/original',
      'dcterms:ispartof': 'https://example.org/collection',
      'dcterms:isreferencedby': 'https://example.org/references/citation1',
      'dcterms:isreplacedby': 'https://example.org/replacement',
      'dcterms:isrequiredby': 'https://example.org/dependent',
      'dcterms:issued': '2023-05-20T10:00:00Z',
      'dcterms:isversionof': 'https://example.org/original-work',
      'dcterms:language': 'en-US',
      'dcterms:license': 'Creative Commons Attribution 4.0',
      'dcterms:mediator': 'Library System',
      'dcterms:medium': 'Digital',
      'dcterms:modified': '2023-05-25T16:45:00Z',
      'dcterms:provenance': 'Digitized from original manuscript',
      'dcterms:publisher': 'Academic Press',
      'dcterms:references': 'https://example.org/ref/source1',
      'dcterms:relation': 'https://example.org/related',
      'dcterms:replaces': 'https://example.org/old-version',
      'dcterms:requires': 'https://example.org/prerequisite',
      'dcterms:rights': 'Copyright 2023',
      'dcterms:rightsholder': 'Example University',
      'dcterms:source': 'https://example.org/source',
      'dcterms:spatial': 'Boston, MA, USA',
      'dcterms:subject': 'Academic Research',
      'dcterms:tableofcontents': 'Chapter 1, Chapter 2, Chapter 3',
      'dcterms:temporal': '2023',
      'dcterms:title': 'Sample Title',
      'dcterms:type': 'Text',
      'dcterms:valid': '2024-05-25T23:59:59Z',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete item or feed object with all properties (with array of values)', () => {
    const value = {
      'dcterms:abstract': ['Sample abstract content', 'Another abstract'],
      'dcterms:accessrights': ['Open Access', 'Restricted Access'],
      'dcterms:accrualmethod': ['Manual upload', 'Automatic harvest'],
      'dcterms:accrualperiodicity': ['Annual', 'Monthly'],
      'dcterms:accrualpolicy': ['Open submission', 'Moderated submission'],
      'dcterms:alternative': ['Alternative Title', 'Secondary Title'],
      'dcterms:audience': ['General Public', 'Researchers'],
      'dcterms:available': ['2023-06-01T00:00:00Z', '2023-07-01T00:00:00Z'],
      'dcterms:bibliographiccitation': [
        'Doe, J. (2023). Sample Work. Publisher.',
        'Smith, J. (2023). Another Work.',
      ],
      'dcterms:conformsto': ['Dublin Core Metadata Terms', 'ISO Standard'],
      'dcterms:contributor': ['Jane Smith', 'Bob Johnson'],
      'dcterms:coverage': ['Global', 'Europe'],
      'dcterms:created': ['2023-05-01T12:00:00Z', '2023-05-02T12:00:00Z'],
      'dcterms:creator': ['John Doe', 'Jane Doe'],
      'dcterms:date': ['2023-05-02T08:30:00Z', '2023-05-03T08:30:00Z'],
      'dcterms:dateaccepted': ['2023-05-10T09:00:00Z', '2023-05-11T09:00:00Z'],
      'dcterms:datecopyrighted': ['2023-05-15T00:00:00Z', '2023-05-16T00:00:00Z'],
      'dcterms:datesubmitted': ['2023-05-05T14:30:00Z', '2023-05-06T14:30:00Z'],
      'dcterms:description': ['A comprehensive description', 'Another description'],
      'dcterms:educationlevel': ['Graduate level', 'Undergraduate level'],
      'dcterms:extent': ['250 pages', '300 pages'],
      'dcterms:format': ['application/pdf', 'text/html'],
      'dcterms:hasformat': ['https://example.org/formats/pdf', 'https://example.org/formats/html'],
      'dcterms:haspart': [
        'https://example.org/parts/chapter1',
        'https://example.org/parts/chapter2',
      ],
      'dcterms:hasversion': ['https://example.org/versions/v2', 'https://example.org/versions/v3'],
      'dcterms:identifier': ['ISBN:978-0123456789', 'DOI:10.1234/example'],
      'dcterms:instructionalmethod': ['Online learning', 'In-person learning'],
      'dcterms:isformatof': [
        'https://example.org/original',
        'https://example.org/another-original',
      ],
      'dcterms:ispartof': ['https://example.org/collection', 'https://example.org/series'],
      'dcterms:isreferencedby': [
        'https://example.org/references/citation1',
        'https://example.org/references/citation2',
      ],
      'dcterms:isreplacedby': [
        'https://example.org/replacement',
        'https://example.org/new-replacement',
      ],
      'dcterms:isrequiredby': [
        'https://example.org/dependent',
        'https://example.org/another-dependent',
      ],
      'dcterms:issued': ['2023-05-20T10:00:00Z', '2023-05-21T10:00:00Z'],
      'dcterms:isversionof': ['https://example.org/original-work', 'https://example.org/base-work'],
      'dcterms:language': ['en-US', 'en-GB'],
      'dcterms:license': ['Creative Commons Attribution 4.0', 'MIT License'],
      'dcterms:mediator': ['Library System', 'Archive System'],
      'dcterms:medium': ['Digital', 'Print'],
      'dcterms:modified': ['2023-05-25T16:45:00Z', '2023-05-26T16:45:00Z'],
      'dcterms:provenance': ['Digitized from original manuscript', 'Scanned from print'],
      'dcterms:publisher': ['Academic Press', 'University Press'],
      'dcterms:references': ['https://example.org/ref/source1', 'https://example.org/ref/source2'],
      'dcterms:relation': ['https://example.org/related', 'https://example.org/also-related'],
      'dcterms:replaces': [
        'https://example.org/old-version',
        'https://example.org/deprecated-version',
      ],
      'dcterms:requires': ['https://example.org/prerequisite', 'https://example.org/dependency'],
      'dcterms:rights': ['Copyright 2023', 'All rights reserved'],
      'dcterms:rightsholder': ['Example University', 'Example Foundation'],
      'dcterms:source': ['https://example.org/source', 'https://example.org/origin'],
      'dcterms:spatial': ['Boston, MA, USA', 'Cambridge, MA, USA'],
      'dcterms:subject': ['Academic Research', 'Scientific Study'],
      'dcterms:tableofcontents': ['Chapter 1, Chapter 2, Chapter 3', 'Section 1, Section 2'],
      'dcterms:temporal': ['2023', '2022-2023'],
      'dcterms:title': ['Sample Title', 'Alternative Sample Title'],
      'dcterms:type': ['Text', 'Dataset'],
      'dcterms:valid': ['2024-05-25T23:59:59Z', '2025-05-25T23:59:59Z'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse partial item or feed object with some properties', () => {
    const value = {
      'dcterms:abstract': 'Partial abstract',
      'dcterms:created': '2023-05-01T12:00:00Z',
      'dcterms:license': 'MIT License',
      'dcterms:spatial': 'New York, NY',
    }
    const expected = {
      abstract: 'Partial abstract',
      created: '2023-05-01T12:00:00Z',
      license: 'MIT License',
      spatial: 'New York, NY',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle array of values and extract first one', () => {
    const value = {
      'dcterms:abstract': ['First abstract', 'Second abstract'],
      'dcterms:license': [{ '#text': 'First license' }, { '#text': 'Second license' }],
    }
    const expected = {
      abstract: 'First abstract',
      license: 'First license',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'dcterms:created': 123456789,
      'dcterms:issued': true,
      'dcterms:abstract': null,
      'dcterms:license': '',
    }
    const expected = {
      created: '123456789',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty item or feed object', () => {
    expect(retrieveItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(retrieveItemOrFeed('not an object')).toBeUndefined()
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'dcterms:abstract': 'Valid abstract',
      'dcterms:created': 'invalid-date',
      'dcterms:license': 'Valid license',
      'other:property': 'Should be ignored',
    }
    const expected = {
      abstract: 'Valid abstract',
      created: 'invalid-date',
      license: 'Valid license',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })
})
