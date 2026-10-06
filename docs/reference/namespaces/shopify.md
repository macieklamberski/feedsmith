---
title: "Reference: Shopify Namespace"
---

# Shopify Namespace Reference

The Shopify namespace carries product data in the Atom feeds of Shopify stores: the product type, vendor and tags, and each variant with its price, SKU and weight.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://jadedpixel.com/-/spec/shopify</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td>No official documentation (inferred from live feeds)</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;shopify:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/atom">Atom</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>shopify</code></td>
    </tr>
  </tbody>
</table>

Shopify never published a document for this namespace, and its URI does not resolve to one. Store feeds bind it to the `s` prefix. Elements are read under whatever prefix a feed binds to the URI, and generated under `shopify`.

Every element below is inferred from live feeds, all at entry level:

- `type`: the product type.
- `vendor`: the product vendor.
- `tag`: a product tag, repeated once per tag.
- `variant`: a product variant, repeated once per variant. It holds an Atom `id` and `title`, plus `price` with a `currency` attribute, `sku` and `grams`.

## Types

<<< @/../src/namespaces/shopify/common/types.ts#reference

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
