import type { Unreliable } from '../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
  trimObject,
} from '../../common/utils.js'

export const generateRfc822Date = (value: Unreliable) => {
  if (typeof value === 'string') {
    // biome-ignore lint/style/noParameterAssign: No explanation.
    value = new Date(value)
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toUTCString()
  }
}

// biome-ignore lint/suspicious/noExplicitAny: No explanation.
export const generateOutline = (value: Unreliable): any => {
  if (!isObject(value)) {
    return
  }

  const outline = {
    '@text': parseString(value.text),
    '@type': parseString(value.type),
    '@isComment': parseBoolean(value.isComment),
    '@isBreakpoint': parseBoolean(value.isBreakpoint),
    '@created': parseString(value.created),
    '@category': parseString(value.category),
    '@description': parseString(value.description),
    '@xmlUrl': parseString(value.xmlUrl),
    '@htmlUrl': parseString(value.htmlUrl),
    '@language': parseString(value.language),
    '@title': parseString(value.title),
    '@version': parseString(value.version),
    '@url': parseString(value.url),
    outline: parseArrayOf(value.outlines, generateOutline),
  }

  if (outline['@text'] !== undefined) {
    return trimObject(outline)
  }
}

export const generateHead = (value: Unreliable) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    title: parseString(value.title),
    dateCreated: generateRfc822Date(value.dateCreated),
    dateModified: generateRfc822Date(value.dateModified),
    ownerName: parseString(value.ownerName),
    ownerEmail: parseString(value.ownerEmail),
    ownerId: parseString(value.ownerId),
    docs: parseString(value.docs),
    expansionState: parseArrayOf(value.expansionState, parseNumber)?.join(),
    vertScrollState: parseNumber(value.vertScrollState),
    windowTop: parseNumber(value.windowTop),
    windowLeft: parseNumber(value.windowLeft),
    windowBottom: parseNumber(value.windowBottom),
    windowRight: parseNumber(value.windowRight),
  })
}

export const generateBody = (value: Unreliable) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    outline: parseArrayOf(value.outlines, generateOutline),
  })
}

export const generateOpml = (value: Unreliable) => {
  if (!isObject(value)) {
    return
  }

  const opml = trimObject({
    '@version': '2.0',
    head: generateHead(value.head),
    body: generateBody(value.body),
  })

  if (opml?.body !== undefined) {
    return { opml }
  }
}
