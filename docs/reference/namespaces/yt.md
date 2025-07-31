# YouTube Namespace Fields

The YouTube namespace provides YouTube-specific metadata for RSS feeds, enabling identification of YouTube videos and channels within RSS feeds.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.youtube.com/xml/schemas/2015</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;yt:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/atom">Atom</a></td>
    </tr>
  </tbody>
</table>

## Structure

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Date Handling](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/namespaces/yt/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
