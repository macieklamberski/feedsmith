---
title: "Reference: Podcast Chapters"
---

# Podcast Chapters Reference

Podcast Chapters is a JSON format for podcast chapter markers, part of the [Podcasting 2.0 specification](/reference/namespaces/podcast). It enables podcasters to embed chapter metadata including timestamps, titles, images, links, and location data.

<table>
  <tbody>
    <tr>
      <th>Version</th>
      <td>1.2</td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/examples/chapters/jsonChapters.md" target="_blank">Podcast Chapters Specification</a></td>
    </tr>
    <tr>
      <th>MIME Type</th>
      <td><code>application/json+chapters</code></td>
    </tr>
  </tbody>
</table>

## Functions

### `parseChapters()`

Parses Podcast Chapters content and returns a typed chapters object.

```typescript
import { parseChapters } from 'feedsmith'

const chapters = parseChapters(jsonContent)
// Returns: object with all fields optional except required ones
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `unknown` | The Podcast Chapters JSON content to parse (string or object) |

#### Returns
`object` - Parsed Podcast Chapters with all fields optional

### `generateChapters()`

Generates Podcast Chapters object from chapters data. The `version` field is automatically set to `1.2.0`.

```typescript
import { generateChapters } from 'feedsmith'

const chapters = generateChapters({
  chapters: [
    { startTime: 0, title: 'Introduction' },
    { startTime: 60, title: 'Main Content' },
  ],
  title: 'Episode Chapters',
})
// Returns: { version: '1.2.0', chapters: [...], title: 'Episode Chapters' }
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `object` | Podcast Chapters data to generate |
| `options` | `object` | Optional generation settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strict` | `boolean` | `false` | Enable strict mode for spec-required field validation, see [Strict Mode](/generating/strict-mode) |

#### Returns
`object` - Generated Podcast Chapters

### `detectChapters()`

Detects if the provided content is a Podcast Chapters document.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `unknown` | The content to check (string or object) |

#### Returns
`boolean` - `true` if content appears to be Podcast Chapters format

#### Example
```typescript
import { detectChapters } from 'feedsmith'

const isChapters = detectChapters(jsonContent)
```

## Types

All Podcast Chapters types are available under the `Chapters` namespace:

```typescript
import type { Chapters } from 'feedsmith'

// Access any type from the definitions below
type Document = Chapters.Document
type Chapter = Chapters.Chapter
type Location = Chapters.Location
// … see type definitions below for all available types
```

See the [TypeScript guide](/reference/typescript) for usage examples.

### Type Definitions

> [!INFO]
> For details on type parameters (`TStrict`) and `Requirable<T>` markers, see [TypeScript Reference](/reference/typescript#tdate).

<<< @/../src/related/chapters/common/types.ts#reference

## Related

- **[Podcast Namespace](/reference/namespaces/podcast)** - The Podcasting 2.0 namespace that references Podcast Chapters
