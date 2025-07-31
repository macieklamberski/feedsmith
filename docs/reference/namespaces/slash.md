# Slash Namespace Fields

The Slash namespace provides metadata about user engagement, particularly comment counts. Originally created by Slashdot, it's now widely used to indicate discussion activity on feed items.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://purl.org/rss/1.0/modules/slash/</code></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;slash:*&gt;</code></td>
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
export type HitParade = Array<number>

export type Item = {
  section?: string
  department?: string
  comments?: number
  hitParade?: HitParade
}
```

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
