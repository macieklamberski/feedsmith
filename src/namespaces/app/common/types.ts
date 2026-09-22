import type { Requirable, Strict } from '../../../common/types.js'
import type { AtomFeed } from '../../../feeds/atom/common/types.js'

// #region reference
export namespace AppNs {
  export type Control = {
    draft?: boolean
  }

  export type Category<TStrict extends boolean = false> = Strict<
    {
      term: Requirable<string> // Required in spec
      scheme?: string
      label?: string
    },
    TStrict
  >

  export type Categories<TStrict extends boolean = false> = {
    href?: string
    fixed?: boolean
    scheme?: string
    categories?: Array<Category<TStrict>>
  }

  export type Collection<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec
      title: Requirable<AtomFeed.Text> // Required in spec
      accepts?: Array<string>
      categories?: Array<Categories<TStrict>>
    },
    TStrict
  >

  export type Entry<TDate> = {
    edited?: TDate
    control?: Control
  }

  export type Feed<TStrict extends boolean = false> = {
    collections?: Array<Collection<TStrict>>
  }
}
// #endregion reference
