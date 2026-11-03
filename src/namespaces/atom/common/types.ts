import type { DeepOmit } from 'trousse'
import type { AtomFeed } from '../../../feeds/atom/common/types.js'

// Namespace properties to exclude when Atom is used as a namespace (not as a feed format). This
// includes keys from all levels: Entry/Feed, Person (arxiv), etc.
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
  | 'trackback'
  | 'wfw'
  | 'yt'

// Feedburner and xml are only carried in Atom feeds, and RFC 4287 places atom:entry only inside
// atom:feed. Link-level thr and Text/Content xml are kept, since Atom as a namespace carries them.
type NsEntryKeys = 'feedburner' | 'thr' | 'xml'
type NsFeedKeys = 'entries' | 'feedburner' | 'xml'

// #region reference
export namespace AtomNs {
  export type Entry<TDate> = DeepOmit<Omit<AtomFeed.Entry<TDate>, NsEntryKeys>, NsKeys>

  export type Feed<TDate> = DeepOmit<Omit<AtomFeed.Feed<TDate>, NsFeedKeys>, NsKeys>
}
// #endregion reference
