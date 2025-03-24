import { describe, expect, it } from 'bun:test'
import { locales } from '../../common/config'
import { parse } from './parse'

describe('parse', () => {
  const versions = {
    '09': '0.9',
    '10': '1.0',
    ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly parse RDF ${label}`, async () => {
      const reference = `${import.meta.dir}/references/rdf-${key}`
      const input = await Bun.file(`${reference}.xml`).text()
      const expectation = await Bun.file(`${reference}.json`).json()
      const result = parse(input)

      expect(result).toEqual(expectation)
    })
  }

  it('should correctly parse RDF with mixed case tags', async () => {
    const input = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <?xml version="1.0"?>
      <RDF:rdf
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns="http://channel.netscape.com/rdf/simple/0.9/"
      >
        <CHANNEL>
          <title>Mozilla Dot Org</title>
          <LINK>http://www.mozilla.org</LINK>
          <description>the Mozilla Organization web site</description>
        </CHANNEL>
        <ItEM RDF:aBOUT="http://example.org/item1">
          <TITle>New Status Updates</TITle>
          <link>http://www.mozilla.org/status/</link>
        </ItEM>
      </RDF:rdf>
    `
    const expectation = {
      title: 'Mozilla Dot Org',
      link: 'http://www.mozilla.org',
      description: 'the Mozilla Organization web site',
      items: [{ title: 'New Status Updates', link: 'http://www.mozilla.org/status/' }],
    }
    const result = parse(input)

    expect(result).toEqual(expectation)
  })

  it('should throw error for invalid input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalid)
  })

  it('should handle null input', () => {
    expect(() => parse(null)).toThrowError(locales.invalid)
  })

  it('should handle undefined input', () => {
    expect(() => parse(undefined)).toThrowError(locales.invalid)
  })

  it('should handle array input', () => {
    expect(() => parse([])).toThrowError(locales.invalid)
  })

  it('should handle empty object input', () => {
    expect(() => parse({})).toThrowError(locales.invalid)
  })

  it('should handle string input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalid)
  })

  it('should handle number input', () => {
    expect(() => parse(123)).toThrowError(locales.invalid)
  })
})
