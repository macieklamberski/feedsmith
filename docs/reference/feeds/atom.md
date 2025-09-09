# Atom Feed Reference

Atom is a syndication format based on XML that provides a robust framework for web feeds. Feedsmith provides comprehensive parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>0.3, 1.0</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>
        <a href="/reference/namespaces/dc">Dublin Core</a>,
        <a href="/reference/namespaces/sy">Syndication</a>,
        <a href="/reference/namespaces/slash">Slash</a>,
        <a href="/reference/namespaces/itunes">iTunes</a>,
        <a href="/reference/namespaces/psc">Podlove Simple Chapters</a>,
        <a href="/reference/namespaces/googleplay">Google Play Podcasts</a>,
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

<<< @/../src/feeds/atom/common/types.ts#reference


## Related

- **[Parsing Atom Feeds](/parsing/#atom)** - How to parse Atom content
- **[Generating Atom Feeds](/generating/#atom)** - How to create Atom feeds
- **[Atom Detection](/parsing/detecting#atom)** - Detecting Atom format
