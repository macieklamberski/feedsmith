import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateRfc3339Date,
  isObject,
  isPresent,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { DctermsNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<DctermsNs.ItemOrFeed<DateLike>> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  // TODO: Remove this once deprecated singular fields are removed in next major version.
  const generateArray = <V>(
    pluralValues: Array<V> | undefined,
    singularValue: V | undefined,
    generator: (value: V) => unknown,
  ) => {
    if (isPresent(pluralValues)) {
      return trimArray(pluralValues.map(generator))
    }

    if (isPresent(singularValue)) {
      return generator(singularValue)
    }
  }

  const value = {
    'dcterms:abstract': generateArray(
      itemOrFeed.abstracts,
      itemOrFeed.abstract,
      generateCdataString,
    ),
    'dcterms:accessRights': generateArray(itemOrFeed.accessRights, undefined, generateCdataString),
    'dcterms:accrualMethod': generateArray(
      itemOrFeed.accrualMethods,
      itemOrFeed.accrualMethod,
      generateCdataString,
    ),
    'dcterms:accrualPeriodicity': generateArray(
      itemOrFeed.accrualPeriodicities,
      itemOrFeed.accrualPeriodicity,
      generateCdataString,
    ),
    'dcterms:accrualPolicy': generateArray(
      itemOrFeed.accrualPolicies,
      itemOrFeed.accrualPolicy,
      generateCdataString,
    ),
    'dcterms:alternative': generateArray(
      itemOrFeed.alternatives,
      itemOrFeed.alternative,
      generateCdataString,
    ),
    'dcterms:audience': generateArray(
      itemOrFeed.audiences,
      itemOrFeed.audience,
      generateCdataString,
    ),
    'dcterms:available': generateArray(
      itemOrFeed.availables,
      itemOrFeed.available,
      generateRfc3339Date,
    ),
    'dcterms:bibliographicCitation': generateArray(
      itemOrFeed.bibliographicCitations,
      itemOrFeed.bibliographicCitation,
      generateCdataString,
    ),
    'dcterms:conformsTo': generateArray(
      itemOrFeed.conformsTos,
      itemOrFeed.conformsTo,
      generateCdataString,
    ),
    'dcterms:contributor': generateArray(
      itemOrFeed.contributors,
      itemOrFeed.contributor,
      generateCdataString,
    ),
    'dcterms:coverage': generateArray(
      itemOrFeed.coverages,
      itemOrFeed.coverage,
      generateCdataString,
    ),
    'dcterms:created': generateArray(itemOrFeed.createds, itemOrFeed.created, generateRfc3339Date),
    'dcterms:creator': generateArray(itemOrFeed.creators, itemOrFeed.creator, generateCdataString),
    'dcterms:date': generateArray(itemOrFeed.dates, itemOrFeed.date, generateRfc3339Date),
    'dcterms:dateAccepted': generateArray(
      itemOrFeed.dateAccepteds,
      itemOrFeed.dateAccepted,
      generateRfc3339Date,
    ),
    'dcterms:dateCopyrighted': generateArray(
      itemOrFeed.dateCopyrighteds,
      itemOrFeed.dateCopyrighted,
      generateRfc3339Date,
    ),
    'dcterms:dateSubmitted': generateArray(
      itemOrFeed.dateSubmitteds,
      itemOrFeed.dateSubmitted,
      generateRfc3339Date,
    ),
    'dcterms:description': generateArray(
      itemOrFeed.descriptions,
      itemOrFeed.description,
      generateCdataString,
    ),
    'dcterms:educationLevel': generateArray(
      itemOrFeed.educationLevels,
      itemOrFeed.educationLevel,
      generateCdataString,
    ),
    'dcterms:extent': generateArray(itemOrFeed.extents, itemOrFeed.extent, generateCdataString),
    'dcterms:format': generateArray(itemOrFeed.formats, itemOrFeed.format, generateCdataString),
    'dcterms:hasFormat': generateArray(
      itemOrFeed.hasFormats,
      itemOrFeed.hasFormat,
      generateCdataString,
    ),
    'dcterms:hasPart': generateArray(itemOrFeed.hasParts, itemOrFeed.hasPart, generateCdataString),
    'dcterms:hasVersion': generateArray(
      itemOrFeed.hasVersions,
      itemOrFeed.hasVersion,
      generateCdataString,
    ),
    'dcterms:identifier': generateArray(
      itemOrFeed.identifiers,
      itemOrFeed.identifier,
      generateCdataString,
    ),
    'dcterms:instructionalMethod': generateArray(
      itemOrFeed.instructionalMethods,
      itemOrFeed.instructionalMethod,
      generateCdataString,
    ),
    'dcterms:isFormatOf': generateArray(
      itemOrFeed.isFormatOfs,
      itemOrFeed.isFormatOf,
      generateCdataString,
    ),
    'dcterms:isPartOf': generateArray(
      itemOrFeed.isPartOfs,
      itemOrFeed.isPartOf,
      generateCdataString,
    ),
    'dcterms:isReferencedBy': generateArray(
      itemOrFeed.isReferencedBys,
      itemOrFeed.isReferencedBy,
      generateCdataString,
    ),
    'dcterms:isReplacedBy': generateArray(
      itemOrFeed.isReplacedBys,
      itemOrFeed.isReplacedBy,
      generateCdataString,
    ),
    'dcterms:isRequiredBy': generateArray(
      itemOrFeed.isRequiredBys,
      itemOrFeed.isRequiredBy,
      generateCdataString,
    ),
    'dcterms:issued': generateArray(itemOrFeed.issueds, itemOrFeed.issued, generateRfc3339Date),
    'dcterms:isVersionOf': generateArray(
      itemOrFeed.isVersionOfs,
      itemOrFeed.isVersionOf,
      generateCdataString,
    ),
    'dcterms:language': generateArray(
      itemOrFeed.languages,
      itemOrFeed.language,
      generateCdataString,
    ),
    'dcterms:license': generateArray(itemOrFeed.licenses, itemOrFeed.license, generateCdataString),
    'dcterms:mediator': generateArray(
      itemOrFeed.mediators,
      itemOrFeed.mediator,
      generateCdataString,
    ),
    'dcterms:medium': generateArray(itemOrFeed.mediums, itemOrFeed.medium, generateCdataString),
    'dcterms:modified': generateArray(
      itemOrFeed.modifieds,
      itemOrFeed.modified,
      generateRfc3339Date,
    ),
    'dcterms:provenance': generateArray(
      itemOrFeed.provenances,
      itemOrFeed.provenance,
      generateCdataString,
    ),
    'dcterms:publisher': generateArray(
      itemOrFeed.publishers,
      itemOrFeed.publisher,
      generateCdataString,
    ),
    'dcterms:references': generateArray(itemOrFeed.references, undefined, generateCdataString),
    'dcterms:relation': generateArray(
      itemOrFeed.relations,
      itemOrFeed.relation,
      generateCdataString,
    ),
    'dcterms:replaces': generateArray(itemOrFeed.replaces, undefined, generateCdataString),
    'dcterms:requires': generateArray(itemOrFeed.requires, undefined, generateCdataString),
    'dcterms:rights': generateArray(itemOrFeed.rights, undefined, generateCdataString),
    'dcterms:rightsHolder': generateArray(
      itemOrFeed.rightsHolders,
      itemOrFeed.rightsHolder,
      generateCdataString,
    ),
    'dcterms:source': generateArray(itemOrFeed.sources, itemOrFeed.source, generateCdataString),
    'dcterms:spatial': generateArray(itemOrFeed.spatials, itemOrFeed.spatial, generateCdataString),
    'dcterms:subject': generateArray(itemOrFeed.subjects, itemOrFeed.subject, generateCdataString),
    'dcterms:tableOfContents': generateArray(
      itemOrFeed.tableOfContents,
      undefined,
      generateCdataString,
    ),
    'dcterms:temporal': generateArray(
      itemOrFeed.temporals,
      itemOrFeed.temporal,
      generateCdataString,
    ),
    'dcterms:title': generateArray(itemOrFeed.titles, itemOrFeed.title, generateCdataString),
    'dcterms:type': generateArray(itemOrFeed.types, itemOrFeed.type, generateCdataString),
    'dcterms:valid': generateArray(itemOrFeed.valids, itemOrFeed.valid, generateRfc3339Date),
  }

  return trimObject(value)
}
