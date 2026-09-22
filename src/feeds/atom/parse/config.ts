import { namespaceStopNodes } from '../../../common/config.js'
import { entryPaths, feedPaths } from '../../../namespaces/atom/common/config.js'

export const stopNodes = [
  ...namespaceStopNodes,
  ...feedPaths.map((path) => `feed.${path}`),
  ...entryPaths.map((path) => `feed.entry.${path}`),
]
