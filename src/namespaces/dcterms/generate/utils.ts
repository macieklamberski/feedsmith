import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateArrayOrSingular,
  generateCdataString,
  generateRfc3339Date,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { DctermsNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<DctermsNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'dcterms:abstract': generateArrayOrSingular(
      itemOrFeed.abstracts,
      itemOrFeed.abstract,
      generateCdataString,
    ),
    'dcterms:accessRights': generateArrayOrSingular(
      itemOrFeed.accessRights,
      undefined,
      generateCdataString,
    ),
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
    'dcterms:available': generateArrayOrSingular(
      itemOrFeed.availables,
      itemOrFeed.available,
      generateRfc3339Date,
    ),
    'dcterms:bibliographicCitation': generateArrayOrSingular(
      itemOrFeed.bibliographicCitations,
      itemOrFeed.bibliographicCitation,
      generateCdataString,
    ),
    'dcterms:conformsTo': generateArrayOrSingular(
      itemOrFeed.conformsTos,
      itemOrFeed.conformsTo,
      generateCdataString,
    ),
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
    'dcterms:created': generateArrayOrSingular(
      itemOrFeed.createds,
      itemOrFeed.created,
      generateRfc3339Date,
    ),
    'dcterms:creator': generateArrayOrSingular(
      itemOrFeed.creators,
      itemOrFeed.creator,
      generateCdataString,
    ),
    'dcterms:date': generateArrayOrSingular(itemOrFeed.dates, itemOrFeed.date, generateRfc3339Date),
    'dcterms:dateAccepted': generateArrayOrSingular(
      itemOrFeed.dateAccepteds,
      itemOrFeed.dateAccepted,
      generateRfc3339Date,
    ),
    'dcterms:dateCopyrighted': generateArrayOrSingular(
      itemOrFeed.dateCopyrighteds,
      itemOrFeed.dateCopyrighted,
      generateRfc3339Date,
    ),
    'dcterms:dateSubmitted': generateArrayOrSingular(
      itemOrFeed.dateSubmitteds,
      itemOrFeed.dateSubmitted,
      generateRfc3339Date,
    ),
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
    'dcterms:isFormatOf': generateArrayOrSingular(
      itemOrFeed.isFormatOfs,
      itemOrFeed.isFormatOf,
      generateCdataString,
    ),
    'dcterms:isPartOf': generateArrayOrSingular(
      itemOrFeed.isPartOfs,
      itemOrFeed.isPartOf,
      generateCdataString,
    ),
    'dcterms:isReferencedBy': generateArrayOrSingular(
      itemOrFeed.isReferencedBys,
      itemOrFeed.isReferencedBy,
      generateCdataString,
    ),
    'dcterms:isReplacedBy': generateArrayOrSingular(
      itemOrFeed.isReplacedBys,
      itemOrFeed.isReplacedBy,
      generateCdataString,
    ),
    'dcterms:isRequiredBy': generateArrayOrSingular(
      itemOrFeed.isRequiredBys,
      itemOrFeed.isRequiredBy,
      generateCdataString,
    ),
    'dcterms:issued': generateArrayOrSingular(
      itemOrFeed.issueds,
      itemOrFeed.issued,
      generateRfc3339Date,
    ),
    'dcterms:isVersionOf': generateArrayOrSingular(
      itemOrFeed.isVersionOfs,
      itemOrFeed.isVersionOf,
      generateCdataString,
    ),
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
    'dcterms:modified': generateArrayOrSingular(
      itemOrFeed.modifieds,
      itemOrFeed.modified,
      generateRfc3339Date,
    ),
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
    'dcterms:references': generateArrayOrSingular(
      itemOrFeed.references,
      undefined,
      generateCdataString,
    ),
    'dcterms:relation': generateArrayOrSingular(
      itemOrFeed.relations,
      itemOrFeed.relation,
      generateCdataString,
    ),
    'dcterms:replaces': generateArrayOrSingular(
      itemOrFeed.replaces,
      undefined,
      generateCdataString,
    ),
    'dcterms:requires': generateArrayOrSingular(
      itemOrFeed.requires,
      undefined,
      generateCdataString,
    ),
    'dcterms:rights': generateArrayOrSingular(itemOrFeed.rights, undefined, generateCdataString),
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
    'dcterms:tableOfContents': generateArrayOrSingular(
      itemOrFeed.tableOfContents,
      undefined,
      generateCdataString,
    ),
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
    'dcterms:valid': generateArrayOrSingular(
      itemOrFeed.valids,
      itemOrFeed.valid,
      generateRfc3339Date,
    ),
  }

  return trimObject(value)
}
