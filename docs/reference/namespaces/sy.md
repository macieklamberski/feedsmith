# Syndication Namespace Fields

The Syndication namespace provides information about the frequency and timing of feed updates. It helps aggregators understand how often to check for new content.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/rss/1.0/modules/syndication/</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;sy:*&gt;</code></td>
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

<<< @/../src/namespaces/sy/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
