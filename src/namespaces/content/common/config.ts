export const uris = [
  'http://purl.org/rss/1.0/modules/content/', // Official URI
  'https://purl.org/rss/1.0/modules/content/',
  'http://purl.org/rss/1.0/modules/content',
  'https://purl.org/rss/1.0/modules/content',
]

export const stopNodes = [
  '*.content:encoded',
  // RDF feeds read the rdf prefix as the primary namespace, so rdf:value arrives as value there.
  '*.content:item.value',
]
