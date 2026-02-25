import type { DeepOmit } from '../../../common/types.js'
import type { Atom } from '../../../feeds/atom/common/types.js'

// Namespace properties to exclude when Atom is used as a namespace (not as a feed format).
// This includes keys from all levels: Entry/Feed, Person (arxiv), Link (thr), etc.
type NsKeys =
  | 'admin'
  | 'app'
  | 'arxiv'
  | 'cc'
  | 'creativeCommons'
  | 'dc'
  | 'dcterms'
  | 'geo'
  | 'georss'
  | 'googleplay'
  | 'itunes'
  | 'media'
  | 'opensearch'
  | 'pingback'
  | 'psc'
  | 'slash'
  | 'sy'
  | 'thr'
  | 'trackback'
  | 'wfw'
  | 'yt'

// #region reference
export namespace AtomNs {
  export type Entry<TDate> = DeepOmit<Atom.Entry<TDate>, NsKeys>

  export type Feed<TDate> = DeepOmit<Atom.Feed<TDate>, NsKeys>
}
// #endregion reference
