// TODO: Try to use: { [key: string]: Unreliable } | undefined for better type safety.
// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any

export type DateLike = Date | string

export type ExtraFields<F extends ReadonlyArray<string>, V = unknown> = {
  [K in F[number]]?: V
}

export type AnyOf<T> = Partial<{ [P in keyof T]-?: NonNullable<T[P]> }> &
  { [P in keyof T]-?: Pick<{ [Q in keyof T]-?: NonNullable<T[Q]> }, P> }[keyof T]

export type ParseExactUtil<R> = (value: Unreliable) => R | undefined

export type ParsePartialUtil<R, O = undefined> = (value: Unreliable, options?: O) => R | undefined

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

export type XmlGenerateOptions<O = Record<string, unknown>> = O & {
  stylesheets?: Array<XmlStylesheet>
}

export type JsonGenerateOptions<O = Record<string, unknown>> = O

export type XmlGenerateMain<V, O = Record<string, unknown>> = (
  value: V,
  options?: XmlGenerateOptions<O>,
) => string

export type JsonGenerateMain<V, O = Record<string, unknown>> = (
  value: V,
  options?: JsonGenerateOptions<O>,
) => unknown
