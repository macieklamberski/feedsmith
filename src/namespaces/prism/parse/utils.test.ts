import { describe, expect, it } from 'bun:test'
import { parseOriginPlatform, retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse complete feed object with core properties', () => {
    const value = {
      'prism:publicationname': 'Journal of Examples',
      'prism:issn': '1234-5678',
      'prism:eissn': '8765-4321',
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:publicationdate': '2023-03-15',
      'prism:aggregationtype': 'journal',
      'prism:publishingfrequency': 'weekly',
      'prism:url': 'https://journal.example.com',
      'prism:teaser': 'A short promotional description',
      'prism:keyword': ['science', 'research'],
    }
    const expected = {
      publicationName: 'Journal of Examples',
      issn: '1234-5678',
      eIssn: '8765-4321',
      volume: '615',
      number: '7952',
      publicationDates: ['2023-03-15'],
      aggregationType: 'journal',
      publishingFrequency: 'weekly',
      urls: ['https://journal.example.com'],
      teasers: ['A short promotional description'],
      keywords: ['science', 'research'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed fields given as rdf:resource', () => {
    const value = {
      'prism:distributor': { '@rdf:resource': 'https://example.com/distributor' },
      'prism:organization': { '@rdf:resource': 'https://example.com/org' },
      'prism:person': { '@rdf:resource': 'https://example.com/person' },
      'prism:event': { '@rdf:resource': 'https://example.com/event' },
      'prism:industry': { '@rdf:resource': 'https://example.com/industry' },
      'prism:location': { '@rdf:resource': 'https://example.com/location' },
    }
    const expected = {
      distributor: 'https://example.com/distributor',
      organizations: ['https://example.com/org'],
      persons: ['https://example.com/person'],
      events: ['https://example.com/event'],
      industries: ['https://example.com/industry'],
      locations: ['https://example.com/location'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with PRISM 1.2 fields', () => {
    const value = {
      'prism:category': { '@rdf:resource': 'https://example.com/genre/research' },
      'prism:hasformat': 'https://example.com/article.pdf',
      'prism:haspart': [
        { '@rdf:resource': 'https://example.com/figure-1' },
        { '@rdf:resource': 'https://example.com/figure-2' },
      ],
      'prism:haspreviousversion': 'https://example.com/article-v1',
      'prism:isformatof': 'https://example.com/article',
      'prism:ispartof': { '@rdf:resource': 'https://example.com/issue-7952' },
      'prism:isreferencedby': 'https://example.com/review',
      'prism:isrequiredby': 'https://example.com/bundle',
      'prism:isversionof': 'https://example.com/original',
      'prism:objecttitle': 'Dodge Viper',
      'prism:receptiondate': '2023-03-16',
      'prism:references': [
        { '@rdf:resource': 'https://doi.org/10.1000/1' },
        'https://doi.org/10.1000/2',
      ],
      'prism:requires': { '@rdf:resource': 'https://example.com/dataset' },
    }
    const expected = {
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
      receptionDate: '2023-03-16',
      references: ['https://doi.org/10.1000/1', 'https://doi.org/10.1000/2'],
      requires: 'https://example.com/dataset',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with page, word count and relationship fields', () => {
    const value = {
      'prism:startingpage': '975',
      'prism:endingpage': '1211',
      'prism:wordcount': '52000',
      'prism:hasalternative': 'https://example.com/issue-alt',
      'prism:hascorrection': { '@rdf:resource': 'https://example.com/issue-correction' },
      'prism:hastranslation': ['https://example.com/issue-de', 'https://example.com/issue-fr'],
      'prism:iscorrectionof': 'https://example.com/issue-v1',
      'prism:istranslationof': { '@rdf:resource': 'https://example.com/issue-en' },
    }
    const expected = {
      startingPage: '975',
      endingPage: '1211',
      wordCount: 52000,
      hasAlternatives: ['https://example.com/issue-alt'],
      hasCorrections: ['https://example.com/issue-correction'],
      hasTranslations: ['https://example.com/issue-de', 'https://example.com/issue-fr'],
      isCorrectionOf: ['https://example.com/issue-v1'],
      isTranslationOf: 'https://example.com/issue-en',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with originPlatform in platform attribute', () => {
    const value = {
      'prism:originplatform': [{ '@platform': 'web' }, { '@platform': 'print' }],
    }
    const expected = {
      originPlatforms: ['web', 'print'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with content and title fields', () => {
    const value = {
      'prism:edition': 'International',
      'prism:contenttype': 'article',
      'prism:alternatetitle': ['Example Journal', 'Example Magazine'],
      'prism:subtitle': ['The International Weekly Journal of Science'],
    }
    const expected = {
      edition: 'International',
      contentType: 'article',
      alternateTitles: ['Example Journal', 'Example Magazine'],
      subtitles: ['The International Weekly Journal of Science'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with catalog and product fields', () => {
    const value = {
      'prism:bookedition': ['First Edition', 'Second Edition'],
      'prism:nationalcatalognumber': 'NC12345',
      'prism:productcode': ['EXJ-2023-615', 'EXJ-2023-616'],
    }
    const expected = {
      bookEditions: ['First Edition', 'Second Edition'],
      nationalCatalogNumber: 'NC12345',
      productCodes: ['EXJ-2023-615', 'EXJ-2023-616'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with organization and entity fields', () => {
    const value = {
      'prism:corporateentity': ['Example Publishing', 'Example Research'],
      'prism:distributor': 'Example Distribution Group',
      'prism:organization': ['Example Research'],
      'prism:person': ['Dr. Jane Smith', 'Dr. John Doe'],
    }
    const expected = {
      corporateEntities: ['Example Publishing', 'Example Research'],
      distributor: 'Example Distribution Group',
      organizations: ['Example Research'],
      persons: ['Dr. Jane Smith', 'Dr. John Doe'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with blog and link fields', () => {
    const value = {
      'prism:blogtitle': 'Example News Blog',
      'prism:blogurl': 'https://journal.example.com/news/blog',
      'prism:link': ['https://journal.example.com/journal'],
      'prism:rating': ['A+', 'Excellent'],
    }
    const expected = {
      blogTitle: 'Example News Blog',
      blogURL: 'https://journal.example.com/news/blog',
      links: ['https://journal.example.com/journal'],
      ratings: ['A+', 'Excellent'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings by omitting them', () => {
    const value = {
      'prism:publicationname': 'Journal of Examples',
      'prism:issn': '',
      'prism:volume': '   ',
    }
    const expected = {
      publicationName: 'Journal of Examples',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should use first element when singular field is an array', () => {
    const value = {
      'prism:publicationname': ['Journal of Examples', 'Second Journal'],
      'prism:volume': ['615', '616'],
    }
    const expected = {
      publicationName: 'Journal of Examples',
      volume: '615',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'prism:volume': 615,
      'prism:aggregateissuenumber': '500',
      'prism:bytecount': 1048576,
    }
    const expected = {
      volume: '615',
      aggregateIssueNumber: 500,
      byteCount: 1048576,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'prism:publicationname': 'Journal of Examples',
      'prism:bytecount': 'not a number',
      'prism:issn': '',
      'other:property': 'value',
    }
    const expected = {
      publicationName: 'Journal of Examples',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItemOrFeed('not an object')).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
  })

  it.todo('should parse date fields with custom parseDateFn', () => {
    // Pass options.parseDateFn that converts date strings into Date instances.
    // Expected: coverDate, publicationDates, creationDate and the other date fields equal
    // the values returned by parseDateFn instead of the raw strings.
  })

  it('should parse complete item object with core properties', () => {
    const value = {
      'prism:doi': '10.1234/example-2023-0001',
      'prism:url': 'https://journal.example.com/articles/example-2023-0001',
      'prism:volume': '615',
      'prism:number': '7952',
      'prism:startingpage': '425',
      'prism:endingpage': '432',
      'prism:publicationdate': '2023-03-15',
      'prism:keyword': ['quantum', 'computing'],
      'prism:genre': ['research-article'],
    }
    const expected = {
      doi: '10.1234/example-2023-0001',
      urls: ['https://journal.example.com/articles/example-2023-0001'],
      volume: '615',
      number: '7952',
      startingPage: '425',
      endingPage: '432',
      publicationDates: ['2023-03-15'],
      keywords: ['quantum', 'computing'],
      genres: ['research-article'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item fields given as rdf:resource', () => {
    const value = {
      'prism:organization': { '@rdf:resource': 'https://example.com/org' },
      'prism:person': { '@rdf:resource': 'https://example.com/person' },
      'prism:event': { '@rdf:resource': 'https://example.com/event' },
      'prism:industry': { '@rdf:resource': 'https://example.com/industry' },
      'prism:location': { '@rdf:resource': 'https://example.com/location' },
      'prism:hasalternative': { '@rdf:resource': 'https://example.com/alternative' },
      'prism:hascorrection': { '@rdf:resource': 'https://example.com/correction' },
      'prism:hastranslation': { '@rdf:resource': 'https://example.com/translation' },
      'prism:isalternativeof': { '@rdf:resource': 'https://example.com/original' },
      'prism:iscorrectionof': { '@rdf:resource': 'https://example.com/corrected' },
      'prism:istranslationof': { '@rdf:resource': 'https://example.com/source' },
    }
    const expected = {
      organizations: ['https://example.com/org'],
      persons: ['https://example.com/person'],
      events: ['https://example.com/event'],
      industries: ['https://example.com/industry'],
      locations: ['https://example.com/location'],
      hasAlternatives: ['https://example.com/alternative'],
      hasCorrections: ['https://example.com/correction'],
      hasTranslations: ['https://example.com/translation'],
      isAlternativeOf: ['https://example.com/original'],
      isCorrectionOf: ['https://example.com/corrected'],
      isTranslationOf: 'https://example.com/source',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with PAM issue, series and classification fields', () => {
    const value = {
      'prism:issuename': 'Spring Issue',
      'prism:issueteaser': 'Special coverage',
      'prism:issuetype': 'regular',
      'prism:aggregationtype': 'journal',
      'prism:isbn': '978-0-12-345678-9',
      'prism:onsaledate': '2023-03-01',
      'prism:onsaleday': 'wednesday',
      'prism:offsaledate': '2023-04-01',
      'prism:seriestitle': 'Nature Research Journals',
      'prism:seriesnumber': '1',
      'prism:subchannel1': 'Science',
      'prism:subchannel2': 'Biology',
      'prism:subchannel3': 'Cells',
      'prism:subchannel4': 'Membranes',
      'prism:subsection1': 'Articles',
      'prism:subsection2': 'Letters',
      'prism:subsection3': 'Brief Communications',
      'prism:subsection4': 'Corrections',
      'prism:productcode': 'NAT-2023-615',
      'prism:sellingagency': 'Example Agency',
      'prism:nationalcatalognumber': 'NC12345',
      'prism:publishingfrequency': 'weekly',
      'prism:uspsnumber': '123-456',
    }
    const expected = {
      issueName: 'Spring Issue',
      issueTeaser: 'Special coverage',
      issueType: 'regular',
      aggregationType: 'journal',
      isbns: ['978-0-12-345678-9'],
      onSaleDates: ['2023-03-01'],
      onSaleDays: ['wednesday'],
      offSaleDates: ['2023-04-01'],
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with distributor and compliance profile', () => {
    const value = {
      'prism:distributor': { '@rdf:resource': 'https://example.com/distributor' },
      'prism:complianceprofile': 'two',
    }
    const expected = {
      distributor: 'https://example.com/distributor',
      complianceProfile: 'two',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with issue identifier', () => {
    const value = {
      'prism:issueidentifier': '2023-03-15',
    }
    const expected = {
      issueIdentifier: '2023-03-15',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with cover date fields', () => {
    const value = {
      'prism:coverdate': '2023-03-15',
      'prism:coverdisplaydate': 'March 15, 2023',
    }
    const expected = {
      coverDate: '2023-03-15',
      coverDisplayDate: 'March 15, 2023',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with originPlatform fields', () => {
    const value = {
      'prism:originplatform': ['print', 'web'],
    }
    const expected = {
      originPlatforms: ['print', 'web'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with originPlatform in platform attribute', () => {
    const value = {
      'prism:originplatform': [{ '@platform': 'print' }, { '@platform': 'web' }],
    }
    const expected = {
      originPlatforms: ['print', 'web'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with link fields', () => {
    const value = {
      'prism:link': ['https://example.com/related1', 'https://example.com/related2'],
    }
    const expected = {
      links: ['https://example.com/related1', 'https://example.com/related2'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })
})

describe('parseOriginPlatform', () => {
  it('should parse platform attribute', () => {
    const value = { '@platform': 'web' }

    expect(parseOriginPlatform(value)).toBe('web')
  })

  it('should parse rdf:resource attribute', () => {
    const value = { '@rdf:resource': 'platform.xml#web' }

    expect(parseOriginPlatform(value)).toBe('platform.xml#web')
  })

  it('should parse text content', () => {
    const value = 'web'

    expect(parseOriginPlatform(value)).toBe('web')
  })

  it('should parse #text wrapper', () => {
    const value = { '#text': 'web' }

    expect(parseOriginPlatform(value)).toBe('web')
  })

  it('should prefer platform attribute over text content', () => {
    const value = {
      '@platform': 'web',
      '#text': 'print',
    }

    expect(parseOriginPlatform(value)).toBe('web')
  })

  it('should fall back to text content when platform attribute is empty', () => {
    const value = {
      '@platform': '',
      '#text': 'print',
    }

    expect(parseOriginPlatform(value)).toBe('print')
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseOriginPlatform(value)).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    expect(parseOriginPlatform('')).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    expect(parseOriginPlatform(undefined)).toBeUndefined()
  })
})
