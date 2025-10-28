import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate valid itemOrFeed object with all singular (deprecated) properties', () => {
    const value = {
      abstract: 'Sample abstract content',
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
      relation: 'https://example.org/related',
      rightsHolder: 'Example University',
      source: 'https://example.org/source',
      spatial: 'Boston, MA, USA',
      subject: 'Academic Research',
      temporal: '2023',
      title: 'Sample Title',
      type: 'Text',
      valid: new Date('2024-05-25T23:59:59Z'),
    }
    const expected = {
      'dcterms:abstract': 'Sample abstract content',
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
      'dcterms:relation': 'https://example.org/related',
      'dcterms:rightsHolder': 'Example University',
      'dcterms:source': 'https://example.org/source',
      'dcterms:spatial': 'Boston, MA, USA',
      'dcterms:subject': 'Academic Research',
      'dcterms:temporal': '2023',
      'dcterms:title': 'Sample Title',
      'dcterms:type': 'Text',
      'dcterms:valid': '2024-05-25T23:59:59.000Z',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate valid itemOrFeed object with all plural properties (single values)', () => {
    const value = {
      abstracts: ['Sample abstract content'],
      accessRights: ['Open Access'],
      accrualMethods: ['Manual upload'],
      accrualPeriodicities: ['Annual'],
      accrualPolicies: ['Open submission'],
      alternatives: ['Alternative Title'],
      audiences: ['General Public'],
      availables: [new Date('2023-06-01T00:00:00Z')],
      bibliographicCitations: ['Doe, J. (2023). Sample Work. Publisher.'],
      conformsTos: ['Dublin Core Metadata Terms'],
      contributors: ['Jane Smith'],
      coverages: ['Global'],
      createds: [new Date('2023-05-01T12:00:00Z')],
      creators: ['John Doe'],
      dates: [new Date('2023-05-02T08:30:00Z')],
      dateAccepteds: [new Date('2023-05-10T09:00:00Z')],
      dateCopyrighteds: [new Date('2023-05-15T00:00:00Z')],
      dateSubmitteds: [new Date('2023-05-05T14:30:00Z')],
      descriptions: ['A comprehensive description'],
      educationLevels: ['Graduate level'],
      extents: ['250 pages'],
      formats: ['application/pdf'],
      hasFormats: ['https://example.org/formats/pdf'],
      hasParts: ['https://example.org/parts/chapter1'],
      hasVersions: ['https://example.org/versions/v2'],
      identifiers: ['ISBN:978-0123456789'],
      instructionalMethods: ['Online learning'],
      isFormatOfs: ['https://example.org/original'],
      isPartOfs: ['https://example.org/collection'],
      isReferencedBys: ['https://example.org/references/citation1'],
      isReplacedBys: ['https://example.org/replacement'],
      isRequiredBys: ['https://example.org/dependent'],
      issueds: [new Date('2023-05-20T10:00:00Z')],
      isVersionOfs: ['https://example.org/original-work'],
      languages: ['en-US'],
      licenses: ['Creative Commons Attribution 4.0'],
      mediators: ['Library System'],
      mediums: ['Digital'],
      modifieds: [new Date('2023-05-25T16:45:00Z')],
      provenances: ['Digitized from original manuscript'],
      publishers: ['Academic Press'],
      references: ['https://example.org/ref/source1'],
      relations: ['https://example.org/related'],
      replaces: ['https://example.org/old-version'],
      requires: ['https://example.org/prerequisite'],
      rights: ['Copyright 2023'],
      rightsHolders: ['Example University'],
      sources: ['https://example.org/source'],
      spatials: ['Boston, MA, USA'],
      subjects: ['Academic Research'],
      tableOfContents: ['Chapter 1, Chapter 2, Chapter 3'],
      temporals: ['2023'],
      titles: ['Sample Title'],
      types: ['Text'],
      valids: [new Date('2024-05-25T23:59:59Z')],
    }
    const expected = {
      'dcterms:abstract': ['Sample abstract content'],
      'dcterms:accessRights': ['Open Access'],
      'dcterms:accrualMethod': ['Manual upload'],
      'dcterms:accrualPeriodicity': ['Annual'],
      'dcterms:accrualPolicy': ['Open submission'],
      'dcterms:alternative': ['Alternative Title'],
      'dcterms:audience': ['General Public'],
      'dcterms:available': ['2023-06-01T00:00:00.000Z'],
      'dcterms:bibliographicCitation': ['Doe, J. (2023). Sample Work. Publisher.'],
      'dcterms:conformsTo': ['Dublin Core Metadata Terms'],
      'dcterms:contributor': ['Jane Smith'],
      'dcterms:coverage': ['Global'],
      'dcterms:created': ['2023-05-01T12:00:00.000Z'],
      'dcterms:creator': ['John Doe'],
      'dcterms:date': ['2023-05-02T08:30:00.000Z'],
      'dcterms:dateAccepted': ['2023-05-10T09:00:00.000Z'],
      'dcterms:dateCopyrighted': ['2023-05-15T00:00:00.000Z'],
      'dcterms:dateSubmitted': ['2023-05-05T14:30:00.000Z'],
      'dcterms:description': ['A comprehensive description'],
      'dcterms:educationLevel': ['Graduate level'],
      'dcterms:extent': ['250 pages'],
      'dcterms:format': ['application/pdf'],
      'dcterms:hasFormat': ['https://example.org/formats/pdf'],
      'dcterms:hasPart': ['https://example.org/parts/chapter1'],
      'dcterms:hasVersion': ['https://example.org/versions/v2'],
      'dcterms:identifier': ['ISBN:978-0123456789'],
      'dcterms:instructionalMethod': ['Online learning'],
      'dcterms:isFormatOf': ['https://example.org/original'],
      'dcterms:isPartOf': ['https://example.org/collection'],
      'dcterms:isReferencedBy': ['https://example.org/references/citation1'],
      'dcterms:isReplacedBy': ['https://example.org/replacement'],
      'dcterms:isRequiredBy': ['https://example.org/dependent'],
      'dcterms:issued': ['2023-05-20T10:00:00.000Z'],
      'dcterms:isVersionOf': ['https://example.org/original-work'],
      'dcterms:language': ['en-US'],
      'dcterms:license': ['Creative Commons Attribution 4.0'],
      'dcterms:mediator': ['Library System'],
      'dcterms:medium': ['Digital'],
      'dcterms:modified': ['2023-05-25T16:45:00.000Z'],
      'dcterms:provenance': ['Digitized from original manuscript'],
      'dcterms:publisher': ['Academic Press'],
      'dcterms:references': ['https://example.org/ref/source1'],
      'dcterms:relation': ['https://example.org/related'],
      'dcterms:replaces': ['https://example.org/old-version'],
      'dcterms:requires': ['https://example.org/prerequisite'],
      'dcterms:rights': ['Copyright 2023'],
      'dcterms:rightsHolder': ['Example University'],
      'dcterms:source': ['https://example.org/source'],
      'dcterms:spatial': ['Boston, MA, USA'],
      'dcterms:subject': ['Academic Research'],
      'dcterms:tableOfContents': ['Chapter 1, Chapter 2, Chapter 3'],
      'dcterms:temporal': ['2023'],
      'dcterms:title': ['Sample Title'],
      'dcterms:type': ['Text'],
      'dcterms:valid': ['2024-05-25T23:59:59.000Z'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate valid itemOrFeed object with plural properties (multiple values)', () => {
    const value = {
      abstracts: ['Sample abstract content', 'Another abstract'],
      accessRights: ['Open Access', 'Restricted Access'],
      titles: ['Sample Title', 'Alternative Title'],
      creators: ['John Doe', 'Jane Doe'],
      subjects: ['Academic Research', 'Scientific Study'],
      descriptions: ['First description', 'Second description'],
      publishers: ['Academic Press', 'University Press'],
      contributors: ['Alice', 'Bob'],
      dates: [new Date('2023-01-01T00:00:00Z'), new Date('2023-06-15T12:00:00Z')],
      types: ['Text', 'Dataset'],
      formats: ['application/pdf', 'text/html'],
      identifiers: ['ISBN:978-0123456789', 'DOI:10.1234/example'],
      sources: ['https://example.org/source1', 'https://example.org/source2'],
      languages: ['en-US', 'en-GB'],
      relations: ['https://example.org/related1', 'https://example.org/related2'],
      coverages: ['Global', 'North America'],
      rights: ['Copyright 2023', 'CC BY-NC-SA 4.0'],
      references: ['https://example.org/ref1', 'https://example.org/ref2'],
      replaces: ['https://example.org/old1', 'https://example.org/old2'],
      requires: ['https://example.org/dep1', 'https://example.org/dep2'],
      tableOfContents: ['Chapter 1, Chapter 2', 'Section 1, Section 2'],
    }
    const expected = {
      'dcterms:abstract': ['Sample abstract content', 'Another abstract'],
      'dcterms:accessRights': ['Open Access', 'Restricted Access'],
      'dcterms:title': ['Sample Title', 'Alternative Title'],
      'dcterms:creator': ['John Doe', 'Jane Doe'],
      'dcterms:subject': ['Academic Research', 'Scientific Study'],
      'dcterms:description': ['First description', 'Second description'],
      'dcterms:publisher': ['Academic Press', 'University Press'],
      'dcterms:contributor': ['Alice', 'Bob'],
      'dcterms:date': ['2023-01-01T00:00:00.000Z', '2023-06-15T12:00:00.000Z'],
      'dcterms:type': ['Text', 'Dataset'],
      'dcterms:format': ['application/pdf', 'text/html'],
      'dcterms:identifier': ['ISBN:978-0123456789', 'DOI:10.1234/example'],
      'dcterms:source': ['https://example.org/source1', 'https://example.org/source2'],
      'dcterms:language': ['en-US', 'en-GB'],
      'dcterms:relation': ['https://example.org/related1', 'https://example.org/related2'],
      'dcterms:coverage': ['Global', 'North America'],
      'dcterms:rights': ['Copyright 2023', 'CC BY-NC-SA 4.0'],
      'dcterms:references': ['https://example.org/ref1', 'https://example.org/ref2'],
      'dcterms:replaces': ['https://example.org/old1', 'https://example.org/old2'],
      'dcterms:requires': ['https://example.org/dep1', 'https://example.org/dep2'],
      'dcterms:tableOfContents': ['Chapter 1, Chapter 2', 'Section 1, Section 2'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should prefer plural fields over singular when both are provided', () => {
    const value = {
      title: 'Singular Title',
      titles: ['Plural Title 1', 'Plural Title 2'],
      creator: 'Singular Creator',
      creators: ['Plural Creator'],
      abstract: 'Singular Abstract',
      abstracts: ['Plural Abstract 1', 'Plural Abstract 2'],
    }
    const expected = {
      'dcterms:title': ['Plural Title 1', 'Plural Title 2'],
      'dcterms:creator': ['Plural Creator'],
      'dcterms:abstract': ['Plural Abstract 1', 'Plural Abstract 2'],
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

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      abstract: undefined,
      title: undefined,
      creator: undefined,
      subject: undefined,
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty arrays in plural fields', () => {
    const value = {
      titles: [],
      creators: ['John Doe'],
      subjects: [],
      abstracts: ['Sample abstract'],
    }
    const expected = {
      'dcterms:creator': ['John Doe'],
      'dcterms:abstract': ['Sample abstract'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
  })
})
