import { decodeHTML, decodeXML } from 'entities'
import type { XMLBuilder } from 'fast-xml-parser'
import type {
  AnyOf,
  GenerateFunction,
  ParseExactFunction,
  Unreliable,
  XmlGenerateOptions,
  XmlStylesheet,
} from './types.js'

export const isPresent = <T>(value: T): value is NonNullable<T> => {
  return value != null
}

export const isObject = (value: Unreliable): value is Record<string, Unreliable> => {
  return (
    isPresent(value) &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value.constructor === Object
  )
}

const whitespaceOnlyRegex = /^\p{White_Space}*$/u

export const isNonEmptyString = (value: Unreliable): value is string => {
  return typeof value === 'string' && value !== '' && !whitespaceOnlyRegex.test(value)
}

export const isNonEmptyStringOrNumber = (value: Unreliable): value is string | number => {
  return typeof value === 'number' || isNonEmptyString(value)
}

export const retrieveText = (value: Unreliable): Unreliable => {
  return value?.['#text'] ?? value
}

export const trimObject = <T extends Record<string, unknown>>(object: T): AnyOf<T> | undefined => {
  let result: Partial<T> | undefined

  for (const key in object) {
    const value = object[key]

    if (isPresent(value)) {
      if (!result) {
        result = {}
      }

      result[key] = value
    }
  }

  return result as AnyOf<T> | undefined
}

export const trimArray = <T, R = T>(
  value: Array<T> | undefined,
  parse?: ParseExactFunction<R>,
): Array<R> | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return
  }

  // Do not re-create the array if it all elements are present and no parsing is required.
  if (!parse) {
    let needsTrimming = false

    for (let i = 0; i < value.length; i++) {
      if (!isPresent(value[i])) {
        needsTrimming = true
        break
      }
    }

    if (!needsTrimming) {
      return value as unknown as Array<R>
    }
  }

  // Pre-allocation in case of Array is more performant than doing the lazy-allocation
  // similar to the one used in trimObject.
  const result: Array<R> = []

  for (let i = 0; i < value.length; i++) {
    const item = parse ? parse(value[i]) : value[i]

    if (isPresent(item)) {
      result.push(item as R)
    }
  }

  return result.length > 0 ? result : undefined
}

const cdataStartTag = '<![CDATA['
const cdataEndTag = ']]>'
const cdataRegex = /<!\[CDATA\[([\s\S]*?)\]\]>/g

export const stripCdata = (text: Unreliable) => {
  if (typeof text !== 'string') {
    return text
  }

  if (text.indexOf('[CDATA[') === -1) {
    return text
  }

  // For simple cases with only one CDATA section (common case).
  const startPos = text.indexOf(cdataStartTag)

  // If we have just one simple CDATA section, handle it without regex.
  if (startPos !== -1) {
    const endPos = text.indexOf(cdataEndTag, startPos + cdataStartTag.length)
    if (endPos !== -1 && text.indexOf(cdataStartTag, startPos + cdataStartTag.length) === -1) {
      // Single CDATA section case - avoid regex.
      return (
        text.substring(0, startPos) +
        text.substring(startPos + cdataStartTag.length, endPos) +
        text.substring(endPos + cdataEndTag.length)
      )
    }
  }

  // Fall back to regex for complex cases with multiple CDATA sections.
  // Reset lastIndex before use since the regex has global flag.
  cdataRegex.lastIndex = 0
  return text.replace(cdataRegex, '$1')
}

export const hasEntities = (text: string) => {
  const ampIndex = text.indexOf('&')
  return ampIndex !== -1 && text.indexOf(';', ampIndex) !== -1
}

export const parseString: ParseExactFunction<string> = (value) => {
  if (typeof value === 'string') {
    let string = stripCdata(value).trim()

    if (hasEntities(string)) {
      string = decodeXML(string)

      if (hasEntities(string)) {
        string = decodeHTML(string)
      }
    }

    return string || undefined
  }

  if (typeof value === 'number') {
    return value.toString()
  }
}

export const parseNumber: ParseExactFunction<number> = (value) => {
  if (typeof value === 'number') {
    return value
  }

  if (isNonEmptyString(value)) {
    const numeric = +value

    return Number.isNaN(numeric) ? undefined : numeric
  }
}

const trueRegex = /^\p{White_Space}*true\p{White_Space}*$/iu
const falseRegex = /^\p{White_Space}*false\p{White_Space}*$/iu
const yesRegex = /^\p{White_Space}*yes\p{White_Space}*$/iu

export const parseBoolean: ParseExactFunction<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (isNonEmptyString(value)) {
    if (trueRegex.test(value)) return true
    if (falseRegex.test(value)) return false
  }
}

export const parseYesNoBoolean: ParseExactFunction<boolean> = (value) => {
  const boolean = parseBoolean(value)

  if (boolean !== undefined) {
    return boolean
  }

  if (isNonEmptyString(value)) {
    return yesRegex.test(value)
  }
}

export const parseDate: ParseExactFunction<string> = (value) => {
  // This function is currently a placeholder for the actual date parsing functionality
  // which might be added at some point in the future. Currently it just uses treats
  // the date as string.
  return parseString(value)
}

export const parseArray: ParseExactFunction<Array<Unreliable>> = (value) => {
  if (Array.isArray(value)) {
    return value
  }

  if (!isObject(value)) {
    return
  }

  if (value.length) {
    return Array.from(value as Unreliable as ArrayLike<Unreliable>)
  }

  const keys = Object.keys(value)

  if (keys.length === 0) {
    return
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const n = Number(key)

    if (!Number.isInteger(n) || n !== i) {
      return
    }
  }

  return Object.values(value)
}

export const parseArrayOf = <R>(
  value: Unreliable,
  parse: ParseExactFunction<R>,
): Array<R> | undefined => {
  const array = parseArray(value)

  if (array) {
    return trimArray(array, parse)
  }

  const parsed = parse(value)

  if (parsed) {
    return [parsed]
  }
}

export const parseSingular = <T>(value: T | Array<T>): T => {
  return Array.isArray(value) ? value[0] : value
}

export const parseSingularOf = <R>(
  value: Unreliable,
  parse: ParseExactFunction<R>,
): R | undefined => {
  return parse(parseSingular(value))
}

export const parseCsvOf = <T>(
  value: Unreliable,
  parse: ParseExactFunction<T>,
): Array<T> | undefined => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  const items = parseString(value)?.split(',')

  if (items) {
    return trimArray(items, parse)
  }
}

export const generateCsvOf = <T>(
  value: Array<T> | undefined,
  generate?: GenerateFunction<T>,
): string | undefined => {
  if (!Array.isArray(value) || value.length === 0) {
    return
  }

  return trimArray(value, generate)?.join()
}

export const generateXmlStylesheet = (stylesheet: XmlStylesheet): string | undefined => {
  const generated = trimObject({
    type: generatePlainString(stylesheet.type),
    href: generatePlainString(stylesheet.href),
    title: generatePlainString(stylesheet.title),
    media: generatePlainString(stylesheet.media),
    charset: generatePlainString(stylesheet.charset),
    alternate: generateYesNoBoolean(stylesheet.alternate),
  })

  if (!generated) {
    return undefined
  }

  let attributes = ''

  for (const key in generated) {
    const value = generated[key as keyof typeof generated]
    if (value !== undefined) {
      attributes += ` ${key}="${value}"`
    }
  }

  return `<?xml-stylesheet${attributes}?>`
}

export const generateXml = (
  builder: XMLBuilder,
  value: string,
  options?: XmlGenerateOptions,
): string => {
  let body = builder.build(value)

  if (body.includes('&apos;')) {
    body = body.replace(/&apos;/g, "'")
  }

  let declaration = '<?xml version="1.0" encoding="utf-8"?>'

  if (options?.stylesheets?.length) {
    for (const stylesheetObject of options.stylesheets) {
      const stylesheetString = generateXmlStylesheet(stylesheetObject)

      if (stylesheetString) {
        declaration += `\n${stylesheetString}`
      }
    }
  }

  return `${declaration}\n${body}`
}

export const generateRfc822Date: GenerateFunction<string | Date> = (value) => {
  // This function generates RFC 822 format dates which is also compatible with RFC 2822.

  if (typeof value === 'string') {
    // biome-ignore lint/style/noParameterAssign: No explanation.
    value = new Date(value)
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toUTCString()
  }
}

export const generateRfc3339Date: GenerateFunction<string | Date> = (value) => {
  // This function generates RFC 3339 format dates which is also compatible with W3C-DTF.
  // The only difference between ISO 8601 (produced by toISOString) and RFC 3339 is that
  // RFC 3339 allows a space between date and time parts instead of 'T', but the 'T' format
  // is actually valid in RFC 3339 as well, so we can just return the ISO string.

  if (typeof value === 'string') {
    // biome-ignore lint/style/noParameterAssign: No explanation.
    value = new Date(value)
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
}

export const generateBoolean: GenerateFunction<boolean> = (value) => {
  if (typeof value === 'boolean') {
    return value
  }
}

export const generateYesNoBoolean: GenerateFunction<boolean> = (value) => {
  if (typeof value !== 'boolean') {
    return
  }

  return value ? 'yes' : 'no'
}

export const detectNamespaces = (value: unknown, recursive = false): Set<string> => {
  const namespaces = new Set<string>()
  const seenKeys = new Set<string>()

  const traverse = (current: unknown): void => {
    if (Array.isArray(current)) {
      for (const item of current) {
        traverse(item)
      }

      return
    }

    if (isObject(current)) {
      for (const key in current) {
        if (seenKeys.has(key)) {
          continue
        }

        seenKeys.add(key)

        const keyWithoutAt = key.indexOf('@') === 0 ? key.slice(1) : key
        const colonIndex = keyWithoutAt.indexOf(':')

        if (colonIndex > 0) {
          namespaces.add(keyWithoutAt.slice(0, colonIndex))
        }

        if (recursive) {
          traverse(current[key])
        }
      }
    }
  }

  traverse(value)

  return namespaces
}

export const generateCdataString: GenerateFunction<string> = (value) => {
  if (!isNonEmptyString(value)) {
    return
  }

  if (
    value.indexOf('<') !== -1 ||
    value.indexOf('>') !== -1 ||
    value.indexOf('&') !== -1 ||
    value.indexOf(']]>') !== -1
  ) {
    return { '#cdata': value.trim() }
  }

  return value.trim()
}

export const generatePlainString: GenerateFunction<string> = (value) => {
  if (!isNonEmptyString(value)) {
    return
  }

  return value.trim()
}

export const generateNumber: GenerateFunction<number> = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
}

export const generateNamespaceAttrs = (
  value: Unreliable,
  namespaceUrls: Record<string, string>,
): Record<string, string> | undefined => {
  if (!isObject(value)) {
    return
  }

  let namespaceAttrs: Record<string, string> | undefined
  const valueNamespaces = detectNamespaces(value, true)

  for (const slug in namespaceUrls) {
    if (!valueNamespaces.has(slug)) {
      continue
    }

    if (!namespaceAttrs) {
      namespaceAttrs = {}
    }

    namespaceAttrs[`@xmlns:${slug}`] = namespaceUrls[slug]
  }

  return namespaceAttrs
}

export const invertObject = (object: Record<string, string>): Record<string, string> => {
  const inverted: Record<string, string> = {}

  for (const key in object) {
    inverted[object[key]] = key
  }

  return inverted
}

export const createNamespaceNormalizator = (
  namespaceUrls: Record<string, string>,
  primaryNamespace?: string,
) => {
  const namespacesMap = invertObject(namespaceUrls)

  const resolveNamespacePrefix = (uri: string, localName: string, fallback: string): string => {
    if (primaryNamespace && uri === primaryNamespace) {
      return localName
    }

    const standardPrefix = namespacesMap[uri]

    if (standardPrefix) {
      return `${standardPrefix}:${localName}`
    }

    return fallback
  }

  const extractNamespaceDeclarations = (element: Unreliable): Record<string, string> => {
    const declarations: Record<string, string> = {}

    if (isObject(element)) {
      for (const key in element) {
        if (key === '@xmlns') {
          declarations[''] = element[key]
        } else if (key.indexOf('@xmlns:') === 0) {
          const prefix = key.substring('@xmlns:'.length)
          declarations[prefix] = element[key]
        }
      }
    }

    return declarations
  }

  const normalizeWithContext = (
    name: string,
    context: Record<string, string>,
    useDefault = false,
  ): string => {
    const colonIndex = name.indexOf(':')

    if (colonIndex === -1) {
      if (useDefault && context['']) {
        return resolveNamespacePrefix(context[''], name, name)
      }

      return name
    }

    const prefix = name.substring(0, colonIndex)
    const unprefixedName = name.substring(colonIndex + 1)
    const uri = context[prefix]

    if (uri) {
      return resolveNamespacePrefix(uri, unprefixedName, name)
    }

    return name
  }

  const normalizeKey = (key: string, context: Record<string, string>): string => {
    if (key.indexOf('@') === 0) {
      const attrName = key.substring(1)
      const normalizedAttrName = normalizeWithContext(attrName, context, false)

      return `@${normalizedAttrName}`
    } else {
      return normalizeWithContext(key, context, true)
    }
  }

  const traverseAndNormalize = (
    object: Unreliable,
    parentContext: Record<string, string> = {},
  ): Unreliable => {
    if (!isObject(object)) {
      return object
    }

    if (Array.isArray(object)) {
      return object.map((item) => traverseAndNormalize(item, parentContext))
    }

    const normalizedObject: Unreliable = {}
    const keyGroups: Map<string, Unreliable[]> = new Map()

    const declarations = extractNamespaceDeclarations(object)
    const currentContext = { ...parentContext, ...declarations }

    for (const key in object) {
      const value = object[key]

      if (key.indexOf('@xmlns') === 0) {
        normalizedObject[key] = value
        continue
      }

      const normalizedKey = normalizeKey(key, currentContext)
      const normalizedValue = traverseAndNormalize(value, currentContext)

      if (!keyGroups.has(normalizedKey)) {
        keyGroups.set(normalizedKey, [])
      }

      const group = keyGroups.get(normalizedKey)

      if (group) {
        group.push(normalizedValue)
      }
    }

    for (const [normalizedKey, values] of keyGroups) {
      if (values.length === 1) {
        normalizedObject[normalizedKey] = values[0]
      } else {
        normalizedObject[normalizedKey] = values
      }
    }

    return normalizedObject
  }

  // For the root level, we need to handle the special case where the root element
  // itself has namespace declarations that apply to its own normalization.
  const normalizeRoot = (object: Unreliable): Unreliable => {
    if (!isObject(object)) {
      return object
    }

    if (Array.isArray(object)) {
      return object.map(normalizeRoot)
    }

    const normalizedObject: Unreliable = {}

    for (const key in object) {
      const value = object[key]

      // Extract namespace declarations from the value to see if they apply to the key.
      const declarations = extractNamespaceDeclarations(value)
      // If this element has declarations, use them to normalize its own key.
      const normalizedKey = Object.keys(declarations).length ? normalizeKey(key, declarations) : key
      // Process the value with empty parent context since this is root.
      const normalizedValue = traverseAndNormalize(value)

      normalizedObject[normalizedKey] = normalizedValue
    }

    return normalizedObject
  }

  return normalizeRoot
}
