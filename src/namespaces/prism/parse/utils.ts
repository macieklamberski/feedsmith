import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { PrismNs } from '../common/types.js'

export const retrieveFeed: ParsePartialUtil<PrismNs.Feed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
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
    volume: parseSingularOf(value['prism:volume'], (value) => parseString(retrieveText(value))),
    number: parseSingularOf(value['prism:number'], (value) => parseString(retrieveText(value))),
    edition: parseSingularOf(value['prism:edition'], (value) => parseString(retrieveText(value))),
    aggregateIssueNumber: parseSingularOf(value['prism:aggregateissuenumber'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    aggregationType: parseSingularOf(value['prism:aggregationtype'], (value) =>
      parseString(retrieveText(value)),
    ),
    coverDate: parseSingularOf(value['prism:coverdate'], (value) => parseDate(retrieveText(value))),
    coverDisplayDate: parseSingularOf(value['prism:coverdisplaydate'], (value) =>
      parseString(retrieveText(value)),
    ),
    publicationDates: parseArrayOf(value['prism:publicationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    publicationDisplayDates: parseArrayOf(value['prism:publicationdisplaydate'], (value) =>
      parseString(retrieveText(value)),
    ),
    creationDate: parseSingularOf(value['prism:creationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    modificationDate: parseSingularOf(value['prism:modificationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    dateReceived: parseSingularOf(value['prism:datereceived'], (value) =>
      parseDate(retrieveText(value)),
    ),
    onSaleDates: parseArrayOf(value['prism:onsaledate'], (value) => parseDate(retrieveText(value))),
    onSaleDays: parseArrayOf(value['prism:onsaleday'], (value) => parseString(retrieveText(value))),
    offSaleDates: parseArrayOf(value['prism:offsaledate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    killDate: parseSingularOf(value['prism:killdate'], (value) => parseDate(retrieveText(value))),
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
    corporateEntities: parseArrayOf(value['prism:corporateentity'], (value) =>
      parseString(retrieveText(value)),
    ),
    distributor: parseSingularOf(value['prism:distributor'], (value) =>
      parseString(retrieveText(value)),
    ),
    sellingAgencies: parseArrayOf(value['prism:sellingagency'], (value) =>
      parseString(retrieveText(value)),
    ),
    organizations: parseArrayOf(value['prism:organization'], (value) =>
      parseString(retrieveText(value)),
    ),
    persons: parseArrayOf(value['prism:person'], (value) => parseString(retrieveText(value))),
    platforms: parseArrayOf(value['prism:platform'], (value) => parseString(retrieveText(value))),
    originPlatforms: parseArrayOf(value['prism:originplatform'], (value) =>
      parseString(retrieveText(value)),
    ),
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
    events: parseArrayOf(value['prism:event'], (value) => parseString(retrieveText(value))),
    genres: parseArrayOf(value['prism:genre'], (value) => parseString(retrieveText(value))),
    industries: parseArrayOf(value['prism:industry'], (value) => parseString(retrieveText(value))),
    locations: parseArrayOf(value['prism:location'], (value) => parseString(retrieveText(value))),
    objects: parseArrayOf(value['prism:object'], (value) => parseString(retrieveText(value))),
    profession: parseSingularOf(value['prism:profession'], (value) =>
      parseString(retrieveText(value)),
    ),
    sport: parseSingularOf(value['prism:sport'], (value) => parseString(retrieveText(value))),
    embargoDate: parseSingularOf(value['prism:embargodate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    copyright: parseSingularOf(value['prism:copyright'], (value) =>
      parseString(retrieveText(value)),
    ),
    expirationDate: parseSingularOf(value['prism:expirationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    rightsAgent: parseSingularOf(value['prism:rightsagent'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(feed)
}

export const retrieveItem: ParsePartialUtil<PrismNs.Item<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    publicationName: parseSingularOf(value['prism:publicationname'], (value) =>
      parseString(retrieveText(value)),
    ),
    issn: parseSingularOf(value['prism:issn'], (value) => parseString(retrieveText(value))),
    eIssn: parseSingularOf(value['prism:eissn'], (value) => parseString(retrieveText(value))),
    doi: parseSingularOf(value['prism:doi'], (value) => parseString(retrieveText(value))),
    urls: parseArrayOf(value['prism:url'], (value) => parseString(retrieveText(value))),
    volume: parseSingularOf(value['prism:volume'], (value) => parseString(retrieveText(value))),
    number: parseSingularOf(value['prism:number'], (value) => parseString(retrieveText(value))),
    edition: parseSingularOf(value['prism:edition'], (value) => parseString(retrieveText(value))),
    section: parseSingularOf(value['prism:section'], (value) => parseString(retrieveText(value))),
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
    publicationDates: parseArrayOf(value['prism:publicationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    publicationDisplayDates: parseArrayOf(value['prism:publicationdisplaydate'], (value) =>
      parseString(retrieveText(value)),
    ),
    creationDate: parseSingularOf(value['prism:creationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    modificationDate: parseSingularOf(value['prism:modificationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    dateReceived: parseSingularOf(value['prism:datereceived'], (value) =>
      parseDate(retrieveText(value)),
    ),
    killDate: parseSingularOf(value['prism:killdate'], (value) => parseDate(retrieveText(value))),
    copyrightYears: parseArrayOf(value['prism:copyrightyear'], (value) =>
      parseString(retrieveText(value)),
    ),
    contentType: parseSingularOf(value['prism:contenttype'], (value) =>
      parseString(retrieveText(value)),
    ),
    genres: parseArrayOf(value['prism:genre'], (value) => parseString(retrieveText(value))),
    alternateTitles: parseArrayOf(value['prism:alternatetitle'], (value) =>
      parseString(retrieveText(value)),
    ),
    subtitles: parseArrayOf(value['prism:subtitle'], (value) => parseString(retrieveText(value))),
    teasers: parseArrayOf(value['prism:teaser'], (value) => parseString(retrieveText(value))),
    keywords: parseArrayOf(value['prism:keyword'], (value) => parseString(retrieveText(value))),
    corporateEntities: parseArrayOf(value['prism:corporateentity'], (value) =>
      parseString(retrieveText(value)),
    ),
    organizations: parseArrayOf(value['prism:organization'], (value) =>
      parseString(retrieveText(value)),
    ),
    persons: parseArrayOf(value['prism:person'], (value) => parseString(retrieveText(value))),
    platforms: parseArrayOf(value['prism:platform'], (value) => parseString(retrieveText(value))),
    device: parseSingularOf(value['prism:device'], (value) => parseString(retrieveText(value))),
    academicFields: parseArrayOf(value['prism:academicfield'], (value) =>
      parseString(retrieveText(value)),
    ),
    events: parseArrayOf(value['prism:event'], (value) => parseString(retrieveText(value))),
    industries: parseArrayOf(value['prism:industry'], (value) => parseString(retrieveText(value))),
    locations: parseArrayOf(value['prism:location'], (value) => parseString(retrieveText(value))),
    objects: parseArrayOf(value['prism:object'], (value) => parseString(retrieveText(value))),
    profession: parseSingularOf(value['prism:profession'], (value) =>
      parseString(retrieveText(value)),
    ),
    sport: parseSingularOf(value['prism:sport'], (value) => parseString(retrieveText(value))),
    hasAlternatives: parseArrayOf(value['prism:hasalternative'], (value) =>
      parseString(retrieveText(value)),
    ),
    hasCorrections: parseArrayOf(value['prism:hascorrection'], (value) =>
      parseString(retrieveText(value)),
    ),
    hasTranslations: parseArrayOf(value['prism:hastranslation'], (value) =>
      parseString(retrieveText(value)),
    ),
    isAlternativeOf: parseArrayOf(value['prism:isalternativeof'], (value) =>
      parseString(retrieveText(value)),
    ),
    isCorrectionOf: parseArrayOf(value['prism:iscorrectionof'], (value) =>
      parseString(retrieveText(value)),
    ),
    isTranslationOf: parseSingularOf(value['prism:istranslationof'], (value) =>
      parseString(retrieveText(value)),
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
    links: parseArrayOf(value['prism:link'], (value) => parseString(retrieveText(value))),
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
    embargoDate: parseSingularOf(value['prism:embargodate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    copyright: parseSingularOf(value['prism:copyright'], (value) =>
      parseString(retrieveText(value)),
    ),
    expirationDate: parseSingularOf(value['prism:expirationdate'], (value) =>
      parseDate(retrieveText(value)),
    ),
    rightsAgent: parseSingularOf(value['prism:rightsagent'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
