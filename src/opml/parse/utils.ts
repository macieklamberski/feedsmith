import type { DateAny, ParsePartialUtil } from '../../common/types.js'
import {
  isObject,
  isPresent,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../common/utils.js'
import type { Opml, ParseMainOptions } from '../common/types.js'

export const parseOutline: ParsePartialUtil<Opml.Outline<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value)) {
    return
  }

  const outline: Record<string, unknown> = {
    text: parseString(value['@text']),
    type: parseString(value['@type']),
    isComment: parseBoolean(value['@iscomment']),
    isBreakpoint: parseBoolean(value['@isbreakpoint']),
    created: parseDate(value['@created'], options?.parseDateFn),
    category: parseString(value['@category']),
    description: parseString(value['@description']),
    xmlUrl: parseString(value['@xmlurl']),
    htmlUrl: parseString(value['@htmlurl']),
    language: parseString(value['@language']),
    title: parseString(value['@title']),
    version: parseString(value['@version']),
    url: parseString(value['@url']),
    outlines: parseArrayOf(value.outline, (value) => parseOutline(value, options)),
  }

  if (options?.extraOutlineAttributes) {
    for (const attribute of options.extraOutlineAttributes) {
      const attributeKey = `@${attribute.toLowerCase()}`

      if (!isPresent(value[attributeKey])) {
        continue
      }

      outline[attribute] = parseString(value[attributeKey])
    }
  }

  return trimObject(outline) as Opml.Outline<DateAny> | undefined
}

export const parseHead: ParsePartialUtil<Opml.Head<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value)) {
    return
  }

  const head = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    dateCreated: parseSingularOf(value.datecreated, (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    dateModified: parseSingularOf(value.datemodified, (value) =>
      parseDate(retrieveText(value), options?.parseDateFn),
    ),
    ownerName: parseSingularOf(value.ownername, (value) => parseString(retrieveText(value))),
    ownerEmail: parseSingularOf(value.owneremail, (value) => parseString(retrieveText(value))),
    ownerId: parseSingularOf(value.ownerid, (value) => parseString(retrieveText(value))),
    docs: parseSingularOf(value.docs, (value) => parseString(retrieveText(value))),
    expansionState: parseSingularOf(value.expansionstate, (value) =>
      parseCsvOf(retrieveText(value), parseNumber),
    ),
    vertScrollState: parseSingularOf(value.vertscrollstate, (value) =>
      parseNumber(retrieveText(value)),
    ),
    windowTop: parseSingularOf(value.windowtop, (value) => parseNumber(retrieveText(value))),
    windowLeft: parseSingularOf(value.windowleft, (value) => parseNumber(retrieveText(value))),
    windowBottom: parseSingularOf(value.windowbottom, (value) => parseNumber(retrieveText(value))),
    windowRight: parseSingularOf(value.windowright, (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(head)
}

export const parseBody: ParsePartialUtil<Opml.Body<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value)) {
    return
  }

  const body = {
    outlines: parseArrayOf(
      value.outline,
      (value) => parseOutline(value, options),
      options?.maxItems,
    ),
  }

  return trimObject(body)
}

export const parseDocument: ParsePartialUtil<Opml.Document<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isObject(value?.opml)) {
    return
  }

  const opml = {
    head: parseHead(value.opml.head, options),
    body: parseBody(value.opml.body, options),
  }

  return trimObject(opml)
}
