import type { z } from 'zod'
import type { attachment, author, feed, hub, item } from './schemas'

export type Author = z.infer<typeof author>

export type Attachment = z.infer<typeof attachment>

export type Item = z.infer<typeof item>

export type Hub = z.infer<typeof hub>

export type Feed = z.infer<typeof feed>
