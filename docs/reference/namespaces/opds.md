---
title: "Reference: OPDS Namespace"
---

# OPDS Namespace Reference

The OPDS (Open Publication Distribution System) namespace extends Atom links with catalog-specific metadata for digital publication distribution, including pricing, acquisition methods, and faceted navigation.

The `availability`, `holds` and `copies` properties are an unofficial extension, not part of OPDS 1.2. They come from [OPDS For Library Patrons](https://github.com/NYPL-Simplified/Simplified/wiki/OPDS-For-Library-Patrons), a NYPL wiki page by Leonard Richardson for Library Simplified, which defines them for library lending and places `opds:availability`, `opds:holds` and `opds:copies` inside `atom:link` in the same namespace.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://opds-spec.org/2010/catalog</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://specs.opds.io/opds-1.2" target="_blank">OPDS Catalog 1.2</a><br><a href="https://github.com/NYPL-Simplified/Simplified/wiki/OPDS-For-Library-Patrons" target="_blank">OPDS For Library Patrons</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;opds:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/atom">Atom</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>opds</code> (on <code>Link</code>)</td>
    </tr>
  </tbody>
</table>

## Types

<<< @/../src/namespaces/opds/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
