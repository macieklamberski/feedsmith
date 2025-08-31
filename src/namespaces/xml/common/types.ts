// TODO: Rename to XmlElement when PR #69 (text structure) is implemented. This will
// allow XML attributes on content/summary elements, not just feed/entry.

// #region reference
export type ItemOrFeed = {
  lang?: string
  base?: string
  space?: string
  id?: string
}
// #endregion reference
