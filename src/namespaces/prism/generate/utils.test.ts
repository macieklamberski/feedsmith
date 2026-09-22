import { describe, expect, it } from 'bun:test'
import {
  generateItemOrFeed,
  generateOriginPlatform,
  generatePlatformDate,
  generatePlatformString,
  generateRating,
} from './utils.js'

describe('generateOriginPlatform', () => {
  it('should generate origin platform as the platform attribute', () => {
    const expected = { '@platform': 'web' }

    expect(generateOriginPlatform('web')).toEqual(expected)
  })

  it('should trim the platform value', () => {
    const expected = { '@platform': 'print' }

    expect(generateOriginPlatform('  print  ')).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    expect(generateOriginPlatform('')).toBeUndefined()
  })

  it('should handle non-string inputs', () => {
    expect(generateOriginPlatform(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateOriginPlatform(123)).toBeUndefined()
  })
})

describe('generatePlatformString', () => {
  it('should generate text with platform attribute', () => {
    const value = { value: 'Summer Special', platform: 'web' }
    const expected = { '#text': 'Summer Special', '@platform': 'web' }

    expect(generatePlatformString(value)).toEqual(expected)
  })

  it('should generate text without platform attribute', () => {
    const value = { value: 'Summer Special' }
    const expected = { '#text': 'Summer Special' }

    expect(generatePlatformString(value)).toEqual(expected)
  })

  it('should wrap HTML in CDATA', () => {
    const value = { value: '<b>Summer</b> Special', platform: 'web' }
    const expected = { '#cdata': '<b>Summer</b> Special', '@platform': 'web' }

    expect(generatePlatformString(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generatePlatformString({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generatePlatformString(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePlatformString('Summer Special')).toBeUndefined()
  })
})

describe('generatePlatformDate', () => {
  it('should generate date with platform attribute', () => {
    const value = { value: new Date('2023-03-15T00:00:00Z'), platform: 'web' }
    const expected = { '#text': '2023-03-15T00:00:00.000Z', '@platform': 'web' }

    expect(generatePlatformDate(value)).toEqual(expected)
  })

  it('should generate date without platform attribute', () => {
    const value = { value: new Date('2023-03-15T00:00:00Z') }
    const expected = { '#text': '2023-03-15T00:00:00.000Z' }

    expect(generatePlatformDate(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generatePlatformDate({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generatePlatformDate(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePlatformDate(new Date('2023-03-15T00:00:00Z'))).toBeUndefined()
  })
})

describe('generateRating', () => {
  it('should generate rating with ratingSystem attribute', () => {
    const value = { value: 'E', ratingSystem: 'ESRB' }
    const expected = { '#text': 'E', '@ratingSystem': 'ESRB' }

    expect(generateRating(value)).toEqual(expected)
  })

  it('should generate rating without ratingSystem attribute', () => {
    const value = { value: 'E' }
    const expected = { '#text': 'E' }

    expect(generateRating(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateRating({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateRating(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRating('E')).toBeUndefined()
  })
})

describe('generateItemOrFeed', () => {
  it('should generate feed with core properties', () => {
    const value = {
      publicationName: 'Journal of Examples',
      issn: '1234-5678',
      eIssn: '8765-4321',
      volume: '615',
      number: '7952',
      publicationDates: [{ value: new Date('2023-03-15T00:00:00Z') }],
      aggregationType: 'journal',
      publishingFrequency: 'weekly',
      urls: [{ value: 'https://journal.example.com' }],
      teasers: [{ value: 'A short promotional description' }],
      keywords: ['science', 'research'],
    }
    const expected = {
      'prism:publicationName': 'Journal of Examples',
      'prism:issn': '1234-5678',
      'prism:eIssn': '8765-4321',
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:publicationDate': [{ '#text': '2023-03-15T00:00:00.000Z' }],
      'prism:aggregationType': 'journal',
      'prism:publishingFrequency': 'weekly',
      'prism:url': [{ '#text': 'https://journal.example.com' }],
      'prism:teaser': [{ '#text': 'A short promotional description' }],
      'prism:keyword': ['science', 'research'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with PRISM 1.2 fields', () => {
    const value = {
      category: 'https://example.com/genre/research',
      hasFormats: ['https://example.com/article.pdf'],
      hasParts: ['https://example.com/figure-1', 'https://example.com/figure-2'],
      hasPreviousVersion: 'https://example.com/article-v1',
      isFormatOf: 'https://example.com/article',
      isPartOf: 'https://example.com/issue-7952',
      isReferencedBy: 'https://example.com/review',
      isRequiredBy: 'https://example.com/bundle',
      isVersionOf: 'https://example.com/original',
      objectTitles: ['Dodge Viper'],
      receptionDate: new Date('2023-03-16T00:00:00Z'),
      references: ['https://doi.org/10.1000/1', 'https://doi.org/10.1000/2'],
      requires: 'https://example.com/dataset',
    }
    const expected = {
      'prism:category': 'https://example.com/genre/research',
      'prism:hasFormat': ['https://example.com/article.pdf'],
      'prism:hasPart': ['https://example.com/figure-1', 'https://example.com/figure-2'],
      'prism:hasPreviousVersion': 'https://example.com/article-v1',
      'prism:isFormatOf': 'https://example.com/article',
      'prism:isPartOf': 'https://example.com/issue-7952',
      'prism:isReferencedBy': 'https://example.com/review',
      'prism:isRequiredBy': 'https://example.com/bundle',
      'prism:isVersionOf': 'https://example.com/original',
      'prism:objectTitle': ['Dodge Viper'],
      'prism:receptionDate': '2023-03-16T00:00:00.000Z',
      'prism:references': ['https://doi.org/10.1000/1', 'https://doi.org/10.1000/2'],
      'prism:requires': 'https://example.com/dataset',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with page, word count and relationship fields', () => {
    const value = {
      startingPage: '975',
      endingPage: '1211',
      wordCount: 52000,
      hasAlternatives: ['https://example.com/issue-alt'],
      hasCorrections: [{ value: 'https://example.com/issue-correction' }],
      hasTranslations: ['https://example.com/issue-de', 'https://example.com/issue-fr'],
      isCorrectionOf: ['https://example.com/issue-v1'],
      isTranslationOf: 'https://example.com/issue-en',
    }
    const expected = {
      'prism:startingPage': '975',
      'prism:endingPage': '1211',
      'prism:wordCount': 52000,
      'prism:hasAlternative': ['https://example.com/issue-alt'],
      'prism:hasCorrection': [{ '#text': 'https://example.com/issue-correction' }],
      'prism:hasTranslation': ['https://example.com/issue-de', 'https://example.com/issue-fr'],
      'prism:isCorrectionOf': ['https://example.com/issue-v1'],
      'prism:isTranslationOf': 'https://example.com/issue-en',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with plural fields as arrays', () => {
    const value = {
      isbns: ['978-0-123456-78-9', '978-0-987654-32-1'],
      keywords: ['keyword1', 'keyword2'],
      genres: ['article'],
      channels: ['web', 'print'],
      tickers: ['AAPL'],
      timePeriod: '2023-Q1',
    }
    const expected = {
      'prism:isbn': ['978-0-123456-78-9', '978-0-987654-32-1'],
      'prism:keyword': ['keyword1', 'keyword2'],
      'prism:genre': ['article'],
      'prism:channel': ['web', 'print'],
      'prism:ticker': ['AAPL'],
      'prism:timePeriod': '2023-Q1',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with date fields', () => {
    const value = {
      coverDate: new Date('2023-03-01T00:00:00Z'),
      publicationDates: [{ value: new Date('2023-03-15T10:00:00Z') }],
      creationDate: new Date('2023-02-20T00:00:00Z'),
      modificationDate: new Date('2023-03-10T14:30:00Z'),
      killDate: { value: new Date('2024-03-15T00:00:00Z') },
      onSaleDates: [{ value: new Date('2023-03-01T00:00:00Z') }],
      offSaleDates: [{ value: new Date('2023-04-01T00:00:00Z') }],
    }
    const expected = {
      'prism:coverDate': '2023-03-01T00:00:00.000Z',
      'prism:publicationDate': [{ '#text': '2023-03-15T10:00:00.000Z' }],
      'prism:creationDate': '2023-02-20T00:00:00.000Z',
      'prism:modificationDate': '2023-03-10T14:30:00.000Z',
      'prism:killDate': { '#text': '2024-03-15T00:00:00.000Z' },
      'prism:onSaleDate': [{ '#text': '2023-03-01T00:00:00.000Z' }],
      'prism:offSaleDate': [{ '#text': '2023-04-01T00:00:00.000Z' }],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with number fields', () => {
    const value = {
      aggregateIssueNumber: 500,
      byteCount: 1048576,
    }
    const expected = {
      'prism:aggregateIssueNumber': 500,
      'prism:byteCount': 1048576,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with deprecated fields', () => {
    const value = {
      embargoDate: new Date('2023-06-01T00:00:00Z'),
      copyright: '© 2023 Publisher',
      expirationDate: new Date('2024-01-01T00:00:00Z'),
      rightsAgent: 'Rights Management Inc.',
    }
    const expected = {
      'prism:embargoDate': '2023-06-01T00:00:00.000Z',
      'prism:copyright': '© 2023 Publisher',
      'prism:expirationDate': '2024-01-01T00:00:00.000Z',
      'prism:rightsAgent': 'Rights Management Inc.',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with distribution and platform fields', () => {
    const value = {
      channels: ['web'],
      subchannel1: 'news',
      subchannel2: 'science',
      section: 'front-page',
      subsection1: 'highlights',
      subsection2: 'featured',
      platforms: ['desktop'],
      originPlatforms: ['print', 'digital'],
      device: 'tablet',
      complianceProfile: 'PRISM 3.0',
      sellingAgencies: ['Agency1'],
    }
    const expected = {
      'prism:channel': ['web'],
      'prism:subchannel1': 'news',
      'prism:subchannel2': 'science',
      'prism:section': 'front-page',
      'prism:subsection1': 'highlights',
      'prism:subsection2': 'featured',
      'prism:platform': ['desktop'],
      'prism:originPlatform': [{ '@platform': 'print' }, { '@platform': 'digital' }],
      'prism:device': 'tablet',
      'prism:complianceProfile': 'PRISM 3.0',
      'prism:sellingAgency': ['Agency1'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with subject elements', () => {
    const value = {
      academicFields: ['Physics', 'Chemistry'],
      events: ['Conference 2023'],
      industries: ['Technology'],
      locations: ['New York'],
      objects: ['Particle Accelerator'],
      profession: 'Scientist',
      sport: 'Tennis',
    }
    const expected = {
      'prism:academicField': ['Physics', 'Chemistry'],
      'prism:event': ['Conference 2023'],
      'prism:industry': ['Technology'],
      'prism:location': ['New York'],
      'prism:object': ['Particle Accelerator'],
      'prism:profession': 'Scientist',
      'prism:sport': 'Tennis',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with series fields', () => {
    const value = {
      seriesTitle: 'Science Series',
      seriesNumber: 42,
      uspsNumber: '123-456',
      versionIdentifier: 'v1.0.0',
    }
    const expected = {
      'prism:seriesTitle': 'Science Series',
      'prism:seriesNumber': 42,
      'prism:uspsNumber': '123-456',
      'prism:versionIdentifier': 'v1.0.0',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with issue fields', () => {
    const value = {
      issueIdentifier: '2023-03-15',
      issueName: 'Spring Issue',
      issueTeaser: { value: 'Special coverage of breakthrough discoveries' },
      issueType: 'regular',
    }
    const expected = {
      'prism:issueIdentifier': '2023-03-15',
      'prism:issueName': 'Spring Issue',
      'prism:issueTeaser': { '#text': 'Special coverage of breakthrough discoveries' },
      'prism:issueType': 'regular',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with additional date fields', () => {
    const value = {
      coverDisplayDate: 'March 15, 2023',
      publicationDisplayDates: [{ value: 'Spring 2023' }],
      dateReceived: new Date('2023-01-15T00:00:00Z'),
      onSaleDays: [{ value: 'wednesday' }, { value: 'friday' }],
      copyrightYears: ['2023', '2024'],
    }
    const expected = {
      'prism:coverDisplayDate': 'March 15, 2023',
      'prism:publicationDisplayDate': [{ '#text': 'Spring 2023' }],
      'prism:dateReceived': '2023-01-15T00:00:00.000Z',
      'prism:onSaleDay': [{ '#text': 'wednesday' }, { '#text': 'friday' }],
      'prism:copyrightYear': ['2023', '2024'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with content and title fields', () => {
    const value = {
      edition: 'International',
      contentType: 'article',
      alternateTitles: [{ value: 'Example Journal' }, { value: 'Example Magazine' }],
      subtitles: ['The International Weekly Journal of Science'],
    }
    const expected = {
      'prism:edition': 'International',
      'prism:contentType': 'article',
      'prism:alternateTitle': [{ '#text': 'Example Journal' }, { '#text': 'Example Magazine' }],
      'prism:subtitle': ['The International Weekly Journal of Science'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with catalog and product fields', () => {
    const value = {
      bookEditions: ['First Edition', 'Second Edition'],
      nationalCatalogNumber: 'NC12345',
      productCodes: ['EXJ-2023-615', 'EXJ-2023-616'],
    }
    const expected = {
      'prism:bookEdition': ['First Edition', 'Second Edition'],
      'prism:nationalCatalogNumber': 'NC12345',
      'prism:productCode': ['EXJ-2023-615', 'EXJ-2023-616'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with subchannel3-4 and subsection3-4', () => {
    const value = {
      subchannel3: 'biology',
      subchannel4: 'molecular',
      subsection3: 'editors-picks',
      subsection4: 'trending',
    }
    const expected = {
      'prism:subchannel3': 'biology',
      'prism:subchannel4': 'molecular',
      'prism:subsection3': 'editors-picks',
      'prism:subsection4': 'trending',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with organization and entity fields', () => {
    const value = {
      corporateEntities: ['Example Publishing', 'Example Research'],
      distributor: 'Example Distribution Group',
      organizations: ['Example Research'],
      persons: ['Dr. Jane Smith', 'Dr. John Doe'],
    }
    const expected = {
      'prism:corporateEntity': ['Example Publishing', 'Example Research'],
      'prism:distributor': 'Example Distribution Group',
      'prism:organization': ['Example Research'],
      'prism:person': ['Dr. Jane Smith', 'Dr. John Doe'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate feed with blog and link fields', () => {
    const value = {
      blogTitle: 'Example News Blog',
      blogURL: 'https://journal.example.com/news/blog',
      links: ['https://journal.example.com/journal'],
      ratings: [{ value: 'A+' }, { value: 'Excellent' }],
    }
    const expected = {
      'prism:blogTitle': 'Example News Blog',
      'prism:blogURL': 'https://journal.example.com/news/blog',
      'prism:link': ['https://journal.example.com/journal'],
      'prism:rating': [{ '#text': 'A+' }, { '#text': 'Excellent' }],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings by omitting them', () => {
    const value = {
      publicationName: 'Journal of Examples',
      issn: '',
      volume: '   ',
    }
    const expected = {
      'prism:publicationName': 'Journal of Examples',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should filter out empty values from array fields', () => {
    const value = {
      keywords: ['science', '', '   '],
      isbns: ['', '   '],
    }
    const expected = {
      'prism:keyword': ['science'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should filter out undefined values', () => {
    const value = {
      publicationName: 'Journal of Examples',
      issn: undefined,
      aggregateIssueNumber: undefined,
    }
    const expected = {
      'prism:publicationName': 'Journal of Examples',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed('string')).toBeUndefined()
  })

  it('should generate item with core properties', () => {
    const value = {
      doi: '10.1234/example-2023-0001',
      urls: [{ value: 'https://journal.example.com/articles/example-2023-0001' }],
      volume: '615',
      number: '7952',
      startingPage: '425',
      endingPage: '432',
      publicationDates: [{ value: new Date('2023-03-15T00:00:00Z') }],
      keywords: ['quantum', 'computing'],
      genres: ['research-article'],
    }
    const expected = {
      'prism:doi': '10.1234/example-2023-0001',
      'prism:url': [{ '#text': 'https://journal.example.com/articles/example-2023-0001' }],
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:startingPage': '425',
      'prism:endingPage': '432',
      'prism:publicationDate': [{ '#text': '2023-03-15T00:00:00.000Z' }],
      'prism:keyword': ['quantum', 'computing'],
      'prism:genre': ['research-article'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with page information', () => {
    const value = {
      startingPage: '1',
      endingPage: '15',
      pageRange: '1-15',
      pageCount: 15,
      pageProgressionDirection: 'LTR',
      samplePageRange: '1-3',
    }
    const expected = {
      'prism:startingPage': '1',
      'prism:endingPage': '15',
      'prism:pageRange': '1-15',
      'prism:pageCount': 15,
      'prism:pageProgressionDirection': 'LTR',
      'prism:samplePageRange': '1-3',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with dual-level fields', () => {
    const value = {
      publicationName: 'Journal of Science',
      issn: '1234-5678',
      eIssn: '8765-4321',
      section: 'Research',
    }
    const expected = {
      'prism:publicationName': 'Journal of Science',
      'prism:issn': '1234-5678',
      'prism:eIssn': '8765-4321',
      'prism:section': 'Research',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with relationship fields', () => {
    const value = {
      hasAlternatives: ['alt1', 'alt2'],
      hasCorrections: [{ value: 'corr1' }],
      hasTranslations: ['trans1'],
      isAlternativeOf: ['orig1'],
      isCorrectionOf: ['origcorr1'],
      isTranslationOf: 'original-article-id',
    }
    const expected = {
      'prism:hasAlternative': ['alt1', 'alt2'],
      'prism:hasCorrection': [{ '#text': 'corr1' }],
      'prism:hasTranslation': ['trans1'],
      'prism:isAlternativeOf': ['orig1'],
      'prism:isCorrectionOf': ['origcorr1'],
      'prism:isTranslationOf': 'original-article-id',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with supplemental fields', () => {
    const value = {
      supplementTitles: ['Supplementary Materials'],
      supplementDisplayID: 'S1',
      supplementStartingPage: 'S1',
    }
    const expected = {
      'prism:supplementTitle': ['Supplementary Materials'],
      'prism:supplementDisplayID': 'S1',
      'prism:supplementStartingPage': 'S1',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with metric fields', () => {
    const value = {
      wordCount: 5000,
      byteCount: 25000,
      versionIdentifier: 'v1.2.0',
    }
    const expected = {
      'prism:wordCount': 5000,
      'prism:byteCount': 25000,
      'prism:versionIdentifier': 'v1.2.0',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with PAM/PSV dual-level fields', () => {
    const value = {
      publicationDisplayDates: [{ value: 'March 15, 2023' }, { value: 'Spring 2023' }],
      ratings: [{ value: 'PG-13' }, { value: 'TV-14' }],
      timePeriod: '2023-Q1',
      tickers: ['AAPL', 'GOOGL'],
    }
    const expected = {
      'prism:publicationDisplayDate': [{ '#text': 'March 15, 2023' }, { '#text': 'Spring 2023' }],
      'prism:rating': [{ '#text': 'PG-13' }, { '#text': 'TV-14' }],
      'prism:timePeriod': '2023-Q1',
      'prism:ticker': ['AAPL', 'GOOGL'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with deprecated fields', () => {
    const value = {
      embargoDate: new Date('2023-06-01T00:00:00Z'),
      copyright: '© 2023 Author',
      expirationDate: new Date('2024-01-01T00:00:00Z'),
      rightsAgent: 'CCC',
    }
    const expected = {
      'prism:embargoDate': '2023-06-01T00:00:00.000Z',
      'prism:copyright': '© 2023 Author',
      'prism:expirationDate': '2024-01-01T00:00:00.000Z',
      'prism:rightsAgent': 'CCC',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with content and title fields', () => {
    const value = {
      edition: 'International',
      contentType: 'research-article',
      alternateTitles: [{ value: 'Alternative Title 1' }, { value: 'Alternative Title 2' }],
      subtitles: ['A Comprehensive Study'],
      teasers: [{ value: 'Brief summary of the article' }],
      copyrightYears: ['2023', '2024'],
    }
    const expected = {
      'prism:edition': 'International',
      'prism:contentType': 'research-article',
      'prism:alternateTitle': [
        { '#text': 'Alternative Title 1' },
        { '#text': 'Alternative Title 2' },
      ],
      'prism:subtitle': ['A Comprehensive Study'],
      'prism:teaser': [{ '#text': 'Brief summary of the article' }],
      'prism:copyrightYear': ['2023', '2024'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with platform fields', () => {
    const value = {
      platforms: ['desktop', 'mobile', 'tablet'],
      device: 'smartphone',
    }
    const expected = {
      'prism:platform': ['desktop', 'mobile', 'tablet'],
      'prism:device': 'smartphone',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with originPlatform fields', () => {
    const value = {
      originPlatforms: ['print', 'web'],
    }
    const expected = {
      'prism:originPlatform': [{ '@platform': 'print' }, { '@platform': 'web' }],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with subject classification fields', () => {
    const value = {
      academicFields: ['Quantum Physics', 'Computer Science'],
      events: ['Annual Conference 2023'],
      industries: ['Technology', 'Healthcare'],
      locations: ['Cambridge', 'Boston'],
      objects: ['Quantum Computer'],
      profession: 'Researcher',
      sport: 'Cycling',
    }
    const expected = {
      'prism:academicField': ['Quantum Physics', 'Computer Science'],
      'prism:event': ['Annual Conference 2023'],
      'prism:industry': ['Technology', 'Healthcare'],
      'prism:location': ['Cambridge', 'Boston'],
      'prism:object': ['Quantum Computer'],
      'prism:profession': 'Researcher',
      'prism:sport': 'Cycling',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with organization fields', () => {
    const value = {
      corporateEntities: ['Department of Physics'],
      organizations: ['MIT', 'Harvard'],
      persons: ['John Doe', 'Jane Smith'],
    }
    const expected = {
      'prism:corporateEntity': ['Department of Physics'],
      'prism:organization': ['MIT', 'Harvard'],
      'prism:person': ['John Doe', 'Jane Smith'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with link fields', () => {
    const value = {
      links: ['https://example.com/related1', 'https://example.com/related2'],
    }
    const expected = {
      'prism:link': ['https://example.com/related1', 'https://example.com/related2'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with additional date fields', () => {
    const value = {
      creationDate: new Date('2023-02-01T09:00:00Z'),
      modificationDate: new Date('2023-03-10T00:00:00Z'),
      dateReceived: new Date('2023-01-15T00:00:00Z'),
      killDate: { value: new Date('2024-03-15T00:00:00Z') },
    }
    const expected = {
      'prism:creationDate': '2023-02-01T09:00:00.000Z',
      'prism:modificationDate': '2023-03-10T00:00:00.000Z',
      'prism:dateReceived': '2023-01-15T00:00:00.000Z',
      'prism:killDate': { '#text': '2024-03-15T00:00:00.000Z' },
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with PAM issue, series and classification fields', () => {
    const value = {
      issueName: 'Spring Issue',
      issueTeaser: { value: 'Special coverage' },
      issueType: 'regular',
      aggregationType: 'journal',
      isbns: ['978-0-12-345678-9'],
      onSaleDates: [{ value: new Date('2023-03-01T00:00:00Z') }],
      onSaleDays: [{ value: 'wednesday' }],
      offSaleDates: [{ value: new Date('2023-04-01T00:00:00Z') }],
      seriesTitle: 'Nature Research Journals',
      seriesNumber: 1,
      subchannel1: 'Science',
      subchannel2: 'Biology',
      subchannel3: 'Cells',
      subchannel4: 'Membranes',
      subsection1: 'Articles',
      subsection2: 'Letters',
      subsection3: 'Brief Communications',
      subsection4: 'Corrections',
      productCodes: ['NAT-2023-615'],
      sellingAgencies: ['Example Agency'],
      nationalCatalogNumber: 'NC12345',
      publishingFrequency: 'weekly',
      uspsNumber: '123-456',
    }
    const expected = {
      'prism:issueName': 'Spring Issue',
      'prism:issueTeaser': { '#text': 'Special coverage' },
      'prism:issueType': 'regular',
      'prism:aggregationType': 'journal',
      'prism:isbn': ['978-0-12-345678-9'],
      'prism:onSaleDate': [{ '#text': '2023-03-01T00:00:00.000Z' }],
      'prism:onSaleDay': [{ '#text': 'wednesday' }],
      'prism:offSaleDate': [{ '#text': '2023-04-01T00:00:00.000Z' }],
      'prism:seriesTitle': 'Nature Research Journals',
      'prism:seriesNumber': 1,
      'prism:subchannel1': 'Science',
      'prism:subchannel2': 'Biology',
      'prism:subchannel3': 'Cells',
      'prism:subchannel4': 'Membranes',
      'prism:subsection1': 'Articles',
      'prism:subsection2': 'Letters',
      'prism:subsection3': 'Brief Communications',
      'prism:subsection4': 'Corrections',
      'prism:productCode': ['NAT-2023-615'],
      'prism:sellingAgency': ['Example Agency'],
      'prism:nationalCatalogNumber': 'NC12345',
      'prism:publishingFrequency': 'weekly',
      'prism:uspsNumber': '123-456',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with distributor and compliance profile', () => {
    const value = {
      distributor: 'https://example.com/distributor',
      complianceProfile: 'two',
    }
    const expected = {
      'prism:distributor': 'https://example.com/distributor',
      'prism:complianceProfile': 'two',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with issue identifier', () => {
    const value = {
      issueIdentifier: '2023-03-15',
    }
    const expected = {
      'prism:issueIdentifier': '2023-03-15',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with cover date fields', () => {
    const value = {
      coverDate: new Date('2023-03-15T00:00:00Z'),
      coverDisplayDate: 'March 15, 2023',
    }
    const expected = {
      'prism:coverDate': '2023-03-15T00:00:00.000Z',
      'prism:coverDisplayDate': 'March 15, 2023',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })
})
