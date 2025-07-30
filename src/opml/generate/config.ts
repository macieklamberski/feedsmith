import { XMLBuilder } from 'fast-xml-parser'
import { builderConfig } from '../../common/config.js'

export const builder = new XMLBuilder({
  ...builderConfig,
})
