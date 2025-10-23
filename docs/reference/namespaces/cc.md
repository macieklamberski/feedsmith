# Creative Commons Rights Expression Language Reference

The Creative Commons Rights Expression Language (ccREL) enables RSS and Atom feeds to declare copyright licenses and additional permissions for feed content.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://creativecommons.org/ns#</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://creativecommons.org/ns" target="_blank">Creative Commons Rights Expression Language (ccREL)</a></td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;cc:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/atom">Atom</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>cc</code></td>
    </tr>
  </tbody>
</table>

## Overview

The Creative Commons Rights Expression Language (ccREL) allows content creators to communicate the copyright license under which their content is made available. While originally designed for Creative Commons licenses, this namespace can technically be used with any license type.

The namespace supports both feed-level and item-level license declarations:
- **Feed-level**: Applies to all content in the feed
- **Item-level**: Applies to individual items and takes precedence over feed-level licenses

## Types

<<< @/../src/namespaces/cc/common/types.ts#reference

## Elements

### `<cc:license>`

A URL identifying the copyright license under which the content is made available.

**Example:**
```xml
<cc:license>https://creativecommons.org/licenses/by-nc-sa/4.0/</cc:license>
```

### `<cc:morePermissions>`

A URL where additional permissions beyond those granted by the license may be obtained. This is particularly useful when offering commercial licensing options for content that is otherwise non-commercial.

**Example:**
```xml
<cc:morePermissions>https://example.com/commercial-license</cc:morePermissions>
```

## Usage Examples

### Feed-Level License

```xml
<rss version="2.0" xmlns:cc="http://creativecommons.org/ns#">
  <channel>
    <title>Example Podcast</title>
    <cc:license>https://creativecommons.org/licenses/by-nc-sa/4.0/</cc:license>
    <cc:morePermissions>https://example.com/commercial-license</cc:morePermissions>
    <!-- Other channel elements -->
  </channel>
</rss>
```

### Item-Level License

```xml
<item>
  <title>Special Episode</title>
  <cc:license>https://creativecommons.org/licenses/by/4.0/</cc:license>
  <!-- Item-level license overrides feed-level license -->
</item>
```

## Common Creative Commons Licenses

- `https://creativecommons.org/licenses/by/4.0/` - Attribution (CC BY)
- `https://creativecommons.org/licenses/by-sa/4.0/` - Attribution-ShareAlike (CC BY-SA)
- `https://creativecommons.org/licenses/by-nd/4.0/` - Attribution-NoDerivs (CC BY-ND)
- `https://creativecommons.org/licenses/by-nc/4.0/` - Attribution-NonCommercial (CC BY-NC)
- `https://creativecommons.org/licenses/by-nc-sa/4.0/` - Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)
- `https://creativecommons.org/licenses/by-nc-nd/4.0/` - Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)
- `https://creativecommons.org/publicdomain/zero/1.0/` - CC0 (Public Domain Dedication)

## Related

- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
- **[Generating RSS](/generating/rss)** - How to generate RSS feeds
- **[Creative Commons Website](https://creativecommons.org)** - Official Creative Commons website
