import { parserConfig as baseParserConfig } from '../../../common/config.js'

export const stopNodes = [
  'rdf:rdf.channel.title',
  'rdf:rdf.channel.link',
  'rdf:rdf.channel.description',
  'rdf:rdf.image.title',
  'rdf:rdf.image.link',
  'rdf:rdf.image.url',
  'rdf:rdf.item.title',
  'rdf:rdf.item.link',
  'rdf:rdf.item.description',
  'rdf:rdf.textinput.title',
  'rdf:rdf.textinput.description',
  'rdf:rdf.textinput.name',
  'rdf:rdf.textinput.link',
  // TODO: What about the namespaces?
]

export const parserConfig = { ...baseParserConfig, stopNodes }
