import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate valid itemOrFeed object with all properties', () => {
    const value = {
      abstracts: ['Sample abstract content'],
      accessRights: ['Open Access'],
      accrualMethods: ['Manual upload'],
      accrualPeriodicities: ['Annual'],
      accrualPolicies: ['Open submission'],
      alternatives: ['Alternative Title'],
      audiences: ['General Public'],
      available: [new Date('2023-06-01T00:00:00Z')],
      bibliographicCitations: ['Doe, J. (2023). Sample Work. Publisher.'],
      conformsTo: ['Dublin Core Metadata Terms'],
      contributors: ['Jane Smith'],
      coverages: ['Global'],
      created: [new Date('2023-05-01T12:00:00Z')],
      creators: ['John Doe'],
      dateAccepted: [new Date('2023-05-10T09:00:00Z')],
      dateCopyrighted: [new Date('2023-05-15T00:00:00Z')],
      dates: [new Date('2023-05-02T08:30:00Z')],
      dateSubmitted: [new Date('2023-05-05T14:30:00Z')],
      descriptions: ['A comprehensive description'],
      educationLevels: ['Graduate level'],
      extents: ['250 pages'],
      formats: ['application/pdf'],
      hasFormats: ['https://example.org/formats/pdf'],
      hasParts: ['https://example.org/parts/chapter1'],
      hasVersions: ['https://example.org/versions/v2'],
      identifiers: ['ISBN:978-0123456789'],
      instructionalMethods: ['Online learning'],
      isFormatOf: ['https://example.org/original'],
      isPartOf: ['https://example.org/collection'],
      isReferencedBy: ['https://example.org/references/citation1'],
      isReplacedBy: ['https://example.org/replacement'],
      isRequiredBy: ['https://example.org/dependent'],
      issued: [new Date('2023-05-20T10:00:00Z')],
      isVersionOf: ['https://example.org/original-work'],
      languages: ['en-US'],
      licenses: ['Creative Commons Attribution 4.0'],
      mediators: ['Library System'],
      mediums: ['Digital'],
      modified: [new Date('2023-05-25T16:45:00Z')],
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
      valid: [new Date('2024-05-25T23:59:59Z')],
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

  it('should generate itemOrFeed with minimal properties', () => {
    const value = {
      titles: ['Minimal Title'],
    }
    const expected = {
      'dcterms:title': ['Minimal Title'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate valid itemOrFeed object with multiple values', () => {
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

  it('should handle empty arrays', () => {
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
      accessRights: undefined,
      accrualMethods: undefined,
      accrualPeriodicities: undefined,
      accrualPolicies: undefined,
      alternatives: undefined,
      audiences: undefined,
      available: undefined,
      bibliographicCitations: undefined,
      conformsTo: undefined,
      contributors: undefined,
      coverages: undefined,
      created: undefined,
      creators: undefined,
      dateAccepted: undefined,
      dateCopyrighted: undefined,
      dates: undefined,
      dateSubmitted: undefined,
      descriptions: undefined,
      educationLevels: undefined,
      extents: undefined,
      formats: undefined,
      hasFormats: undefined,
      hasParts: undefined,
      hasVersions: undefined,
      identifiers: undefined,
      instructionalMethods: undefined,
      isFormatOf: undefined,
      isPartOf: undefined,
      isReferencedBy: undefined,
      isReplacedBy: undefined,
      isRequiredBy: undefined,
      issued: undefined,
      isVersionOf: undefined,
      languages: undefined,
      licenses: undefined,
      mediators: undefined,
      mediums: undefined,
      modified: undefined,
      provenances: undefined,
      publishers: undefined,
      references: undefined,
      relations: undefined,
      replaces: undefined,
      requires: undefined,
      rights: undefined,
      rightsHolders: undefined,
      sources: undefined,
      spatials: undefined,
      subjects: undefined,
      tableOfContents: undefined,
      temporals: undefined,
      titles: undefined,
      types: undefined,
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
