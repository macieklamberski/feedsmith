import type { GenerateFunction } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimObject } from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const generateItemOrFeed: GenerateFunction<ItemOrFeed<Date>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dcterms:abstract': itemOrFeed.abstract,
    'dcterms:accessRights': itemOrFeed.accessRights,
    'dcterms:accrualMethod': itemOrFeed.accrualMethod,
    'dcterms:accrualPeriodicity': itemOrFeed.accrualPeriodicity,
    'dcterms:accrualPolicy': itemOrFeed.accrualPolicy,
    'dcterms:alternative': itemOrFeed.alternative,
    'dcterms:audience': itemOrFeed.audience,
    'dcterms:available': generateRfc3339Date(itemOrFeed.available),
    'dcterms:bibliographicCitation': itemOrFeed.bibliographicCitation,
    'dcterms:conformsTo': itemOrFeed.conformsTo,
    'dcterms:contributor': itemOrFeed.contributor,
    'dcterms:coverage': itemOrFeed.coverage,
    'dcterms:created': generateRfc3339Date(itemOrFeed.created),
    'dcterms:creator': itemOrFeed.creator,
    'dcterms:date': generateRfc3339Date(itemOrFeed.date),
    'dcterms:dateAccepted': generateRfc3339Date(itemOrFeed.dateAccepted),
    'dcterms:dateCopyrighted': generateRfc3339Date(itemOrFeed.dateCopyrighted),
    'dcterms:dateSubmitted': generateRfc3339Date(itemOrFeed.dateSubmitted),
    'dcterms:description': itemOrFeed.description,
    'dcterms:educationLevel': itemOrFeed.educationLevel,
    'dcterms:extent': itemOrFeed.extent,
    'dcterms:format': itemOrFeed.format,
    'dcterms:hasFormat': itemOrFeed.hasFormat,
    'dcterms:hasPart': itemOrFeed.hasPart,
    'dcterms:hasVersion': itemOrFeed.hasVersion,
    'dcterms:identifier': itemOrFeed.identifier,
    'dcterms:instructionalMethod': itemOrFeed.instructionalMethod,
    'dcterms:isFormatOf': itemOrFeed.isFormatOf,
    'dcterms:isPartOf': itemOrFeed.isPartOf,
    'dcterms:isReferencedBy': itemOrFeed.isReferencedBy,
    'dcterms:isReplacedBy': itemOrFeed.isReplacedBy,
    'dcterms:isRequiredBy': itemOrFeed.isRequiredBy,
    'dcterms:issued': generateRfc3339Date(itemOrFeed.issued),
    'dcterms:isVersionOf': itemOrFeed.isVersionOf,
    'dcterms:language': itemOrFeed.language,
    'dcterms:license': itemOrFeed.license,
    'dcterms:mediator': itemOrFeed.mediator,
    'dcterms:medium': itemOrFeed.medium,
    'dcterms:modified': generateRfc3339Date(itemOrFeed.modified),
    'dcterms:provenance': itemOrFeed.provenance,
    'dcterms:publisher': itemOrFeed.publisher,
    'dcterms:references': itemOrFeed.references,
    'dcterms:relation': itemOrFeed.relation,
    'dcterms:replaces': itemOrFeed.replaces,
    'dcterms:requires': itemOrFeed.requires,
    'dcterms:rights': itemOrFeed.rights,
    'dcterms:rightsHolder': itemOrFeed.rightsHolder,
    'dcterms:source': itemOrFeed.source,
    'dcterms:spatial': itemOrFeed.spatial,
    'dcterms:subject': itemOrFeed.subject,
    'dcterms:tableOfContents': itemOrFeed.tableOfContents,
    'dcterms:temporal': itemOrFeed.temporal,
    'dcterms:title': itemOrFeed.title,
    'dcterms:type': itemOrFeed.type,
    'dcterms:valid': generateRfc3339Date(itemOrFeed.valid),
  }

  return trimObject(value)
}
