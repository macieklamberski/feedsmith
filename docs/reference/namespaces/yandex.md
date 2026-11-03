---
title: "Reference: Yandex News Namespace"
---

# Yandex News Namespace Reference

The Yandex News namespace carries the full text, genre and topic tags that publishers export to Yandex in RSS feeds, along with the logo, analytics and related links that older Yandex News and Turbo pages requirements defined.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://news.yandex.ru</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>
        <a href="https://yandex.com/support/webmaster/en/search-appearance/fresh-content" target="_blank">Yandex Webmaster: Latest and most important news</a> (unofficial, vendor documentation)<br>
        <a href="https://web.archive.org/web/20220613165932/https://yandex.ru/support/news/export-content/export.html" target="_blank">Yandex News: Export requirements</a> (2022, Web Archive)<br>
        <a href="https://web.archive.org/web/20171010200407/https://yandex.ru/support/news/feed.html" target="_blank">Yandex News: Technical requirements</a> (2017, Web Archive)<br>
        <a href="https://web.archive.org/web/20180110191243/https://yandex.ru/support/webmaster/turbo/rss-elements.html" target="_blank">Yandex Webmaster: Turbo pages RSS elements</a> (2018, Web Archive)
      </td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;yandex:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/rdf">RDF</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>yandex</code></td>
    </tr>
  </tbody>
</table>

## Unofficial Parts

These parts are not read from the Yandex documentation:

- `yandex:logo`, read on the channel as `yandex.logos`. No version of the documentation defines it, so its text value and its `type` attribute come from the feeds that write it.
- `yandex:theme_tags` as a list. The documentation shows one value per item, while feeds repeat the element within an item.

## Types

<<< @/../src/namespaces/yandex/common/types.ts#reference

## Related

- **[RSS Feed](/reference/feeds/rss)** - The format the Yandex documentation names
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
