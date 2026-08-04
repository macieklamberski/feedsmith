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
