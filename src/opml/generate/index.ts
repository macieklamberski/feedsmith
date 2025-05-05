import { builder } from './config.js'
import type { Opml } from './types.js'
import { generateOpml } from './utils.js'

export const generate = (value: Opml): string => {
  const generated = generateOpml(value)

  if (!generated) {
    throw new Error('Invalid input OPML')
  }

  const built = builder.build(generated)
  // TODO: Figure out a better way to handle apostrophes. Replacing all occurrences
  // in longer XML files will be inefficient.
  const builtWithApos = built.replaceAll('&apos;', "'")

  return `<?xml version="1.0" encoding="utf-8"?>\n${builtWithApos}`
}
