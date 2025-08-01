import type { DateLike } from '@/common/types.js'
import type { Entry as AtomEntry, Feed as AtomFeed } from '@/feeds/atom/common/types.js'

// #region reference
export type Entry<TDate extends DateLike> = Partial<AtomEntry<TDate>>

export type Feed<TDate extends DateLike> = Partial<AtomFeed<TDate>>
// #endregion reference
