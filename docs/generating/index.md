---
prev: Parsing › Detecting
next: Generating › Examples
---

# Generating Feeds

Create RSS, Atom, JSON Feed, and OPML files with full namespace support.

## Overview

Feed generation is straightforward - provide the feed data and get back a properly formatted string:

```typescript
import {
  generateRssFeed,
  generateAtomFeed,
  generateJsonFeed,
  generateOpml
} from 'feedsmith'

// Generate different formats
const rss = generateRssFeed({ /* feed data */ })
const atom = generateAtomFeed({ /* feed data */ })
const json = generateJsonFeed({ /* feed data */ })
const opml = generateOpml({ /* opml data */ })
```

## Returned Values

The generation functions return properly formatted strings ready to use.

For detailed examples of input and output for each feed format, see the [Generating Examples](/generating/examples) page.
