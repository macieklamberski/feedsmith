import type z from 'zod'
import type { ParseFunction as CommonParseFunction } from '../../common/types'
import type { category, entry, feed, generator, link, person, source, text } from './schemas'

export type ParseFunction<R> = CommonParseFunction<R, { prefix: string; partial: boolean }>

export type Text = z.infer<typeof text>

export type Link = z.infer<typeof link>

export type Person = z.infer<typeof person>

export type Category = z.infer<typeof category>

export type Generator = z.infer<typeof generator>

export type Source = z.infer<typeof source>

export type Entry = z.infer<typeof entry>

export type Feed = z.infer<typeof feed>
