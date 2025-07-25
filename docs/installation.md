# Installation

Feedsmith works in both Node.js and modern browsers as an ES module. It was tested in both environments, ensuring compatibility and reliability.

## Package Manager

Install the package using your preferred package manager:

::: code-group

```bash [npm]
npm install feedsmith
```

```bash [yarn]
yarn add feedsmith
```

```bash [pnpm]
pnpm add feedsmith
```

```bash [bun]
bun add feedsmith
```

:::

### Requirements

- **Node.js**: Version 14 or higher

## Browser Usage

Feedsmith works in modern browsers as an ES module. You have several options:

### Using CDN

::: code-group

```html [unpkg]
<script type="module">
  import { parseFeed } from 'https://unpkg.com/feedsmith@latest/dist/index.js'

  const { type, feed } = parseFeed(feedContent)
  console.log(feed.title)
</script>
```

```html [jsDelivr]
<script type="module">
  import { parseFeed } from 'https://cdn.jsdelivr.net/npm/feedsmith@latest/dist/index.js'

  const { type, feed } = parseFeed(feedContent)
  console.log(feed.title)
</script>
```

```html [esm.sh]
<script type="module">
  import { parseFeed } from 'https://esm.sh/feedsmith@latest'

  const { type, feed } = parseFeed(feedContent)
  console.log(feed.title)
</script>
```

:::

### Using Build Tools

If you're using a bundler like Vite, Webpack, or Rollup, you can import Feedsmith directly:

```javascript
import { parseFeed } from 'feedsmith'
```
