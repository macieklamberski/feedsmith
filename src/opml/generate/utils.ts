import type { DateLike } from '../../common/types.js'
import {
  generateBoolean,
  generateCdataString,
  generateCsvOf,
  generateNumber,
  generatePlainString,
  generateRfc822Date,
  isObject,
  isPresent,
  trimArray,
  trimObject,
} from '../../common/utils.js'
import type { GenerateUtil, Opml } from '../common/types.js'

export const generateOutline: GenerateUtil<Opml.Outline<DateLike>> = (outline, options) => {
  if (!isObject(outline)) {
    return
  }

  const value: Record<string, unknown> = {
    '@text': generatePlainString(outline.text),
    '@type': generatePlainString(outline.type),
    '@isComment': generateBoolean(outline.isComment),
    '@isBreakpoint': generateBoolean(outline.isBreakpoint),
    '@created': generateRfc822Date(outline.created),
    '@category': generatePlainString(outline.category),
    '@description': generatePlainString(outline.description),
    '@xmlUrl': generatePlainString(outline.xmlUrl),
    '@htmlUrl': generatePlainString(outline.htmlUrl),
    '@language': generatePlainString(outline.language),
    '@title': generatePlainString(outline.title),
    '@version': generatePlainString(outline.version),
    '@url': generatePlainString(outline.url),
    outline: trimArray(outline.outlines, (item) => generateOutline(item, options)),
  }

  if (options?.extraOutlineAttributes) {
    for (const attribute of options.extraOutlineAttributes) {
      const attributeKey = `@${attribute}`

      if (!isPresent(outline[attribute])) {
        continue
      }

      value[attributeKey] = generatePlainString(outline[attribute] as string)
    }
  }

  return trimObject(value)
}

export const generateHead: GenerateUtil<Opml.Head<DateLike>> = (head) => {
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

export const generateBody: GenerateUtil<Opml.Body<DateLike>> = (body, options) => {
  if (!isObject(body)) {
    return
  }

  const value = {
    outline: trimArray(body.outlines, (item) => generateOutline(item, options)),
  }

  return trimObject(value)
}

export const generateDocument: GenerateUtil<Opml.Document<DateLike>> = (opml, options) => {
  if (!isObject(opml)) {
    return
  }

  const value = trimObject({
    '@version': '2.0',
    head: generateHead(opml.head),
    body: generateBody(opml.body, options),
  })

  if (value?.body !== undefined) {
    return { opml: value }
  }
}
