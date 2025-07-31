# JSON Feed Reference

JSON Feed is a syndication format based on JSON that provides a simple, straightforward way to publish feeds. Feedsmith provides full parsing and generation capabilities.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>1.0, 1.1</td>
    </tr>
    <tr>
      <th>Namespaces</th>
      <td>None (JSON-based format)</td>
    </tr>
  </tbody>
</table>

## Type Definition

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/feeds/json/common/types.ts#reference

## Related

- **[Parsing JSON Feeds](/parsing/#json-feed)** - How to parse JSON Feed content
- **[Generating JSON Feeds](/generating/#json-feed)** - How to create JSON feeds
- **[JSON Feed Detection](/parsing/detecting#json-feed)** - Detecting JSON Feed format