import { namespaceUris } from '../../../common/config.js'
import { isNonEmptyString } from '../../../common/utils.js'

export const detect = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false
  }

  const hasFeedElement = /(?:^|[\s>])<(?:\w+:)?feed[\s>]/im.test(value)

  if (!hasFeedElement) {
    return false
  }

  const hasAtomNamespace = namespaceUris.atom.some((uri) => value.includes(uri))
  const hasAtomElements = /(<(?:\w+:)?(entry|title|link|id|updated|summary)[\s>])/i.test(value)

  return hasAtomNamespace || hasAtomElements
}
