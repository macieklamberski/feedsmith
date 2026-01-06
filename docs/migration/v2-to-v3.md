# Migration from 2.x to 3.x

This guide covers all breaking changes when upgrading from Feedsmith 2.x to 3.x. Each breaking change is detailed with specific upgrade steps and examples.

> [!IMPORTANT]
> Version 3.x simplifies the API by removing lenient mode and making all type fields optional by default. This eliminates the distinction between strict and lenient modes, resulting in a more straightforward developer experience.

## Installation

Update your package to the latest 3.x version:

```bash
npm install feedsmith@latest
```

## Breaking Changes

### Removal of Lenient Mode

The `{ lenient: true }` option has been removed from all generate functions. Generate functions now always accept partial feeds and both `Date` objects and string dates.

#### Before (2.x)
```typescript
import { generateRssFeed } from 'feedsmith'

// Strict mode (default) - required fields and Date objects
const xml = generateRssFeed({
  title: 'My Blog',
  link: 'https://example.com',
  description: 'A blog about things',
  pubDate: new Date('2024-01-01'),
})

// Lenient mode - all optional, string dates accepted
const xml = generateRssFeed({
  title: 'My Blog',
  pubDate: '2024-01-01T00:00:00Z',
}, { lenient: true })
```

#### After (3.x)
```typescript
import { generateRssFeed } from 'feedsmith'

// All fields optional, both Date and string dates accepted
const xml = generateRssFeed({
  title: 'My Blog',
  pubDate: new Date('2024-01-01'),
})

// String dates also accepted without any options
const xml = generateRssFeed({
  title: 'My Blog',
  pubDate: '2024-01-01T00:00:00Z',
})
```

#### Migration Steps
1. Remove `{ lenient: true }` from all generate function calls
2. Add runtime validation if you relied on strict mode for required field enforcement

### `DeepPartial` Type Removed

The `DeepPartial` utility type is no longer exported from `feedsmith/types`. Since all type fields are now optional by default, this type is no longer needed.

#### Before (2.x)
```typescript
import type { DeepPartial, Rss } from 'feedsmith/types'

const processFeed = (feed: DeepPartial<Rss.Feed<string>>) => {
  console.log(feed.title)
}
```

#### After (3.x)
```typescript
import type { Rss } from 'feedsmith/types'

// All fields already optional - DeepPartial not needed
const processFeed = (feed: Rss.Feed<string>) => {
  console.log(feed.title)
}
```

#### Migration Steps
1. Remove `DeepPartial` from your imports
2. Use base types directly (`Rss.Feed`, `Atom.Feed`, etc.)

### All Type Fields Now Optional

Previously required fields in type definitions are now optional. The types include `// Required in spec.` comments to indicate which fields are required by the specification.

#### Before (2.x)
```typescript
import type { Rss } from 'feedsmith/types'

// TypeScript enforced required fields
const feed: Rss.Feed<Date> = {
  title: 'My Blog',
  description: 'Required by type',
  // link was already optional
}

// Items required title OR description
const item: Rss.Item<Date> = {
  title: 'Post Title', // Required by discriminated union
}
```

#### After (3.x)
```typescript
import type { Rss } from 'feedsmith/types'

// All fields optional at type level
const feed: Rss.Feed<Date> = {
  title: 'My Blog',
  // description no longer required by type
}

// Items have all optional fields
const item: Rss.Item<Date> = {
  // No fields required by type
}

// Add runtime validation if needed
const validateFeed = (feed: Rss.Feed<Date>) => {
  if (!feed.title || !feed.description) {
    throw new Error('Missing required fields')
  }
}
```

#### Migration Steps
1. Add runtime validation if you relied on TypeScript to enforce required fields
2. Use optional chaining (`?.`) when accessing properties that were previously required

## Migration Checklist

Use this checklist to ensure a complete migration:

- Remove `{ lenient: true }` from all generate function calls
- Remove `DeepPartial` from imports
- Add runtime validation if you relied on type-level required field enforcement
- Test feed generation to ensure output is correct
