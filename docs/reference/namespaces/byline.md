---
title: "Reference: Byline Namespace"
---

# Byline Namespace

The Byline namespace adds structured author identity, context, and content perspective to feeds. It addresses "content collapse" — the loss of context when content from diverse sources arrives in a unified stream — by describing who an author is, their relationship to the content, and how an item should be read (reporting, opinion, satire, sponsored, and so on).

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>https://bylinespec.org/1.0</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.bylinespec.org/spec" target="_blank">Byline Specification</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;byline:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/atom">Atom</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>byline</code></td>
    </tr>
  </tbody>
</table>

::: tip Draft specification
Byline is a `0.1.0` draft. Field names and structure may change before it stabilizes. Feed-level authors and organizations are grouped in `<byline:contributors>` and `<byline:organizations>` containers, following the specification's examples.
:::

## Types

<<< @/../src/namespaces/byline/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
