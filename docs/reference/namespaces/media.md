# Media RSS Namespace Reference

The Media RSS namespace provides rich media metadata for RSS feeds, enabling comprehensive description of multimedia content including videos, images, and audio files.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://search.yahoo.com/mrss/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.rssboard.org/media-rss" target="_blank">Media RSS Specification</a></td>
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
    <tr>
      <th>Property</th>
      <td><code>media</code></td>
    </tr>
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/media/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
