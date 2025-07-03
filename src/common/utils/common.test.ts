import { describe, expect, it } from 'bun:test'
import { namespaceUrls } from '../config.js'
import { createFixedStatefulTransforms } from './common.js'

describe('createFixedStatefulTransforms', () => {
  describe('basic namespace normalization', () => {
    it('should normalize custom prefixes to standard prefixes', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Declare namespace via updateTag (how fast-xml-parser actually works)
      transforms.updateTag('feed', 'rss.feed', {
        '@xmlns:a': 'http://www.w3.org/2005/Atom',
      })

      // Test tag transformation
      expect(transforms.transformTagName('a:title')).toBe('atom:title')
      expect(transforms.transformTagName('a:entry')).toBe('atom:entry')

      // Test attribute transformation
      expect(transforms.transformAttributeName(`@a:href`)).toBe('@atom:href')
      expect(transforms.transformAttributeName(`@a:type`)).toBe('@atom:type')
    })

    it('should handle multiple namespace declarations in same element', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Declare multiple namespaces on root element
      transforms.updateTag('rss', 'rss', {
        '@xmlns:dublin': 'http://purl.org/dc/elements/1.1/',
        '@xmlns:itunes1': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      })

      expect(transforms.transformTagName('dublin:creator')).toBe('dc:creator')
      expect(transforms.transformTagName('itunes1:duration')).toBe('itunes:duration')
      expect(transforms.transformAttributeName(`@dublin:subject`)).toBe('@dc:subject')
    })

    it('should leave unmapped prefixes unchanged (lowercase)', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      transforms.updateTag('feed', 'feed', { '@xmlns:custom': 'http://example.com/custom' })

      expect(transforms.transformTagName('custom:element')).toBe('custom:element')
      expect(transforms.transformAttributeName(`@custom:attr`)).toBe('@custom:attr')
    })

    it('should handle elements without namespaces', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      expect(transforms.transformTagName('title')).toBe('title')
      expect(transforms.transformTagName('description')).toBe('description')
      expect(transforms.transformAttributeName(`@href`)).toBe('@href')
    })

    it('should preserve xmlns attributes', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // xmlns attributes should pass through unchanged
      expect(transforms.transformAttributeName(`@xmlns`)).toBe(`@xmlns`)
      expect(transforms.transformAttributeName(`@xmlns:atom`)).toBe(`@xmlns:atom`)
      expect(transforms.transformAttributeName(`@xmlns:dc`)).toBe(`@xmlns:dc`)
    })
  })

  describe('context management and scoping', () => {
    it('should handle namespace redefinition in nested elements', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Root level: 'a' means Atom
      transforms.updateTag('feed', 'feed', { '@xmlns:a': 'http://www.w3.org/2005/Atom' })
      expect(transforms.transformTagName('a:title')).toBe('atom:title')
      expect(transforms.transformAttributeName(`@a:href`)).toBe('@atom:href')

      // Nested level: 'a' now means Dublin Core
      transforms.updateTag('source', 'feed.source', {
        '@xmlns:a': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.transformTagName('a:creator')).toBe('dc:creator')
      expect(transforms.transformAttributeName(`@a:subject`)).toBe('@dc:subject')

      // Close nested element - back to Atom
      transforms.transformTagName('/source')
      expect(transforms.transformTagName('a:summary')).toBe('atom:summary')
      expect(transforms.transformAttributeName(`@a:type`)).toBe('@atom:type')
    })

    it('should handle multiple levels of nesting', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Level 1: 'ns' means Atom
      transforms.updateTag('feed', 'feed', { '@xmlns:ns': 'http://www.w3.org/2005/Atom' })
      expect(transforms.transformTagName('ns:title')).toBe('atom:title')

      // Level 2: Add Dublin Core
      transforms.updateTag('entry', 'feed.entry', {
        '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.transformTagName('ns:title')).toBe('atom:title') // Still Atom
      expect(transforms.transformTagName('dc:creator')).toBe('dc:creator') // Dublin Core

      // Level 3: Redefine 'ns' to mean Dublin Core
      transforms.updateTag('source', 'feed.entry.source', {
        '@xmlns:ns': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.transformTagName('ns:subject')).toBe('dc:subject') // Now Dublin Core
      expect(transforms.transformTagName('dc:creator')).toBe('dc:creator') // Still Dublin Core
      expect(transforms.transformAttributeName(`@ns:type`)).toBe('@dc:type')

      // Close level 3 - back to level 2
      transforms.transformTagName('/source')
      expect(transforms.transformTagName('ns:updated')).toBe('atom:updated') // Back to Atom
      expect(transforms.transformTagName('dc:rights')).toBe('dc:rights') // Still Dublin Core

      // Close level 2 - back to level 1
      transforms.transformTagName('/entry')
      expect(transforms.transformTagName('ns:author')).toBe('atom:author') // Still Atom
    })

    it('should prevent context leakage between sibling elements', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Item 1 declares namespace
      transforms.updateTag('item', 'rss.channel.item', {
        '@xmlns:custom': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.transformTagName('custom:creator')).toBe('dc:creator')

      // Close Item 1
      transforms.transformTagName('/item')

      // Item 2 should NOT have access to Item 1's namespace
      transforms.updateTag('item', 'rss.channel.item', {})
      expect(transforms.transformTagName('custom:subject')).toBe('custom:subject') // Not normalized
    })
  })

  describe('default namespace handling', () => {
    it('should handle default namespace declarations', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      transforms.updateTag('feed', 'feed', { '@xmlns': 'http://www.w3.org/2005/Atom' })

      // Default namespace should add prefix to unprefixed elements
      expect(transforms.transformTagName('title')).toBe('atom:title')
      expect(transforms.transformTagName('entry')).toBe('atom:entry')
    })

    it('should handle default namespace changes', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      transforms.updateTag('root', 'root', { '@xmlns': 'http://www.w3.org/2005/Atom' })
      expect(transforms.transformTagName('title')).toBe('atom:title')

      transforms.updateTag('section', 'root.section', {
        '@xmlns': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.transformTagName('creator')).toBe('dc:creator')

      transforms.transformTagName('/section')
      expect(transforms.transformTagName('summary')).toBe('atom:summary') // Back to Atom
    })

    it('should handle empty default namespace (clearing)', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Set default namespace
      transforms.updateTag('root', 'root', { '@xmlns': 'http://www.w3.org/2005/Atom' })
      expect(transforms.transformTagName('title')).toBe('atom:title')

      // Clear default namespace
      transforms.updateTag('section', 'root.section', { '@xmlns': '' })
      expect(transforms.transformTagName('title')).toBe('title') // No prefix

      // Back to Atom
      transforms.transformTagName('/section')
      expect(transforms.transformTagName('summary')).toBe('atom:summary')
    })
  })

  describe('closing tag handling', () => {
    it('should properly handle closing tags with namespace normalization', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      transforms.updateTag('feed', 'feed', { '@xmlns:a': 'http://www.w3.org/2005/Atom' })
      transforms.updateTag('entry', 'feed.entry', {})

      expect(transforms.transformTagName('/a:entry')).toBe('/atom:entry')
      expect(transforms.transformTagName('/a:feed')).toBe('/atom:feed')
    })

    it('should maintain context through closing tags', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      transforms.updateTag('feed', 'feed', { '@xmlns:a': 'http://www.w3.org/2005/Atom' })
      transforms.updateTag('entry', 'feed.entry', {})
      transforms.updateTag('source', 'feed.entry.source', {
        '@xmlns:a': 'http://purl.org/dc/elements/1.1/',
      })

      expect(transforms.transformTagName('a:title')).toBe('dc:title')
      expect(transforms.transformTagName('/source')).toBe('/source')
      expect(transforms.transformTagName('a:summary')).toBe('atom:summary') // Back to Atom
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle elements without attributes', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // updateTag with null/undefined attrs
      // @ts-ignore: This is for testing purposes.
      expect(transforms.updateTag('element', 'element', null)).toBe('element')
      // @ts-ignore: This is for testing purposes.
      expect(transforms.updateTag('element', 'element', undefined)).toBe('element')
      expect(transforms.updateTag('element', 'element', {})).toBe('element')
    })

    it('should handle empty tag names', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      expect(transforms.transformTagName('')).toBe('')
      expect(transforms.transformAttributeName('')).toBe('')
    })

    it('should handle malformed namespace URIs gracefully', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Invalid/unknown namespace URI
      transforms.updateTag('element', 'element', {
        '@xmlns:bad': 'not-a-valid-uri',
      })

      expect(transforms.transformTagName('bad:element')).toBe('bad:element') // No normalization
    })

    it('should handle tags with only colons', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      expect(transforms.transformTagName(':')).toBe(':')
      expect(transforms.transformTagName(':element')).toBe(':element')
      expect(transforms.transformTagName('prefix:')).toBe('prefix:')
    })

    it('should handle self-closing elements with namespace declarations', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Channel with foo namespace
      transforms.updateTag('channel', 'rss.channel', {
        '@xmlns:foo': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.getStackDepth()).toBe(2)

      // Self-closing element with bar namespace
      transforms.updateTag('selfclosing', 'rss.channel.selfclosing', {
        '@xmlns:bar': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.getStackDepth()).toBe(3)
      expect(transforms.transformTagName('bar:element')).toBe('dc:element')

      // Move to sibling - should clean up self-closing element's context
      transforms.updateTag('item', 'rss.channel.item', {})
      expect(transforms.getStackDepth()).toBe(2) // Back to channel level

      // bar namespace should no longer be accessible
      expect(transforms.transformTagName('bar:source')).toBe('bar:source') // Not normalized

      // But foo from channel should still work
      expect(transforms.transformTagName('foo:source')).toBe('dc:source')
    })

    it('should handle deeply nested closing tag cleanup', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Create deep nesting
      transforms.updateTag('level1', 'level1', {
        '@xmlns:a': 'http://www.w3.org/2005/Atom',
      })
      transforms.updateTag('level2', 'level1.level2', {
        '@xmlns:a': 'http://purl.org/dc/elements/1.1/',
      })
      transforms.updateTag('level3', 'level1.level2.level3', {
        '@xmlns:a': 'http://search.yahoo.com/mrss/',
      })

      expect(transforms.transformTagName('a:element')).toBe('media:element')

      // Close tags in proper order (XML should be well-formed)
      transforms.transformTagName('/level3')
      expect(transforms.transformTagName('a:element')).toBe('dc:element')

      transforms.transformTagName('/level2')
      expect(transforms.transformTagName('a:element')).toBe('atom:element')

      transforms.transformTagName('/level1')
      // Back at root - no namespace mappings
      expect(transforms.transformTagName('a:element')).toBe('a:element')
    })
  })

  describe('real-world RSS scenarios', () => {
    it('should handle typical RSS feed with Dublin Core and iTunes', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Root RSS element with multiple namespaces
      transforms.updateTag('rss', 'rss', {
        '@xmlns:dublincore': 'http://purl.org/dc/elements/1.1/',
        '@xmlns:itunes1': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      })

      transforms.updateTag('channel', 'rss.channel', {})
      transforms.updateTag('item', 'rss.channel.item', {})

      expect(transforms.transformTagName('dublincore:creator')).toBe('dc:creator')
      expect(transforms.transformTagName('itunes1:duration')).toBe('itunes:duration')
      expect(transforms.transformAttributeName(`@dublincore:subject`)).toBe('@dc:subject')
      expect(transforms.transformAttributeName(`@itunes1:explicit`)).toBe('@itunes:explicit')
    })

    it('should handle user test case: foo/bar prefixes mapping to DC', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      // Channel with foo prefix
      transforms.updateTag('channel', 'rss.channel', {
        '@xmlns:foo': 'http://purl.org/dc/elements/1.1/',
      })

      // Item 1 with bar prefix (redefinition)
      transforms.updateTag('item', 'rss.channel.item', {
        '@xmlns:bar': 'http://purl.org/dc/elements/1.1/',
      })

      expect(transforms.transformTagName('bar:source')).toBe('dc:source')
      expect(transforms.transformTagName('bar:language')).toBe('dc:language')
      expect(transforms.transformTagName('bar:relation')).toBe('dc:relation')

      // Close item 1
      transforms.transformTagName('/item')

      // Item 2 - back to foo prefix
      transforms.updateTag('item', 'rss.channel.item', {})
      expect(transforms.transformTagName('foo:source')).toBe('dc:source')
      expect(transforms.transformTagName('foo:language')).toBe('dc:language')
      expect(transforms.transformTagName('foo:relation')).toBe('dc:relation')
    })

    it('should handle complex Atom feed with nested sources', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      transforms.updateTag('feed', 'feed', {
        '@xmlns:atomFeed': 'http://www.w3.org/2005/Atom',
      })
      expect(transforms.transformTagName('atomFeed:title')).toBe('atom:title')

      transforms.updateTag('entry', 'feed.entry', {})
      expect(transforms.transformAttributeName(`@atomFeed:href`)).toBe('@atom:href')

      // Nested source with different namespace
      transforms.updateTag('source', 'feed.entry.source', {
        '@xmlns:meta': 'http://purl.org/dc/elements/1.1/',
      })
      expect(transforms.transformTagName('meta:creator')).toBe('dc:creator')
      expect(transforms.transformTagName('atomFeed:link')).toBe('atom:link') // Still accessible

      transforms.transformTagName('/source')
      expect(transforms.transformTagName('atomFeed:summary')).toBe('atom:summary') // Back to Atom
    })
  })

  describe('context debugging and introspection', () => {
    it('should provide access to current context for debugging', () => {
      const transforms = createFixedStatefulTransforms(namespaceUrls)

      expect(transforms.getCurrentContext()).toEqual({})
      expect(transforms.getStackDepth()).toBe(1)

      transforms.updateTag('element', 'element', { '@xmlns:test': 'http://example.com' })

      expect(transforms.getCurrentContext()).toEqual({ test: 'http://example.com' })
      expect(transforms.getStackDepth()).toBe(2)

      transforms.transformTagName('/element')
      expect(transforms.getCurrentContext()).toEqual({})
      expect(transforms.getStackDepth()).toBe(1)
    })
  })
})
