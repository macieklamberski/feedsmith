export const uris = [
  'http://www.w3.org/2007/app', // Official URI
  'https://www.w3.org/2007/app',
  'http://www.w3.org/2007/app/',
  'https://www.w3.org/2007/app/',
]

// The collection title is an Atom text construct, so its inline xhtml markup must reach parseText
// as raw text.
export const stopNodes = ['*.app:draft', '*.app:edited', '*.app:collection.title']
