---
title: "Generating Feeds: Lenient Mode"
---

# Lenient Mode

By default, the generate functions enforce all fields that are required by the feed specifications and expect `Date` objects for date fields. However, when working with parsed feeds or building feeds incrementally, you may need more flexibility. This is where **lenient mode** comes in.

## What is Lenient Mode?

Lenient mode allows you to:
- Generate feeds **without spec-required fields** (all fields become optional)
- Use **string dates** instead of Date objects
- Pass through **invalid date strings** as-is

This is particularly useful when working with the _parse → modify → generate_ workflow, as the parse functions return objects where all fields are optional and dates are strings.

## Basic Usage

Add `{ lenient: true }` as the second parameter to any generate function:

```typescript
import { generateRssFeed, parseRssFeed } from 'feedsmith'

// Parse returns an object with all optional fields and string dates
const parsedFeed = parseRssFeed(xmlString)

// Generate with lenient mode accepts the parsed output directly
const regeneratedXml = generateRssFeed(parsedFeed, { lenient: true })
```

## Strict vs Lenient Mode

### Strict Mode (default)

```typescript
// Requires spec-mandated fields with Date objects for dates
const feed = {
  title: 'My Blog',                   // Required by RSS spec
  link: 'https://example.com',        // Required by RSS spec
  description: 'A blog about things', // Required by RSS spec
  pubDate: new Date('2024-01-01'),    // Optional, but must be Date if provided
  items: [
    {
      title: 'Post 1',                // At least title or description required
      link: 'https://example.com/post1',
      description: 'First post',
      pubDate: new Date('2024-01-02') // Optional, but must be Date if provided
    }
  ]
}

const xml = generateRssFeed(feed)
```

### Lenient Mode

```typescript
// All fields become optional, accepts string dates
const partialFeed = {
  title: 'My Blog',
  // link and description not required in lenient mode
  pubDate: '2024-01-01T00:00:00Z',             // String date accepted
  items: [
    {
      title: 'Post 1',
      // No other fields required
      pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT' // RFC822 string accepted
    }
  ]
}

const xml = generateRssFeed(partialFeed, { lenient: true })
```

## Invalid Date Handling

In lenient mode, invalid date strings are preserved as-is instead of stripping them from the output:

```typescript
const feedWithInvalidDates = {
  title: 'Feed with Custom Dates',
  pubDate: 'Yesterday at 3pm', // Invalid but preserved
  items: [
    {
      title: 'Post',
      pubDate: 'Coming soon'   // Invalid but preserved
    }
  ]
}

const xml = generateRssFeed(feedWithInvalidDates, { lenient: true })
// Output will contain: <pubDate>Yesterday at 3pm</pubDate>
```

## When to Use Lenient Mode

### Use lenient mode
- Processing feeds from external sources (_parse → modify → generate_ workflow)
- Building feeds incrementally where not all data is available initially
- Working with legacy feeds that don't strictly follow specifications
- Migrating or transforming feeds between different systems

### Use strict mode (default)
- Creating new feeds from scratch with complete data
- You want TypeScript to enforce all spec-required fields
- Date formatting consistency is critical
