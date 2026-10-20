import { describe, expect, it } from 'bun:test'
import {
  parseCircleByCenterPoint,
  parseCoordinates,
  parseEnvelope,
  parseExterior,
  parseLinearRing,
  parseLineString,
  parsePoint,
  parsePolygon,
  parsePosition,
  parsePositionList,
  parseRadius,
  retrieveWhere,
} from './utils.js'

describe('parseCoordinates', () => {
  it('should parse pairs of latitude and longitude', () => {
    const value = '45.256 -71.92 46.46 -72.41'
    const expected = [
      { lat: 45.256, lng: -71.92 },
      { lat: 46.46, lng: -72.41 },
    ]

    expect(parseCoordinates(value)).toEqual(expected)
  })

  it('should parse triples with a height when the dimension is 3', () => {
    const value = '42.3453 -156.2342 45 42.35 -156.24 50'
    const expected = [
      { lat: 42.3453, lng: -156.2342, alt: 45 },
      { lat: 42.35, lng: -156.24, alt: 50 },
    ]

    expect(parseCoordinates(value, 3)).toEqual(expected)
  })

  it('should handle varied whitespace', () => {
    const value = '  45.256\t-71.92\n46.46  -72.41 '
    const expected = [
      { lat: 45.256, lng: -71.92 },
      { lat: 46.46, lng: -72.41 },
    ]

    expect(parseCoordinates(value)).toEqual(expected)
  })

  it('should return undefined when the count does not fit the dimension', () => {
    expect(parseCoordinates('45.256 -71.92 46.46')).toBeUndefined()
    expect(parseCoordinates('45.256 -71.92 46.46 -72.41', 3)).toBeUndefined()
  })

  it('should return undefined for an unsupported dimension', () => {
    expect(parseCoordinates('45.256 -71.92 46.46 -72.41', 4)).toBeUndefined()
  })

  it('should return undefined when a value is not a number', () => {
    expect(parseCoordinates('45.256 north')).toBeUndefined()
  })

  it('should return undefined for empty and non-string inputs', () => {
    expect(parseCoordinates('')).toBeUndefined()
    expect(parseCoordinates('   ')).toBeUndefined()
    expect(parseCoordinates(undefined)).toBeUndefined()
    expect(parseCoordinates({})).toBeUndefined()
  })
})

describe('parsePosition', () => {
  it('should parse a position with its attributes', () => {
    const value = {
      '#text': '45.256 -71.92',
      '@srsname': 'EPSG:4326',
      '@srsdimension': '2',
    }
    const expected = {
      lat: 45.256,
      lng: -71.92,
      srsName: 'EPSG:4326',
      srsDimension: 2,
    }

    expect(parsePosition(value)).toEqual(expected)
  })

  it('should parse a position given as plain text', () => {
    const value = '45.256 -71.92'
    const expected = { lat: 45.256, lng: -71.92 }

    expect(parsePosition(value)).toEqual(expected)
  })

  it('should use the dimension inherited from the geometry', () => {
    const value = '42.3453 -156.2342 45'
    const expected = { lat: 42.3453, lng: -156.2342, alt: 45 }

    expect(parsePosition(value, 3)).toEqual(expected)
  })

  it('should prefer its own dimension over the inherited one', () => {
    const value = { '#text': '45.256 -71.92', '@srsdimension': '2' }
    const expected = { lat: 45.256, lng: -71.92, srsDimension: 2 }

    expect(parsePosition(value, 3)).toEqual(expected)
  })

  it('should return undefined when the text holds more than one position', () => {
    expect(parsePosition('45.256 -71.92 46.46 -72.41')).toBeUndefined()
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parsePosition('')).toBeUndefined()
    expect(parsePosition(undefined)).toBeUndefined()
    expect(parsePosition({})).toBeUndefined()
  })
})

describe('parsePositionList', () => {
  it('should parse a position list with its attributes', () => {
    const value = {
      '#text': '45.256 -71.92 46.46 -72.41',
      '@srsname': 'EPSG:4326',
      '@srsdimension': '2',
      '@count': '2',
    }
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -72.41 },
      ],
      srsName: 'EPSG:4326',
      srsDimension: 2,
      count: 2,
    }

    expect(parsePositionList(value)).toEqual(expected)
  })

  it('should parse a position list given as plain text', () => {
    const value = '45.256 -71.92 46.46 -72.41'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92 },
        { lat: 46.46, lng: -72.41 },
      ],
    }

    expect(parsePositionList(value)).toEqual(expected)
  })

  it('should use the dimension inherited from the geometry', () => {
    const value = '45.256 -71.92 10 46.46 -72.41 12'
    const expected = {
      points: [
        { lat: 45.256, lng: -71.92, alt: 10 },
        { lat: 46.46, lng: -72.41, alt: 12 },
      ],
    }

    expect(parsePositionList(value, 3)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parsePositionList('')).toBeUndefined()
    expect(parsePositionList(undefined)).toBeUndefined()
    expect(parsePositionList({})).toBeUndefined()
  })
})

describe('parsePoint', () => {
  it('should parse a point with all properties', () => {
    const value = {
      '@gml:id': 'p1',
      '@srsname': 'EPSG:4326',
      '@srsdimension': '2',
      'gml:pos': '45.256 -71.92',
    }
    const expected = {
      id: 'p1',
      srsName: 'EPSG:4326',
      srsDimension: 2,
      pos: { lat: 45.256, lng: -71.92 },
    }

    expect(parsePoint(value)).toEqual(expected)
  })

  it('should parse a point with only a position', () => {
    const value = { 'gml:pos': '45.256 -71.92' }
    const expected = {
      pos: { lat: 45.256, lng: -71.92 },
    }

    expect(parsePoint(value)).toEqual(expected)
  })

  it('should read a height when the point has three dimensions', () => {
    const value = {
      '@srsname': 'urn:ogc:def:crs:EPSG:9.0:4979',
      '@srsdimension': '3',
      'gml:pos': '42.3453 -156.2342 45',
    }
    const expected = {
      srsName: 'urn:ogc:def:crs:EPSG:9.0:4979',
      srsDimension: 3,
      pos: { lat: 42.3453, lng: -156.2342, alt: 45 },
    }

    expect(parsePoint(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parsePoint({})).toBeUndefined()
    expect(parsePoint('45.256 -71.92')).toBeUndefined()
    expect(parsePoint(undefined)).toBeUndefined()
  })
})

describe('parseLineString', () => {
  it('should parse a line string with all properties', () => {
    const value = {
      '@gml:id': 'l1',
      '@srsname': 'EPSG:4326',
      'gml:poslist': '45.256 -71.92 46.46 -72.41',
    }
    const expected = {
      id: 'l1',
      srsName: 'EPSG:4326',
      posList: {
        points: [
          { lat: 45.256, lng: -71.92 },
          { lat: 46.46, lng: -72.41 },
        ],
      },
    }

    expect(parseLineString(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parseLineString({})).toBeUndefined()
    expect(parseLineString('45.256 -71.92')).toBeUndefined()
    expect(parseLineString(undefined)).toBeUndefined()
  })
})

describe('parseLinearRing', () => {
  it('should parse a linear ring', () => {
    const value = { 'gml:poslist': '45 -110 46 -109 43 -109 45 -110' }
    const expected = {
      posList: {
        points: [
          { lat: 45, lng: -110 },
          { lat: 46, lng: -109 },
          { lat: 43, lng: -109 },
          { lat: 45, lng: -110 },
        ],
      },
    }

    expect(parseLinearRing(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parseLinearRing({})).toBeUndefined()
    expect(parseLinearRing(undefined)).toBeUndefined()
  })
})

describe('parseExterior', () => {
  it('should parse the linear ring of an exterior', () => {
    const value = {
      'gml:linearring': { 'gml:poslist': '45 -110 46 -109 43 -109 45 -110' },
    }
    const expected = {
      linearRing: {
        posList: {
          points: [
            { lat: 45, lng: -110 },
            { lat: 46, lng: -109 },
            { lat: 43, lng: -109 },
            { lat: 45, lng: -110 },
          ],
        },
      },
    }

    expect(parseExterior(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parseExterior({})).toBeUndefined()
    expect(parseExterior(undefined)).toBeUndefined()
  })
})

describe('parsePolygon', () => {
  it('should parse a polygon with all properties', () => {
    const value = {
      '@gml:id': 'poly1',
      '@srsname': 'urn:ogc:def:crs:EPSG:9.0:26986',
      'gml:exterior': {
        'gml:linearring': {
          'gml:poslist': '236750 900000 237750 900000 237750 901000 236750 900000',
        },
      },
    }
    const expected = {
      id: 'poly1',
      srsName: 'urn:ogc:def:crs:EPSG:9.0:26986',
      exterior: {
        linearRing: {
          posList: {
            points: [
              { lat: 236750, lng: 900000 },
              { lat: 237750, lng: 900000 },
              { lat: 237750, lng: 901000 },
              { lat: 236750, lng: 900000 },
            ],
          },
        },
      },
    }

    expect(parsePolygon(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parsePolygon({})).toBeUndefined()
    expect(parsePolygon(undefined)).toBeUndefined()
  })
})

describe('parseEnvelope', () => {
  it('should parse an envelope with all properties', () => {
    const value = {
      '@srsname': 'EPSG:4326',
      'gml:lowercorner': '42.943 -71.032',
      'gml:uppercorner': '43.039 -69.856',
    }
    const expected = {
      srsName: 'EPSG:4326',
      lowerCorner: { lat: 42.943, lng: -71.032 },
      upperCorner: { lat: 43.039, lng: -69.856 },
    }

    expect(parseEnvelope(value)).toEqual(expected)
  })

  it('should trim whitespace around the corners', () => {
    const value = {
      'gml:lowercorner': ' 42.943 -71.032 ',
      'gml:uppercorner': '\n43.039 -69.856\n',
    }
    const expected = {
      lowerCorner: { lat: 42.943, lng: -71.032 },
      upperCorner: { lat: 43.039, lng: -69.856 },
    }

    expect(parseEnvelope(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parseEnvelope({})).toBeUndefined()
    expect(parseEnvelope(undefined)).toBeUndefined()
  })
})

describe('parseRadius', () => {
  it('should parse a radius with its unit', () => {
    const value = { '#text': '500', '@uom': 'm' }
    const expected = { value: 500, uom: 'm' }

    expect(parseRadius(value)).toEqual(expected)
  })

  it('should parse a radius given as plain text', () => {
    const value = '500'
    const expected = { value: 500 }

    expect(parseRadius(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-numeric inputs', () => {
    expect(parseRadius('')).toBeUndefined()
    expect(parseRadius('wide')).toBeUndefined()
    expect(parseRadius(undefined)).toBeUndefined()
  })
})

describe('parseCircleByCenterPoint', () => {
  it('should parse a circle with all properties', () => {
    const value = {
      '@numarc': '1',
      '@interpolation': 'circularArcCenterPointWithRadius',
      'gml:pos': '45.256 -71.92',
      'gml:radius': { '#text': '500', '@uom': 'm' },
    }
    const expected = {
      numArc: 1,
      interpolation: 'circularArcCenterPointWithRadius',
      pos: { lat: 45.256, lng: -71.92 },
      radius: { value: 500, uom: 'm' },
    }

    expect(parseCircleByCenterPoint(value)).toEqual(expected)
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(parseCircleByCenterPoint({})).toBeUndefined()
    expect(parseCircleByCenterPoint(undefined)).toBeUndefined()
  })
})

describe('retrieveWhere', () => {
  it('should parse every geometry the profile allows', () => {
    const value = {
      'gml:point': { 'gml:pos': '45.256 -71.92' },
      'gml:linestring': { 'gml:poslist': '45.256 -71.92 46.46 -72.41' },
      'gml:polygon': {
        'gml:exterior': {
          'gml:linearring': { 'gml:poslist': '45 -110 46 -109 43 -109 45 -110' },
        },
      },
      'gml:envelope': {
        'gml:lowercorner': '42.943 -71.032',
        'gml:uppercorner': '43.039 -69.856',
      },
      'gml:circlebycenterpoint': {
        'gml:pos': '45.256 -71.92',
        'gml:radius': { '#text': '500', '@uom': 'm' },
      },
    }
    const expected = {
      point: {
        pos: { lat: 45.256, lng: -71.92 },
      },
      lineString: {
        posList: {
          points: [
            { lat: 45.256, lng: -71.92 },
            { lat: 46.46, lng: -72.41 },
          ],
        },
      },
      polygon: {
        exterior: {
          linearRing: {
            posList: {
              points: [
                { lat: 45, lng: -110 },
                { lat: 46, lng: -109 },
                { lat: 43, lng: -109 },
                { lat: 45, lng: -110 },
              ],
            },
          },
        },
      },
      envelope: {
        lowerCorner: { lat: 42.943, lng: -71.032 },
        upperCorner: { lat: 43.039, lng: -69.856 },
      },
      circleByCenterPoint: {
        pos: { lat: 45.256, lng: -71.92 },
        radius: { value: 500, uom: 'm' },
      },
    }

    expect(retrieveWhere(value)).toEqual(expected)
  })

  it('should use the first geometry when an element repeats', () => {
    const value = {
      'gml:point': [{ 'gml:pos': '45.256 -71.92' }, { 'gml:pos': '51.5 -0.12' }],
    }
    const expected = {
      point: {
        pos: { lat: 45.256, lng: -71.92 },
      },
    }

    expect(retrieveWhere(value)).toEqual(expected)
  })

  it('should ignore geometries outside the profile', () => {
    const value = { 'gml:multipoint': { 'gml:pos': '45.256 -71.92' } }

    expect(retrieveWhere(value)).toBeUndefined()
  })

  it('should return undefined for empty and non-object inputs', () => {
    expect(retrieveWhere({})).toBeUndefined()
    expect(retrieveWhere('45.256 -71.92')).toBeUndefined()
    expect(retrieveWhere(undefined)).toBeUndefined()
  })
})
