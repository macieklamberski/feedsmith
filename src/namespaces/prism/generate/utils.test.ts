import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with core properties', () => {
    const value = {
      publicationName: 'Nature',
      issn: '0028-0836',
      eIssn: '1476-4687',
      volume: '615',
      number: '7952',
      publicationDates: [new Date('2023-03-15T00:00:00Z')],
      aggregationType: 'journal',
      publishingFrequency: 'weekly',
      urls: ['https://www.nature.com'],
      teasers: ['A short promotional description'],
      keywords: ['science', 'research'],
    }
    const expected = {
      'prism:publicationName': 'Nature',
      'prism:issn': '0028-0836',
      'prism:eIssn': '1476-4687',
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:publicationDate': ['2023-03-15T00:00:00.000Z'],
      'prism:aggregationType': 'journal',
      'prism:publishingFrequency': 'weekly',
      'prism:url': ['https://www.nature.com'],
      'prism:teaser': ['A short promotional description'],
      'prism:keyword': ['science', 'research'],
    }

    expect(generateFeed(value)).toEqual(expected)
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

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with date fields', () => {
    const value = {
      coverDate: new Date('2023-03-01T00:00:00Z'),
      publicationDates: [new Date('2023-03-15T10:00:00Z')],
      creationDate: new Date('2023-02-20T00:00:00Z'),
      modificationDate: new Date('2023-03-10T14:30:00Z'),
      killDate: new Date('2024-03-15T00:00:00Z'),
      onSaleDates: [new Date('2023-03-01T00:00:00Z')],
      offSaleDates: [new Date('2023-04-01T00:00:00Z')],
    }
    const expected = {
      'prism:coverDate': '2023-03-01T00:00:00.000Z',
      'prism:publicationDate': ['2023-03-15T10:00:00.000Z'],
      'prism:creationDate': '2023-02-20T00:00:00.000Z',
      'prism:modificationDate': '2023-03-10T14:30:00.000Z',
      'prism:killDate': '2024-03-15T00:00:00.000Z',
      'prism:onSaleDate': ['2023-03-01T00:00:00.000Z'],
      'prism:offSaleDate': ['2023-04-01T00:00:00.000Z'],
    }

    expect(generateFeed(value)).toEqual(expected)
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

    expect(generateFeed(value)).toEqual(expected)
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

    expect(generateFeed(value)).toEqual(expected)
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
      'prism:originPlatform': ['print', 'digital'],
      'prism:device': 'tablet',
      'prism:complianceProfile': 'PRISM 3.0',
      'prism:sellingAgency': ['Agency1'],
    }

    expect(generateFeed(value)).toEqual(expected)
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

    expect(generateFeed(value)).toEqual(expected)
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

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with issue fields', () => {
    const value = {
      issueIdentifier: '2023-03-15',
      issueName: 'Spring Issue',
      issueTeaser: 'Special coverage of breakthrough discoveries',
      issueType: 'regular',
    }
    const expected = {
      'prism:issueIdentifier': '2023-03-15',
      'prism:issueName': 'Spring Issue',
      'prism:issueTeaser': 'Special coverage of breakthrough discoveries',
      'prism:issueType': 'regular',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with additional date fields', () => {
    const value = {
      coverDisplayDate: 'March 15, 2023',
      publicationDisplayDates: ['Spring 2023'],
      dateReceived: new Date('2023-01-15T00:00:00Z'),
      onSaleDays: ['wednesday', 'friday'],
      copyrightYears: ['2023', '2024'],
    }
    const expected = {
      'prism:coverDisplayDate': 'March 15, 2023',
      'prism:publicationDisplayDate': ['Spring 2023'],
      'prism:dateReceived': '2023-01-15T00:00:00.000Z',
      'prism:onSaleDay': ['wednesday', 'friday'],
      'prism:copyrightYear': ['2023', '2024'],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with content and title fields', () => {
    const value = {
      edition: 'International',
      contentType: 'article',
      alternateTitles: ['Nature Journal', 'Nature Magazine'],
      subtitles: ['The International Weekly Journal of Science'],
    }
    const expected = {
      'prism:edition': 'International',
      'prism:contentType': 'article',
      'prism:alternateTitle': ['Nature Journal', 'Nature Magazine'],
      'prism:subtitle': ['The International Weekly Journal of Science'],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with catalog and product fields', () => {
    const value = {
      bookEditions: ['First Edition', 'Second Edition'],
      nationalCatalogNumber: 'NC12345',
      productCodes: ['NAT-2023-615', 'NAT-2023-616'],
    }
    const expected = {
      'prism:bookEdition': ['First Edition', 'Second Edition'],
      'prism:nationalCatalogNumber': 'NC12345',
      'prism:productCode': ['NAT-2023-615', 'NAT-2023-616'],
    }

    expect(generateFeed(value)).toEqual(expected)
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

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with organization and entity fields', () => {
    const value = {
      corporateEntities: ['Springer Nature', 'Nature Research'],
      distributor: 'Nature Publishing Group',
      organizations: ['Nature Research'],
      persons: ['Dr. Jane Smith', 'Dr. John Doe'],
    }
    const expected = {
      'prism:corporateEntity': ['Springer Nature', 'Nature Research'],
      'prism:distributor': 'Nature Publishing Group',
      'prism:organization': ['Nature Research'],
      'prism:person': ['Dr. Jane Smith', 'Dr. John Doe'],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with blog and link fields', () => {
    const value = {
      blogTitle: 'Nature News Blog',
      blogURL: 'https://www.nature.com/news/blog',
      links: ['https://www.nature.com/nature'],
      ratings: ['A+', 'Excellent'],
    }
    const expected = {
      'prism:blogTitle': 'Nature News Blog',
      'prism:blogURL': 'https://www.nature.com/news/blog',
      'prism:link': ['https://www.nature.com/nature'],
      'prism:rating': ['A+', 'Excellent'],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings by omitting them', () => {
    const value = {
      publicationName: 'Nature',
      issn: '',
      volume: '   ',
    }
    const expected = {
      'prism:publicationName': 'Nature',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with core properties', () => {
    const value = {
      doi: '10.1038/s41586-023-05842-x',
      urls: ['https://www.nature.com/articles/s41586-023-05842-x'],
      volume: '615',
      number: '7952',
      startingPage: '425',
      endingPage: '432',
      publicationDates: [new Date('2023-03-15T00:00:00Z')],
      keywords: ['quantum', 'computing'],
      genres: ['research-article'],
    }
    const expected = {
      'prism:doi': '10.1038/s41586-023-05842-x',
      'prism:url': ['https://www.nature.com/articles/s41586-023-05842-x'],
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:startingPage': '425',
      'prism:endingPage': '432',
      'prism:publicationDate': ['2023-03-15T00:00:00.000Z'],
      'prism:keyword': ['quantum', 'computing'],
      'prism:genre': ['research-article'],
    }

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with relationship fields', () => {
    const value = {
      hasAlternatives: ['alt1', 'alt2'],
      hasCorrections: ['corr1'],
      hasTranslations: ['trans1'],
      isAlternativeOf: ['orig1'],
      isCorrectionOf: ['origcorr1'],
      isTranslationOf: 'original-article-id',
    }
    const expected = {
      'prism:hasAlternative': ['alt1', 'alt2'],
      'prism:hasCorrection': ['corr1'],
      'prism:hasTranslation': ['trans1'],
      'prism:isAlternativeOf': ['orig1'],
      'prism:isCorrectionOf': ['origcorr1'],
      'prism:isTranslationOf': 'original-article-id',
    }

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with PAM/PSV dual-level fields', () => {
    const value = {
      publicationDisplayDates: ['March 15, 2023', 'Spring 2023'],
      ratings: ['PG-13', 'TV-14'],
      timePeriod: '2023-Q1',
      tickers: ['AAPL', 'GOOGL'],
    }
    const expected = {
      'prism:publicationDisplayDate': ['March 15, 2023', 'Spring 2023'],
      'prism:rating': ['PG-13', 'TV-14'],
      'prism:timePeriod': '2023-Q1',
      'prism:ticker': ['AAPL', 'GOOGL'],
    }

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with content and title fields', () => {
    const value = {
      edition: 'International',
      contentType: 'research-article',
      alternateTitles: ['Alternative Title 1', 'Alternative Title 2'],
      subtitles: ['A Comprehensive Study'],
      teasers: ['Brief summary of the article'],
      copyrightYears: ['2023', '2024'],
    }
    const expected = {
      'prism:edition': 'International',
      'prism:contentType': 'research-article',
      'prism:alternateTitle': ['Alternative Title 1', 'Alternative Title 2'],
      'prism:subtitle': ['A Comprehensive Study'],
      'prism:teaser': ['Brief summary of the article'],
      'prism:copyrightYear': ['2023', '2024'],
    }

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with link fields', () => {
    const value = {
      links: ['https://example.com/related1', 'https://example.com/related2'],
    }
    const expected = {
      'prism:link': ['https://example.com/related1', 'https://example.com/related2'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with additional date fields', () => {
    const value = {
      creationDate: new Date('2023-02-01T09:00:00Z'),
      modificationDate: new Date('2023-03-10T00:00:00Z'),
      dateReceived: new Date('2023-01-15T00:00:00Z'),
      killDate: new Date('2024-03-15T00:00:00Z'),
    }
    const expected = {
      'prism:creationDate': '2023-02-01T09:00:00.000Z',
      'prism:modificationDate': '2023-03-10T00:00:00.000Z',
      'prism:dateReceived': '2023-01-15T00:00:00.000Z',
      'prism:killDate': '2024-03-15T00:00:00.000Z',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
  })
})
