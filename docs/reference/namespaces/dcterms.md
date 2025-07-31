# Dublin Core Terms Namespace Fields

The Dublin Core Terms namespace provides extended metadata elements based on the Dublin Core Metadata Initiative, offering comprehensive resource description capabilities.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/dc/terms/</code></td>
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
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/dcterms/common/types.ts#reference

## Related

- **[Dublin Core Namespace](/reference/namespaces/dc)** - Basic Dublin Core elements
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
