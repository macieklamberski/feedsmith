import type { GenerateFunction } from '../../common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateCsvOf,
  generateNumber,
  generatePlainString,
  generateRfc822Date,
  isObject,
  trimArray,
  trimObject,
} from '../../common/utils.js'
import type { Body, Head, Opml, Outline } from '../common/types.js'

export const generateOutline: GenerateFunction<Outline> = (outline) => {
  if (!isObject(outline)) {
    return
  }

  const value = {
    '@text': generatePlainString(outline.text),
    '@type': generatePlainString(outline.type),
    '@isComment': generateBoolean(outline.isComment),
    '@isBreakpoint': generateBoolean(outline.isBreakpoint),
    '@created': generatePlainString(outline.created),
    '@category': generatePlainString(outline.category),
    '@description': generatePlainString(outline.description),
    '@xmlUrl': generatePlainString(outline.xmlUrl),
    '@htmlUrl': generatePlainString(outline.htmlUrl),
    '@language': generatePlainString(outline.language),
    '@title': generatePlainString(outline.title),
    '@version': generatePlainString(outline.version),
    '@url': generatePlainString(outline.url),
    outline: trimArray(outline.outlines, generateOutline),
  }

  return trimObject(value)
}

export const generateHead: GenerateFunction<Head<Date>> = (head) => {
  if (!isObject(head)) {
    return
  }

  const value = {
    title: generateCdataString(head.title),
    dateCreated: generateRfc822Date(head.dateCreated),
    dateModified: generateRfc822Date(head.dateModified),
    ownerName: generateCdataString(head.ownerName),
    ownerEmail: generateCdataString(head.ownerEmail),
    ownerId: generateCdataString(head.ownerId),
    docs: generateCdataString(head.docs),
    expansionState: generateCsvOf(head.expansionState, generateNumber),
    vertScrollState: generateNumber(head.vertScrollState),
    windowTop: generateNumber(head.windowTop),
    windowLeft: generateNumber(head.windowLeft),
    windowBottom: generateNumber(head.windowBottom),
    windowRight: generateNumber(head.windowRight),
  }

  return trimObject(value)
}

export const generateBody: GenerateFunction<Body> = (body) => {
  if (!isObject(body)) {
    return
  }

  const value = {
    outline: trimArray(body.outlines, generateOutline),
  }

  return trimObject(value)
}

export const generateOpml: GenerateFunction<Opml<Date>> = (opml) => {
  if (!isObject(opml)) {
    return
  }

  const value = trimObject({
    '@version': '2.0',
    head: generateHead(opml.head),
    body: generateBody(opml.body),
  })

  if (value?.body !== undefined) {
    return { opml: value }
  }
}
