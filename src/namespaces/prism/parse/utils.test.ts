import { describe, expect, it } from 'bun:test'
import { retrieveFeed, retrieveItem } from './utils.js'

describe('retrieveFeed', () => {
  it('should parse complete feed object with core properties', () => {
    const value = {
      'prism:publicationname': 'Nature',
      'prism:issn': '0028-0836',
      'prism:eissn': '1476-4687',
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:publicationdate': '2023-03-15',
      'prism:aggregationtype': 'journal',
      'prism:publishingfrequency': 'weekly',
      'prism:url': 'https://www.nature.com',
      'prism:teaser': 'A short promotional description',
      'prism:keyword': ['science', 'research'],
    }
    const expected = {
      publicationName: 'Nature',
      issn: '0028-0836',
      eIssn: '1476-4687',
      volume: '615',
      number: '7952',
      publicationDates: ['2023-03-15'],
      aggregationType: 'journal',
      publishingFrequency: 'weekly',
      urls: ['https://www.nature.com'],
      teasers: ['A short promotional description'],
      keywords: ['science', 'research'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed object with #text wrapper', () => {
    const value = {
      'prism:publicationname': { '#text': 'Science' },
      'prism:issn': { '#text': '0036-8075' },
      'prism:volume': { '#text': '380' },
    }
    const expected = {
      publicationName: 'Science',
      issn: '0036-8075',
      volume: '380',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with plural fields as arrays', () => {
    const value = {
      'prism:isbn': ['978-0-123456-78-9', '978-0-987654-32-1'],
      'prism:keyword': ['keyword1', 'keyword2', 'keyword3'],
      'prism:genre': ['article', 'review'],
      'prism:channel': ['web', 'print'],
      'prism:ticker': ['AAPL', 'GOOGL'],
      'prism:timeperiod': '2023-Q1',
    }
    const expected = {
      isbns: ['978-0-123456-78-9', '978-0-987654-32-1'],
      keywords: ['keyword1', 'keyword2', 'keyword3'],
      genres: ['article', 'review'],
      channels: ['web', 'print'],
      tickers: ['AAPL', 'GOOGL'],
      timePeriod: '2023-Q1',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with date fields', () => {
    const value = {
      'prism:coverdate': '2023-03-01',
      'prism:publicationdate': ['2023-03-15T10:00:00Z'],
      'prism:creationdate': '2023-02-20',
      'prism:modificationdate': '2023-03-10T14:30:00Z',
      'prism:killdate': '2024-03-15',
      'prism:onsaledate': ['2023-03-01', '2023-03-08'],
      'prism:offsaledate': ['2023-04-01'],
    }
    const expected = {
      coverDate: '2023-03-01',
      publicationDates: ['2023-03-15T10:00:00Z'],
      creationDate: '2023-02-20',
      modificationDate: '2023-03-10T14:30:00Z',
      killDate: '2024-03-15',
      onSaleDates: ['2023-03-01', '2023-03-08'],
      offSaleDates: ['2023-04-01'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with number fields', () => {
    const value = {
      'prism:aggregateissuenumber': '500',
      'prism:bytecount': '1048576',
    }
    const expected = {
      aggregateIssueNumber: 500,
      byteCount: 1048576,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with deprecated fields', () => {
    const value = {
      'prism:embargodate': '2023-06-01',
      'prism:copyright': '© 2023 Publisher',
      'prism:expirationdate': '2024-01-01',
      'prism:rightsagent': 'Rights Management Inc.',
    }
    const expected = {
      embargoDate: '2023-06-01',
      copyright: '© 2023 Publisher',
      expirationDate: '2024-01-01',
      rightsAgent: 'Rights Management Inc.',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with distribution and platform fields', () => {
    const value = {
      'prism:channel': ['web'],
      'prism:subchannel1': 'news',
      'prism:subchannel2': 'science',
      'prism:section': 'front-page',
      'prism:subsection1': 'highlights',
      'prism:subsection2': 'featured',
      'prism:platform': ['desktop'],
      'prism:originplatform': ['print', 'digital'],
      'prism:device': 'tablet',
      'prism:complianceprofile': 'PRISM 3.0',
      'prism:sellingagency': ['Agency1'],
    }
    const expected = {
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

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with subject elements', () => {
    const value = {
      'prism:academicfield': ['Physics', 'Chemistry'],
      'prism:event': ['Conference 2023'],
      'prism:industry': ['Technology'],
      'prism:location': ['New York', 'London'],
      'prism:object': ['Particle Accelerator'],
      'prism:profession': 'Scientist',
      'prism:sport': 'Tennis',
    }
    const expected = {
      academicFields: ['Physics', 'Chemistry'],
      events: ['Conference 2023'],
      industries: ['Technology'],
      locations: ['New York', 'London'],
      objects: ['Particle Accelerator'],
      profession: 'Scientist',
      sport: 'Tennis',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with series fields', () => {
    const value = {
      'prism:seriestitle': 'Science Series',
      'prism:seriesnumber': '42',
      'prism:uspsnumber': '123-456',
      'prism:versionidentifier': 'v1.0.0',
    }
    const expected = {
      seriesTitle: 'Science Series',
      seriesNumber: 42,
      uspsNumber: '123-456',
      versionIdentifier: 'v1.0.0',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with issue fields', () => {
    const value = {
      'prism:issueidentifier': '2023-03-15',
      'prism:issuename': 'Spring Issue',
      'prism:issueteaser': 'Special coverage of breakthrough discoveries',
      'prism:issuetype': 'regular',
    }
    const expected = {
      issueIdentifier: '2023-03-15',
      issueName: 'Spring Issue',
      issueTeaser: 'Special coverage of breakthrough discoveries',
      issueType: 'regular',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with additional date fields', () => {
    const value = {
      'prism:coverdisplaydate': 'March 15, 2023',
      'prism:publicationdisplaydate': ['Spring 2023'],
      'prism:datereceived': '2023-01-15',
      'prism:onsaleday': ['wednesday', 'friday'],
      'prism:copyrightyear': ['2023', '2024'],
    }
    const expected = {
      coverDisplayDate: 'March 15, 2023',
      publicationDisplayDates: ['Spring 2023'],
      dateReceived: '2023-01-15',
      onSaleDays: ['wednesday', 'friday'],
      copyrightYears: ['2023', '2024'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with content and title fields', () => {
    const value = {
      'prism:edition': 'International',
      'prism:contenttype': 'article',
      'prism:alternatetitle': ['Nature Journal', 'Nature Magazine'],
      'prism:subtitle': ['The International Weekly Journal of Science'],
    }
    const expected = {
      edition: 'International',
      contentType: 'article',
      alternateTitles: ['Nature Journal', 'Nature Magazine'],
      subtitles: ['The International Weekly Journal of Science'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with catalog and product fields', () => {
    const value = {
      'prism:bookedition': ['First Edition', 'Second Edition'],
      'prism:nationalcatalognumber': 'NC12345',
      'prism:productcode': ['NAT-2023-615', 'NAT-2023-616'],
    }
    const expected = {
      bookEditions: ['First Edition', 'Second Edition'],
      nationalCatalogNumber: 'NC12345',
      productCodes: ['NAT-2023-615', 'NAT-2023-616'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with subchannel3-4 and subsection3-4', () => {
    const value = {
      'prism:subchannel3': 'biology',
      'prism:subchannel4': 'molecular',
      'prism:subsection3': 'editors-picks',
      'prism:subsection4': 'trending',
    }
    const expected = {
      subchannel3: 'biology',
      subchannel4: 'molecular',
      subsection3: 'editors-picks',
      subsection4: 'trending',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with organization and entity fields', () => {
    const value = {
      'prism:corporateentity': ['Springer Nature', 'Nature Research'],
      'prism:distributor': 'Nature Publishing Group',
      'prism:organization': ['Nature Research'],
      'prism:person': ['Dr. Jane Smith', 'Dr. John Doe'],
    }
    const expected = {
      corporateEntities: ['Springer Nature', 'Nature Research'],
      distributor: 'Nature Publishing Group',
      organizations: ['Nature Research'],
      persons: ['Dr. Jane Smith', 'Dr. John Doe'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with blog and link fields', () => {
    const value = {
      'prism:blogtitle': 'Nature News Blog',
      'prism:blogurl': 'https://www.nature.com/news/blog',
      'prism:link': ['https://www.nature.com/nature'],
      'prism:rating': ['A+', 'Excellent'],
    }
    const expected = {
      blogTitle: 'Nature News Blog',
      blogURL: 'https://www.nature.com/news/blog',
      links: ['https://www.nature.com/nature'],
      ratings: ['A+', 'Excellent'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty strings by omitting them', () => {
    const value = {
      'prism:publicationname': 'Nature',
      'prism:issn': '',
      'prism:volume': '   ',
    }
    const expected = {
      publicationName: 'Nature',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse complete item object with core properties', () => {
    const value = {
      'prism:doi': '10.1038/s41586-023-05842-x',
      'prism:url': 'https://www.nature.com/articles/s41586-023-05842-x',
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:startingpage': '425',
      'prism:endingpage': '432',
      'prism:publicationdate': '2023-03-15',
      'prism:keyword': ['quantum', 'computing'],
      'prism:genre': ['research-article'],
    }
    const expected = {
      doi: '10.1038/s41586-023-05842-x',
      urls: ['https://www.nature.com/articles/s41586-023-05842-x'],
      volume: '615',
      number: '7952',
      startingPage: '425',
      endingPage: '432',
      publicationDates: ['2023-03-15'],
      keywords: ['quantum', 'computing'],
      genres: ['research-article'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with #text wrapper', () => {
    const value = {
      'prism:doi': { '#text': '10.1126/science.abc1234' },
      'prism:volume': { '#text': '380' },
      'prism:startingpage': { '#text': '100' },
    }
    const expected = {
      doi: '10.1126/science.abc1234',
      volume: '380',
      startingPage: '100',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with page information', () => {
    const value = {
      'prism:startingpage': '1',
      'prism:endingpage': '15',
      'prism:pagerange': '1-15',
      'prism:pagecount': '15',
      'prism:pageprogressiondirection': 'LTR',
      'prism:samplepagerange': '1-3',
    }
    const expected = {
      startingPage: '1',
      endingPage: '15',
      pageRange: '1-15',
      pageCount: 15,
      pageProgressionDirection: 'LTR',
      samplePageRange: '1-3',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with dual-level fields', () => {
    const value = {
      'prism:publicationname': 'Journal of Science',
      'prism:issn': '1234-5678',
      'prism:eissn': '8765-4321',
      'prism:section': 'Research',
    }
    const expected = {
      publicationName: 'Journal of Science',
      issn: '1234-5678',
      eIssn: '8765-4321',
      section: 'Research',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with relationship fields', () => {
    const value = {
      'prism:hasalternative': ['alt1', 'alt2'],
      'prism:hascorrection': ['corr1'],
      'prism:hastranslation': ['trans1', 'trans2'],
      'prism:isalternativeof': ['orig1'],
      'prism:iscorrectionof': ['origcorr1'],
      'prism:istranslationof': 'original-article-id',
    }
    const expected = {
      hasAlternatives: ['alt1', 'alt2'],
      hasCorrections: ['corr1'],
      hasTranslations: ['trans1', 'trans2'],
      isAlternativeOf: ['orig1'],
      isCorrectionOf: ['origcorr1'],
      isTranslationOf: 'original-article-id',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with supplemental fields', () => {
    const value = {
      'prism:supplementtitle': 'Supplementary Materials',
      'prism:supplementdisplayid': 'S1',
      'prism:supplementstartingpage': 'S1',
    }
    const expected = {
      supplementTitles: ['Supplementary Materials'],
      supplementDisplayID: 'S1',
      supplementStartingPage: 'S1',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with metric fields', () => {
    const value = {
      'prism:wordcount': '5000',
      'prism:bytecount': '25000',
      'prism:versionidentifier': 'v1.2.0',
    }
    const expected = {
      wordCount: 5000,
      byteCount: 25000,
      versionIdentifier: 'v1.2.0',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with PAM/PSV dual-level fields', () => {
    const value = {
      'prism:publicationdisplaydate': ['March 15, 2023', 'Spring 2023'],
      'prism:rating': ['PG-13', 'TV-14'],
      'prism:timeperiod': '2023-Q1',
      'prism:ticker': ['AAPL', 'GOOGL'],
    }
    const expected = {
      publicationDisplayDates: ['March 15, 2023', 'Spring 2023'],
      ratings: ['PG-13', 'TV-14'],
      timePeriod: '2023-Q1',
      tickers: ['AAPL', 'GOOGL'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with date fields', () => {
    const value = {
      'prism:publicationdate': '2023-03-15',
      'prism:creationdate': '2023-02-01T09:00:00Z',
      'prism:modificationdate': '2023-03-10',
      'prism:datereceived': '2023-01-15',
      'prism:killdate': '2024-03-15',
    }
    const expected = {
      publicationDates: ['2023-03-15'],
      creationDate: '2023-02-01T09:00:00Z',
      modificationDate: '2023-03-10',
      dateReceived: '2023-01-15',
      killDate: '2024-03-15',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with people and organization fields', () => {
    const value = {
      'prism:corporateentity': ['Department of Physics'],
      'prism:organization': ['MIT', 'Harvard'],
      'prism:person': ['John Doe', 'Jane Smith'],
    }
    const expected = {
      corporateEntities: ['Department of Physics'],
      organizations: ['MIT', 'Harvard'],
      persons: ['John Doe', 'Jane Smith'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with deprecated fields', () => {
    const value = {
      'prism:embargodate': '2023-06-01',
      'prism:copyright': '© 2023 Author',
      'prism:expirationdate': '2024-01-01',
      'prism:rightsagent': 'CCC',
    }
    const expected = {
      embargoDate: '2023-06-01',
      copyright: '© 2023 Author',
      expirationDate: '2024-01-01',
      rightsAgent: 'CCC',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with content and title fields', () => {
    const value = {
      'prism:edition': 'International',
      'prism:contenttype': 'research-article',
      'prism:alternatetitle': ['Alternative Title 1', 'Alternative Title 2'],
      'prism:subtitle': ['A Comprehensive Study'],
      'prism:teaser': ['Brief summary of the article'],
      'prism:copyrightyear': ['2023', '2024'],
    }
    const expected = {
      edition: 'International',
      contentType: 'research-article',
      alternateTitles: ['Alternative Title 1', 'Alternative Title 2'],
      subtitles: ['A Comprehensive Study'],
      teasers: ['Brief summary of the article'],
      copyrightYears: ['2023', '2024'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with platform fields', () => {
    const value = {
      'prism:platform': ['desktop', 'mobile', 'tablet'],
      'prism:device': 'smartphone',
    }
    const expected = {
      platforms: ['desktop', 'mobile', 'tablet'],
      device: 'smartphone',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with subject classification fields', () => {
    const value = {
      'prism:academicfield': ['Quantum Physics', 'Computer Science'],
      'prism:event': ['Annual Conference 2023'],
      'prism:industry': ['Technology', 'Healthcare'],
      'prism:location': ['Cambridge', 'Boston'],
      'prism:object': ['Quantum Computer'],
      'prism:profession': 'Researcher',
      'prism:sport': 'Cycling',
    }
    const expected = {
      academicFields: ['Quantum Physics', 'Computer Science'],
      events: ['Annual Conference 2023'],
      industries: ['Technology', 'Healthcare'],
      locations: ['Cambridge', 'Boston'],
      objects: ['Quantum Computer'],
      profession: 'Researcher',
      sport: 'Cycling',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with link fields', () => {
    const value = {
      'prism:link': ['https://example.com/related1', 'https://example.com/related2'],
    }
    const expected = {
      links: ['https://example.com/related1', 'https://example.com/related2'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings by omitting them', () => {
    const value = {
      'prism:doi': '10.1234/test',
      'prism:url': '',
      'prism:volume': '  ',
    }
    const expected = {
      doi: '10.1234/test',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
