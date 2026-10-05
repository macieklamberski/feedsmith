---
title: "Reference: RSS-CB Namespace"
---

# RSS-CB Namespace Reference

The RSS-CB namespace describes what central banks publish: news, research papers, speeches and events, and statistics such as exchange rates and interest rates.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td>
        <code>http://www.cbwiki.net/wiki/index.php/Specification_1.2/</code> (1.2)<br>
        <code>http://www.cbwiki.net/wiki/index.php/Specification_1.1</code> (1.1)<br>
        <code>http://www.bis.org/rss-cb/1.0/</code> (1.0)
      </td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>
        <a href="https://web.archive.org/web/20210224094152/http://cbwiki.net/wiki/index.php/RSS-CB_1.2_Specification" target="_blank">RSS-CB 1.2 Specification</a> (Web Archive)<br>
        <a href="https://web.archive.org/web/20070701110218/http://www.cbwiki.net/wiki/index.php/Specification_1.1" target="_blank">RSS-CB 1.1 Specification</a> (Web Archive)<br>
        <a href="https://web.archive.org/web/20080101124549/http://www.cbwiki.net/wiki/index.php/Specification" target="_blank">RSS-CB 1.0 Specification</a> (Web Archive)
      </td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;cb:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/rdf">RDF</a>
      </td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>cb</code></td>
    </tr>
  </tbody>
</table>

Each version of RSS-CB has its own namespace URI, and all of them parse into the same `cb` property. Fields that only RSS-CB 1.0 or 1.1 defines are marked as deprecated.

RSS-CB 1.0 writes its elements directly under the item and names the application type in `cb:application`. Those elements are read into the same application type as their 1.1 and 1.2 counterparts. A 1.0 statistics item has no subtype element, so its subtype is told by `cb:baseCurrency` or `cb:targetCurrency` (exchange rate), `cb:rateName` (interest rate), the `cb:transaction*` elements (transaction), or `cb:topic` or `cb:coverage` (other statistic).

`custom` holds the child XML of `cb:custom` as a raw string. It is generated only when it is well-formed and uses no entity XML cannot resolve.

These parts are inferred from live feeds, not read from a specification:

- `observationPeriod` written with a `frequency` attribute and the period as the element's text, as Federal Reserve feeds on the 1.1 URI do. RSS-CB 1.2 defines `frequency` and `period` as child elements.
- `keywords`, `resources`, `persons` and `jelCodes` as lists. The specifications do not say how often these elements may appear, and live feeds repeat them.

## Types

> [!INFO]
> For details on type parameters (`TDate`), see [TypeScript Reference](/reference/typescript#tdate).

<<< @/../src/namespaces/cb/common/types.ts#reference

## Related

- **[Dublin Core Namespace](/reference/namespaces/dc)** - Item dates and languages that RSS-CB requires
- **[PRISM Namespace](/reference/namespaces/prism)** - Publishing metadata
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
