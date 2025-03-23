export type Detect = (value: unknown) => boolean

export const detect: Detect = (value): value is string => {
  return typeof value === 'string' && /<rss[\s>]/i.test(value)
}
