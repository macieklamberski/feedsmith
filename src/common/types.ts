// TODO: Try to use: { [key: string]: Unreliable } | undefined for better type safety.
// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any

export type DateLike = Date | string

export type ExtraFields<F extends ReadonlyArray<string>, V = unknown> = {
  [K in F[number]]?: V
}

export type AnyOf<T> = Partial<{ [P in keyof T]-?: NonNullable<T[P]> }> &
  { [P in keyof T]-?: Pick<{ [Q in keyof T]-?: NonNullable<T[Q]> }, P> }[keyof T]

export type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends (...args: Array<unknown>) => unknown
    ? T
    : T extends object
      ? T extends null
        ? T
        : { [P in keyof T]?: DeepPartial<T[P]> }
      : T

export type ParseExactUtil<R> = (value: Unreliable) => R | undefined

export type ParsePartialUtil<R, O = undefined> = (
  value: Unreliable,
  options?: O,
) => DeepPartial<R> | undefined

export type GenerateUtil<V, O = undefined> = (
  value: V | undefined,
  options?: O,
) => Unreliable | undefined

export type XmlStylesheet = {
  type: string
  href: string
  title?: string
  media?: string
  charset?: string
  alternate?: boolean
}

export type XmlGenerateMain<S, L, O = Record<string, never>> = <F extends boolean = false>(
  value: F extends true ? L : S,
  options?: O & { lenient?: F; stylesheets?: Array<XmlStylesheet> },
) => string

export type JsonGenerateMain<S, L, O = Record<string, never>> = <F extends boolean = false>(
  value: F extends true ? L : S,
  options?: O & { lenient?: F },
) => unknown
