---
title: "Reference: Atom Tombstones Namespace"
---

# Atom Tombstones Namespace Reference

The Atom Tombstones namespace ([RFC 6721](https://www.rfc-editor.org/rfc/rfc6721.html)) provides the `<at:deleted-entry>` element for signaling that a previously published entry has been removed from an Atom feed, along with metadata about when, by whom, and why it was deleted.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/atompub/tombstones/1.0</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.rfc-editor.org/rfc/rfc6721.html" target="_blank">RFC 6721: The Atom "deleted-entry" Element</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;at:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/atom">Atom</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>at</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> For details on type parameters (`TDate`, `TStrict`) and `Requirable<T>` markers, see [TypeScript Reference](/reference/typescript#tdate).

<<< @/../src/namespaces/at/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
