export type Detect = (value: string) => boolean

export const detect: Detect = (value) => {
  return /<(?:atom:)?feed[\s>]/i.test(value)
}
