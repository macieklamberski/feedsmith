export const detect = (value: unknown): value is string => {
  return typeof value === 'string' && /<rdf:rdf[\s>]/i.test(value)
}
