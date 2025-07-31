# Podcast Namespace Fields

The Podcast namespace implements the Podcasting 2.0 specification, providing advanced features for modern podcasting including transcripts, chapters, value streaming, and enhanced metadata.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>https://podcastindex.org/namespace/1.0</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;podcast:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a></td>
    </tr>
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/podcast/common/types.ts#reference

## Related

- **[iTunes Namespace](/reference/namespaces/itunes)** - Traditional podcast metadata
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
