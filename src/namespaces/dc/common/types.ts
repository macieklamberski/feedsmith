import type { DateLike } from '../../../common/types.js'

// #region reference
export type ItemOrFeed<TDate extends DateLike> = {
  title?: string
  creator?: string
  subject?: string
  description?: string
  publisher?: string
  contributor?: string
  date?: TDate
  type?: string
  format?: string
  identifier?: string
  source?: string
  language?: string
  relation?: string
  coverage?: string
  rights?: string
}
// #endregion reference
