import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate valid itemOrFeed object with all properties', () => {
    const value = {
      abstract: 'Sample abstract content',
      accessRights: 'Open Access',
      accrualMethod: 'Manual upload',
      accrualPeriodicity: 'Annual',
      accrualPolicy: 'Open submission',
      alternative: 'Alternative Title',
      audience: 'General Public',
      available: new Date('2023-06-01T00:00:00Z'),
      bibliographicCitation: 'Doe, J. (2023). Sample Work. Publisher.',
      conformsTo: 'Dublin Core Metadata Terms',
      contributor: 'Jane Smith',
      coverage: 'Global',
      created: new Date('2023-05-01T12:00:00Z'),
      creator: 'John Doe',
      date: new Date('2023-05-02T08:30:00Z'),
      dateAccepted: new Date('2023-05-10T09:00:00Z'),
      dateCopyrighted: new Date('2023-05-15T00:00:00Z'),
      dateSubmitted: new Date('2023-05-05T14:30:00Z'),
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
      issued: new Date('2023-05-20T10:00:00Z'),
      isVersionOf: 'https://example.org/original-work',
      language: 'en-US',
      license: 'Creative Commons Attribution 4.0',
      mediator: 'Library System',
      medium: 'Digital',
      modified: new Date('2023-05-25T16:45:00Z'),
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
      valid: new Date('2024-05-25T23:59:59Z'),
    }
    const expected = {
      'dcterms:abstract': 'Sample abstract content',
      'dcterms:accessRights': 'Open Access',
      'dcterms:accrualMethod': 'Manual upload',
      'dcterms:accrualPeriodicity': 'Annual',
      'dcterms:accrualPolicy': 'Open submission',
      'dcterms:alternative': 'Alternative Title',
      'dcterms:audience': 'General Public',
      'dcterms:available': '2023-06-01T00:00:00.000Z',
      'dcterms:bibliographicCitation': 'Doe, J. (2023). Sample Work. Publisher.',
      'dcterms:conformsTo': 'Dublin Core Metadata Terms',
      'dcterms:contributor': 'Jane Smith',
      'dcterms:coverage': 'Global',
      'dcterms:created': '2023-05-01T12:00:00.000Z',
      'dcterms:creator': 'John Doe',
      'dcterms:date': '2023-05-02T08:30:00.000Z',
      'dcterms:dateAccepted': '2023-05-10T09:00:00.000Z',
      'dcterms:dateCopyrighted': '2023-05-15T00:00:00.000Z',
      'dcterms:dateSubmitted': '2023-05-05T14:30:00.000Z',
      'dcterms:description': 'A comprehensive description',
      'dcterms:educationLevel': 'Graduate level',
      'dcterms:extent': '250 pages',
      'dcterms:format': 'application/pdf',
      'dcterms:hasFormat': 'https://example.org/formats/pdf',
      'dcterms:hasPart': 'https://example.org/parts/chapter1',
      'dcterms:hasVersion': 'https://example.org/versions/v2',
      'dcterms:identifier': 'ISBN:978-0123456789',
      'dcterms:instructionalMethod': 'Online learning',
      'dcterms:isFormatOf': 'https://example.org/original',
      'dcterms:isPartOf': 'https://example.org/collection',
      'dcterms:isReferencedBy': 'https://example.org/references/citation1',
      'dcterms:isReplacedBy': 'https://example.org/replacement',
      'dcterms:isRequiredBy': 'https://example.org/dependent',
      'dcterms:issued': '2023-05-20T10:00:00.000Z',
      'dcterms:isVersionOf': 'https://example.org/original-work',
      'dcterms:language': 'en-US',
      'dcterms:license': 'Creative Commons Attribution 4.0',
      'dcterms:mediator': 'Library System',
      'dcterms:medium': 'Digital',
      'dcterms:modified': '2023-05-25T16:45:00.000Z',
      'dcterms:provenance': 'Digitized from original manuscript',
      'dcterms:publisher': 'Academic Press',
      'dcterms:references': 'https://example.org/ref/source1',
      'dcterms:relation': 'https://example.org/related',
      'dcterms:replaces': 'https://example.org/old-version',
      'dcterms:requires': 'https://example.org/prerequisite',
      'dcterms:rights': 'Copyright 2023',
      'dcterms:rightsHolder': 'Example University',
      'dcterms:source': 'https://example.org/source',
      'dcterms:spatial': 'Boston, MA, USA',
      'dcterms:subject': 'Academic Research',
      'dcterms:tableOfContents': 'Chapter 1, Chapter 2, Chapter 3',
      'dcterms:temporal': '2023',
      'dcterms:title': 'Sample Title',
      'dcterms:type': 'Text',
      'dcterms:valid': '2024-05-25T23:59:59.000Z',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate itemOrFeed with minimal properties', () => {
    const value = {
      title: 'Minimal Title',
    }
    const expected = {
      'dcterms:title': 'Minimal Title',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate valid itemOrFeed object with all plural properties (single values)', () => {
    const value = {
      abstracts: ['Sample abstract'],
      accrualMethods: ['Manual upload'],
      accrualPeriodicities: ['Annual'],
      accrualPolicies: ['Open submission'],
      alternatives: ['Alternative Title'],
      audiences: ['General Public'],
      bibliographicCitations: ['Doe, J. (2023). Sample Work.'],
      contributors: ['Jane Smith'],
      coverages: ['Global'],
      creators: ['John Doe'],
      dates: [new Date('2023-05-02T08:30:00Z')],
      descriptions: ['A comprehensive description'],
      educationLevels: ['Graduate level'],
      extents: ['250 pages'],
      formats: ['application/pdf'],
      hasFormats: ['https://example.org/formats/pdf'],
      hasParts: ['https://example.org/parts/chapter1'],
      hasVersions: ['https://example.org/versions/v2'],
      identifiers: ['ISBN:978-0123456789'],
      instructionalMethods: ['Online learning'],
      languages: ['en-US'],
      licenses: ['Creative Commons Attribution 4.0'],
      mediators: ['Library System'],
      mediums: ['Digital'],
      provenances: ['Digitized from original manuscript'],
      publishers: ['Academic Press'],
      relations: ['https://example.org/related'],
      rightsHolders: ['Example University'],
      sources: ['https://example.org/source'],
      spatials: ['Boston, MA, USA'],
      subjects: ['Academic Research'],
      temporals: ['2023'],
      titles: ['Sample Title'],
      types: ['Text'],
    }
    const expected = {
      'dcterms:abstract': ['Sample abstract'],
      'dcterms:accrualMethod': ['Manual upload'],
      'dcterms:accrualPeriodicity': ['Annual'],
      'dcterms:accrualPolicy': ['Open submission'],
      'dcterms:alternative': ['Alternative Title'],
      'dcterms:audience': ['General Public'],
      'dcterms:bibliographicCitation': ['Doe, J. (2023). Sample Work.'],
      'dcterms:contributor': ['Jane Smith'],
      'dcterms:coverage': ['Global'],
      'dcterms:creator': ['John Doe'],
      'dcterms:date': ['2023-05-02T08:30:00.000Z'],
      'dcterms:description': ['A comprehensive description'],
      'dcterms:educationLevel': ['Graduate level'],
      'dcterms:extent': ['250 pages'],
      'dcterms:format': ['application/pdf'],
      'dcterms:hasFormat': ['https://example.org/formats/pdf'],
      'dcterms:hasPart': ['https://example.org/parts/chapter1'],
      'dcterms:hasVersion': ['https://example.org/versions/v2'],
      'dcterms:identifier': ['ISBN:978-0123456789'],
      'dcterms:instructionalMethod': ['Online learning'],
      'dcterms:language': ['en-US'],
      'dcterms:license': ['Creative Commons Attribution 4.0'],
      'dcterms:mediator': ['Library System'],
      'dcterms:medium': ['Digital'],
      'dcterms:provenance': ['Digitized from original manuscript'],
      'dcterms:publisher': ['Academic Press'],
      'dcterms:relation': ['https://example.org/related'],
      'dcterms:rightsHolder': ['Example University'],
      'dcterms:source': ['https://example.org/source'],
      'dcterms:spatial': ['Boston, MA, USA'],
      'dcterms:subject': ['Academic Research'],
      'dcterms:temporal': ['2023'],
      'dcterms:title': ['Sample Title'],
      'dcterms:type': ['Text'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate valid itemOrFeed object with plural properties (multiple values)', () => {
    const value = {
      abstracts: ['First abstract', 'Second abstract'],
      creators: ['John Doe', 'Jane Smith'],
      dates: [new Date('2023-01-01T00:00:00Z'), new Date('2023-02-01T00:00:00Z')],
      titles: ['Main Title', 'Alternative Title'],
    }
    const expected = {
      'dcterms:abstract': ['First abstract', 'Second abstract'],
      'dcterms:creator': ['John Doe', 'Jane Smith'],
      'dcterms:date': ['2023-01-01T00:00:00.000Z', '2023-02-01T00:00:00.000Z'],
      'dcterms:title': ['Main Title', 'Alternative Title'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should prefer plural fields over singular when both are provided', () => {
    const value = {
      abstracts: ['Plural Abstract 1', 'Plural Abstract 2'],
      creators: ['Plural Creator'],
      abstract: 'Singular Abstract',
      creator: 'Singular Creator',
    }
    const expected = {
      'dcterms:abstract': ['Plural Abstract 1', 'Plural Abstract 2'],
      'dcterms:creator': ['Plural Creator'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty arrays in plural fields', () => {
    const value = {
      abstracts: [],
      creators: ['John Doe'],
      subjects: [],
    }
    const expected = {
      'dcterms:creator': ['John Doe'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      abstracts: undefined,
      accrualMethods: undefined,
      accrualPeriodicities: undefined,
      accrualPolicies: undefined,
      alternatives: undefined,
      audiences: undefined,
      bibliographicCitations: undefined,
      contributors: undefined,
      coverages: undefined,
      creators: undefined,
      dates: undefined,
      descriptions: undefined,
      educationLevels: undefined,
      extents: undefined,
      formats: undefined,
      hasFormats: undefined,
      hasParts: undefined,
      hasVersions: undefined,
      identifiers: undefined,
      instructionalMethods: undefined,
      languages: undefined,
      licenses: undefined,
      mediators: undefined,
      mediums: undefined,
      provenances: undefined,
      publishers: undefined,
      relations: undefined,
      rightsHolders: undefined,
      sources: undefined,
      spatials: undefined,
      subjects: undefined,
      temporals: undefined,
      titles: undefined,
      types: undefined,
      abstract: undefined,
      accessRights: undefined,
      accrualMethod: undefined,
      accrualPeriodicity: undefined,
      accrualPolicy: undefined,
      alternative: undefined,
      audience: undefined,
      available: undefined,
      bibliographicCitation: undefined,
      conformsTo: undefined,
      contributor: undefined,
      coverage: undefined,
      created: undefined,
      creator: undefined,
      date: undefined,
      dateAccepted: undefined,
      dateCopyrighted: undefined,
      dateSubmitted: undefined,
      description: undefined,
      educationLevel: undefined,
      extent: undefined,
      format: undefined,
      hasFormat: undefined,
      hasPart: undefined,
      hasVersion: undefined,
      identifier: undefined,
      instructionalMethod: undefined,
      isFormatOf: undefined,
      isPartOf: undefined,
      isReferencedBy: undefined,
      isReplacedBy: undefined,
      isRequiredBy: undefined,
      issued: undefined,
      isVersionOf: undefined,
      language: undefined,
      license: undefined,
      mediator: undefined,
      medium: undefined,
      modified: undefined,
      provenance: undefined,
      publisher: undefined,
      references: undefined,
      relation: undefined,
      replaces: undefined,
      requires: undefined,
      rights: undefined,
      rightsHolder: undefined,
      source: undefined,
      spatial: undefined,
      subject: undefined,
      tableOfContents: undefined,
      temporal: undefined,
      title: undefined,
      type: undefined,
      valid: undefined,
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
  })
})
