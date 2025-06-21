import type { ParsePartialFunction } from '../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextDate,
  parseTextNumber,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../common/utils.js'
import type { Body, Head, Opml, Outline } from '../common/types.js'

export const parseOutline: ParsePartialFunction<Outline> = (value) => {
  if (!isObject(value)) {
    return
  }

  const outline = {
    text: parseString(value['@text']),
    type: parseString(value['@type']),
    isComment: parseBoolean(value['@iscomment']),
    isBreakpoint: parseBoolean(value['@isbreakpoint']),
    created: parseString(value['@created']),
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
    title: parseSingularOf(value.title, parseTextString),
    dateCreated: parseSingularOf(value.datecreated, parseTextDate),
    dateModified: parseSingularOf(value.datemodified, parseTextDate),
    ownerName: parseSingularOf(value.ownername, parseTextString),
    ownerEmail: parseSingularOf(value.owneremail, parseTextString),
    ownerId: parseSingularOf(value.ownerid, parseTextString),
    docs: parseSingularOf(value.docs, parseTextString),
    expansionState: parseSingularOf(value.expansionstate, (value) =>
      parseCsvOf(retrieveText(value), parseNumber),
    ),
    vertScrollState: parseSingularOf(value.vertscrollstate, parseTextNumber),
    windowTop: parseSingularOf(value.windowtop, parseTextNumber),
    windowLeft: parseSingularOf(value.windowleft, parseTextNumber),
    windowBottom: parseSingularOf(value.windowbottom, parseTextNumber),
    windowRight: parseSingularOf(value.windowright, parseTextNumber),
  }

  return trimObject(head)
}

export const parseBody: ParsePartialFunction<Body> = (value) => {
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
