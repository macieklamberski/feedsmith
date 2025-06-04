// TODO: Try to use: { [key: string]: Unreliable } | undefined for better type safety.
// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any

export type DateLike = Date | string

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends Record<PropertyKey, unknown>
      ? T[P] extends CallableFunction | Array<unknown>
        ? T[P]
        : DeepPartial<T[P]>
      : T[P]
}

export type ParseFunction<R, O = never> = (value: Unreliable, options?: O) => R | undefined

export type GenerateFunction<V> = (value: V | undefined) => Unreliable | undefined
