---
title: "Reference: OPML"
---

# OPML

OPML (Outline Processor Markup Language) is a format for exchanging outline-structured information, commonly used for sharing feed subscription lists.

<table>
  <tbody>
    <tr>
      <th>Versions</th>
      <td>1.0, 2.0</td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://opml.org/spec2.opml" target="_blank">OPML 2.0 Specification</a></td>
    </tr>
  </tbody>
</table>

## Functions

### `parseOpml()`

Parses OPML content and returns a typed OPML object.

```typescript
import { parseOpml } from 'feedsmith'

const opml = parseOpml(xmlContent, {
  extraOutlineAttributes: ['customIcon', 'updateInterval']
})
// Returns: object with all fields optional and dates as strings

// Limit number of outlines parsed
const opml = parseOpml(xmlContent, { maxItems: 5 })

// Combine both options
const opml = parseOpml(xmlContent, {
  maxItems: 5,
  extraOutlineAttributes: ['customIcon', 'updateInterval']
})
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `string` | The OPML XML content to parse |
| `options` | `object` | Optional parsing settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxItems` | `number` | - | Limit the number of outlines parsed. Use `0` to skip outlines entirely, useful when only OPML metadata is needed |
| `extraOutlineAttributes` | `string[]` | - | Custom attributes to extract from outline elements (case-insensitive), see [examples](/parsing/examples#extra-outline-attributes) |

#### Returns
`object` - Parsed OPML with all fields optional and dates as strings

### `generateOpml()`

Generates OPML XML from OPML data.

```typescript
import { generateOpml } from 'feedsmith'

const xml = generateOpml(opmlData, {
  lenient: true,
  stylesheets: [{ type: 'text/xsl', href: '/opml.xsl' }],
  extraOutlineAttributes: ['customIcon', 'updateInterval']
})
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `object` | OPML data to generate |
| `options` | `object` | Optional generation settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lenient` | `boolean` | `false` | Enable lenient mode for relaxed validation, see [Lenient Mode](/generating/lenient-mode) |
| `stylesheets` | `Stylesheet[]` | - | Add stylesheets for visual formatting, see [Feed Styling](/generating/styling) |
| `extraOutlineAttributes` | `string[]` | - | Custom attributes to include in outline elements. Only specified attributes are included in generated XML, see [examples](/generating/examples#extra-outline-attributes) |

#### Returns
`string` - Generated OPML XML

## Types

All OPML types are available under the `Opml` namespace:

```typescript
import type { Opml } from 'feedsmith/types'

// Access any type from the definitions below
type Document = Opml.Document<Date>
type Head = Opml.Head<Date>
type Body = Opml.Body<Date>
type Outline = Opml.Outline<Date>
// … see type definitions below for all available types
```

See the [TypeScript guide](/reference/typescript) for usage examples.

### Type Definitions

> [!INFO]
> `TDate` represents date fields in the type definitions. When **parsing**, dates are returned as strings in their original format (see [Parsing › Handling Dates](/parsing/dates) for more details). When **generating**, dates should be provided as JavaScript `Date` objects.

<<< @/../src/opml/common/types.ts#reference

> [!INFO]
> The `Outline` type includes an index signature `[key: string]: unknown` which allows storing any custom attributes alongside the standard OPML properties.
