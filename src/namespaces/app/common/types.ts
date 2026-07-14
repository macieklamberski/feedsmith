// #region reference
export namespace AppNs {
  export type Control = {
    draft?: boolean
  }

  export type Entry<TDate> = {
    edited?: TDate
    control?: Control
  }
}
// #endregion reference
