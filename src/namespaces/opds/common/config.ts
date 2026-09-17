export const uris = [
  'http://opds-spec.org/2010/catalog', // Official URI.
  'https://opds-spec.org/2010/catalog',
  'http://opds-spec.org/2010/catalog/',
  'https://opds-spec.org/2010/catalog/',
]

export const stopNodes = [
  '*.opds:price',
  // Not a stop node because it supports recursive nesting that requires parser traversal.
  // '*.opds:indirectacquisition',
  '*.opds:availability',
  '*.opds:holds',
  '*.opds:copies',
]
