import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { parse } from './index.js'

describe('parse', () => {
  const versions = {
    '03': '0.3',
    '10': '1.0',
    ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly parse Atom ${label} feed`, async () => {
      const reference = `${import.meta.dir}/../references/atom-${key}`
      const input = await Bun.file(`${reference}.xml`).text()
      const expected = await Bun.file(`${reference}.json`).json()
      const result = parse(input)

      expect(result).toEqual(expected)
    })
  }

  it('should correctly parse Atom 1.0 feed with mixed case tags', async () => {
    const input = `
      <?xml version="1.0" encoding="UTF-8"?>
      <FeEd xmlns="http://www.w3.org/2005/Atom">
        <TiTlE>Mixed Case Atom Feed</TiTlE>
        <SuBtItLe>A test feed with mixed case tags</SuBtItLe>
        <LiNk href="https://example.com/" rel="alternate"/>
        <LiNk href="https://example.com/atom.xml" rel="self"/>
        <Id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</Id>
        <UpDaTeD>2024-01-10T12:00:00Z</UpDaTeD>
        <RiGhTs>Copyright 2024, Example Corp</RiGhTs>
        <AuThOr>
          <NaMe>John Doe</NaMe>
          <EmAiL>john@example.com</EmAiL>
          <UrI>https://example.com/john</UrI>
        </AuThOr>
        <CoNtRiBuToR>
          <NaMe>Jane Smith</NaMe>
          <EmAiL>jane@example.com</EmAiL>
        </CoNtRiBuToR>
        <CaTeGoRy term="tech" scheme="https://example.com/categories" label="Technology"/>
        <GeNeRaToR uri="https://example.com/generator" version="1.0">Example Generator</GeNeRaToR>
        <IcOn>https://example.com/favicon.ico</IcOn>
        <LoGo>https://example.com/logo.png</LoGo>
        <EnTrY>
          <TiTlE>First Entry</TiTlE>
          <LiNk href="https://example.com/entry1" rel="alternate"/>
          <Id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</Id>
          <PuBlIsHeD>2024-01-01T12:00:00Z</PuBlIsHeD>
          <UpDaTeD>2024-01-02T09:30:00Z</UpDaTeD>
          <AuThOr>
            <NaMe>John Doe</NaMe>
          </AuThOr>
          <CoNtEnT type="html">
            &lt;p&gt;This is the first entry in a mixed case Atom feed.&lt;/p&gt;
          </CoNtEnT>
          <SuMmArY>Summary of the first entry</SuMmArY>
          <CaTeGoRy term="samples" label="Samples"/>
        </EnTrY>
        <entry>
          <title>Second Entry</title>
          <link href="https://example.com/entry2" rel="alternate"/>
          <id>urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a</id>
          <published>2024-01-03T14:30:00Z</published>
          <updated>2024-01-03T15:45:00Z</updated>
          <author>
            <name>Jane Smith</name>
          </author>
          <content type="text">
            This is the second entry in a mixed case Atom feed.
          </content>
          <summary>Summary of the second entry</summary>
          <category term="docs" label="Documentation"/>
        </entry>
      </FeEd>
    `
    const expected = {
      title: { value: 'Mixed Case Atom Feed' },
      subtitle: { value: 'A test feed with mixed case tags' },
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      updated: '2024-01-10T12:00:00Z',
      links: [
        { href: 'https://example.com/', rel: 'alternate' },
        { href: 'https://example.com/atom.xml', rel: 'self' },
      ],
      rights: { value: 'Copyright 2024, Example Corp' },
      authors: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          uri: 'https://example.com/john',
        },
      ],
      contributors: [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      ],
      categories: [
        {
          term: 'tech',
          scheme: 'https://example.com/categories',
          label: 'Technology',
        },
      ],
      generator: {
        text: 'Example Generator',
        uri: 'https://example.com/generator',
        version: '1.0',
      },
      icon: 'https://example.com/favicon.ico',
      logo: 'https://example.com/logo.png',
      entries: [
        {
          title: { value: 'First Entry' },
          id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
          links: [{ href: 'https://example.com/entry1', rel: 'alternate' }],
          published: '2024-01-01T12:00:00Z',
          updated: '2024-01-02T09:30:00Z',
          authors: [{ name: 'John Doe' }],
          content: {
            type: 'html',
            value: '<p>This is the first entry in a mixed case Atom feed.</p>',
          },
          summary: { value: 'Summary of the first entry' },
          categories: [{ term: 'samples', label: 'Samples' }],
        },
        {
          title: { value: 'Second Entry' },
          id: 'urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a',
          links: [{ href: 'https://example.com/entry2', rel: 'alternate' }],
          published: '2024-01-03T14:30:00Z',
          updated: '2024-01-03T15:45:00Z',
          authors: [{ name: 'Jane Smith' }],
          content: { type: 'text', value: 'This is the second entry in a mixed case Atom feed.' },
          summary: { value: 'Summary of the second entry' },
          categories: [{ term: 'docs', label: 'Documentation' }],
        },
      ],
    }
    const result = parse(input)

    expect(result).toEqual(expected)
  })

  it('should correctly parse namespaced Atom feed', async () => {
    const input = `
      <?xml version="1.0" encoding="utf-8"?>
      <atom:feed atom:xmlns="http://www.w3.org/2005/Atom">
        <atom:title>Example Feed</title>
        <atom:id>example-feed</id>
        <atom:entry>
          <atom:title>Example Entry</title>
          <atom:id>example-entry</id>
        </atom:entry>
      </atom:feed>
    `
    const expected = {
      id: 'example-feed',
      title: { value: 'Example Feed' },
      entries: [
        {
          id: 'example-entry',
          title: { value: 'Example Entry' },
        },
      ],
    }
    const result = parse(input)

    expect(result).toEqual(expected)
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
