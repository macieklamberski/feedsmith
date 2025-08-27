import type { DateLike, XmlGenerateOptions } from '@/common/types.js'
import { generateXml } from '@/common/utils.js'
import type { Feed } from '@/feeds/atom/common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate = (value: Feed<DateLike>, options?: XmlGenerateOptions): string => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new Error('Invalid input Atom')
  }

  return generateXml(builder, generated, options)
}
