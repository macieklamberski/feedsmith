import { describe, expect, test } from 'bun:test'
import { detect } from './'

describe('detect', () => {
  test('detect any object as potential JSON feed', () => {
    expect(detect({})).toBe(true)
  })

  test('return false for non-object value', () => {
    expect(detect('')).toBe(false)
    expect(detect(undefined)).toEqual(false)
    expect(detect(null)).toEqual(false)
    expect(detect([])).toEqual(false)
  })
})
