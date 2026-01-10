import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateRfc3339Date,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { DcTermsNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<DcTermsNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dcterms:abstract': trimArray(itemOrFeed.abstracts, generateCdataString),
    'dcterms:accessRights': trimArray(itemOrFeed.accessRights, generateCdataString),
    'dcterms:accrualMethod': trimArray(itemOrFeed.accrualMethods, generateCdataString),
    'dcterms:accrualPeriodicity': trimArray(itemOrFeed.accrualPeriodicities, generateCdataString),
    'dcterms:accrualPolicy': trimArray(itemOrFeed.accrualPolicies, generateCdataString),
    'dcterms:alternative': trimArray(itemOrFeed.alternatives, generateCdataString),
    'dcterms:audience': trimArray(itemOrFeed.audiences, generateCdataString),
    'dcterms:available': trimArray(itemOrFeed.available, generateRfc3339Date),
    'dcterms:bibliographicCitation': trimArray(
      itemOrFeed.bibliographicCitations,
      generateCdataString,
    ),
    'dcterms:conformsTo': trimArray(itemOrFeed.conformsTo, generateCdataString),
    'dcterms:contributor': trimArray(itemOrFeed.contributors, generateCdataString),
    'dcterms:coverage': trimArray(itemOrFeed.coverages, generateCdataString),
    'dcterms:created': trimArray(itemOrFeed.created, generateRfc3339Date),
    'dcterms:creator': trimArray(itemOrFeed.creators, generateCdataString),
    'dcterms:date': trimArray(itemOrFeed.dates, generateRfc3339Date),
    'dcterms:dateAccepted': trimArray(itemOrFeed.dateAccepted, generateRfc3339Date),
    'dcterms:dateCopyrighted': trimArray(itemOrFeed.dateCopyrighted, generateRfc3339Date),
    'dcterms:dateSubmitted': trimArray(itemOrFeed.dateSubmitted, generateRfc3339Date),
    'dcterms:description': trimArray(itemOrFeed.descriptions, generateCdataString),
    'dcterms:educationLevel': trimArray(itemOrFeed.educationLevels, generateCdataString),
    'dcterms:extent': trimArray(itemOrFeed.extents, generateCdataString),
    'dcterms:format': trimArray(itemOrFeed.formats, generateCdataString),
    'dcterms:hasFormat': trimArray(itemOrFeed.hasFormats, generateCdataString),
    'dcterms:hasPart': trimArray(itemOrFeed.hasParts, generateCdataString),
    'dcterms:hasVersion': trimArray(itemOrFeed.hasVersions, generateCdataString),
    'dcterms:identifier': trimArray(itemOrFeed.identifiers, generateCdataString),
    'dcterms:instructionalMethod': trimArray(itemOrFeed.instructionalMethods, generateCdataString),
    'dcterms:isFormatOf': trimArray(itemOrFeed.isFormatOf, generateCdataString),
    'dcterms:isPartOf': trimArray(itemOrFeed.isPartOf, generateCdataString),
    'dcterms:isReferencedBy': trimArray(itemOrFeed.isReferencedBy, generateCdataString),
    'dcterms:isReplacedBy': trimArray(itemOrFeed.isReplacedBy, generateCdataString),
    'dcterms:isRequiredBy': trimArray(itemOrFeed.isRequiredBy, generateCdataString),
    'dcterms:issued': trimArray(itemOrFeed.issued, generateRfc3339Date),
    'dcterms:isVersionOf': trimArray(itemOrFeed.isVersionOf, generateCdataString),
    'dcterms:language': trimArray(itemOrFeed.languages, generateCdataString),
    'dcterms:license': trimArray(itemOrFeed.licenses, generateCdataString),
    'dcterms:mediator': trimArray(itemOrFeed.mediators, generateCdataString),
    'dcterms:medium': trimArray(itemOrFeed.mediums, generateCdataString),
    'dcterms:modified': trimArray(itemOrFeed.modified, generateRfc3339Date),
    'dcterms:provenance': trimArray(itemOrFeed.provenances, generateCdataString),
    'dcterms:publisher': trimArray(itemOrFeed.publishers, generateCdataString),
    'dcterms:references': trimArray(itemOrFeed.references, generateCdataString),
    'dcterms:relation': trimArray(itemOrFeed.relations, generateCdataString),
    'dcterms:replaces': trimArray(itemOrFeed.replaces, generateCdataString),
    'dcterms:requires': trimArray(itemOrFeed.requires, generateCdataString),
    'dcterms:rights': trimArray(itemOrFeed.rights, generateCdataString),
    'dcterms:rightsHolder': trimArray(itemOrFeed.rightsHolders, generateCdataString),
    'dcterms:source': trimArray(itemOrFeed.sources, generateCdataString),
    'dcterms:spatial': trimArray(itemOrFeed.spatials, generateCdataString),
    'dcterms:subject': trimArray(itemOrFeed.subjects, generateCdataString),
    'dcterms:tableOfContents': trimArray(itemOrFeed.tableOfContents, generateCdataString),
    'dcterms:temporal': trimArray(itemOrFeed.temporals, generateCdataString),
    'dcterms:title': trimArray(itemOrFeed.titles, generateCdataString),
    'dcterms:type': trimArray(itemOrFeed.types, generateCdataString),
    'dcterms:valid': trimArray(itemOrFeed.valid, generateRfc3339Date),
  }

  return trimObject(value)
}
