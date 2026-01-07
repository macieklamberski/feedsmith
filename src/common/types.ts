// TODO: Try to use: { [key: string]: Unreliable } | undefined for better type safety.
// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any

export type DateLike = Date | string

export type ExtraFields<F extends ReadonlyArray<string>, V = unknown> = {
  [K in F[number]]?: V
}

export type AnyOf<T> = Partial<{ [P in keyof T]-?: NonNullable<T[P]> }> &
  { [P in keyof T]-?: Pick<{ [Q in keyof T]-?: NonNullable<T[Q]> }, P> }[keyof T]

export type IsPlainObject<T> =
  T extends Array<unknown>
    ? false
    : T extends (...args: Array<unknown>) => unknown
      ? false
      : T extends Date
        ? false
        : T extends object
          ? T extends null
            ? false
            : true
          : false

export type RemoveUndefined<T> = T extends undefined ? never : T

export type DeepPartial<T> =
  IsPlainObject<T> extends true
    ? { [P in keyof T]?: DeepPartial<RemoveUndefined<T[P]>> }
    : T extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T

export type DeepOmit<T, K extends string> = T extends Array<infer U>
  ? Array<DeepOmit<U, K>>
  : IsPlainObject<T> extends true
    ? Pick<{ [P in keyof T]: DeepOmit<T[P], K> }, Exclude<keyof T, K>>
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

export type ParseOptions = {
  maxItems?: number
}

export type XmlStylesheet = {
  type: string
  href: string
  title?: string
  media?: string
  charset?: string
  alternate?: boolean
}

export type XmlGenerateOptions<O, F extends boolean = false> = O & {
  lenient?: F
  stylesheets?: Array<XmlStylesheet>
}

export type JsonGenerateOptions<O, F extends boolean = false> = O & {
  lenient?: F
}

export type XmlGenerateMain<S, L, O = Record<string, unknown>> = <F extends boolean = false>(
  value: F extends true ? L : S,
  options?: XmlGenerateOptions<O, F>,
) => string

export type JsonGenerateMain<S, L, O = Record<string, unknown>> = <F extends boolean = false>(
  value: F extends true ? L : S,
  options?: JsonGenerateOptions<O, F>,
) => unknown
