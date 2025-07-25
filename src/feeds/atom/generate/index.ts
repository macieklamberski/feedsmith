import type { XmlGenerateOptions } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import type { Feed } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate = (value: Feed<Date>, options?: XmlGenerateOptions): string => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new Error('Invalid input Atom')
  }

  return generateXml(builder, generated, options)
}
