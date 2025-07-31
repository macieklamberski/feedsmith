# Media RSS Namespace Fields

The Media RSS namespace provides rich media metadata for RSS feeds, enabling comprehensive description of multimedia content including videos, images, and audio files.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://search.yahoo.com/mrss/</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;media:*&gt;</code></td>
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
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/media/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
