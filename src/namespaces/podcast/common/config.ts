export const uris = [
  'https://podcastindex.org/namespace/1.0', // Official URI.
  'http://podcastindex.org/namespace/1.0',
  'https://podcastindex.org/namespace/1.0/',
  'http://podcastindex.org/namespace/1.0/',
  'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md',
]

// Item-level stopNodes that also appear inside podcast:liveitem container.
const liveItemLeaves = [
  'podcast:soundbite',
  'podcast:person',
  'podcast:location',
  'podcast:season',
  'podcast:episode',
  'podcast:license',
  'podcast:txt',
  'podcast:contentlink',
]

export const stopNodes = [
  '*.podcast:locked',
  '*.podcast:funding',
  '*.podcast:soundbite',
  '*.podcast:person',
  '*.podcast:location',
  '*.podcast:season',
  '*.podcast:episode',
  '*.podcast:trailer',
  '*.podcast:license',
  '*.podcast:guid',
  '*.podcast:medium',
  '*.podcast:contentlink',
  '*.podcast:block',
  '*.podcast:txt',
  '*.podcast:updatefrequency',
  // Inside podcast:liveitem container.
  ...liveItemLeaves.map((leaf) => `*.podcast:liveitem.${leaf}`),
]
