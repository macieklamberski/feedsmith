export const uris = [
  'http://www.w3.org/2005/Atom', // Official URI (Atom 1.0).
  'https://www.w3.org/2005/Atom',
  'http://www.w3.org/2005/Atom/',
  'https://www.w3.org/2005/Atom/',
  'http://purl.org/atom/ns#', // Official URI (Atom 0.3).
  'https://purl.org/atom/ns#',
]

// The elements that can carry a type="xhtml" value with inline markup. Atom 0.3's tagline
// is left out: generated feeds are normalized to 1.0, so its stop node would never match.
export const textConstructs = ['title', 'subtitle', 'rights', 'summary', 'content']

// Leaf paths the parser reads, relative to the feed and to the entry. Text constructs can
// hold inline xhtml markup, which must reach parseText as raw text; containers (author,
// contributor, source) appear only as segments so they parse into structure.
const personPaths = (parent: string) => [
  `${parent}.name`,
  `${parent}.uri`,
  `${parent}.url`, // Atom 0.3.
  `${parent}.email`,
]

export const feedPaths = [
  ...personPaths('author'),
  'category',
  ...personPaths('contributor'),
  'generator',
  'icon',
  'id',
  'link',
  'logo',
  'rights',
  'subtitle',
  'tagline', // Atom 0.3.
  'title',
  'updated',
  'modified', // Atom 0.3.
]

export const entryPaths = [
  ...personPaths('author'),
  'category',
  'content',
  ...personPaths('contributor'),
  'id',
  'link',
  'published',
  'issued', // Atom 0.3.
  'created', // Atom 0.3.
  'rights',
  ...personPaths('source.author'),
  'source.category',
  ...personPaths('source.contributor'),
  'source.generator',
  'source.icon',
  'source.id',
  'source.link',
  'source.logo',
  'source.rights',
  'source.subtitle',
  'source.title',
  'source.updated',
  'source.modified', // Atom 0.3.
  'summary',
  'title',
  'updated',
  'modified', // Atom 0.3.
]

const prefixSegments = (path: string) => {
  return path
    .split('.')
    .map((segment) => `atom:${segment}`)
    .join('.')
}

export const stopNodes = [...new Set([...feedPaths, ...entryPaths])].map((path) => {
  return `*.${prefixSegments(path)}`
})
