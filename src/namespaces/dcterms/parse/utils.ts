import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseTextDate,
  parseTextString,
  trimObject,
} from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialFunction<ItemOrFeed<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    abstract: parseSingularOf(value['dcterms:abstract'], parseTextString),
    accessRights: parseSingularOf(value['dcterms:accessrights'], parseTextString),
    accrualMethod: parseSingularOf(value['dcterms:accrualmethod'], parseTextString),
    accrualPeriodicity: parseSingularOf(value['dcterms:accrualperiodicity'], parseTextString),
    accrualPolicy: parseSingularOf(value['dcterms:accrualpolicy'], parseTextString),
    alternative: parseSingularOf(value['dcterms:alternative'], parseTextString),
    audience: parseSingularOf(value['dcterms:audience'], parseTextString),
    available: parseSingularOf(value['dcterms:available'], parseTextDate),
    bibliographicCitation: parseSingularOf(value['dcterms:bibliographiccitation'], parseTextString),
    conformsTo: parseSingularOf(value['dcterms:conformsto'], parseTextString),
    contributor: parseSingularOf(value['dcterms:contributor'], parseTextString),
    coverage: parseSingularOf(value['dcterms:coverage'], parseTextString),
    created: parseSingularOf(value['dcterms:created'], parseTextDate),
    creator: parseSingularOf(value['dcterms:creator'], parseTextString),
    date: parseSingularOf(value['dcterms:date'], parseTextDate),
    dateAccepted: parseSingularOf(value['dcterms:dateaccepted'], parseTextDate),
    dateCopyrighted: parseSingularOf(value['dcterms:datecopyrighted'], parseTextDate),
    dateSubmitted: parseSingularOf(value['dcterms:datesubmitted'], parseTextDate),
    description: parseSingularOf(value['dcterms:description'], parseTextString),
    educationLevel: parseSingularOf(value['dcterms:educationlevel'], parseTextString),
    extent: parseSingularOf(value['dcterms:extent'], parseTextString),
    format: parseSingularOf(value['dcterms:format'], parseTextString),
    hasFormat: parseSingularOf(value['dcterms:hasformat'], parseTextString),
    hasPart: parseSingularOf(value['dcterms:haspart'], parseTextString),
    hasVersion: parseSingularOf(value['dcterms:hasversion'], parseTextString),
    identifier: parseSingularOf(value['dcterms:identifier'], parseTextString),
    instructionalMethod: parseSingularOf(value['dcterms:instructionalmethod'], parseTextString),
    isFormatOf: parseSingularOf(value['dcterms:isformatof'], parseTextString),
    isPartOf: parseSingularOf(value['dcterms:ispartof'], parseTextString),
    isReferencedBy: parseSingularOf(value['dcterms:isreferencedby'], parseTextString),
    isReplacedBy: parseSingularOf(value['dcterms:isreplacedby'], parseTextString),
    isRequiredBy: parseSingularOf(value['dcterms:isrequiredby'], parseTextString),
    issued: parseSingularOf(value['dcterms:issued'], parseTextDate),
    isVersionOf: parseSingularOf(value['dcterms:isversionof'], parseTextString),
    language: parseSingularOf(value['dcterms:language'], parseTextString),
    license: parseSingularOf(value['dcterms:license'], parseTextString),
    mediator: parseSingularOf(value['dcterms:mediator'], parseTextString),
    medium: parseSingularOf(value['dcterms:medium'], parseTextString),
    modified: parseSingularOf(value['dcterms:modified'], parseTextDate),
    provenance: parseSingularOf(value['dcterms:provenance'], parseTextString),
    publisher: parseSingularOf(value['dcterms:publisher'], parseTextString),
    references: parseSingularOf(value['dcterms:references'], parseTextString),
    relation: parseSingularOf(value['dcterms:relation'], parseTextString),
    replaces: parseSingularOf(value['dcterms:replaces'], parseTextString),
    requires: parseSingularOf(value['dcterms:requires'], parseTextString),
    rights: parseSingularOf(value['dcterms:rights'], parseTextString),
    rightsHolder: parseSingularOf(value['dcterms:rightsholder'], parseTextString),
    source: parseSingularOf(value['dcterms:source'], parseTextString),
    spatial: parseSingularOf(value['dcterms:spatial'], parseTextString),
    subject: parseSingularOf(value['dcterms:subject'], parseTextString),
    tableOfContents: parseSingularOf(value['dcterms:tableofcontents'], parseTextString),
    temporal: parseSingularOf(value['dcterms:temporal'], parseTextString),
    title: parseSingularOf(value['dcterms:title'], parseTextString),
    type: parseSingularOf(value['dcterms:type'], parseTextString),
    valid: parseSingularOf(value['dcterms:valid'], parseTextDate),
  }

  return trimObject(itemOrFeed)
}
