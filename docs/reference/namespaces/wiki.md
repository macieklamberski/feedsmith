---
title: "Reference: Wiki Namespace"
---

# Wiki Namespace Reference

The Wiki namespace carries the metadata of a wiki's RecentChanges page: the InterWiki name of the wiki, and the version, status, importance, diff and history links of each page change.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/rss/1.0/modules/wiki/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="http://www.meatballwiki.org/wiki/ModWiki" target="_blank">RDF Site Summary 1.0 Module: Wiki</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;wiki:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>wiki</code></td>
    </tr>
  </tbody>
</table>

## Types

<<< @/../src/namespaces/wiki/common/types.ts#reference

The `host` property is read from the `wiki:host` attribute of the `rdf:Description` inside `dc:contributor`, where the specification places it. It is parsed but not generated.

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
