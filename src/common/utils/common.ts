import { invertObject } from '../utils.js'

export const createFixedStatefulTransforms = (namespaceUrls: Record<string, string>) => {
  const standardNamespaces = invertObject(namespaceUrls)
  const contextStack: Record<string, string>[] = [{}]
  const elementStack: Array<{ name: string; depth: number }> = []

  const normalize = (name: string, useDefault = false): string => {
    const colonIndex = name.indexOf(':')

    // Handle unprefixed elements with default namespace
    if (colonIndex === -1) {
      if (useDefault) {
        const context = contextStack[contextStack.length - 1]

        if ('' in context && context[''] !== '') {
          const standardPrefix = standardNamespaces[context['']]

          if (standardPrefix) {
            return `${standardPrefix}:${name.toLowerCase()}`
          }
        }
      }

      return name.toLowerCase()
    }

    const prefix = name.substring(0, colonIndex)
    const localName = name.substring(colonIndex + 1)
    const uri = contextStack[contextStack.length - 1][prefix]

    if (uri) {
      const standardPrefix = standardNamespaces[uri]

      if (standardPrefix) {
        return `${standardPrefix}:${localName.toLowerCase()}`
      }
    }

    return name.toLowerCase()
  }

  return {
    updateTag: (tagName: string, jPath: string, attrs: Record<string, unknown>): string => {
      const currentDepth = jPath.split('.').length

      // Pop contexts from elements at same or deeper depth (self-closing/siblings)
      while (
        elementStack.length > 0 &&
        elementStack[elementStack.length - 1].depth >= currentDepth
      ) {
        contextStack.pop()
        elementStack.pop()
      }

      // Extract namespace declarations
      const declarations: Record<string, string> = {}

      if (attrs) {
        if ('@xmlns' in attrs) {
          declarations[''] = attrs['@xmlns'] as string
        }

        for (const key in attrs) {
          if (key.startsWith('@xmlns:')) {
            const prefix = key.substring('@xmlns:'.length)

            declarations[prefix] = attrs[key] as string
          }
        }
      }

      // Push new context if namespace declarations found
      if (Object.keys(declarations).length > 0) {
        contextStack.push({ ...contextStack[contextStack.length - 1], ...declarations })
        elementStack.push({ name: tagName, depth: currentDepth })
      }

      return normalize(tagName, true)
    },

    transformTagName: (tagName: string): string => {
      if (tagName.indexOf('/') === 0) {
        const elementName = tagName.substring(1)
        const normalizedElementName = normalize(elementName, true)

        // Pop context if this element created one
        if (elementStack.length > 0 && elementStack[elementStack.length - 1].name === elementName) {
          contextStack.pop()
          elementStack.pop()
        }

        return `/${normalizedElementName}`
      }
      return normalize(tagName, true)
    },

    transformAttributeName: (attrName: string): string => {
      if (attrName.indexOf('@xmlns') === 0) {
        return attrName
      }

      if (attrName.indexOf('@') === 0) {
        const nameWithoutPrefix = attrName.substring(1)
        const normalizedNameWithoutPrefix = normalize(nameWithoutPrefix, false)

        return `@${normalizedNameWithoutPrefix}`
      }

      return normalize(attrName, false)
    },

    getCurrentContext: () => ({ ...contextStack[contextStack.length - 1] }),
    getStackDepth: () => contextStack.length,
  }
}
