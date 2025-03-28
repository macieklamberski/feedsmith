export const detect = (value: unknown): value is string => {
  return typeof value === 'string' && /<rss[\s>]/i.test(value)
}
