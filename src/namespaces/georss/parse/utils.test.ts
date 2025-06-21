import { describe, expect, it } from 'bun:test'
import {
  parseBox,
  parseLatLngPairs,
  parseLine,
  parsePoint,
  parsePolygon,
  retrieveItemOrFeed,
} from './utils.js'

describe('parseLatLngPairs', () => {
  it('should parse a valid string with a exactly 1 lat/lng pair', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { min: 1, max: 1 })).toEqual(expected)
  })

  it('should parse a valid string with exactly 3 lat/lng pairs', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12'
    const expected = [
      { lat: 45.256, lng: -71.92 },
      { lat: 37.8, lng: -122.41 },
      { lat: 51.5, lng: -0.12 },
    ]

    expect(parseLatLngPairs(value, { min: 3, max: 3 })).toEqual(expected)
  })

  it('should parse a valid string with exactly 3 lat/lng pairs and varied spacing', () => {
    const value = '45.256  -71.92\t37.8 -122.41    51.5 -0.12'
    const expected = [
      { lat: 45.256, lng: -71.92 },
      { lat: 37.8, lng: -122.41 },
      { lat: 51.5, lng: -0.12 },
    ]

    expect(parseLatLngPairs(value, { min: 3, max: 3 })).toEqual(expected)
  })

  it('should parse a valid string with a ranging lat/lng pairs', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { min: 1, max: 4 })).toEqual(expected)
  })

  it('should parse a valid string with a required min lat/lng pairs', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { min: 1 })).toEqual(expected)
  })

  it('should parse a valid string with a required max lat/lng pairs', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value, { max: 1 })).toEqual(expected)
  })

  it('should return undefined if pairsCount does not match the actual number of pairs', () => {
    const value = '45.256 -71.92 37.8 -122.41'

    expect(parseLatLngPairs(value, { min: 3, max: 3 })).toBeUndefined()
  })

  it('should parse a valid string with a no lat/lng pairs count requirement', () => {
    const value = '45.256 -71.92'
    const expected = [{ lat: 45.256, lng: -71.92 }]

    expect(parseLatLngPairs(value)).toEqual(expected)
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 37.8'

    expect(parseLatLngPairs(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parseLatLngPairs(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLatLngPairs(undefined)).toBeUndefined()
    expect(parseLatLngPairs(null)).toBeUndefined()
    expect(parseLatLngPairs({})).toBeUndefined()
    expect(parseLatLngPairs([])).toBeUndefined()
  })

  it('should handle non-numeric coordinates', () => {
    const value = 'invalid 123 45.256 -71.92'

    expect(parseLatLngPairs(value)).toBeUndefined()
  })

  it('should handle a mix of valid and invalid coordinates', () => {
    const value = '45.256 -71.92 invalid text'

    expect(parseLatLngPairs(value)).toBeUndefined()
  })
})

describe('parsePoint', () => {
  it('should parse valid point string with space separator', () => {
    const value = '45.256 -71.92'
    const expected = {
      lat: 45.256,
      lng: -71.92,
    }

    expect(parsePoint(value)).toEqual(expected)
  })

  it('should return undefined for invalid point format with too many coordinates', () => {
    const value = '45.256 -71.92 123.45'

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should return undefined for invalid point format with too few coordinates', () => {
    const value = '45.256'

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should handle non-numeric coordinates', () => {
    const value = 'invalid latitude'

    expect(parsePoint(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parsePoint(3)).toBeUndefined()
    expect(parsePoint(undefined)).toBeUndefined()
    expect(parsePoint(null)).toBeUndefined()
    expect(parsePoint({})).toBeUndefined()
    expect(parsePoint([])).toBeUndefined()
  })
})

describe('parseLine', () => {
  it('should parse a valid line with exactly 2 points', () => {
    const value = '45.256 -71.92 37.8 -122.41'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
      ],
    }

    expect(parseLine(value)).toEqual(expected)
  })

  it('should parse a valid line with more than 2 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
      ],
    }

    expect(parseLine(value)).toEqual(expected)
  })

  it('should handle a line with varied spacing', () => {
    const value = '45.256  -71.92\t37.8 -122.41'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
      ],
    }

    expect(parseLine(value)).toEqual(expected)
  })

  it('should handle non-numeric coordinates', () => {
    const value = '45.256 -71.92 invalid latitude'

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined if there are fewer than 2 points', () => {
    const value = '45.256 -71.92'

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 37.8'

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parseLine(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseLine(undefined)).toBeUndefined()
    expect(parseLine(null)).toBeUndefined()
    expect(parseLine({})).toBeUndefined()
    expect(parseLine([])).toBeUndefined()
  })
})

describe('parsePolygon', () => {
  it('should parse a valid polygon with exactly 4 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12 40.7 -74.0'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
        { lat: 40.7, lng: -74.0 },
      ],
    }

    expect(parsePolygon(value)).toEqual(expected)
  })

  it('should parse a valid polygon with more than 4 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12 40.7 -74.0 35.6 139.7'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
        { lat: 40.7, lng: -74.0 },
        { lat: 35.6, lng: 139.7 },
      ],
    }

    expect(parsePolygon(value)).toEqual(expected)
  })

  it('should handle a polygon with varied spacing', () => {
    const value = '45.256  -71.92\t37.8 -122.41    51.5 -0.12 40.7 -74.0'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 37.8, lng: -122.41 },
        { lat: 51.5, lng: -0.12 },
        { lat: 40.7, lng: -74.0 },
      ],
    }

    expect(parsePolygon(value)).toEqual(expected)
  })

  it('should handle non-numeric coordinates', () => {
    const value = '45.256 -71.92 37.8 -122.41 invalid latitude -0.12'

    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined if there are fewer than 4 points', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12'

    // This is three points, but the function requires at least 4.
    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 37.8 -122.41 51.5 -0.12 40.7'

    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parsePolygon(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parsePolygon(undefined)).toBeUndefined()
    expect(parsePolygon(null)).toBeUndefined()
    expect(parsePolygon({})).toBeUndefined()
    expect(parsePolygon([])).toBeUndefined()
  })
})

describe('parseBox', () => {
  it('should parse a valid box with exactly 2 points', () => {
    const value = '45.256 -71.92 51.5 -0.12'
    const expected = {
      lowerCorner: { lat: 45.256, lng: -71.92 },
      upperCorner: { lat: 51.5, lng: -0.12 },
    }

    expect(parseBox(value)).toEqual(expected)
  })

  it('should handle a box with varied spacing', () => {
    const value = '45.256  -71.92\t51.5 -0.12'
    const expected = {
      lowerCorner: { lat: 45.256, lng: -71.92 },
      upperCorner: { lat: 51.5, lng: -0.12 },
    }

    expect(parseBox(value)).toEqual(expected)
  })

  it('should handle partial box objects with missing corners', () => {
    // This simulates a case where parseLatLngPairs returns valid points
    // but one of them has undefined coordinates.
    const valueWithInvalidPoints = '45.256 NaN 51.5 -0.12'

    expect(parseBox(valueWithInvalidPoints)).toBeUndefined()
  })

  it('should return undefined if there are not exactly 2 points', () => {
    const valueTooFew = '45.256 -71.92'
    const valueTooMany = '45.256 -71.92 51.5 -0.12 40.7 -74.0'

    expect(parseBox(valueTooFew)).toBeUndefined()
    expect(parseBox(valueTooMany)).toBeUndefined()
  })

  it('should return undefined if the number of coordinates is odd', () => {
    const value = '45.256 -71.92 51.5'

    expect(parseBox(value)).toBeUndefined()
  })

  it('should return undefined for empty strings', () => {
    const value = ''

    expect(parseBox(value)).toBeUndefined()
  })

  it('should handle non-numeric coordinates', () => {
    const value = '45.256 -71.92 invalid latitude'

    expect(parseBox(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseBox(undefined)).toBeUndefined()
    expect(parseBox(null)).toBeUndefined()
    expect(parseBox({})).toBeUndefined()
    expect(parseBox([])).toBeUndefined()
  })
})

describe('retrieveItemOrFeed', () => {
  const expectedFull = {
    point: { lat: 45.256, lng: -71.92 },
    line: {
      points: [
        { lat: 45.256, lng: -110.45 },
        { lat: 46.46, lng: -109.48 },
        { lat: 43.84, lng: -109.86 },
      ],
    },
    polygon: {
      points: [
        { lat: 45.256, lng: -110.45 },
        { lat: 46.46, lng: -109.48 },
        { lat: 43.84, lng: -109.86 },
        { lat: 45.256, lng: -110.45 },
      ],
    },
    box: {
      lowerCorner: { lat: 42.943, lng: -71.032 },
      upperCorner: { lat: 43.039, lng: -69.856 },
    },
    featureTypeTag: 'city',
    relationshipTag: 'is-centroid-of',
    featureName: 'Portland',
    elev: 63,
    floor: 2,
    radius: 500,
  }

  it('should parse a complete itemOrFeed with all GeoRSS properties (with #text)', () => {
    const value = {
      'georss:point': { '#text': '45.256 -71.92' },
      'georss:line': { '#text': '45.256 -110.45 46.46 -109.48 43.84 -109.86' },
      'georss:polygon': { '#text': '45.256 -110.45 46.46 -109.48 43.84 -109.86 45.256 -110.45' },
      'georss:box': { '#text': '42.943 -71.032 43.039 -69.856' },
      'georss:featuretypetag': { '#text': 'city' },
      'georss:relationshiptag': { '#text': 'is-centroid-of' },
      'georss:featurename': { '#text': 'Portland' },
      'georss:elev': { '#text': '63' },
      'georss:floor': { '#text': '2' },
      'georss:radius': { '#text': '500' },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse a complete itemOrFeed with all GeoRSS properties (without #text)', () => {
    const value = {
      'georss:point': '45.256 -71.92',
      'georss:line': '45.256 -110.45 46.46 -109.48 43.84 -109.86',
      'georss:polygon': '45.256 -110.45 46.46 -109.48 43.84 -109.86 45.256 -110.45',
      'georss:box': '42.943 -71.032 43.039 -69.856',
      'georss:featuretypetag': 'city',
      'georss:relationshiptag': 'is-centroid-of',
      'georss:featurename': 'Portland',
      'georss:elev': '63',
      'georss:floor': '2',
      'georss:radius': '500',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse a complete itemOrFeed with all GeoRSS properties (as array of values)', () => {
    const value = {
      'georss:point': ['45.256 -71.92'],
      'georss:line': ['45.256 -110.45 46.46 -109.48 43.84 -109.86'],
      'georss:polygon': ['45.256 -110.45 46.46 -109.48 43.84 -109.86 45.256 -110.45'],
      'georss:box': ['42.943 -71.032 43.039 -69.856'],
      'georss:featuretypetag': ['city'],
      'georss:relationshiptag': ['is-centroid-of'],
      'georss:featurename': ['Portland'],
      'georss:elev': ['63'],
      'georss:floor': ['2'],
      'georss:radius': ['500'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse itemOrFeed with only point property', () => {
    const value = {
      'georss:point': '45.256 -71.92',
    }
    const expected = {
      point: { lat: 45.256, lng: -71.92 },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse itemOrFeed with only line property', () => {
    const value = {
      'georss:line': '45.256 -110.45 46.46 -109.48 43.84 -109.86',
    }
    const expected = {
      line: {
        points: [
          { lat: 45.256, lng: -110.45 },
          { lat: 46.46, lng: -109.48 },
          { lat: 43.84, lng: -109.86 },
        ],
      },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse itemOrFeed with only polygon property', () => {
    const value = {
      'georss:polygon': '45.256 -110.45 46.46 -109.48 43.84 -109.86 45.256 -110.45',
    }
    const expected = {
      polygon: {
        points: [
          { lat: 45.256, lng: -110.45 },
          { lat: 46.46, lng: -109.48 },
          { lat: 43.84, lng: -109.86 },
          { lat: 45.256, lng: -110.45 },
        ],
      },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse itemOrFeed with only box property', () => {
    const value = {
      'georss:box': '42.943 -71.032 43.039 -69.856',
    }
    const expected = {
      box: {
        lowerCorner: { lat: 42.943, lng: -71.032 },
        upperCorner: { lat: 43.039, lng: -69.856 },
      },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      'georss:elev': 63,
      'georss:floor': 2,
      'georss:radius': 500,
    }
    const expected = {
      elev: 63,
      floor: 2,
      radius: 500,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle coercible string values', () => {
    const value = {
      'georss:featuretypetag': 123,
      'georss:relationshiptag': 456,
      'georss:featurename': 789,
    }
    const expected = {
      featureTypeTag: '123',
      relationshipTag: '456',
      featureName: '789',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      'georss:point': '45.256 -71.92',
      'georss:featurename': 'Portland',
      'invalid:property': 'should be ignored',
      random: 'value',
    }
    const expected = {
      point: { lat: 45.256, lng: -71.92 },
      featureName: 'Portland',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle null or undefined property values', () => {
    const value = {
      'georss:point': null,
      'georss:featurename': undefined,
      'georss:elev': '63',
    }
    const expected = {
      elev: 63,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      unrelated: 'property',
      random: 'value',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(retrieveItemOrFeed('not an object')).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
  })
})
