import type { XmlGenerateOptions } from '@/common/types.js'
import { generateXml } from '@/common/utils.js'
import type { Opml } from '@/opml/common/types.js'
import { builder } from './config.js'
import { generateOpml } from './utils.js'

export const generate = (value: Opml<Date>, options?: XmlGenerateOptions) => {
  const generated = generateOpml(value)

  if (!generated) {
    throw new Error('Invalid input OPML')
  }

  return generateXml(builder, generated, options)
}
