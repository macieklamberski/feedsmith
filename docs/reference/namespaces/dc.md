# Dublin Core Namespace Reference

The Dublin Core namespace provides standardized metadata elements for describing digital resources. It offers a simple and effective way to add bibliographic information to feeds and items.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/dc/elements/1.1/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/" target="_blank">Dublin Core Metadata Terms</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;dc:*&gt;</code></td>
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
      <td><code>dc</code></td>
    </tr>
  </tbody>
</table>

## Types

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/dc/common/types.ts#reference

## Related

- **[Dublin Core Terms](/reference/namespaces/dcterms)** - Extended Dublin Core metadata
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
