import { describe, expect, it } from 'bun:test'
import {
  parseOriginPlatform,
  parsePlatformDate,
  parsePlatformString,
  parseRating,
  retrieveItemOrFeed,
} from './utils.js'

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
      publicationDates: [{ value: '2023-03-15' }],
      aggregationType: 'journal',
      publishingFrequency: 'weekly',
      urls: [{ value: 'https://journal.example.com' }],
      teasers: [{ value: 'A short promotional description' }],
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
      'prism:publicationname': { '@rdf:resource': 'https://example.com/publicationname' },
      'prism:aggregationtype': { '@rdf:resource': 'https://example.com/aggregationtype' },
      'prism:copyrightyear': { '@rdf:resource': 'https://example.com/copyrightyear' },
      'prism:contenttype': { '@rdf:resource': 'https://example.com/contenttype' },
      'prism:alternatetitle': { '@rdf:resource': 'https://example.com/alternatetitle' },
      'prism:subtitle': { '@rdf:resource': 'https://example.com/subtitle' },
      'prism:teaser': { '@rdf:resource': 'https://example.com/teaser' },
      'prism:seriestitle': { '@rdf:resource': 'https://example.com/seriestitle' },
      'prism:bookedition': { '@rdf:resource': 'https://example.com/bookedition' },
      'prism:nationalcatalognumber': {
        '@rdf:resource': 'https://example.com/nationalcatalognumber',
      },
      'prism:productcode': { '@rdf:resource': 'https://example.com/productcode' },
      'prism:uspsnumber': { '@rdf:resource': 'https://example.com/uspsnumber' },
      'prism:publishingfrequency': { '@rdf:resource': 'https://example.com/publishingfrequency' },
      'prism:channel': { '@rdf:resource': 'https://example.com/channel' },
      'prism:subchannel1': { '@rdf:resource': 'https://example.com/subchannel1' },
      'prism:subchannel2': { '@rdf:resource': 'https://example.com/subchannel2' },
      'prism:subchannel3': { '@rdf:resource': 'https://example.com/subchannel3' },
      'prism:subchannel4': { '@rdf:resource': 'https://example.com/subchannel4' },
      'prism:corporateentity': { '@rdf:resource': 'https://example.com/corporateentity' },
      'prism:sellingagency': { '@rdf:resource': 'https://example.com/sellingagency' },
      'prism:platform': { '@rdf:resource': 'https://example.com/platform' },
      'prism:device': { '@rdf:resource': 'https://example.com/device' },
      'prism:complianceprofile': { '@rdf:resource': 'https://example.com/complianceprofile' },
      'prism:blogtitle': { '@rdf:resource': 'https://example.com/blogtitle' },
      'prism:blogurl': { '@rdf:resource': 'https://example.com/blogurl' },
      'prism:link': { '@rdf:resource': 'https://example.com/link' },
      'prism:url': { '@rdf:resource': 'https://example.com/url' },
      'prism:rating': { '@rdf:resource': 'https://example.com/rating' },
      'prism:timeperiod': { '@rdf:resource': 'https://example.com/timeperiod' },
      'prism:versionidentifier': { '@rdf:resource': 'https://example.com/versionidentifier' },
      'prism:ticker': { '@rdf:resource': 'https://example.com/ticker' },
      'prism:academicfield': { '@rdf:resource': 'https://example.com/academicfield' },
      'prism:genre': { '@rdf:resource': 'https://example.com/genre' },
      'prism:object': { '@rdf:resource': 'https://example.com/object' },
      'prism:profession': { '@rdf:resource': 'https://example.com/profession' },
      'prism:sport': { '@rdf:resource': 'https://example.com/sport' },
    }
    const expected = {
      distributor: 'https://example.com/distributor',
      organizations: ['https://example.com/org'],
      persons: ['https://example.com/person'],
      events: ['https://example.com/event'],
      industries: ['https://example.com/industry'],
      locations: ['https://example.com/location'],
      publicationName: 'https://example.com/publicationname',
      aggregationType: 'https://example.com/aggregationtype',
      copyrightYears: ['https://example.com/copyrightyear'],
      contentType: 'https://example.com/contenttype',
      alternateTitles: [{ value: 'https://example.com/alternatetitle' }],
      subtitles: ['https://example.com/subtitle'],
      teasers: [{ value: 'https://example.com/teaser' }],
      seriesTitle: 'https://example.com/seriestitle',
      bookEditions: ['https://example.com/bookedition'],
      nationalCatalogNumber: 'https://example.com/nationalcatalognumber',
      productCodes: ['https://example.com/productcode'],
      uspsNumber: 'https://example.com/uspsnumber',
      publishingFrequency: 'https://example.com/publishingfrequency',
      channels: ['https://example.com/channel'],
      subchannel1: 'https://example.com/subchannel1',
      subchannel2: 'https://example.com/subchannel2',
      subchannel3: 'https://example.com/subchannel3',
      subchannel4: 'https://example.com/subchannel4',
      corporateEntities: ['https://example.com/corporateentity'],
      sellingAgencies: ['https://example.com/sellingagency'],
      platforms: ['https://example.com/platform'],
      device: 'https://example.com/device',
      complianceProfile: 'https://example.com/complianceprofile',
      blogTitle: 'https://example.com/blogtitle',
      blogURL: 'https://example.com/blogurl',
      links: ['https://example.com/link'],
      urls: [{ value: 'https://example.com/url' }],
      ratings: [{ value: 'https://example.com/rating' }],
      timePeriod: 'https://example.com/timeperiod',
      versionIdentifier: 'https://example.com/versionidentifier',
      tickers: ['https://example.com/ticker'],
      academicFields: ['https://example.com/academicfield'],
      genres: ['https://example.com/genre'],
      objects: ['https://example.com/object'],
      profession: 'https://example.com/profession',
      sport: 'https://example.com/sport',
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
      hasCorrections: [{ value: 'https://example.com/issue-correction' }],
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
      publicationDates: [{ value: '2023-03-15T10:00:00Z' }],
      creationDate: '2023-02-20',
      modificationDate: '2023-03-10T14:30:00Z',
      killDate: { value: '2024-03-15' },
      onSaleDates: [{ value: '2023-03-01' }, { value: '2023-03-08' }],
      offSaleDates: [{ value: '2023-04-01' }],
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
      issueTeaser: { value: 'Special coverage of breakthrough discoveries' },
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
      publicationDisplayDates: [{ value: 'Spring 2023' }],
      dateReceived: '2023-01-15',
      onSaleDays: [{ value: 'wednesday' }, { value: 'friday' }],
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
      alternateTitles: [{ value: 'Example Journal' }, { value: 'Example Magazine' }],
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
      ratings: [{ value: 'A+' }, { value: 'Excellent' }],
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
      urls: [{ value: 'https://journal.example.com/articles/example-2023-0001' }],
      volume: '615',
      number: '7952',
      startingPage: '425',
      endingPage: '432',
      publicationDates: [{ value: '2023-03-15' }],
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
      'prism:publicationname': { '@rdf:resource': 'https://example.com/publicationname' },
      'prism:url': { '@rdf:resource': 'https://example.com/url' },
      'prism:aggregationtype': { '@rdf:resource': 'https://example.com/aggregationtype' },
      'prism:pageprogressiondirection': {
        '@rdf:resource': 'https://example.com/pageprogressiondirection',
      },
      'prism:copyrightyear': { '@rdf:resource': 'https://example.com/copyrightyear' },
      'prism:contenttype': { '@rdf:resource': 'https://example.com/contenttype' },
      'prism:genre': { '@rdf:resource': 'https://example.com/genre' },
      'prism:alternatetitle': { '@rdf:resource': 'https://example.com/alternatetitle' },
      'prism:subtitle': { '@rdf:resource': 'https://example.com/subtitle' },
      'prism:teaser': { '@rdf:resource': 'https://example.com/teaser' },
      'prism:seriestitle': { '@rdf:resource': 'https://example.com/seriestitle' },
      'prism:nationalcatalognumber': {
        '@rdf:resource': 'https://example.com/nationalcatalognumber',
      },
      'prism:productcode': { '@rdf:resource': 'https://example.com/productcode' },
      'prism:uspsnumber': { '@rdf:resource': 'https://example.com/uspsnumber' },
      'prism:publishingfrequency': { '@rdf:resource': 'https://example.com/publishingfrequency' },
      'prism:subchannel1': { '@rdf:resource': 'https://example.com/subchannel1' },
      'prism:subchannel2': { '@rdf:resource': 'https://example.com/subchannel2' },
      'prism:subchannel3': { '@rdf:resource': 'https://example.com/subchannel3' },
      'prism:subchannel4': { '@rdf:resource': 'https://example.com/subchannel4' },
      'prism:corporateentity': { '@rdf:resource': 'https://example.com/corporateentity' },
      'prism:sellingagency': { '@rdf:resource': 'https://example.com/sellingagency' },
      'prism:platform': { '@rdf:resource': 'https://example.com/platform' },
      'prism:device': { '@rdf:resource': 'https://example.com/device' },
      'prism:complianceprofile': { '@rdf:resource': 'https://example.com/complianceprofile' },
      'prism:academicfield': { '@rdf:resource': 'https://example.com/academicfield' },
      'prism:object': { '@rdf:resource': 'https://example.com/object' },
      'prism:profession': { '@rdf:resource': 'https://example.com/profession' },
      'prism:sport': { '@rdf:resource': 'https://example.com/sport' },
      'prism:link': { '@rdf:resource': 'https://example.com/link' },
      'prism:rating': { '@rdf:resource': 'https://example.com/rating' },
      'prism:timeperiod': { '@rdf:resource': 'https://example.com/timeperiod' },
      'prism:versionidentifier': { '@rdf:resource': 'https://example.com/versionidentifier' },
      'prism:ticker': { '@rdf:resource': 'https://example.com/ticker' },
    }
    const expected = {
      organizations: ['https://example.com/org'],
      persons: ['https://example.com/person'],
      events: ['https://example.com/event'],
      industries: ['https://example.com/industry'],
      locations: ['https://example.com/location'],
      hasAlternatives: ['https://example.com/alternative'],
      hasCorrections: [{ value: 'https://example.com/correction' }],
      hasTranslations: ['https://example.com/translation'],
      isAlternativeOf: ['https://example.com/original'],
      isCorrectionOf: ['https://example.com/corrected'],
      isTranslationOf: 'https://example.com/source',
      publicationName: 'https://example.com/publicationname',
      urls: [{ value: 'https://example.com/url' }],
      aggregationType: 'https://example.com/aggregationtype',
      pageProgressionDirection: 'https://example.com/pageprogressiondirection',
      copyrightYears: ['https://example.com/copyrightyear'],
      contentType: 'https://example.com/contenttype',
      genres: ['https://example.com/genre'],
      alternateTitles: [{ value: 'https://example.com/alternatetitle' }],
      subtitles: ['https://example.com/subtitle'],
      teasers: [{ value: 'https://example.com/teaser' }],
      seriesTitle: 'https://example.com/seriestitle',
      nationalCatalogNumber: 'https://example.com/nationalcatalognumber',
      productCodes: ['https://example.com/productcode'],
      uspsNumber: 'https://example.com/uspsnumber',
      publishingFrequency: 'https://example.com/publishingfrequency',
      subchannel1: 'https://example.com/subchannel1',
      subchannel2: 'https://example.com/subchannel2',
      subchannel3: 'https://example.com/subchannel3',
      subchannel4: 'https://example.com/subchannel4',
      corporateEntities: ['https://example.com/corporateentity'],
      sellingAgencies: ['https://example.com/sellingagency'],
      platforms: ['https://example.com/platform'],
      device: 'https://example.com/device',
      complianceProfile: 'https://example.com/complianceprofile',
      academicFields: ['https://example.com/academicfield'],
      objects: ['https://example.com/object'],
      profession: 'https://example.com/profession',
      sport: 'https://example.com/sport',
      links: ['https://example.com/link'],
      ratings: [{ value: 'https://example.com/rating' }],
      timePeriod: 'https://example.com/timeperiod',
      versionIdentifier: 'https://example.com/versionidentifier',
      tickers: ['https://example.com/ticker'],
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
      issueTeaser: { value: 'Special coverage' },
      issueType: 'regular',
      aggregationType: 'journal',
      isbns: ['978-0-12-345678-9'],
      onSaleDates: [{ value: '2023-03-01' }],
      onSaleDays: [{ value: 'wednesday' }],
      offSaleDates: [{ value: '2023-04-01' }],
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
      hasCorrections: [{ value: 'corr1' }],
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
      publicationDisplayDates: [{ value: 'March 15, 2023' }, { value: 'Spring 2023' }],
      ratings: [{ value: 'PG-13' }, { value: 'TV-14' }],
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
      publicationDates: [{ value: '2023-03-15' }],
      creationDate: '2023-02-01T09:00:00Z',
      modificationDate: '2023-03-10',
      dateReceived: '2023-01-15',
      killDate: { value: '2024-03-15' },
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
      alternateTitles: [{ value: 'Alternative Title 1' }, { value: 'Alternative Title 2' }],
      subtitles: ['A Comprehensive Study'],
      teasers: [{ value: 'Brief summary of the article' }],
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

describe('parsePlatformString', () => {
  it('should parse text with platform attribute', () => {
    const value = { '#text': 'Summer Special', '@platform': 'web' }
    const expected = { value: 'Summer Special', platform: 'web' }

    expect(parsePlatformString(value)).toEqual(expected)
  })

  it('should parse prefixed platform attribute', () => {
    const value = { '#text': 'Summer Special', '@prism:platform': 'print' }
    const expected = { value: 'Summer Special', platform: 'print' }

    expect(parsePlatformString(value)).toEqual(expected)
  })

  it('should prefer unprefixed platform attribute', () => {
    const value = { '#text': 'Summer Special', '@platform': 'web', '@prism:platform': 'print' }
    const expected = { value: 'Summer Special', platform: 'web' }

    expect(parsePlatformString(value)).toEqual(expected)
  })

  it('should fall back to prefixed platform attribute when unprefixed is empty', () => {
    const value = { '#text': 'Summer Special', '@platform': '', '@prism:platform': 'print' }
    const expected = { value: 'Summer Special', platform: 'print' }

    expect(parsePlatformString(value)).toEqual(expected)
  })

  it('should parse plain text', () => {
    const expected = { value: 'Summer Special' }

    expect(parsePlatformString('Summer Special')).toEqual(expected)
  })

  it('should parse rdf:resource attribute', () => {
    const value = { '@rdf:resource': 'https://example.com/teaser', '@platform': 'web' }
    const expected = { value: 'https://example.com/teaser', platform: 'web' }

    expect(parsePlatformString(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parsePlatformString({})).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    expect(parsePlatformString('')).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    expect(parsePlatformString(undefined)).toBeUndefined()
  })
})

describe('parsePlatformDate', () => {
  it('should parse date with platform attribute', () => {
    const value = { '#text': '2023-03-15', '@platform': 'web' }
    const expected = { value: '2023-03-15', platform: 'web' }

    expect(parsePlatformDate(value)).toEqual(expected)
  })

  it('should parse prefixed platform attribute', () => {
    const value = { '#text': '2023-03-15', '@prism:platform': 'print' }
    const expected = { value: '2023-03-15', platform: 'print' }

    expect(parsePlatformDate(value)).toEqual(expected)
  })

  it('should parse plain date', () => {
    const expected = { value: '2023-03-15' }

    expect(parsePlatformDate('2023-03-15')).toEqual(expected)
  })

  it('should apply custom parseDateFn', () => {
    const value = { '#text': '2023-03-15T12:00:00Z', '@platform': 'web' }
    const expected = { value: new Date('2023-03-15T12:00:00Z'), platform: 'web' }

    expect(parsePlatformDate(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parsePlatformDate({})).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    expect(parsePlatformDate(undefined)).toBeUndefined()
  })
})

describe('parseRating', () => {
  it('should parse rating with ratingSystem attribute', () => {
    const value = { '#text': 'E', '@ratingsystem': 'ESRB' }
    const expected = { value: 'E', ratingSystem: 'ESRB' }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should parse prefixed ratingSystem attribute', () => {
    const value = { '#text': 'E', '@prism:ratingsystem': 'ESRB' }
    const expected = { value: 'E', ratingSystem: 'ESRB' }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should parse rdf:resource attribute', () => {
    const value = { '@rdf:resource': 'https://example.com/esrb#E', '@prism:ratingsystem': 'ESRB' }
    const expected = { value: 'https://example.com/esrb#E', ratingSystem: 'ESRB' }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should parse plain text', () => {
    const expected = { value: 'E' }

    expect(parseRating('E')).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseRating({})).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    expect(parseRating(undefined)).toBeUndefined()
  })
})
