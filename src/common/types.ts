// TODO: Try to use: { [key: string]: Unreliable } | undefined for better type safety.
// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any

export type DateLike = Date | string

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

export type ParseExactFunction<R> = (value: Unreliable) => R | undefined

export type ParsePartialFunction<R> = (value: Unreliable) => DeepPartial<R> | undefined

export type GenerateFunction<V> = (value: V | undefined) => Unreliable | undefined

export type XmlStylesheet = {
  type: string
  href: string
  title?: string
  media?: string
  charset?: string
  alternate?: boolean
}

export type XmlGenerateFunction<Strict, Lenient, Options = Record<string, never>> = {
  (
    value: Strict,
    options?: Options & { lenient?: false; stylesheets?: Array<XmlStylesheet> },
  ): string
  (value: Lenient, options: Options & { lenient: true; stylesheets?: Array<XmlStylesheet> }): string
}

export type JsonGenerateFunction<Strict, Lenient, Options = Record<string, never>> = {
  (value: Strict, options?: Options & { lenient?: false }): unknown
  (value: Lenient, options: Options & { lenient: true }): unknown
}
