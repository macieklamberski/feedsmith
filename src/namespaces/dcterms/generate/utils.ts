import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateArrayOrSingular,
  generateCdataString,
  generateRfc3339Date,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { DcTermsNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<DcTermsNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dcterms:abstract': generateArrayOrSingular(
      itemOrFeed.abstracts,
      itemOrFeed.abstract,
      generateCdataString,
    ),
    'dcterms:accessRights': generateCdataString(itemOrFeed.accessRights),
    'dcterms:accrualMethod': generateArrayOrSingular(
      itemOrFeed.accrualMethods,
      itemOrFeed.accrualMethod,
      generateCdataString,
    ),
    'dcterms:accrualPeriodicity': generateArrayOrSingular(
      itemOrFeed.accrualPeriodicities,
      itemOrFeed.accrualPeriodicity,
      generateCdataString,
    ),
    'dcterms:accrualPolicy': generateArrayOrSingular(
      itemOrFeed.accrualPolicies,
      itemOrFeed.accrualPolicy,
      generateCdataString,
    ),
    'dcterms:alternative': generateArrayOrSingular(
      itemOrFeed.alternatives,
      itemOrFeed.alternative,
      generateCdataString,
    ),
    'dcterms:audience': generateArrayOrSingular(
      itemOrFeed.audiences,
      itemOrFeed.audience,
      generateCdataString,
    ),
    'dcterms:available': generateRfc3339Date(itemOrFeed.available),
    'dcterms:bibliographicCitation': generateArrayOrSingular(
      itemOrFeed.bibliographicCitations,
      itemOrFeed.bibliographicCitation,
      generateCdataString,
    ),
    'dcterms:conformsTo': generateCdataString(itemOrFeed.conformsTo),
    'dcterms:contributor': generateArrayOrSingular(
      itemOrFeed.contributors,
      itemOrFeed.contributor,
      generateCdataString,
    ),
    'dcterms:coverage': generateArrayOrSingular(
      itemOrFeed.coverages,
      itemOrFeed.coverage,
      generateCdataString,
    ),
    'dcterms:created': generateRfc3339Date(itemOrFeed.created),
    'dcterms:creator': generateArrayOrSingular(
      itemOrFeed.creators,
      itemOrFeed.creator,
      generateCdataString,
    ),
    'dcterms:date': generateArrayOrSingular(itemOrFeed.dates, itemOrFeed.date, generateRfc3339Date),
    'dcterms:dateAccepted': generateRfc3339Date(itemOrFeed.dateAccepted),
    'dcterms:dateCopyrighted': generateRfc3339Date(itemOrFeed.dateCopyrighted),
    'dcterms:dateSubmitted': generateRfc3339Date(itemOrFeed.dateSubmitted),
    'dcterms:description': generateArrayOrSingular(
      itemOrFeed.descriptions,
      itemOrFeed.description,
      generateCdataString,
    ),
    'dcterms:educationLevel': generateArrayOrSingular(
      itemOrFeed.educationLevels,
      itemOrFeed.educationLevel,
      generateCdataString,
    ),
    'dcterms:extent': generateArrayOrSingular(
      itemOrFeed.extents,
      itemOrFeed.extent,
      generateCdataString,
    ),
    'dcterms:format': generateArrayOrSingular(
      itemOrFeed.formats,
      itemOrFeed.format,
      generateCdataString,
    ),
    'dcterms:hasFormat': generateArrayOrSingular(
      itemOrFeed.hasFormats,
      itemOrFeed.hasFormat,
      generateCdataString,
    ),
    'dcterms:hasPart': generateArrayOrSingular(
      itemOrFeed.hasParts,
      itemOrFeed.hasPart,
      generateCdataString,
    ),
    'dcterms:hasVersion': generateArrayOrSingular(
      itemOrFeed.hasVersions,
      itemOrFeed.hasVersion,
      generateCdataString,
    ),
    'dcterms:identifier': generateArrayOrSingular(
      itemOrFeed.identifiers,
      itemOrFeed.identifier,
      generateCdataString,
    ),
    'dcterms:instructionalMethod': generateArrayOrSingular(
      itemOrFeed.instructionalMethods,
      itemOrFeed.instructionalMethod,
      generateCdataString,
    ),
    'dcterms:isFormatOf': generateCdataString(itemOrFeed.isFormatOf),
    'dcterms:isPartOf': generateCdataString(itemOrFeed.isPartOf),
    'dcterms:isReferencedBy': generateCdataString(itemOrFeed.isReferencedBy),
    'dcterms:isReplacedBy': generateCdataString(itemOrFeed.isReplacedBy),
    'dcterms:isRequiredBy': generateCdataString(itemOrFeed.isRequiredBy),
    'dcterms:issued': generateRfc3339Date(itemOrFeed.issued),
    'dcterms:isVersionOf': generateCdataString(itemOrFeed.isVersionOf),
    'dcterms:language': generateArrayOrSingular(
      itemOrFeed.languages,
      itemOrFeed.language,
      generateCdataString,
    ),
    'dcterms:license': generateArrayOrSingular(
      itemOrFeed.licenses,
      itemOrFeed.license,
      generateCdataString,
    ),
    'dcterms:mediator': generateArrayOrSingular(
      itemOrFeed.mediators,
      itemOrFeed.mediator,
      generateCdataString,
    ),
    'dcterms:medium': generateArrayOrSingular(
      itemOrFeed.mediums,
      itemOrFeed.medium,
      generateCdataString,
    ),
    'dcterms:modified': generateRfc3339Date(itemOrFeed.modified),
    'dcterms:provenance': generateArrayOrSingular(
      itemOrFeed.provenances,
      itemOrFeed.provenance,
      generateCdataString,
    ),
    'dcterms:publisher': generateArrayOrSingular(
      itemOrFeed.publishers,
      itemOrFeed.publisher,
      generateCdataString,
    ),
    'dcterms:references': generateCdataString(itemOrFeed.references),
    'dcterms:relation': generateArrayOrSingular(
      itemOrFeed.relations,
      itemOrFeed.relation,
      generateCdataString,
    ),
    'dcterms:replaces': generateCdataString(itemOrFeed.replaces),
    'dcterms:requires': generateCdataString(itemOrFeed.requires),
    'dcterms:rights': generateCdataString(itemOrFeed.rights),
    'dcterms:rightsHolder': generateArrayOrSingular(
      itemOrFeed.rightsHolders,
      itemOrFeed.rightsHolder,
      generateCdataString,
    ),
    'dcterms:source': generateArrayOrSingular(
      itemOrFeed.sources,
      itemOrFeed.source,
      generateCdataString,
    ),
    'dcterms:spatial': generateArrayOrSingular(
      itemOrFeed.spatials,
      itemOrFeed.spatial,
      generateCdataString,
    ),
    'dcterms:subject': generateArrayOrSingular(
      itemOrFeed.subjects,
      itemOrFeed.subject,
      generateCdataString,
    ),
    'dcterms:tableOfContents': generateCdataString(itemOrFeed.tableOfContents),
    'dcterms:temporal': generateArrayOrSingular(
      itemOrFeed.temporals,
      itemOrFeed.temporal,
      generateCdataString,
    ),
    'dcterms:title': generateArrayOrSingular(
      itemOrFeed.titles,
      itemOrFeed.title,
      generateCdataString,
    ),
    'dcterms:type': generateArrayOrSingular(itemOrFeed.types, itemOrFeed.type, generateCdataString),
    'dcterms:valid': generateRfc3339Date(itemOrFeed.valid),
  }

  return trimObject(value)
}
