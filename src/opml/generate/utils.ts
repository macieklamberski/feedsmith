import type { GenerateFunction } from '../../common/types.js'
import { generateRfc822Date, isObject, trimArray, trimObject } from '../../common/utils.js'
import type { Body, Head, Opml, Outline } from '../common/types.js'

export const generateOutline: GenerateFunction<Outline> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    '@text': value.text,
    '@type': value.type,
    '@isComment': value.isComment,
    '@isBreakpoint': value.isBreakpoint,
    '@created': value.created,
    '@category': value.category,
    '@description': value.description,
    '@xmlUrl': value.xmlUrl,
    '@htmlUrl': value.htmlUrl,
    '@language': value.language,
    '@title': value.title,
    '@version': value.version,
    '@url': value.url,
    outline: trimArray(value.outlines)?.map(generateOutline),
  })
}

export const generateHead: GenerateFunction<Head<Date>> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    title: value.title,
    dateCreated: generateRfc822Date(value.dateCreated),
    dateModified: generateRfc822Date(value.dateModified),
    ownerName: value.ownerName,
    ownerEmail: value.ownerEmail,
    ownerId: value.ownerId,
    docs: value.docs,
    expansionState: trimArray(value.expansionState)?.join(),
    vertScrollState: value.vertScrollState,
    windowTop: value.windowTop,
    windowLeft: value.windowLeft,
    windowBottom: value.windowBottom,
    windowRight: value.windowRight,
  })
}

export const generateBody: GenerateFunction<Body> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    outline: trimArray(value.outlines)?.map(generateOutline),
  })
}

export const generateOpml: GenerateFunction<Opml<Date>> = (value) => {
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
