import { describe, expect, it } from 'bun:test'
import { parseControl, retrieveEntry } from './utils.js'

describe('parseControl', () => {
  it('should parse control with draft=yes', () => {
    const value = {
      'app:draft': 'yes',
    }
    const expected = {
      draft: true,
    }

    expect(parseControl(value)).toEqual(expected)
  })

  it('should parse control with draft=no', () => {
    const value = {
      'app:draft': 'no',
    }
    const expected = {
      draft: false,
    }

    expect(parseControl(value)).toEqual(expected)
  })

  it('should return undefined for control without draft', () => {
    const value = {}

    expect(parseControl(value)).toBeUndefined()
  })

  it('should handle invalid draft values', () => {
    const value = {
      'app:draft': 'maybe',
    }
    const expected = {
      draft: false,
    }

    expect(parseControl(value)).toEqual(expected)
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseControl(null)).toBeUndefined()
    expect(parseControl(undefined)).toBeUndefined()
    expect(parseControl('string')).toBeUndefined()
  })
})

describe('retrieveEntry', () => {
  it('should parse entry with edited and control', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00Z',
      'app:control': {
        'app:draft': 'yes',
      },
    }
    const expected = {
      edited: '2024-03-15T14:30:00Z',
      control: {
        draft: true,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse entry with edited only', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00Z',
    }
    const expected = {
      edited: '2024-03-15T14:30:00Z',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse entry with control only', () => {
    const value = {
      'app:control': {
        'app:draft': 'no',
      },
    }
    const expected = {
      control: {
        draft: false,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse draft=yes as true', () => {
    const value = {
      'app:control': {
        'app:draft': 'yes',
      },
    }
    const expected = {
      control: {
        draft: true,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse draft=no as false', () => {
    const value = {
      'app:control': {
        'app:draft': 'no',
      },
    }
    const expected = {
      control: {
        draft: false,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle ISO 8601 dates', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }
    const expected = {
      edited: '2024-03-15T14:30:00.000Z',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle dates without milliseconds', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00Z',
    }
    const expected = {
      edited: '2024-03-15T14:30:00Z',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'app:edited': '',
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should handle invalid dates', () => {
    const value = {
      'app:edited': 'not-a-date',
    }
    const expected = {
      edited: 'not-a-date',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveEntry(null)).toBeUndefined()
    expect(retrieveEntry(undefined)).toBeUndefined()
    expect(retrieveEntry('string')).toBeUndefined()
    expect(retrieveEntry(123)).toBeUndefined()
  })
})
