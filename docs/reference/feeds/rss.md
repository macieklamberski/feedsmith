# RSS Feed Reference

RSS (Really Simple Syndication) is one of the most widely used web feed formats. Feedsmith automatically normalizes legacy elements to their modern equivalents.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.9x, 2.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/atom">Atom</a>,
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/content">Content</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/itunes">iTunes</a>,
        <a href="/reference/namespaces/podcast">Podcast</a>,
        <a href="/reference/namespaces/media">Media RSS</a>,
        <a href="/reference/namespaces/georss">GeoRSS-Simple</a>,
        <a href="/reference/namespaces/thr">Atom Threading</a>,
        <a href="/reference/namespaces/dcterms">Dublin Core Terms</a>,
        <a href="/reference/namespaces/wfw">Well-Formed Web</a>
      </td>
    </tr>
  </tbody>
</table>

## Type Definition

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/rss/common/types.ts#reference


## Related

- **[Parsing RSS Feeds](/parsing/#rss)** - How to parse RSS content
- **[Generating RSS Feeds](/generating/#rss)** - How to create RSS feeds
- **[RSS Detection](/parsing/detecting#rss)** - Detecting RSS format
