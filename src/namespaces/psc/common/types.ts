// #region reference
export type Chapter = {
  start: string
  title?: string
  href?: string
  image?: string
}

export type Item = {
  chapters?: Array<Chapter>
}
// #endregion reference
