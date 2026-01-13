---
title: "Reference: Dublin Core Terms Namespace"
---

# Dublin Core Terms Namespace Reference

The Dublin Core Terms namespace provides extended metadata elements based on the Dublin Core Metadata Initiative, offering comprehensive resource description capabilities.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/dc/terms/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/" target="_blank">Dublin Core Terms</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;dcterms:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/atom">Atom</a>,
        <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>dcterms</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> For details on type parameters (`TDate`), see [TypeScript Reference](/reference/typescript#tdate).

<<< @/../src/namespaces/dcterms/common/types.ts#reference

## Related

- **[Dublin Core Namespace](/reference/namespaces/dc)** - Basic Dublin Core elements
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
