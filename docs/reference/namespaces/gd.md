---
title: "Reference: Google Data Namespace"
---

# Google Data Namespace Reference

The Google Data namespace carries the contact, event and message elements of the Google Data APIs, and the author images that Blogger writes into its Atom feeds.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://schemas.google.com/g/2005</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://developers.google.com/gdata/docs/2.0/elements" target="_blank">Google Data APIs: Common Elements</a> (unofficial in part, see below)</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;gd:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/atom">Atom</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>gd</code></td>
    </tr>
  </tbody>
</table>

## Unofficial Parts

These parts are not read from the reference:

- `gd:image`, read on `author` and `contributor` as `gd.image`. The reference does not document it, so its `src`, `rel`, `width` and `height` attributes come from the Blogger feeds that write it.
- The entry level of `gd:money` and `gd:resourceId`. The reference defines both elements but names no parent for them.

## Types

<<< @/../src/namespaces/gd/common/types.ts#reference

## Related

- **[Atom Feed](/reference/feeds/atom)** - The format whose entries and feeds `gd:entryLink` and `gd:feedLink` embed
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
