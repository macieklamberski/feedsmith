import type { DeepPartial, ParseFunction } from '../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseBoolean,
  parseCsvOf,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextNumber,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../common/utils.js'
import type { Body, Head, Opml, Outline } from '../common/types.js'

export const parseOutline: ParseFunction<DeepPartial<Outline>> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
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
  }) as DeepPartial<Outline>
}

export const parseHead: ParseFunction<DeepPartial<Head<string>>> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    title: parseSingularOf(value.title, parseTextString),
    dateCreated: parseSingularOf(value.datecreated, parseTextString),
    dateModified: parseSingularOf(value.datemodified, parseTextString),
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
  }) as DeepPartial<Head<string>>
}

export const parseBody: ParseFunction<DeepPartial<Body>> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    outlines: parseArrayOf(value.outline, parseOutline),
  }) as DeepPartial<Body>
}

export const parseOpml: ParseFunction<DeepPartial<Opml<string>>> = (value) => {
  if (!isObject(value?.opml)) {
    return
  }

  const opml = {
    version: parseString(value.opml['@version']),
    head: parseHead(value.opml.head),
    body: parseBody(value.opml.body),
  }

  if (opml?.body?.outlines?.length) {
    return trimObject(opml) as DeepPartial<Opml<string>>
  }
}
