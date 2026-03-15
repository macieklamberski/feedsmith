import { describe, expect, it } from 'bun:test'
import { DetectError, ParseError } from './errors.js'

describe('DetectError', () => {
  it('should set message', () => {
    const error = new DetectError('Test error')

    expect(error.message).toBe('Test error')
  })

  it('should be instance of Error', () => {
    const error = new DetectError('Test error')

    expect(error).toBeInstanceOf(Error)
  })

  it('should have name set to DetectError', () => {
    const error = new DetectError('Test error')

    expect(error.name).toBe('DetectError')
  })
})

describe('ParseError', () => {
  it('should set message', () => {
    const error = new ParseError('Test error')

    expect(error.message).toBe('Test error')
  })

  it('should be instance of Error', () => {
    const error = new ParseError('Test error')

    expect(error).toBeInstanceOf(Error)
  })

  it('should have name set to ParseError', () => {
    const error = new ParseError('Test error')

    expect(error.name).toBe('ParseError')
  })
})
