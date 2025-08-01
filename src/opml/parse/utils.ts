import type { ParsePartialFunction } from '@/common/types.js'
import {
  isObject,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '@/common/utils.js'
import type { Body, Head, Opml, Outline } from '@/opml/common/types.js'

export const parseOutline: ParsePartialFunction<Outline<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const outline = {
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
    outlines: parseArrayOf(value.outline, parseOutline),
  }

  return trimObject(outline)
}

export const parseHead: ParsePartialFunction<Head<string>> = (value) => {
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

export const parseBody: ParsePartialFunction<Body<string>> = (value) => {
  if (!isObject(value)) {
    return
  }

  const body = {
    outlines: parseArrayOf(value.outline, parseOutline),
  }

  return trimObject(body)
}

export const parseOpml: ParsePartialFunction<Opml<string>> = (value) => {
  if (!isObject(value?.opml)) {
    return
  }

  const opml = {
    head: parseHead(value.opml.head),
    body: parseBody(value.opml.body),
  }

  return trimObject(opml)
}
