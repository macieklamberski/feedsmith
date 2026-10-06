import { XMLBuilder } from 'fast-xml-parser'
import { builderConfig } from '../../../common/config.js'
import { textConstructs } from '../../../namespaces/atom/common/config.js'

export const builder = new XMLBuilder({
  ...builderConfig,
  // Atom text constructs embedded via the atom namespace hold raw xhtml markup when their type is
  // xhtml, exactly like in Atom feeds (see src/feeds/atom/generate/config.ts).
  stopNodes: textConstructs.map((element) => `..atom:${element}[type=xhtml]`),
})
