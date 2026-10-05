import { namespaceStopNodes } from '../../../common/config.js'

// The pre-parse seed canonicalizes the root's primary prefix before matching, so the root spells as
// `rdf`. A document that never declares the prefix keeps `rdf:rdf` as its key and fails retrieval
// regardless, so only the canonical form is matched.
export const stopNodes = [
  ...namespaceStopNodes,
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
