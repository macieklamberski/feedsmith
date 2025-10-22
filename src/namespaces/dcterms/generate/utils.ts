import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateRfc3339Date,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { Dcterms } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<Dcterms.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dcterms:abstract': generateCdataString(itemOrFeed.abstract),
    'dcterms:accessRights': generateCdataString(itemOrFeed.accessRights),
    'dcterms:accrualMethod': generateCdataString(itemOrFeed.accrualMethod),
    'dcterms:accrualPeriodicity': generateCdataString(itemOrFeed.accrualPeriodicity),
    'dcterms:accrualPolicy': generateCdataString(itemOrFeed.accrualPolicy),
    'dcterms:alternative': generateCdataString(itemOrFeed.alternative),
    'dcterms:audience': generateCdataString(itemOrFeed.audience),
    'dcterms:available': generateRfc3339Date(itemOrFeed.available),
    'dcterms:bibliographicCitation': generateCdataString(itemOrFeed.bibliographicCitation),
    'dcterms:conformsTo': generateCdataString(itemOrFeed.conformsTo),
    'dcterms:contributor': generateCdataString(itemOrFeed.contributor),
    'dcterms:coverage': generateCdataString(itemOrFeed.coverage),
    'dcterms:created': generateRfc3339Date(itemOrFeed.created),
    'dcterms:creator': generateCdataString(itemOrFeed.creator),
    'dcterms:date': generateRfc3339Date(itemOrFeed.date),
    'dcterms:dateAccepted': generateRfc3339Date(itemOrFeed.dateAccepted),
    'dcterms:dateCopyrighted': generateRfc3339Date(itemOrFeed.dateCopyrighted),
    'dcterms:dateSubmitted': generateRfc3339Date(itemOrFeed.dateSubmitted),
    'dcterms:description': generateCdataString(itemOrFeed.description),
    'dcterms:educationLevel': generateCdataString(itemOrFeed.educationLevel),
    'dcterms:extent': generateCdataString(itemOrFeed.extent),
    'dcterms:format': generateCdataString(itemOrFeed.format),
    'dcterms:hasFormat': generateCdataString(itemOrFeed.hasFormat),
    'dcterms:hasPart': generateCdataString(itemOrFeed.hasPart),
    'dcterms:hasVersion': generateCdataString(itemOrFeed.hasVersion),
    'dcterms:identifier': generateCdataString(itemOrFeed.identifier),
    'dcterms:instructionalMethod': generateCdataString(itemOrFeed.instructionalMethod),
    'dcterms:isFormatOf': generateCdataString(itemOrFeed.isFormatOf),
    'dcterms:isPartOf': generateCdataString(itemOrFeed.isPartOf),
    'dcterms:isReferencedBy': generateCdataString(itemOrFeed.isReferencedBy),
    'dcterms:isReplacedBy': generateCdataString(itemOrFeed.isReplacedBy),
    'dcterms:isRequiredBy': generateCdataString(itemOrFeed.isRequiredBy),
    'dcterms:issued': generateRfc3339Date(itemOrFeed.issued),
    'dcterms:isVersionOf': generateCdataString(itemOrFeed.isVersionOf),
    'dcterms:language': generateCdataString(itemOrFeed.language),
    'dcterms:license': generateCdataString(itemOrFeed.license),
    'dcterms:mediator': generateCdataString(itemOrFeed.mediator),
    'dcterms:medium': generateCdataString(itemOrFeed.medium),
    'dcterms:modified': generateRfc3339Date(itemOrFeed.modified),
    'dcterms:provenance': generateCdataString(itemOrFeed.provenance),
    'dcterms:publisher': generateCdataString(itemOrFeed.publisher),
    'dcterms:references': generateCdataString(itemOrFeed.references),
    'dcterms:relation': generateCdataString(itemOrFeed.relation),
    'dcterms:replaces': generateCdataString(itemOrFeed.replaces),
    'dcterms:requires': generateCdataString(itemOrFeed.requires),
    'dcterms:rights': generateCdataString(itemOrFeed.rights),
    'dcterms:rightsHolder': generateCdataString(itemOrFeed.rightsHolder),
    'dcterms:source': generateCdataString(itemOrFeed.source),
    'dcterms:spatial': generateCdataString(itemOrFeed.spatial),
    'dcterms:subject': generateCdataString(itemOrFeed.subject),
    'dcterms:tableOfContents': generateCdataString(itemOrFeed.tableOfContents),
    'dcterms:temporal': generateCdataString(itemOrFeed.temporal),
    'dcterms:title': generateCdataString(itemOrFeed.title),
    'dcterms:type': generateCdataString(itemOrFeed.type),
    'dcterms:valid': generateRfc3339Date(itemOrFeed.valid),
  }

  return trimObject(value)
}
