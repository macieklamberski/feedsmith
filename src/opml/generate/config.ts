// @ts-expect-error: fast-xml-builder v1.0.0 has mismatched exports (default in JS, named in .d.ts).
import XMLBuilder from 'fast-xml-builder'
import { builderConfig } from '../../common/config.js'

export const builder = new XMLBuilder({
  ...builderConfig,
})
