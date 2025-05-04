import { XMLParser } from 'fast-xml-parser'
import { parserConfig } from '../../common/config.js'

export const stopNodes = [
  // TODO: Fill it with correct nodes.
]

export const parser = new XMLParser({
  ...parserConfig,
  stopNodes,
})
