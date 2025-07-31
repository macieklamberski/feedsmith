# OPML Reference

OPML (Outline Processor Markup Language) is a format for exchanging outline-structured information, commonly used for sharing feed subscription lists.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>1.0, 2.0</td>
    </tr>
  </tbody>
</table>

## Type Definition

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/opml/common/types.ts#reference

## Related

- **[Parsing OPML](/parsing/#opml)** - How to parse OPML content
- **[Generating OPML](/generating/#opml)** - How to create OPML documents
- **[OPML Detection](/parsing/detecting#opml)** - Detecting OPML format
