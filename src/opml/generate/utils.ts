import type { GenerateFunction } from '../../common/types.js'
import {
  generateCsvOf,
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
    '@text': outline.text,
    '@type': outline.type,
    '@isComment': outline.isComment,
    '@isBreakpoint': outline.isBreakpoint,
    '@created': outline.created,
    '@category': outline.category,
    '@description': outline.description,
    '@xmlUrl': outline.xmlUrl,
    '@htmlUrl': outline.htmlUrl,
    '@language': outline.language,
    '@title': outline.title,
    '@version': outline.version,
    '@url': outline.url,
    outline: trimArray(outline.outlines, generateOutline),
  }

  return trimObject(value)
}

export const generateHead: GenerateFunction<Head<Date>> = (head) => {
  if (!isObject(head)) {
    return
  }

  const value = {
    title: head.title,
    dateCreated: generateRfc822Date(head.dateCreated),
    dateModified: generateRfc822Date(head.dateModified),
    ownerName: head.ownerName,
    ownerEmail: head.ownerEmail,
    ownerId: head.ownerId,
    docs: head.docs,
    expansionState: generateCsvOf(head.expansionState),
    vertScrollState: head.vertScrollState,
    windowTop: head.windowTop,
    windowLeft: head.windowLeft,
    windowBottom: head.windowBottom,
    windowRight: head.windowRight,
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
