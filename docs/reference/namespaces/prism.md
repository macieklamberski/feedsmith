# PRISM Namespace Reference

The PRISM (Publishing Requirements for Industry Standard Metadata) namespace provides comprehensive metadata elements for scholarly and academic publishing, including bibliographic information, page ranges, DOIs, and publication details.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://prismstandard.org/namespaces/basic/3.0/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.w3.org/submissions/prism/" target="_blank">PRISM Specification</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;prism:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>prism</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/prism/common/types.ts#reference

## Related

- **[Dublin Core Namespace](/reference/namespaces/dc)** - Basic Dublin Core elements
- **[Dublin Core Terms Namespace](/reference/namespaces/dcterms)** - Extended Dublin Core metadata
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
