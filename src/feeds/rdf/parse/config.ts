import { namespaceStopNodes } from '../../../common/config.js'

// The pre-parse seed canonicalizes the root's primary prefix before matching, so the root spells as
// `rdf`. A document that never declares the prefix keeps `rdf:rdf` as its key and fails retrieval
// regardless, so only the canonical form is matched.
export const stopNodes = [
  // Tag names are lowercased, so `*.cc:license` would also stop at the root cc:License and keep
  // its cc:permits and cc:requires children as raw text.
  ...namespaceStopNodes.filter((stopNode) => stopNode !== '*.cc:license'),
  'rdf.channel.cc:license',
  'rdf.image.cc:license',
  'rdf.item.cc:license',
  'rdf.channel.title',
  'rdf.channel.link',
  'rdf.channel.description',
  'rdf.image.title',
  'rdf.image.link',
  'rdf.image.url',
  'rdf.item.title',
  'rdf.item.link',
  'rdf.item.description',
  'rdf.textinput.title',
  'rdf.textinput.description',
  'rdf.textinput.name',
  'rdf.textinput.link',
]
