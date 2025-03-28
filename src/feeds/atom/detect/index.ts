export const detect = (value: unknown): value is string => {
  return typeof value === 'string' && /<(?:atom:)?feed[\s>]/i.test(value)
}
