# Dublin Core Terms Namespace Fields

The Dublin Core Terms namespace provides extended metadata elements based on the Dublin Core Metadata Initiative, offering comprehensive resource description capabilities.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/dc/terms/</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;dcterms:*&gt;</code></td>
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

```typescript
export type ItemOrFeed<TDate extends DateLike> = {
  abstract?: string
  accessRights?: string
  accrualMethod?: string
  accrualPeriodicity?: string
  accrualPolicy?: string
  alternative?: string
  audience?: string
  available?: TDate
  bibliographicCitation?: string
  conformsTo?: string
  contributor?: string
  coverage?: string
  created?: TDate
  creator?: string
  date?: TDate
  dateAccepted?: TDate
  dateCopyrighted?: TDate
  dateSubmitted?: TDate
  description?: string
  educationLevel?: string
  extent?: string
  format?: string
  hasFormat?: string
  hasPart?: string
  hasVersion?: string
  identifier?: string
  instructionalMethod?: string
  isFormatOf?: string
  isPartOf?: string
  isReferencedBy?: string
  isReplacedBy?: string
  isRequiredBy?: string
  issued?: TDate
  isVersionOf?: string
  language?: string
  license?: string
  mediator?: string
  medium?: string
  modified?: TDate
  provenance?: string
  publisher?: string
  references?: string
  relation?: string
  replaces?: string
  requires?: string
  rights?: string
  rightsHolder?: string
  source?: string
  spatial?: string
  subject?: string
  tableOfContents?: string
  temporal?: string
  title?: string
  type?: string
  valid?: TDate
}
```

## Related

- **[Dublin Core Namespace](/reference/namespaces/dc)** - Basic Dublin Core elements
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
