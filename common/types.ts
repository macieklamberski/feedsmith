export type ParseLevel = 'strict' | 'skip' | 'coerce'

export type NonStrictParseLevel = 'skip' | 'coerce'

export type ParseFunction<T> = (value: unknown, level: NonStrictParseLevel) => T | undefined
