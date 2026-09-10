---
title: "Reference: Podcast Transcripts"
---

# Podcast Transcripts Reference

Podcast Transcripts is a JSON format for podcast transcript data, part of the [Podcasting 2.0 specification](/reference/namespaces/podcast). It enables podcasters to embed transcript segments with speaker attribution, timestamps, and text content.

<table>
  <tbody>
    <tr>
      <th>Version</th>
      <td>1.0</td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/examples/transcripts/transcripts.md" target="_blank">Podcast Transcripts Specification</a></td>
    </tr>
    <tr>
      <th>MIME Type</th>
      <td><code>application/json</code></td>
    </tr>
  </tbody>
</table>

## Functions

### `parseTranscripts()`

Parses Podcast Transcripts content and returns a typed transcripts object.

```typescript
import { parseTranscripts } from 'feedsmith'

const transcripts = parseTranscripts(jsonContent)
// Returns: object with all fields optional except required ones
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `unknown` | The Podcast Transcripts JSON content to parse (string or object) |

#### Returns
`object` - Parsed Podcast Transcripts with all fields optional

### `generateTranscripts()`

Generates Podcast Transcripts object from transcripts data. The `version` field is automatically set to `1.0.0`.

```typescript
import { generateTranscripts } from 'feedsmith'

const transcripts = generateTranscripts({
  segments: [
    { speaker: 'Host', startTime: 0, body: 'Welcome to the show!' },
    { speaker: 'Guest', startTime: 5.5, body: 'Thanks for having me.' },
  ],
})
// Returns: { version: '1.0.0', segments: [...] }
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `object` | Podcast Transcripts data to generate |
| `options` | `object` | Optional generation settings |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strict` | `boolean` | `false` | Enable strict mode for spec-required field validation, see [Strict Mode](/generating/strict-mode) |

#### Returns
`object` - Generated Podcast Transcripts

### `detectTranscripts()`

Detects if the provided content is a Podcast Transcripts document.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content` | `unknown` | The content to check (string or object) |

#### Returns
`boolean` - `true` if content appears to be Podcast Transcripts format

#### Example
```typescript
import { detectTranscripts } from 'feedsmith'

const isTranscripts = detectTranscripts(jsonContent)
```

## Types

All Podcast Transcripts types are available under the `Transcripts` namespace:

```typescript
import type { Transcripts } from 'feedsmith'

// Access any type from the definitions below
type Document = Transcripts.Document
type Segment = Transcripts.Segment
// … see type definitions below for all available types
```

See the [TypeScript guide](/reference/typescript) for usage examples.

### Type Definitions

> [!INFO]
> For details on type parameters (`TStrict`) and `Requirable<T>` markers, see [TypeScript Reference](/reference/typescript#tdate).

<<< @/../src/related/transcripts/common/types.ts#reference

## Related

- **[Podcast Namespace](/reference/namespaces/podcast)** - The Podcasting 2.0 namespace that references Podcast Transcripts
