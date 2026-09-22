import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveRdfResourceOrText,
  retrieveText,
} from '../../../common/utils.js'
import type { PrismNs } from '../common/types.js'

// See: https://www.w3.org/submissions/2020/SUBM-prism-20200910/prism-basic.html.
export const parseOriginPlatform: ParseUtilPartial<string> = (value) => {
  if (isPlainObject(value)) {
    const platform = parseString(value['@platform'])

    if (platform) {
      return platform
    }
  }

  return retrieveRdfResourceOrText(value, parseString)
}

export const retrieveItemOrFeed: ParseUtilPartial<
  PrismNs.ItemOrFeed<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const itemOrFeed = {
    publicationName: parseSingularOf(value['prism:publicationname'], (value) =>
      parseString(retrieveText(value)),
    ),
    issn: parseSingularOf(value['prism:issn'], (value) => parseString(retrieveText(value))),
    eIssn: parseSingularOf(value['prism:eissn'], (value) => parseString(retrieveText(value))),
    isbns: parseArrayOf(value['prism:isbn'], (value) => parseString(retrieveText(value))),
    issueIdentifier: parseSingularOf(value['prism:issueidentifier'], (value) =>
      parseString(retrieveText(value)),
    ),
    issueName: parseSingularOf(value['prism:issuename'], (value) =>
      parseString(retrieveText(value)),
    ),
    issueTeaser: parseSingularOf(value['prism:issueteaser'], (value) =>
      parseString(retrieveText(value)),
    ),
    issueType: parseSingularOf(value['prism:issuetype'], (value) =>
      parseString(retrieveText(value)),
    ),
    doi: parseSingularOf(value['prism:doi'], (value) => parseString(retrieveText(value))),
    volume: parseSingularOf(value['prism:volume'], (value) => parseString(retrieveText(value))),
    number: parseSingularOf(value['prism:number'], (value) => parseString(retrieveText(value))),
    edition: parseSingularOf(value['prism:edition'], (value) => parseString(retrieveText(value))),
    aggregateIssueNumber: parseSingularOf(value['prism:aggregateissuenumber'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    aggregationType: parseSingularOf(value['prism:aggregationtype'], (value) =>
      parseString(retrieveText(value)),
    ),
    coverDate: parseSingularOf(value['prism:coverdate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    coverDisplayDate: parseSingularOf(value['prism:coverdisplaydate'], (value) =>
      parseString(retrieveText(value)),
    ),
    publicationDates: parseArrayOf(value['prism:publicationdate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    publicationDisplayDates: parseArrayOf(value['prism:publicationdisplaydate'], (value) =>
      parseString(retrieveText(value)),
    ),
    creationDate: parseSingularOf(value['prism:creationdate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    modificationDate: parseSingularOf(value['prism:modificationdate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    dateReceived: parseSingularOf(value['prism:datereceived'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    onSaleDates: parseArrayOf(value['prism:onsaledate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    onSaleDays: parseArrayOf(value['prism:onsaleday'], (value) => parseString(retrieveText(value))),
    offSaleDates: parseArrayOf(value['prism:offsaledate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    killDate: parseSingularOf(value['prism:killdate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    copyrightYears: parseArrayOf(value['prism:copyrightyear'], (value) =>
      parseString(retrieveText(value)),
    ),
    contentType: parseSingularOf(value['prism:contenttype'], (value) =>
      parseString(retrieveText(value)),
    ),
    alternateTitles: parseArrayOf(value['prism:alternatetitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    subtitles: parseArrayOf(value['prism:subtitle'], (value) => parseString(retrieveText(value))),
    teasers: parseArrayOf(value['prism:teaser'], (value) => parseString(retrieveText(value))),
    keywords: parseArrayOf(value['prism:keyword'], (value) => parseString(retrieveText(value))),
    seriesTitle: parseSingularOf(value['prism:seriestitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    seriesNumber: parseSingularOf(value['prism:seriesnumber'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    bookEditions: parseArrayOf(value['prism:bookedition'], (value) =>
      parseString(retrieveText(value)),
    ),
    nationalCatalogNumber: parseSingularOf(value['prism:nationalcatalognumber'], (value) =>
      parseString(retrieveText(value)),
    ),
    productCodes: parseArrayOf(value['prism:productcode'], (value) =>
      parseString(retrieveText(value)),
    ),
    uspsNumber: parseSingularOf(value['prism:uspsnumber'], (value) =>
      parseString(retrieveText(value)),
    ),
    publishingFrequency: parseSingularOf(value['prism:publishingfrequency'], (value) =>
      parseString(retrieveText(value)),
    ),
    channels: parseArrayOf(value['prism:channel'], (value) => parseString(retrieveText(value))),
    subchannel1: parseSingularOf(value['prism:subchannel1'], (value) =>
      parseString(retrieveText(value)),
    ),
    subchannel2: parseSingularOf(value['prism:subchannel2'], (value) =>
      parseString(retrieveText(value)),
    ),
    subchannel3: parseSingularOf(value['prism:subchannel3'], (value) =>
      parseString(retrieveText(value)),
    ),
    subchannel4: parseSingularOf(value['prism:subchannel4'], (value) =>
      parseString(retrieveText(value)),
    ),
    section: parseSingularOf(value['prism:section'], (value) => parseString(retrieveText(value))),
    subsection1: parseSingularOf(value['prism:subsection1'], (value) =>
      parseString(retrieveText(value)),
    ),
    subsection2: parseSingularOf(value['prism:subsection2'], (value) =>
      parseString(retrieveText(value)),
    ),
    subsection3: parseSingularOf(value['prism:subsection3'], (value) =>
      parseString(retrieveText(value)),
    ),
    subsection4: parseSingularOf(value['prism:subsection4'], (value) =>
      parseString(retrieveText(value)),
    ),
    startingPage: parseSingularOf(value['prism:startingpage'], (value) =>
      parseString(retrieveText(value)),
    ),
    endingPage: parseSingularOf(value['prism:endingpage'], (value) =>
      parseString(retrieveText(value)),
    ),
    pageRange: parseSingularOf(value['prism:pagerange'], (value) =>
      parseString(retrieveText(value)),
    ),
    pageCount: parseSingularOf(value['prism:pagecount'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    pageProgressionDirection: parseSingularOf(value['prism:pageprogressiondirection'], (value) =>
      parseString(retrieveText(value)),
    ),
    samplePageRange: parseSingularOf(value['prism:samplepagerange'], (value) =>
      parseString(retrieveText(value)),
    ),
    corporateEntities: parseArrayOf(value['prism:corporateentity'], (value) =>
      parseString(retrieveText(value)),
    ),
    distributor: parseSingularOf(value['prism:distributor'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    sellingAgencies: parseArrayOf(value['prism:sellingagency'], (value) =>
      parseString(retrieveText(value)),
    ),
    organizations: parseArrayOf(value['prism:organization'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    persons: parseArrayOf(value['prism:person'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    platforms: parseArrayOf(value['prism:platform'], (value) => parseString(retrieveText(value))),
    originPlatforms: parseArrayOf(value['prism:originplatform'], parseOriginPlatform),
    device: parseSingularOf(value['prism:device'], (value) => parseString(retrieveText(value))),
    complianceProfile: parseSingularOf(value['prism:complianceprofile'], (value) =>
      parseString(retrieveText(value)),
    ),
    blogTitle: parseSingularOf(value['prism:blogtitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    blogURL: parseSingularOf(value['prism:blogurl'], (value) => parseString(retrieveText(value))),
    links: parseArrayOf(value['prism:link'], (value) => parseString(retrieveText(value))),
    urls: parseArrayOf(value['prism:url'], (value) => parseString(retrieveText(value))),
    wordCount: parseSingularOf(value['prism:wordcount'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    byteCount: parseSingularOf(value['prism:bytecount'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    ratings: parseArrayOf(value['prism:rating'], (value) => parseString(retrieveText(value))),
    timePeriod: parseSingularOf(value['prism:timeperiod'], (value) =>
      parseString(retrieveText(value)),
    ),
    versionIdentifier: parseSingularOf(value['prism:versionidentifier'], (value) =>
      parseString(retrieveText(value)),
    ),
    tickers: parseArrayOf(value['prism:ticker'], (value) => parseString(retrieveText(value))),
    academicFields: parseArrayOf(value['prism:academicfield'], (value) =>
      parseString(retrieveText(value)),
    ),
    events: parseArrayOf(value['prism:event'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    genres: parseArrayOf(value['prism:genre'], (value) => parseString(retrieveText(value))),
    industries: parseArrayOf(value['prism:industry'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    locations: parseArrayOf(value['prism:location'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    objects: parseArrayOf(value['prism:object'], (value) => parseString(retrieveText(value))),
    profession: parseSingularOf(value['prism:profession'], (value) =>
      parseString(retrieveText(value)),
    ),
    sport: parseSingularOf(value['prism:sport'], (value) => parseString(retrieveText(value))),
    hasAlternatives: parseArrayOf(value['prism:hasalternative'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    hasCorrections: parseArrayOf(value['prism:hascorrection'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    hasTranslations: parseArrayOf(value['prism:hastranslation'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isAlternativeOf: parseArrayOf(value['prism:isalternativeof'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isCorrectionOf: parseArrayOf(value['prism:iscorrectionof'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isTranslationOf: parseSingularOf(value['prism:istranslationof'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    supplementTitles: parseArrayOf(value['prism:supplementtitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    supplementDisplayID: parseSingularOf(value['prism:supplementdisplayid'], (value) =>
      parseString(retrieveText(value)),
    ),
    supplementStartingPage: parseSingularOf(value['prism:supplementstartingpage'], (value) =>
      parseString(retrieveText(value)),
    ),
    embargoDate: parseSingularOf(value['prism:embargodate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    copyright: parseSingularOf(value['prism:copyright'], (value) =>
      parseString(retrieveText(value)),
    ),
    expirationDate: parseSingularOf(value['prism:expirationdate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    rightsAgent: parseSingularOf(value['prism:rightsagent'], (value) =>
      parseString(retrieveText(value)),
    ),
    category: parseSingularOf(value['prism:category'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    hasFormats: parseArrayOf(value['prism:hasformat'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    hasParts: parseArrayOf(value['prism:haspart'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    hasPreviousVersion: parseSingularOf(value['prism:haspreviousversion'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isFormatOf: parseSingularOf(value['prism:isformatof'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isPartOf: parseSingularOf(value['prism:ispartof'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isReferencedBy: parseSingularOf(value['prism:isreferencedby'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isRequiredBy: parseSingularOf(value['prism:isrequiredby'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    isVersionOf: parseSingularOf(value['prism:isversionof'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    objectTitles: parseArrayOf(value['prism:objecttitle'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    receptionDate: parseSingularOf(value['prism:receptiondate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    references: parseArrayOf(value['prism:references'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    requires: parseSingularOf(value['prism:requires'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
  }

  return trimObject(itemOrFeed)
}
