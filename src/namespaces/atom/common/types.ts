import type { DateLike } from '../../../common/types.js'
import type { Feed as AtomEntry, Feed as AtomFeed } from '../../../feeds/atom/common/types.js'

export type Entry<TDate extends DateLike> = AtomEntry<TDate>

export type Feed<TDate extends DateLike> = AtomFeed<TDate>
