import { describe, expect, it } from 'bun:test'
import { generateControl, generateEntry } from './utils.js'

describe('generateControl', () => {
  it('should generate control with draft=true as yes', () => {
    const value = {
      draft: true,
    }
    const expected = {
      'app:draft': 'yes',
    }

    expect(generateControl(value)).toEqual(expected)
  })

  it('should generate control with draft=false as no', () => {
    const value = {
      draft: false,
    }
    const expected = {
      'app:draft': 'no',
    }

    expect(generateControl(value)).toEqual(expected)
  })

  it('should return undefined for control without draft', () => {
    const value = {}

    expect(generateControl(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateControl('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateControl(123)).toBeUndefined()
    expect(generateControl(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateControl(null)).toBeUndefined()
  })
})

describe('generateEntry', () => {
  it('should generate entry with all properties', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00Z'),
      control: {
        draft: true,
      },
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
      'app:control': {
        'app:draft': 'yes',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with edited only', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00Z'),
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with control only', () => {
    const value = {
      control: {
        draft: false,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'no',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate draft true as yes', () => {
    const value = {
      control: {
        draft: true,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'yes',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate draft false as no', () => {
    const value = {
      control: {
        draft: false,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'no',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle Date objects', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00.000Z'),
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle string dates', () => {
    const value = {
      edited: '2024-03-15T14:30:00Z',
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateEntry(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(123)).toBeUndefined()
    expect(generateEntry(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(null)).toBeUndefined()
  })

  it('should handle undefined edited value', () => {
    const value = {
      edited: undefined,
      control: {
        draft: true,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'yes',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle undefined control value', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00Z'),
      control: undefined,
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })
})
