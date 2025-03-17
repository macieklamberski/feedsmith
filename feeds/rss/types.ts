import type z from 'zod'
import type {
  author,
  category,
  cloud,
  enclosure,
  feed,
  image,
  item,
  itemMedia,
  source,
  textInput,
} from './schemas'

export type Author = z.infer<typeof author>

export type Category = z.infer<typeof category>

export type Cloud = z.infer<typeof cloud>

export type Enclosure = z.infer<typeof enclosure>

export type Source = z.infer<typeof source>

export type Image = z.infer<typeof image>

export type TextInput = z.infer<typeof textInput>

export type ItemMedia = z.infer<typeof itemMedia>

export type Item = z.infer<typeof item>

export type Feed = z.infer<typeof feed>
