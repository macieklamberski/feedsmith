# Content Namespace Fields

The Content namespace allows RSS and RDF feeds to include full content alongside or instead of summaries. It provides a way to embed complete articles or posts within feed items.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/rss/1.0/modules/content/</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;content:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/content/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
