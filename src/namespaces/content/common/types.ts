// #region reference
export namespace ContentNs {
  export type Item = {
    // Spec (https://web.resource.org/rss/1.0/modules/content/) also mentions content:items,
    // but it is not clear what it is used for. Also, it's not widely used so its implementation
    // will be skipped for now. If it's requested in the future, it can be added here.
    encoded?: string
  }
}
// #endregion reference
