// TODO: Try to use: { [key: string]: Unreliable } | undefined for better type safety.
// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any

type Simplify<T> = { [K in keyof T]: T[K] }
type Unwrap<T> = T extends { __requirable: infer U } ? U : T
type HasMarker<T> = [Extract<T, { __requirable: unknown }>] extends [never] ? false : true
type Optional<T> = { [K in keyof T]-?: object extends Pick<T, K> ? K : never }[keyof T]
type Marked<T> = { [K in keyof T]-?: HasMarker<T[K]> extends true ? K : never }[keyof T]

export type Strict<T, S extends boolean> = Simplify<
  S extends true
    ? { [K in Exclude<keyof T, Optional<T>>]-?: Unwrap<T[K]> } & {
        [K in Optional<T>]?: Unwrap<T[K]>
      }
    : { [K in Exclude<keyof T, Optional<T> | Marked<T>>]-?: Unwrap<T[K]> } & {
        [K in Optional<T> | Marked<T>]?: Unwrap<T[K]>
      }
>

export type Requirable<T> = T | { __requirable: T }

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

export type XmlGenerateOptions<O = Record<string, unknown>, S extends boolean = false> = O & {
  strict?: S
  stylesheets?: Array<XmlStylesheet>
}

export type XmlGenerateMain<L, St, O = Record<string, unknown>> = <S extends boolean = false>(
  value: S extends true ? St : L,
  options?: XmlGenerateOptions<O, S>,
) => string

export type JsonGenerateOptions<O = Record<string, unknown>, S extends boolean = false> = O & {
  strict?: S
}

export type JsonGenerateMain<L, St, O = Record<string, unknown>> = <S extends boolean = false>(
  value: S extends true ? St : L,
  options?: JsonGenerateOptions<O, S>,
) => unknown
