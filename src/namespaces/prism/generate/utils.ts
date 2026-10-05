import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  generateTextOrCdataString,
  trimArray,
} from '../../../common/utils.js'
import type { PrismNs } from '../common/types.js'

export const generateOriginPlatform: GenerateUtil<string> = (originPlatform) => {
  const value = {
    '@platform': generatePlainString(originPlatform),
  }

  return trimObject(value)
}

export const generatePlatformString: GenerateUtil<PrismNs.PlatformValue<string>> = (
  platformValue,
) => {
  if (!isPlainObject(platformValue)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(platformValue.value),
    '@platform': generatePlainString(platformValue.platform),
  }

  return trimObject(value)
}

export const generatePlatformDate: GenerateUtil<PrismNs.PlatformValue<DateLike>> = (
  platformValue,
) => {
  if (!isPlainObject(platformValue)) {
    return
  }

  const value = {
    '#text': generateRfc3339Date(platformValue.value),
    '@platform': generatePlainString(platformValue.platform),
  }

  return trimObject(value)
}

export const generateRating: GenerateUtil<PrismNs.Rating> = (rating) => {
  if (!isPlainObject(rating)) {
    return
  }

  const value = {
    ...generateTextOrCdataString(rating.value),
    '@ratingSystem': generatePlainString(rating.ratingSystem),
  }

  return trimObject(value)
}

export const generateItemOrFeed: GenerateUtil<PrismNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isPlainObject(itemOrFeed)) {
    return
  }

  const value = {
    'prism:publicationName': generateCdataString(itemOrFeed.publicationName),
    'prism:issn': generateCdataString(itemOrFeed.issn),
    'prism:eIssn': generateCdataString(itemOrFeed.eIssn),
    'prism:isbn': trimArray(itemOrFeed.isbns, generateCdataString),
    'prism:issueIdentifier': generateCdataString(itemOrFeed.issueIdentifier),
    'prism:issueName': generateCdataString(itemOrFeed.issueName),
    'prism:issueTeaser': generatePlatformString(itemOrFeed.issueTeaser),
    'prism:issueType': generateCdataString(itemOrFeed.issueType),
    'prism:doi': generateCdataString(itemOrFeed.doi),
    'prism:volume': generateCdataString(itemOrFeed.volume),
    'prism:number': generateCdataString(itemOrFeed.number),
    'prism:edition': generateCdataString(itemOrFeed.edition),
    'prism:aggregateIssueNumber': generateNumber(itemOrFeed.aggregateIssueNumber),
    'prism:aggregationType': generateCdataString(itemOrFeed.aggregationType),
    'prism:coverDate': generateRfc3339Date(itemOrFeed.coverDate),
    'prism:coverDisplayDate': generateCdataString(itemOrFeed.coverDisplayDate),
    'prism:publicationDate': trimArray(itemOrFeed.publicationDates, generatePlatformDate),
    'prism:publicationDisplayDate': trimArray(
      itemOrFeed.publicationDisplayDates,
      generatePlatformString,
    ),
    'prism:creationDate': generateRfc3339Date(itemOrFeed.creationDate),
    'prism:modificationDate': generateRfc3339Date(itemOrFeed.modificationDate),
    'prism:dateReceived': generateRfc3339Date(itemOrFeed.dateReceived),
    'prism:onSaleDate': trimArray(itemOrFeed.onSaleDates, generatePlatformDate),
    'prism:onSaleDay': trimArray(itemOrFeed.onSaleDays, generatePlatformString),
    'prism:offSaleDate': trimArray(itemOrFeed.offSaleDates, generatePlatformDate),
    'prism:killDate': generatePlatformDate(itemOrFeed.killDate),
    'prism:copyrightYear': trimArray(itemOrFeed.copyrightYears, generateCdataString),
    'prism:contentType': generateCdataString(itemOrFeed.contentType),
    'prism:alternateTitle': trimArray(itemOrFeed.alternateTitles, generatePlatformString),
    'prism:subtitle': trimArray(itemOrFeed.subtitles, generateCdataString),
    'prism:teaser': trimArray(itemOrFeed.teasers, generatePlatformString),
    'prism:keyword': trimArray(itemOrFeed.keywords, generateCdataString),
    'prism:seriesTitle': generateCdataString(itemOrFeed.seriesTitle),
    'prism:seriesNumber': generateNumber(itemOrFeed.seriesNumber),
    'prism:bookEdition': trimArray(itemOrFeed.bookEditions, generateCdataString),
    'prism:nationalCatalogNumber': generateCdataString(itemOrFeed.nationalCatalogNumber),
    'prism:productCode': trimArray(itemOrFeed.productCodes, generateCdataString),
    'prism:uspsNumber': generateCdataString(itemOrFeed.uspsNumber),
    'prism:publishingFrequency': generateCdataString(itemOrFeed.publishingFrequency),
    'prism:channel': trimArray(itemOrFeed.channels, generateCdataString),
    'prism:subchannel1': generateCdataString(itemOrFeed.subchannel1),
    'prism:subchannel2': generateCdataString(itemOrFeed.subchannel2),
    'prism:subchannel3': generateCdataString(itemOrFeed.subchannel3),
    'prism:subchannel4': generateCdataString(itemOrFeed.subchannel4),
    'prism:section': generateCdataString(itemOrFeed.section),
    'prism:subsection1': generateCdataString(itemOrFeed.subsection1),
    'prism:subsection2': generateCdataString(itemOrFeed.subsection2),
    'prism:subsection3': generateCdataString(itemOrFeed.subsection3),
    'prism:subsection4': generateCdataString(itemOrFeed.subsection4),
    'prism:startingPage': generateCdataString(itemOrFeed.startingPage),
    'prism:endingPage': generateCdataString(itemOrFeed.endingPage),
    'prism:pageRange': generateCdataString(itemOrFeed.pageRange),
    'prism:pageCount': generateNumber(itemOrFeed.pageCount),
    'prism:pageProgressionDirection': generateCdataString(itemOrFeed.pageProgressionDirection),
    'prism:samplePageRange': generateCdataString(itemOrFeed.samplePageRange),
    'prism:corporateEntity': trimArray(itemOrFeed.corporateEntities, generateCdataString),
    'prism:distributor': generateCdataString(itemOrFeed.distributor),
    'prism:sellingAgency': trimArray(itemOrFeed.sellingAgencies, generateCdataString),
    'prism:organization': trimArray(itemOrFeed.organizations, generateCdataString),
    'prism:person': trimArray(itemOrFeed.persons, generateCdataString),
    'prism:platform': trimArray(itemOrFeed.platforms, generateCdataString),
    'prism:originPlatform': trimArray(itemOrFeed.originPlatforms, generateOriginPlatform),
    'prism:device': generateCdataString(itemOrFeed.device),
    'prism:complianceProfile': generateCdataString(itemOrFeed.complianceProfile),
    'prism:blogTitle': generateCdataString(itemOrFeed.blogTitle),
    'prism:blogURL': generateCdataString(itemOrFeed.blogURL),
    'prism:link': trimArray(itemOrFeed.links, generateCdataString),
    'prism:url': trimArray(itemOrFeed.urls, generatePlatformString),
    'prism:wordCount': generateNumber(itemOrFeed.wordCount),
    'prism:byteCount': generateNumber(itemOrFeed.byteCount),
    'prism:rating': trimArray(itemOrFeed.ratings, generateRating),
    'prism:timePeriod': generateCdataString(itemOrFeed.timePeriod),
    'prism:versionIdentifier': generateCdataString(itemOrFeed.versionIdentifier),
    'prism:ticker': trimArray(itemOrFeed.tickers, generateCdataString),
    'prism:academicField': trimArray(itemOrFeed.academicFields, generateCdataString),
    'prism:event': trimArray(itemOrFeed.events, generateCdataString),
    'prism:genre': trimArray(itemOrFeed.genres, generateCdataString),
    'prism:industry': trimArray(itemOrFeed.industries, generateCdataString),
    'prism:location': trimArray(itemOrFeed.locations, generateCdataString),
    'prism:object': trimArray(itemOrFeed.objects, generateCdataString),
    'prism:profession': generateCdataString(itemOrFeed.profession),
    'prism:sport': generateCdataString(itemOrFeed.sport),
    'prism:hasAlternative': trimArray(itemOrFeed.hasAlternatives, generateCdataString),
    'prism:hasCorrection': trimArray(itemOrFeed.hasCorrections, generatePlatformString),
    'prism:hasTranslation': trimArray(itemOrFeed.hasTranslations, generateCdataString),
    'prism:isAlternativeOf': trimArray(itemOrFeed.isAlternativeOf, generateCdataString),
    'prism:isCorrectionOf': trimArray(itemOrFeed.isCorrectionOf, generateCdataString),
    'prism:isTranslationOf': generateCdataString(itemOrFeed.isTranslationOf),
    'prism:supplementTitle': trimArray(itemOrFeed.supplementTitles, generateCdataString),
    'prism:supplementDisplayID': generateCdataString(itemOrFeed.supplementDisplayID),
    'prism:supplementStartingPage': generateCdataString(itemOrFeed.supplementStartingPage),
    'prism:embargoDate': generateRfc3339Date(itemOrFeed.embargoDate),
    'prism:copyright': generateCdataString(itemOrFeed.copyright),
    'prism:expirationDate': generateRfc3339Date(itemOrFeed.expirationDate),
    'prism:rightsAgent': generateCdataString(itemOrFeed.rightsAgent),
    'prism:category': generateCdataString(itemOrFeed.category),
    'prism:hasFormat': trimArray(itemOrFeed.hasFormats, generateCdataString),
    'prism:hasPart': trimArray(itemOrFeed.hasParts, generateCdataString),
    'prism:hasPreviousVersion': generateCdataString(itemOrFeed.hasPreviousVersion),
    'prism:isFormatOf': generateCdataString(itemOrFeed.isFormatOf),
    'prism:isPartOf': generateCdataString(itemOrFeed.isPartOf),
    'prism:isReferencedBy': generateCdataString(itemOrFeed.isReferencedBy),
    'prism:isRequiredBy': generateCdataString(itemOrFeed.isRequiredBy),
    'prism:isVersionOf': generateCdataString(itemOrFeed.isVersionOf),
    'prism:objectTitle': trimArray(itemOrFeed.objectTitles, generateCdataString),
    'prism:receptionDate': generateRfc3339Date(itemOrFeed.receptionDate),
    'prism:references': trimArray(itemOrFeed.references, generateCdataString),
    'prism:requires': generateCdataString(itemOrFeed.requires),
  }

  return trimObject(value)
}
