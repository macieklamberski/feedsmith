import type z from 'zod'
import type { feed } from './schemas'
import type { image, item, textinput } from './schemas'

export type Image = z.infer<typeof image>

export type Textinput = z.infer<typeof textinput>

export type Item = z.infer<typeof item>

export type Feed = z.infer<typeof feed>
