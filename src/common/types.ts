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

export type DeepOmit<T, K extends string> = T extends Array<infer U>
  ? Array<DeepOmit<U, K>>
  : IsPlainObject<T> extends true
    ? Pick<{ [P in keyof T]: DeepOmit<T[P], K> }, Exclude<keyof T, K>>
    : T

export type Requirable<T> = T | { __requirable: T }

export type DateLike = Date | string

// Date-aware parse utils need to return different date types depending on the
// parseDateFn option, but TypeScript can't express generic functions through
// type aliases like ParseUtilPartial. Using `any` here lets all parse utils
// share the same ParseUtilPartial pattern while the public parse() entry points
// enforce the correct TDate type via generics.
// biome-ignore lint/suspicious/noExplicitAny: See above reasoning.
export type DateAny = any

export type ExtraFields<F extends ReadonlyArray<string>, V = unknown> = {
  [K in F[number]]?: V
}

export type ParseUtilExact<R> = (value: Unreliable) => R | undefined

export type ParseUtilPartial<R, O = undefined> = (value: Unreliable, options?: O) => R | undefined

export type GenerateUtil<V, O = undefined> = (
  value: V | undefined,
  options?: O,
) => Unreliable | undefined

export type ParseMainOptions<TDate = string> = {
  maxItems?: number
  parseDateFn?: (raw: string) => TDate
}

export type XmlStylesheet = {
  type: string
  href: string
  title?: string
  media?: string
  charset?: string
  alternate?: boolean
}

export type GenerateMainXmlOptions<O = Record<string, unknown>, S extends boolean = false> = O & {
  strict?: S
  stylesheets?: Array<XmlStylesheet>
}

export type GenerateMainXml<LV, SV, O = Record<string, unknown>> = <S extends boolean = false>(
  value: S extends true ? SV : LV,
  options?: GenerateMainXmlOptions<O, S>,
) => string

export type GenerateMainJsonOptions<O = Record<string, unknown>, S extends boolean = false> = O & {
  strict?: S
}

export type GenerateMainJson<LV, SV, O = Record<string, unknown>> = <S extends boolean = false>(
  value: S extends true ? SV : LV,
  options?: GenerateMainJsonOptions<O, S>,
) => unknown
