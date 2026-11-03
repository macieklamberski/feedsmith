---
title: "Reference: Feed History Namespace"
---

# Feed History Namespace Reference

The Feed History namespace marks whether a feed document is a complete representation of its feed or an archive of past entries, as defined by RFC 5005 (Feed Paging and Archiving).

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/syndication/history/1.0</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.rfc-editor.org/rfc/rfc5005" target="_blank">RFC 5005: Feed Paging and Archiving</a><br><a href="https://www.ietf.org/archive/id/draft-nottingham-atompub-feed-history-04.txt" target="_blank">Feed History Draft 04</a> (deprecated <code>incremental</code> and <code>prev</code>)<br><a href="https://www.ietf.org/archive/id/draft-nottingham-atompub-feed-history-03.txt" target="_blank">Feed History Draft 03</a> (deprecated <code>stateful</code>)</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;fh:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/atom">Atom</a>, <a href="/reference/feeds/rdf">RDF</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>fh</code></td>
    </tr>
  </tbody>
</table>

## Types

<<< @/../src/namespaces/fh/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
