import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseDate,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { DcTermsNs } from '../common/types.js'

export const retrieveItemOrFeed: ParseUtilPartial<
  DcTermsNs.ItemOrFeed<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    abstracts: parseArrayOf(value['dcterms:abstract'], (value) => parseString(retrieveText(value))),
    accessRights: parseArrayOf(value['dcterms:accessrights'], (value) =>
      parseString(retrieveText(value)),
    ),
    accrualMethods: parseArrayOf(value['dcterms:accrualmethod'], (value) =>
      parseString(retrieveText(value)),
    ),
    accrualPeriodicities: parseArrayOf(value['dcterms:accrualperiodicity'], (value) =>
      parseString(retrieveText(value)),
    ),
    accrualPolicies: parseArrayOf(value['dcterms:accrualpolicy'], (value) =>
      parseString(retrieveText(value)),
    ),
    alternatives: parseArrayOf(value['dcterms:alternative'], (value) =>
      parseString(retrieveText(value)),
    ),
    audiences: parseArrayOf(value['dcterms:audience'], (value) => parseString(retrieveText(value))),
    available: parseArrayOf(value['dcterms:available'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    bibliographicCitations: parseArrayOf(value['dcterms:bibliographiccitation'], (value) =>
      parseString(retrieveText(value)),
    ),
    conformsTo: parseArrayOf(value['dcterms:conformsto'], (value) =>
      parseString(retrieveText(value)),
    ),
    contributors: parseArrayOf(value['dcterms:contributor'], (value) =>
      parseString(retrieveText(value)),
    ),
    coverages: parseArrayOf(value['dcterms:coverage'], (value) => parseString(retrieveText(value))),
    created: parseArrayOf(value['dcterms:created'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    creators: parseArrayOf(value['dcterms:creator'], (value) => parseString(retrieveText(value))),
    dateAccepted: parseArrayOf(value['dcterms:dateaccepted'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    dateCopyrighted: parseArrayOf(value['dcterms:datecopyrighted'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    dates: parseArrayOf(value['dcterms:date'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    dateSubmitted: parseArrayOf(value['dcterms:datesubmitted'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    descriptions: parseArrayOf(value['dcterms:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    educationLevels: parseArrayOf(value['dcterms:educationlevel'], (value) =>
      parseString(retrieveText(value)),
    ),
    extents: parseArrayOf(value['dcterms:extent'], (value) => parseString(retrieveText(value))),
    formats: parseArrayOf(value['dcterms:format'], (value) => parseString(retrieveText(value))),
    hasFormats: parseArrayOf(value['dcterms:hasformat'], (value) =>
      parseString(retrieveText(value)),
    ),
    hasParts: parseArrayOf(value['dcterms:haspart'], (value) => parseString(retrieveText(value))),
    hasVersions: parseArrayOf(value['dcterms:hasversion'], (value) =>
      parseString(retrieveText(value)),
    ),
    identifiers: parseArrayOf(value['dcterms:identifier'], (value) =>
      parseString(retrieveText(value)),
    ),
    instructionalMethods: parseArrayOf(value['dcterms:instructionalmethod'], (value) =>
      parseString(retrieveText(value)),
    ),
    isFormatOf: parseArrayOf(value['dcterms:isformatof'], (value) =>
      parseString(retrieveText(value)),
    ),
    isPartOf: parseArrayOf(value['dcterms:ispartof'], (value) => parseString(retrieveText(value))),
    isReferencedBy: parseArrayOf(value['dcterms:isreferencedby'], (value) =>
      parseString(retrieveText(value)),
    ),
    isReplacedBy: parseArrayOf(value['dcterms:isreplacedby'], (value) =>
      parseString(retrieveText(value)),
    ),
    isRequiredBy: parseArrayOf(value['dcterms:isrequiredby'], (value) =>
      parseString(retrieveText(value)),
    ),
    issued: parseArrayOf(value['dcterms:issued'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    isVersionOf: parseArrayOf(value['dcterms:isversionof'], (value) =>
      parseString(retrieveText(value)),
    ),
    languages: parseArrayOf(value['dcterms:language'], (value) => parseString(retrieveText(value))),
    licenses: parseArrayOf(value['dcterms:license'], (value) => parseString(retrieveText(value))),
    mediators: parseArrayOf(value['dcterms:mediator'], (value) => parseString(retrieveText(value))),
    mediums: parseArrayOf(value['dcterms:medium'], (value) => parseString(retrieveText(value))),
    modified: parseArrayOf(value['dcterms:modified'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    provenances: parseArrayOf(value['dcterms:provenance'], (value) =>
      parseString(retrieveText(value)),
    ),
    publishers: parseArrayOf(value['dcterms:publisher'], (value) =>
      parseString(retrieveText(value)),
    ),
    references: parseArrayOf(value['dcterms:references'], (value) =>
      parseString(retrieveText(value)),
    ),
    relations: parseArrayOf(value['dcterms:relation'], (value) => parseString(retrieveText(value))),
    replaces: parseArrayOf(value['dcterms:replaces'], (value) => parseString(retrieveText(value))),
    requires: parseArrayOf(value['dcterms:requires'], (value) => parseString(retrieveText(value))),
    rights: parseArrayOf(value['dcterms:rights'], (value) => parseString(retrieveText(value))),
    rightsHolders: parseArrayOf(value['dcterms:rightsholder'], (value) =>
      parseString(retrieveText(value)),
    ),
    sources: parseArrayOf(value['dcterms:source'], (value) => parseString(retrieveText(value))),
    spatials: parseArrayOf(value['dcterms:spatial'], (value) => parseString(retrieveText(value))),
    subjects: parseArrayOf(value['dcterms:subject'], (value) => parseString(retrieveText(value))),
    tableOfContents: parseArrayOf(value['dcterms:tableofcontents'], (value) =>
      parseString(retrieveText(value)),
    ),
    temporals: parseArrayOf(value['dcterms:temporal'], (value) => parseString(retrieveText(value))),
    titles: parseArrayOf(value['dcterms:title'], (value) => parseString(retrieveText(value))),
    types: parseArrayOf(value['dcterms:type'], (value) => parseString(retrieveText(value))),
    valid: parseArrayOf(value['dcterms:valid'], (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
  }

  return trimObject(itemOrFeed)
}
