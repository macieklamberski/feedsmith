import { describe, expect, it } from 'bun:test'
import { DetectError, ParseError } from './error.js'

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
  it('should include line and column in message', () => {
    const error = new ParseError('Test error', { line: 5, column: 10 })

    expect(error.message).toBe('Test error (line 5, column 10)')
    expect(error.line).toBe(5)
    expect(error.column).toBe(10)
  })

  it('should include code when provided', () => {
    const error = new ParseError('Test error', { line: 3, column: 7, code: 'InvalidTag' })

    expect(error.code).toBe('InvalidTag')
  })

  it('should include cause when provided', () => {
    const cause = new Error('Original error')
    const error = new ParseError('Test error', { cause })

    expect(error.cause).toBe(cause)
  })

  it('should not include line and column in message when not provided', () => {
    const error = new ParseError('Test error')

    expect(error.message).toBe('Test error')
    expect(error.line).toBeUndefined()
    expect(error.column).toBeUndefined()
  })

  it('should not include line and column when only line is provided', () => {
    const error = new ParseError('Test error', { line: 5 })

    expect(error.message).toBe('Test error')
    expect(error.line).toBe(5)
    expect(error.column).toBeUndefined()
  })

  it('should not include line and column when only column is provided', () => {
    const error = new ParseError('Test error', { column: 10 })

    expect(error.message).toBe('Test error')
    expect(error.line).toBeUndefined()
    expect(error.column).toBe(10)
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
