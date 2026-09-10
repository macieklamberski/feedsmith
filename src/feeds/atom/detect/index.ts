import { namespaceUris } from '../../../common/config.js'
import { isNonEmptyString } from '../../../common/utils.js'

const feedElementRegex = /(?:^|[\s>])<(?:\w+:)?feed[\s>]/im
const atomElementsRegex = /(<(?:\w+:)?(entry|title|link|id|updated|summary)[\s>])/i

export const detect = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false
  }

  const hasFeedElement = feedElementRegex.test(value)

  if (!hasFeedElement) {
    return false
  }

  const hasAtomNamespace = namespaceUris.atom.some((uri) => value.includes(uri))
  const hasAtomElements = atomElementsRegex.test(value)

  return hasAtomNamespace || hasAtomElements
}
