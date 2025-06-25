import type { GenerateFunction } from '../../../common/types.js'
import { generateRfc3339Date, isObject, trimObject } from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const generateItemOrFeed: GenerateFunction<ItemOrFeed<Date>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dcterms:abstract': itemOrFeed.abstract,
    'dcterms:accessrights': itemOrFeed.accessRights,
    'dcterms:accrualmethod': itemOrFeed.accrualMethod,
    'dcterms:accrualperiodicity': itemOrFeed.accrualPeriodicity,
    'dcterms:accrualpolicy': itemOrFeed.accrualPolicy,
    'dcterms:alternative': itemOrFeed.alternative,
    'dcterms:audience': itemOrFeed.audience,
    'dcterms:available': generateRfc3339Date(itemOrFeed.available),
    'dcterms:bibliographiccitation': itemOrFeed.bibliographicCitation,
    'dcterms:conformsto': itemOrFeed.conformsTo,
    'dcterms:contributor': itemOrFeed.contributor,
    'dcterms:coverage': itemOrFeed.coverage,
    'dcterms:created': generateRfc3339Date(itemOrFeed.created),
    'dcterms:creator': itemOrFeed.creator,
    'dcterms:date': generateRfc3339Date(itemOrFeed.date),
    'dcterms:dateaccepted': generateRfc3339Date(itemOrFeed.dateAccepted),
    'dcterms:datecopyrighted': generateRfc3339Date(itemOrFeed.dateCopyrighted),
    'dcterms:datesubmitted': generateRfc3339Date(itemOrFeed.dateSubmitted),
    'dcterms:description': itemOrFeed.description,
    'dcterms:educationlevel': itemOrFeed.educationLevel,
    'dcterms:extent': itemOrFeed.extent,
    'dcterms:format': itemOrFeed.format,
    'dcterms:hasformat': itemOrFeed.hasFormat,
    'dcterms:haspart': itemOrFeed.hasPart,
    'dcterms:hasversion': itemOrFeed.hasVersion,
    'dcterms:identifier': itemOrFeed.identifier,
    'dcterms:instructionalmethod': itemOrFeed.instructionalMethod,
    'dcterms:isformatof': itemOrFeed.isFormatOf,
    'dcterms:ispartof': itemOrFeed.isPartOf,
    'dcterms:isreferencedby': itemOrFeed.isReferencedBy,
    'dcterms:isreplacedby': itemOrFeed.isReplacedBy,
    'dcterms:isrequiredby': itemOrFeed.isRequiredBy,
    'dcterms:issued': generateRfc3339Date(itemOrFeed.issued),
    'dcterms:isversionof': itemOrFeed.isVersionOf,
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
    'dcterms:rightsholder': itemOrFeed.rightsHolder,
    'dcterms:source': itemOrFeed.source,
    'dcterms:spatial': itemOrFeed.spatial,
    'dcterms:subject': itemOrFeed.subject,
    'dcterms:tableofcontents': itemOrFeed.tableOfContents,
    'dcterms:temporal': itemOrFeed.temporal,
    'dcterms:title': itemOrFeed.title,
    'dcterms:type': itemOrFeed.type,
    'dcterms:valid': generateRfc3339Date(itemOrFeed.valid),
  }

  return trimObject(value)
}
