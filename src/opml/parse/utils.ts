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
import type { Body, Head, Opml, Outline, ParsePartialUtil } from '../common/types.js'

export const parseOutline: ParsePartialUtil<Outline<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const outline: Record<string, unknown> = {
    text: parseString(value['@text']),
    type: parseString(value['@type']),
    isComment: parseBoolean(value['@iscomment']),
    isBreakpoint: parseBoolean(value['@isbreakpoint']),
    created: parseDate(value['@created']),
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

  return trimObject(outline)
}

export const parseHead: ParsePartialUtil<Head<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const head = {
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    dateCreated: parseSingularOf(value.datecreated, (value) => parseDate(retrieveText(value))),
    dateModified: parseSingularOf(value.datemodified, (value) => parseDate(retrieveText(value))),
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

export const parseBody: ParsePartialUtil<Body<string>> = (value, options) => {
  if (!isObject(value)) {
    return
  }

  const body = {
    outlines: parseArrayOf(value.outline, (value) => parseOutline(value, options)),
  }

  return trimObject(body)
}

export const parseOpml: ParsePartialUtil<Opml<string>> = (value, options) => {
  if (!isObject(value?.opml)) {
    return
  }

  const opml = {
    head: parseHead(value.opml.head),
    body: parseBody(value.opml.body, options),
  }

  return trimObject(opml)
}
