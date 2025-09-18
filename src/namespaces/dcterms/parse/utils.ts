import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseDate,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialUtil<ItemOrFeed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    abstract: parseSingularOf(value['dcterms:abstract'], (value) =>
      parseString(retrieveText(value)),
    ),
    accessRights: parseSingularOf(value['dcterms:accessrights'], (value) =>
      parseString(retrieveText(value)),
    ),
    accrualMethod: parseSingularOf(value['dcterms:accrualmethod'], (value) =>
      parseString(retrieveText(value)),
    ),
    accrualPeriodicity: parseSingularOf(value['dcterms:accrualperiodicity'], (value) =>
      parseString(retrieveText(value)),
    ),
    accrualPolicy: parseSingularOf(value['dcterms:accrualpolicy'], (value) =>
      parseString(retrieveText(value)),
    ),
    alternative: parseSingularOf(value['dcterms:alternative'], (value) =>
      parseString(retrieveText(value)),
    ),
    audience: parseSingularOf(value['dcterms:audience'], (value) =>
      parseString(retrieveText(value)),
    ),
    available: parseSingularOf(value['dcterms:available'], (value) =>
      parseDate(retrieveText(value)),
    ),
    bibliographicCitation: parseSingularOf(value['dcterms:bibliographiccitation'], (value) =>
      parseString(retrieveText(value)),
    ),
    conformsTo: parseSingularOf(value['dcterms:conformsto'], (value) =>
      parseString(retrieveText(value)),
    ),
    contributor: parseSingularOf(value['dcterms:contributor'], (value) =>
      parseString(retrieveText(value)),
    ),
    coverage: parseSingularOf(value['dcterms:coverage'], (value) =>
      parseString(retrieveText(value)),
    ),
    created: parseSingularOf(value['dcterms:created'], (value) => parseDate(retrieveText(value))),
    creator: parseSingularOf(value['dcterms:creator'], (value) => parseString(retrieveText(value))),
    date: parseSingularOf(value['dcterms:date'], (value) => parseDate(retrieveText(value))),
    dateAccepted: parseSingularOf(value['dcterms:dateaccepted'], (value) =>
      parseDate(retrieveText(value)),
    ),
    dateCopyrighted: parseSingularOf(value['dcterms:datecopyrighted'], (value) =>
      parseDate(retrieveText(value)),
    ),
    dateSubmitted: parseSingularOf(value['dcterms:datesubmitted'], (value) =>
      parseDate(retrieveText(value)),
    ),
    description: parseSingularOf(value['dcterms:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    educationLevel: parseSingularOf(value['dcterms:educationlevel'], (value) =>
      parseString(retrieveText(value)),
    ),
    extent: parseSingularOf(value['dcterms:extent'], (value) => parseString(retrieveText(value))),
    format: parseSingularOf(value['dcterms:format'], (value) => parseString(retrieveText(value))),
    hasFormat: parseSingularOf(value['dcterms:hasformat'], (value) =>
      parseString(retrieveText(value)),
    ),
    hasPart: parseSingularOf(value['dcterms:haspart'], (value) => parseString(retrieveText(value))),
    hasVersion: parseSingularOf(value['dcterms:hasversion'], (value) =>
      parseString(retrieveText(value)),
    ),
    identifier: parseSingularOf(value['dcterms:identifier'], (value) =>
      parseString(retrieveText(value)),
    ),
    instructionalMethod: parseSingularOf(value['dcterms:instructionalmethod'], (value) =>
      parseString(retrieveText(value)),
    ),
    isFormatOf: parseSingularOf(value['dcterms:isformatof'], (value) =>
      parseString(retrieveText(value)),
    ),
    isPartOf: parseSingularOf(value['dcterms:ispartof'], (value) =>
      parseString(retrieveText(value)),
    ),
    isReferencedBy: parseSingularOf(value['dcterms:isreferencedby'], (value) =>
      parseString(retrieveText(value)),
    ),
    isReplacedBy: parseSingularOf(value['dcterms:isreplacedby'], (value) =>
      parseString(retrieveText(value)),
    ),
    isRequiredBy: parseSingularOf(value['dcterms:isrequiredby'], (value) =>
      parseString(retrieveText(value)),
    ),
    issued: parseSingularOf(value['dcterms:issued'], (value) => parseDate(retrieveText(value))),
    isVersionOf: parseSingularOf(value['dcterms:isversionof'], (value) =>
      parseString(retrieveText(value)),
    ),
    language: parseSingularOf(value['dcterms:language'], (value) =>
      parseString(retrieveText(value)),
    ),
    license: parseSingularOf(value['dcterms:license'], (value) => parseString(retrieveText(value))),
    mediator: parseSingularOf(value['dcterms:mediator'], (value) =>
      parseString(retrieveText(value)),
    ),
    medium: parseSingularOf(value['dcterms:medium'], (value) => parseString(retrieveText(value))),
    modified: parseSingularOf(value['dcterms:modified'], (value) => parseDate(retrieveText(value))),
    provenance: parseSingularOf(value['dcterms:provenance'], (value) =>
      parseString(retrieveText(value)),
    ),
    publisher: parseSingularOf(value['dcterms:publisher'], (value) =>
      parseString(retrieveText(value)),
    ),
    references: parseSingularOf(value['dcterms:references'], (value) =>
      parseString(retrieveText(value)),
    ),
    relation: parseSingularOf(value['dcterms:relation'], (value) =>
      parseString(retrieveText(value)),
    ),
    replaces: parseSingularOf(value['dcterms:replaces'], (value) =>
      parseString(retrieveText(value)),
    ),
    requires: parseSingularOf(value['dcterms:requires'], (value) =>
      parseString(retrieveText(value)),
    ),
    rights: parseSingularOf(value['dcterms:rights'], (value) => parseString(retrieveText(value))),
    rightsHolder: parseSingularOf(value['dcterms:rightsholder'], (value) =>
      parseString(retrieveText(value)),
    ),
    source: parseSingularOf(value['dcterms:source'], (value) => parseString(retrieveText(value))),
    spatial: parseSingularOf(value['dcterms:spatial'], (value) => parseString(retrieveText(value))),
    subject: parseSingularOf(value['dcterms:subject'], (value) => parseString(retrieveText(value))),
    tableOfContents: parseSingularOf(value['dcterms:tableofcontents'], (value) =>
      parseString(retrieveText(value)),
    ),
    temporal: parseSingularOf(value['dcterms:temporal'], (value) =>
      parseString(retrieveText(value)),
    ),
    title: parseSingularOf(value['dcterms:title'], (value) => parseString(retrieveText(value))),
    type: parseSingularOf(value['dcterms:type'], (value) => parseString(retrieveText(value))),
    valid: parseSingularOf(value['dcterms:valid'], (value) => parseDate(retrieveText(value))),
  }

  return trimObject(itemOrFeed)
}
