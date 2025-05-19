import { XMLBuilder } from 'fast-xml-parser'
import { generateConfig } from '../../common/config.js'

export const builder = new XMLBuilder({
  ...generateConfig,
})
