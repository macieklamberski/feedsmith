import { entryPaths } from '../../atom/common/config.js'

export const uris = [
  'http://activitystrea.ms/spec/1.0/', // Official URI
]

// The object and target carry the Atom entry's content model, so their text constructs stay raw
// like the entry's own.
export const stopNodes = [
  '*.activity:verb',
  '*.activity:object-type',
  ...entryPaths.map((path) => `*.activity:object.${path}`),
  ...entryPaths.map((path) => `*.activity:target.${path}`),
]
