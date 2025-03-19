import type z from 'zod'
import type { feed } from '../atom/schemas'
import type { image, item, textInput } from '../rss/schemas'

export type Image = z.infer<typeof image>

export type Textinput = z.infer<typeof textInput>

export type Item = z.infer<typeof item>

export type Feed = z.infer<typeof feed>
