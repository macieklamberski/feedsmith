---
title: "Reference: LiveJournal Namespace"
---

# LiveJournal Namespace

The LiveJournal namespace adds journal-specific metadata to RSS feed items, such as the author's current mood and music, the entry's security level, the posting user, and the originating journal. LiveJournal (and compatible platforms like Dreamwidth and Scribbld) emit these elements on each item of a syndicated journal feed.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://www.livejournal.org/rss/lj/1.0/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://www.livejournal.com/support/faq/149.html" target="_blank">LiveJournal Syndication FAQ</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;lj:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>livejournal</code></td>
    </tr>
  </tbody>
</table>

## Types

<<< @/../src/namespaces/livejournal/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
