import { XMLBuilder } from 'fast-xml-parser'
import { builderConfig } from '../../../common/config.js'
import { textConstructs } from '../../../namespaces/atom/common/config.js'

// A `type="xhtml"` construct holds its value as raw markup (see generateXhtmlValue in
// utils.ts), so the builder must not entity-encode it. Stop nodes match on the type
// attribute, leaving constructs of every other type on the normal escaping path.
export const builder = new XMLBuilder({
  ...builderConfig,
  stopNodes: textConstructs.map((element) => `..${element}[type=xhtml]`),
})
