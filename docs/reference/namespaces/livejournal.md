---
title: "Reference: LiveJournal Namespace"
---

# LiveJournal Namespace

The LiveJournal namespace adds journal-specific metadata to RSS and Atom feeds: the journal's name, id and type on the channel, and the author's current mood and music, the entry's security level, the posting user and the reply count on each item. LiveJournal (and compatible platforms like Dreamwidth and Scribbld) emit these elements in their journal feeds.

LiveJournal's Atom feeds declare a different URI and write the journal and the poster as attributes, `<lj:journal userid username type/>` and `<lj:poster user userid/>`. Both forms parse into the same properties, and each format is generated in its own form.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td>
        <code>http://www.livejournal.org/rss/lj/1.0/</code> (RSS),
        <code>https://www.livejournal.com</code> (Atom)
      </td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://github.com/apparentlymart/livejournal/blob/8c24ffae22479331728a543ca87b7d6d5d64be8b/cgi-bin/ljfeed.pl" target="_blank">LiveJournal feed generator source</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;lj:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td>
        <a href="/reference/feeds/rss">RSS</a>,
        <a href="/reference/feeds/atom">Atom</a>
      </td>
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
