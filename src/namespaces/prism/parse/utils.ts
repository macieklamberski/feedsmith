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

const parsePlatform: ParseUtilPartial<string> = (value) => {
  return parseString(value?.['@platform']) ?? parseString(value?.['@prism:platform'])
}

export const parsePlatformString: ParseUtilPartial<PrismNs.PlatformValue<string>> = (value) => {
  const platformValue = {
    value: retrieveRdfResourceOrText(value, parseString),
    platform: parsePlatform(value),
  }

  return trimObject(platformValue)
}

export const parsePlatformDate: ParseUtilPartial<
  PrismNs.PlatformValue<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  const platformValue = {
    value: parseDate(retrieveText(value), options?.parseDateFn),
    platform: parsePlatform(value),
  }

  return trimObject(platformValue)
}

export const parseRating: ParseUtilPartial<PrismNs.Rating> = (value) => {
  const rating = {
    value: retrieveRdfResourceOrText(value, parseString),
    ratingSystem:
      parseString(value?.['@ratingsystem']) ?? parseString(value?.['@prism:ratingsystem']),
  }

  return trimObject(rating)
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
      retrieveRdfResourceOrText(value, parseString),
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
    issueTeaser: parseSingularOf(value['prism:issueteaser'], parsePlatformString),
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
      retrieveRdfResourceOrText(value, parseString),
    ),
    coverDate: parseSingularOf(value['prism:coverdate'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    coverDisplayDate: parseSingularOf(value['prism:coverdisplaydate'], (value) =>
      parseString(retrieveText(value)),
    ),
    publicationDates: parseArrayOf(value['prism:publicationdate'], (value) =>
      parsePlatformDate(value, options),
    ),
    publicationDisplayDates: parseArrayOf(
      value['prism:publicationdisplaydate'],
      parsePlatformString,
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
      parsePlatformDate(value, options),
    ),
    onSaleDays: parseArrayOf(value['prism:onsaleday'], parsePlatformString),
    offSaleDates: parseArrayOf(value['prism:offsaledate'], (value) =>
      parsePlatformDate(value, options),
    ),
    killDate: parseSingularOf(value['prism:killdate'], (value) =>
      parsePlatformDate(value, options),
    ),
    copyrightYears: parseArrayOf(value['prism:copyrightyear'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    contentType: parseSingularOf(value['prism:contenttype'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    alternateTitles: parseArrayOf(value['prism:alternatetitle'], parsePlatformString),
    subtitles: parseArrayOf(value['prism:subtitle'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    teasers: parseArrayOf(value['prism:teaser'], parsePlatformString),
    keywords: parseArrayOf(value['prism:keyword'], (value) => parseString(retrieveText(value))),
    seriesTitle: parseSingularOf(value['prism:seriestitle'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    seriesNumber: parseSingularOf(value['prism:seriesnumber'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    bookEditions: parseArrayOf(value['prism:bookedition'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    nationalCatalogNumber: parseSingularOf(value['prism:nationalcatalognumber'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    productCodes: parseArrayOf(value['prism:productcode'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    uspsNumber: parseSingularOf(value['prism:uspsnumber'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    publishingFrequency: parseSingularOf(value['prism:publishingfrequency'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    channels: parseArrayOf(value['prism:channel'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    subchannel1: parseSingularOf(value['prism:subchannel1'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    subchannel2: parseSingularOf(value['prism:subchannel2'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    subchannel3: parseSingularOf(value['prism:subchannel3'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    subchannel4: parseSingularOf(value['prism:subchannel4'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
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
      retrieveRdfResourceOrText(value, parseString),
    ),
    samplePageRange: parseSingularOf(value['prism:samplepagerange'], (value) =>
      parseString(retrieveText(value)),
    ),
    corporateEntities: parseArrayOf(value['prism:corporateentity'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    distributor: parseSingularOf(value['prism:distributor'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    sellingAgencies: parseArrayOf(value['prism:sellingagency'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    organizations: parseArrayOf(value['prism:organization'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    persons: parseArrayOf(value['prism:person'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    platforms: parseArrayOf(value['prism:platform'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    originPlatforms: parseArrayOf(value['prism:originplatform'], parseOriginPlatform),
    device: parseSingularOf(value['prism:device'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    complianceProfile: parseSingularOf(value['prism:complianceprofile'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    blogTitle: parseSingularOf(value['prism:blogtitle'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    blogURL: parseSingularOf(value['prism:blogurl'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    links: parseArrayOf(value['prism:link'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    urls: parseArrayOf(value['prism:url'], parsePlatformString),
    wordCount: parseSingularOf(value['prism:wordcount'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    byteCount: parseSingularOf(value['prism:bytecount'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    ratings: parseArrayOf(value['prism:rating'], parseRating),
    timePeriod: parseSingularOf(value['prism:timeperiod'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    versionIdentifier: parseSingularOf(value['prism:versionidentifier'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    tickers: parseArrayOf(value['prism:ticker'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    academicFields: parseArrayOf(value['prism:academicfield'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    events: parseArrayOf(value['prism:event'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    genres: parseArrayOf(value['prism:genre'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    industries: parseArrayOf(value['prism:industry'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    locations: parseArrayOf(value['prism:location'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    objects: parseArrayOf(value['prism:object'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    profession: parseSingularOf(value['prism:profession'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    sport: parseSingularOf(value['prism:sport'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    hasAlternatives: parseArrayOf(value['prism:hasalternative'], (value) =>
      retrieveRdfResourceOrText(value, parseString),
    ),
    hasCorrections: parseArrayOf(value['prism:hascorrection'], parsePlatformString),
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
