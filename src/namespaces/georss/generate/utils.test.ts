import { describe, expect, it } from 'bun:test'
import {
  generateBox,
  generateItemOrFeed,
  generateLatLngPairs,
  generateLine,
  generatePoint,
  generatePolygon,
} from './utils.js'

describe('generateLatLngPairs', () => {
  it('should generate coordinate string from array of points', () => {
    const value = [
      { lat: 45.256, lng: -71.92 },
      { lat: 46.46, lng: -71.781 },
    ]
    const expected = '45.256 -71.92 46.46 -71.781'

    expect(generateLatLngPairs(value)).toBe(expected)
  })

  it('should handle single point', () => {
    const value = [{ lat: 45.256, lng: -71.92 }]
    const expected = '45.256 -71.92'

    expect(generateLatLngPairs(value)).toBe(expected)
  })

  it('should handle integer coordinates', () => {
    const value = [
      { lat: 45, lng: -72 },
      { lat: 46, lng: -71 },
    ]
    const expected = '45 -72 46 -71'

    expect(generateLatLngPairs(value)).toBe(expected)
  })

  it('should handle zero coordinates', () => {
    const value = [{ lat: 0, lng: 0 }]
    const expected = '0 0'

    expect(generateLatLngPairs(value)).toBe(expected)
  })

  it('should skip invalid points', () => {
    const value = [
      { lat: 45.256, lng: -71.92 },
      { lat: 'invalid', lng: -71.781 },
      { lat: 46.46, lng: -71.781 },
    ]
    const expected = '45.256 -71.92 46.46 -71.781'

    // @ts-ignore: This is for testing purposes.
    expect(generateLatLngPairs(value)).toBe(expected)
  })

  it('should handle missing lat or lng', () => {
    const value = [
      { lat: 45.256, lng: -71.92 },
      { lng: -71.781 },
      { lat: 46.46 },
      { lat: 47.0, lng: -70.0 },
    ]
    const expected = '45.256 -71.92 47 -70'

    // @ts-ignore: This is for testing purposes.
    expect(generateLatLngPairs(value)).toBe(expected)
  })

  it('should allow pairs within min-max range', () => {
    const value = [
      { lat: 45.256, lng: -71.92 },
      { lat: 46.46, lng: -71.781 },
    ]
    const expected = '45.256 -71.92 46.46 -71.781'

    expect(generateLatLngPairs(value, { min: 2, max: 4 })).toBe(expected)
  })

  it('should work without pairs count constraints', () => {
    const value = [{ lat: 45.256, lng: -71.92 }]
    const expected = '45.256 -71.92'

    expect(generateLatLngPairs(value)).toBe(expected)
  })

  it('should return undefined for empty array', () => {
    expect(generateLatLngPairs([])).toBeUndefined()
  })

  it('should return undefined when all points are invalid', () => {
    const value = [
      { lat: 'invalid', lng: 'invalid' },
      { lat: null, lng: undefined },
    ]

    // @ts-ignore: This is for testing purposes.
    expect(generateLatLngPairs(value)).toBeUndefined()
  })

  it('should enforce minimum pairs count', () => {
    const value = [{ lat: 45.256, lng: -71.92 }]

    expect(generateLatLngPairs(value, { min: 2 })).toBeUndefined()
  })

  it('should enforce maximum pairs count', () => {
    const value = [
      { lat: 45.256, lng: -71.92 },
      { lat: 46.46, lng: -71.781 },
      { lat: 47.0, lng: -70.0 },
    ]

    expect(generateLatLngPairs(value, { max: 2 })).toBeUndefined()
  })
})

describe('generatePoint', () => {
  it('should generate valid point string', () => {
    const value = { lat: 45.256, lng: -71.92 }
    const expected = '45.256 -71.92'

    expect(generatePoint(value)).toBe(expected)
  })

  it('should handle integer coordinates', () => {
    const value = { lat: 45, lng: -72 }
    const expected = '45 -72'

    expect(generatePoint(value)).toBe(expected)
  })

  it('should handle zero coordinates', () => {
    const value = { lat: 0, lng: 0 }
    const expected = '0 0'

    expect(generatePoint(value)).toBe(expected)
  })

  it('should return undefined for missing lat', () => {
    const value = { lng: -71.92 }

    // @ts-ignore: This is for testing purposes.
    expect(generatePoint(value)).toBeUndefined()
  })

  it('should return undefined for missing lng', () => {
    const value = { lat: 45.256 }

    // @ts-ignore: This is for testing purposes.
    expect(generatePoint(value)).toBeUndefined()
  })

  it('should return undefined for string coordinates', () => {
    const value = { lat: '45.256', lng: '-71.92' }

    // @ts-ignore: This is for testing purposes.
    expect(generatePoint(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generatePoint(undefined)).toBeUndefined()
  })
})

describe('generateLine', () => {
  it('should generate valid line string with 2 points', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -71.781 },
      ],
    }
    const expected = '45.256 -71.92 46.46 -71.781'

    expect(generateLine(value)).toBe(expected)
  })

  it('should generate valid line string with multiple points', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -71.781 },
        { lat: 43.84, lng: -79.81 },
      ],
    }
    const expected = '45.256 -71.92 46.46 -71.781 43.84 -79.81'

    expect(generateLine(value)).toBe(expected)
  })

  it('should skip invalid points and continue if enough valid points remain', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 'invalid', lng: -71.781 },
        { lat: 46.46, lng: -71.781 },
      ],
    }
    const expected = '45.256 -71.92 46.46 -71.781'

    // @ts-ignore: This is for testing purposes.
    expect(generateLine(value)).toBe(expected)
  })

  it('should return undefined for line with only 1 point', () => {
    const value = {
      points: [{ lat: 45.256, lng: -71.92 }],
    }

    expect(generateLine(value)).toBeUndefined()
  })

  it('should return undefined for empty points array', () => {
    const value = { points: [] }

    expect(generateLine(value)).toBeUndefined()
  })

  it('should return undefined for non-array points', () => {
    const value = { points: 'not an array' }

    // @ts-ignore: This is for testing purposes.
    expect(generateLine(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateLine(undefined)).toBeUndefined()
  })

  it('should return undefined if all points are invalid', () => {
    const value = {
      points: [
        { lat: 'invalid', lng: 'invalid' },
        { lat: null, lng: undefined },
      ],
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateLine(value)).toBeUndefined()
  })
})

describe('generatePolygon', () => {
  it('should generate valid polygon string with 4 points', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -71.781 },
        { lat: 43.84, lng: -79.81 },
        { lat: 45.256, lng: -71.92 },
      ],
    }
    const expected = '45.256 -71.92 46.46 -71.781 43.84 -79.81 45.256 -71.92'

    expect(generatePolygon(value)).toBe(expected)
  })

  it('should generate valid polygon string with more than 4 points', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -71.781 },
        { lat: 44.5, lng: -72.5 },
        { lat: 43.84, lng: -79.81 },
        { lat: 45.256, lng: -71.92 },
      ],
    }
    const expected = '45.256 -71.92 46.46 -71.781 44.5 -72.5 43.84 -79.81 45.256 -71.92'

    expect(generatePolygon(value)).toBe(expected)
  })

  it('should skip invalid points and continue if enough valid points remain', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 'invalid', lng: -71.781 },
        { lat: 46.46, lng: -71.781 },
        { lat: 43.84, lng: -79.81 },
        { lat: 45.256, lng: -71.92 },
      ],
    }
    const expected = '45.256 -71.92 46.46 -71.781 43.84 -79.81 45.256 -71.92'

    // @ts-ignore: This is for testing purposes.
    expect(generatePolygon(value)).toBe(expected)
  })

  it('should return undefined if insufficient valid points', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 'invalid', lng: 'invalid' },
        { lat: null, lng: undefined },
      ],
    }

    // @ts-ignore: This is for testing purposes.
    expect(generatePolygon(value)).toBeUndefined()
  })

  it('should return undefined for polygon with only 3 points', () => {
    const value = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -71.781 },
        { lat: 43.84, lng: -79.81 },
      ],
    }

    expect(generatePolygon(value)).toBeUndefined()
  })

  it('should return undefined for empty points array', () => {
    const value = { points: [] }

    expect(generatePolygon(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generatePolygon(undefined)).toBeUndefined()
  })
})

describe('generateBox', () => {
  it('should generate valid box string', () => {
    const value = {
      lowerCorner: { lat: 42.943, lng: -71.032 },
      upperCorner: { lat: 43.039, lng: -69.856 },
    }
    const expected = '42.943 -71.032 43.039 -69.856'

    expect(generateBox(value)).toBe(expected)
  })

  it('should handle integer coordinates', () => {
    const value = {
      lowerCorner: { lat: 42, lng: -71 },
      upperCorner: { lat: 43, lng: -69 },
    }
    const expected = '42 -71 43 -69'

    expect(generateBox(value)).toBe(expected)
  })

  it('should handle zero coordinates', () => {
    const value = {
      lowerCorner: { lat: 0, lng: 0 },
      upperCorner: { lat: 1, lng: 1 },
    }
    const expected = '0 0 1 1'

    expect(generateBox(value)).toBe(expected)
  })

  it('should return undefined for missing lowerCorner', () => {
    const value = {
      upperCorner: { lat: 43.039, lng: -69.856 },
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateBox(value)).toBeUndefined()
  })

  it('should return undefined for missing upperCorner', () => {
    const value = {
      lowerCorner: { lat: 42.943, lng: -71.032 },
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateBox(value)).toBeUndefined()
  })

  it('should return undefined for invalid corner coordinates', () => {
    const value = {
      lowerCorner: { lat: '42.943', lng: -71.032 },
      upperCorner: { lat: 43.039, lng: -69.856 },
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateBox(value)).toBeUndefined()
  })

  it('should return undefined for non-object corners', () => {
    const value = {
      lowerCorner: 'not an object',
      upperCorner: { lat: 43.039, lng: -69.856 },
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateBox(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateBox(undefined)).toBeUndefined()
  })
})

describe('generateItemOrFeed', () => {
  it('should generate itemOrFeed object with all geometric properties', () => {
    const value = {
      point: { lat: 45.256, lng: -71.92 },
      line: {
        points: [
          { lat: 45.256, lng: -71.92 },
          { lat: 46.46, lng: -71.781 },
        ],
      },
      polygon: {
        points: [
          { lat: 45.256, lng: -71.92 },
          { lat: 46.46, lng: -71.781 },
          { lat: 43.84, lng: -79.81 },
          { lat: 45.256, lng: -71.92 },
        ],
      },
      box: {
        lowerCorner: { lat: 42.943, lng: -71.032 },
        upperCorner: { lat: 43.039, lng: -69.856 },
      },
    }
    const expected = {
      'georss:point': '45.256 -71.92',
      'georss:line': '45.256 -71.92 46.46 -71.781',
      'georss:polygon': '45.256 -71.92 46.46 -71.781 43.84 -79.81 45.256 -71.92',
      'georss:box': '42.943 -71.032 43.039 -69.856',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate itemOrFeed object with metadata properties', () => {
    const value = {
      point: { lat: 45.256, lng: -71.92 },
      featureTypeTag: 'city',
      relationshipTag: 'is-centred-at',
      featureName: 'New York City',
      elev: 100,
      floor: 2,
      radius: 500,
    }
    const expected = {
      'georss:point': '45.256 -71.92',
      'georss:featureTypeTag': 'city',
      'georss:relationshipTag': 'is-centred-at',
      'georss:featureName': 'New York City',
      'georss:elev': 100,
      'georss:floor': 2,
      'georss:radius': 500,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate itemOrFeed object with only valid properties', () => {
    const value = {
      point: { lat: 45.256, lng: -71.92 },
      line: { points: [{ lat: 45.256, lng: -71.92 }] }, // Invalid: only 1 point.
      featureTypeTag: 'city',
      featureName: undefined,
      elev: 0,
      floor: null,
    }
    const expected = {
      'georss:point': '45.256 -71.92',
      'georss:featureTypeTag': 'city',
      'georss:elev': 0,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
  })

  it('should generate itemOrFeed with only one geometric shape', () => {
    const value = {
      point: { lat: 45.256, lng: -71.92 },
    }
    const expected = {
      'georss:point': '45.256 -71.92',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      point: { lat: 45.256, lng: -71.92 },
      line: { points: [] }, // Invalid: empty points.
      polygon: { points: 'not an array' }, // Invalid: not array.
      box: { lowerCorner: { lat: 42.943, lng: -71.032 } }, // Invalid: missing upperCorner.
      featureTypeTag: 'city',
      relationshipTag: '',
      featureName: 'Valid Name',
    }
    const expected = {
      'georss:point': '45.256 -71.92',
      'georss:featureTypeTag': 'city',
      'georss:featureName': 'Valid Name',
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateItemOrFeed(value)).toEqual(expected)
  })
})
