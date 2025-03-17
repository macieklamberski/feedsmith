import type z from 'zod'
import type {
  author,
  category,
  cloud,
  enclosure,
  feed,
  guid,
  image,
  item,
  source,
  textInput,
} from './schemas'

export type Author = z.infer<typeof author>

export type Category = z.infer<typeof category>

export type Cloud = z.infer<typeof cloud>

export type Enclosure = z.infer<typeof enclosure>

export type Guid = z.infer<typeof guid>

export type Source = z.infer<typeof source>

export type Image = z.infer<typeof image>

export type TextInput = z.infer<typeof textInput>

export type Item = z.infer<typeof item>

export type Feed = z.infer<typeof feed>
