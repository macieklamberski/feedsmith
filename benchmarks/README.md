# Benchmarks

There are two sets of benchmarks:

1. **[JavaScript Benchmarks](#javascript-benchmarks)**: compare Feedsmith with other JavaScript feed parsing libraries.
2. **[Cross-Language Benchmarks](#cross-language-benchmarks)**: compare Feedsmith with popular feed parsing libraries in other languages.

Keep in mind that packages support different features. Some handle more namespaces or feed formats than others, so a direct comparison isn't always fair.

## JavaScript Benchmarks

These benchmarks compare how fast Feedsmith and popular JavaScript packages parse feeds. Feedsmith's results are marked with an asterisk (`*`).

The benchmarks use real-world feeds, grouped by format (RSS, Atom, RDF, JSON Feed, OPML) and by file size. Each group shows how the packages perform on a different kind of input, from many small feeds to a few very large ones.

Measurements are taken with [hyperfine](https://github.com/sharkdp/hyperfine). Each library runs in a **fresh process**, so no library shares memory or warm-up state with another. Each run also reads **one feed into memory at a time** instead of loading all the files up front. Running everything in one process made the results drift from run to run, as hundreds of megabytes of feeds piled up in memory. The cross-language benchmarks below work the same way.

### Results

Running `bash parsing.sh` prints one comparison per category, sorted fastest first (mean ± σ over at least ten runs). Absolute timings depend on the machine.

```
$ bash parsing.sh

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
┌───┬───────────────────────────────┬───────────────┬───────────────┬────────┬────────┐
│   │ Package                       │ Performance   │ Mean (ms)     │ Min    │ Max    │
├───┼───────────────────────────────┼───────────────┼───────────────┼────────┼────────┤
│ 0 │ feedsmith *                   │ baseline      │ 484.1 ± 6.5   │ 472.6  │ 495.3  │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1.62x slower  │ 785.3 ± 129.7 │ 682.8  │ 1139.4 │
│ 2 │ @gaphub/feed                  │ 2.07x slower  │ 1000.8 ± 65.4 │ 921.5  │ 1061.5 │
│ 3 │ podcast-feed-parser           │ 2.52x slower  │ 1221.5 ± 36.9 │ 1195.4 │ 1295.6 │
│ 4 │ @extractus/feed-extractor     │ 2.54x slower  │ 1229.3 ± 35.6 │ 1167.1 │ 1281.7 │
│ 5 │ feedme.js                     │ 2.57x slower  │ 1243.2 ± 6.3  │ 1233.7 │ 1252.6 │
│ 6 │ rss-parser                    │ 2.83x slower  │ 1367.5 ± 45.0 │ 1284.7 │ 1426.2 │
│ 7 │ feedparser                    │ 4.01x slower  │ 1942.9 ± 24.0 │ 1895.1 │ 1973.7 │
│ 8 │ @rowanmanning/feed-parser     │ 17.39x slower │ 8416.2 ± 98.9 │ 8272.4 │ 8571.8 │
└───┴───────────────────────────────┴───────────────┴───────────────┴────────┴────────┘

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────────┬──────────────┬───────────────┬────────┬────────┐
│   │ Package                       │ Performance  │ Mean (ms)     │ Min    │ Max    │
├───┼───────────────────────────────┼──────────────┼───────────────┼────────┼────────┤
│ 0 │ feedsmith *                   │ baseline     │ 281.2 ± 6.7   │ 271.3  │ 294.7  │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1.17x slower │ 328.9 ± 10.8  │ 316.2  │ 341.7  │
│ 2 │ @gaphub/feed                  │ 1.52x slower │ 428.4 ± 28.9  │ 401.8  │ 471.3  │
│ 3 │ podcast-feed-parser           │ 1.59x slower │ 446.0 ± 13.6  │ 424.2  │ 465.7  │
│ 4 │ feedme.js                     │ 1.92x slower │ 539.0 ± 6.1   │ 532.2  │ 552.2  │
│ 5 │ rss-parser                    │ 1.97x slower │ 555.0 ± 27.2  │ 501.6  │ 587.2  │
│ 6 │ @extractus/feed-extractor     │ 2.36x slower │ 663.0 ± 14.6  │ 643.5  │ 685.9  │
│ 7 │ feedparser                    │ 2.81x slower │ 789.1 ± 8.6   │ 780.0  │ 804.0  │
│ 8 │ @rowanmanning/feed-parser     │ 6.25x slower │ 1758.4 ± 28.7 │ 1714.8 │ 1793.8 │
└───┴───────────────────────────────┴──────────────┴───────────────┴────────┴────────┘

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
┌───┬───────────────────────────┬──────────────┬───────────────┬────────┬────────┐
│   │ Package                   │ Performance  │ Mean (ms)     │ Min    │ Max    │
├───┼───────────────────────────┼──────────────┼───────────────┼────────┼────────┤
│ 0 │ feedsmith *               │ baseline     │ 409.8 ± 5.9   │ 403.0  │ 424.1  │
│ 1 │ @gaphub/feed              │ 2.41x slower │ 988.9 ± 8.0   │ 979.0  │ 1001.1 │
│ 2 │ feedme.js                 │ 3.12x slower │ 1278.2 ± 47.3 │ 1258.6 │ 1412.3 │
│ 3 │ feedparser                │ 3.89x slower │ 1595.3 ± 6.3  │ 1581.0 │ 1602.7 │
│ 4 │ @extractus/feed-extractor │ 4.06x slower │ 1662.4 ± 21.3 │ 1612.6 │ 1690.6 │
│ 5 │ rss-parser                │ 4.61x slower │ 1889.8 ± 34.9 │ 1842.1 │ 1939.7 │
│ 6 │ @rowanmanning/feed-parser │ 9.05x slower │ 3709.5 ± 43.0 │ 3630.0 │ 3769.9 │
└───┴───────────────────────────┴──────────────┴───────────────┴────────┴────────┘

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────┬──────────────┬─────────────────┬────────┬────────┐
│   │ Package                   │ Performance  │ Mean (ms)       │ Min    │ Max    │
├───┼───────────────────────────┼──────────────┼─────────────────┼────────┼────────┤
│ 0 │ feedsmith *               │ baseline     │ 1251.2 ± 9.8    │ 1240.2 │ 1268.1 │
│ 1 │ @rowanmanning/feed-parser │ 3.37x slower │ 4217.6 ± 279.3  │ 4037.3 │ 4752.6 │
│ 2 │ @extractus/feed-extractor │ 3.80x slower │ 4752.5 ± 106.8  │ 4624.2 │ 4927.4 │
│ 3 │ rss-parser                │ 4.08x slower │ 5109.2 ± 369.2  │ 4751.9 │ 5586.6 │
│ 4 │ @gaphub/feed              │ 4.12x slower │ 5156.6 ± 1120.0 │ 3007.7 │ 5759.3 │
│ 5 │ feedme.js                 │ 4.71x slower │ 5888.9 ± 49.0   │ 5823.1 │ 5987.2 │
│ 6 │ feedparser                │ 4.77x slower │ 5966.7 ± 145.3  │ 5745.0 │ 6178.1 │
└───┴───────────────────────────┴──────────────┴─────────────────┴────────┴────────┘

⏳ Running: RDF feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────┬──────────────┬──────────────┬───────┬───────┐
│   │ Package                   │ Performance  │ Mean (ms)    │ Min   │ Max   │
├───┼───────────────────────────┼──────────────┼──────────────┼───────┼───────┤
│ 0 │ feedsmith *               │ baseline     │ 158.3 ± 1.5  │ 155.0 │ 160.5 │
│ 1 │ @rowanmanning/feed-parser │ 1.82x slower │ 287.8 ± 6.5  │ 278.0 │ 298.3 │
│ 2 │ @extractus/feed-extractor │ 2.21x slower │ 349.9 ± 6.0  │ 339.8 │ 355.7 │
│ 3 │ @gaphub/feed              │ 2.39x slower │ 378.6 ± 3.3  │ 374.7 │ 385.5 │
│ 4 │ feedme.js                 │ 2.76x slower │ 436.5 ± 19.7 │ 422.7 │ 483.2 │
│ 5 │ rss-parser                │ 3.21x slower │ 507.4 ± 4.0  │ 502.1 │ 513.6 │
│ 6 │ feedparser                │ 5.58x slower │ 883.0 ± 9.9  │ 869.2 │ 904.1 │
└───┴───────────────────────────┴──────────────┴──────────────┴───────┴───────┘

⏳ Running: OPML parsing (100 files × 100KB–500KB)
┌───┬──────────────────┬──────────────┬──────────────┬───────┬───────┐
│   │ Package          │ Performance  │ Mean (ms)    │ Min   │ Max   │
├───┼──────────────────┼──────────────┼──────────────┼───────┼───────┤
│ 0 │ feedsmith *      │ baseline     │ 330.4 ± 2.7  │ 326.4 │ 334.9 │
│ 1 │ opml             │ 1.81x slower │ 599.2 ± 38.3 │ 560.2 │ 650.6 │
│ 2 │ node-opml-parser │ 1.87x slower │ 618.2 ± 41.3 │ 587.7 │ 703.7 │
│ 3 │ @gaphub/feed     │ 1.91x slower │ 629.8 ± 70.8 │ 525.4 │ 687.1 │
│ 4 │ opmlparser       │ 2.08x slower │ 688.3 ± 30.1 │ 676.0 │ 773.9 │
│ 5 │ opml-to-json     │ 2.31x slower │ 764.7 ± 51.4 │ 684.7 │ 804.9 │
└───┴──────────────────┴──────────────┴──────────────┴───────┴───────┘

⏳ Running: JSON feed parsing (100 files × 100KB–5MB)
┌───┬─────────────┬─────────────┬─────────────┬───────┬───────┐
│   │ Package     │ Performance │ Mean (ms)   │ Min   │ Max   │
├───┼─────────────┼─────────────┼─────────────┼───────┼───────┤
│ 0 │ feedsmith * │ baseline    │ 152.9 ± 1.2 │ 151.3 │ 156.5 │
└───┴─────────────┴─────────────┴─────────────┴───────┴───────┘
```

> [!NOTE]
> There are few JavaScript libraries that parse JSON Feed, so for now only Feedsmith is listed.

### Methodology

The benchmarks measure the total time until the parsed data is fully available. This matches how most apps use a feed parser: they parse a feed and read its title, description and items right away.

Not every library does all the work up front. Some parse lazily and only process a part of the feed when a property is read. For lazy parsers like `@rowanmanning/feed-parser`, the benchmark calls methods such as `.toJSON()` to force a full parse. Without this step, the benchmark would measure only the setup cost. The rest of the work would still happen later, when the app reads the data.

Each library runs as a separate process (`runner.ts <library> <directory> <format>`). Hyperfine discards three warm-up runs, then measures at least ten runs per library. Results show the mean ± standard deviation, so the spread of each measurement is visible. The large-file categories are capped at ten files to keep the total runtime reasonable. For stable numbers, run the benchmarks on an otherwise idle machine.

### Setup

```bash
# 1. Install dependencies
bun install

# 2. Run benchmarks (requires `brew install hyperfine`)
bash parsing.sh

# Compare the local feedsmith source against the published release
bash feedsmith.sh
```

## Cross-Language Benchmarks

These benchmarks use [hyperfine](https://github.com/sharkdp/hyperfine) to compare Feedsmith with popular feed parsers in other languages:

- **Ruby**: [Feedjira](https://github.com/feedjira/feedjira)
- **Python**: [feedparser](https://github.com/kurtmckee/feedparser)
- **Go**: [gofeed](https://github.com/mmcdole/gofeed)
- **PHP**: [SimplePie](https://github.com/simplepie/simplepie)

They cover the core feed formats: **RSS**, **Atom**, and **RDF**.

### Results

Results are sorted fastest first (mean ± σ over at least ten runs).

```
$ sh parsing.sh

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
┌───┬─────────────────────┬───────────────┬─────────────────┬─────────┬─────────┐
│   │ Package             │ Performance   │ Mean (ms)       │ Min     │ Max     │
├───┼─────────────────────┼───────────────┼─────────────────┼─────────┼─────────┤
│ 0 │ feedsmith *         │ baseline      │ 454.0 ± 5.3     │ 446.7   │ 463.7   │
│ 1 │ simplepie (php)     │ 1.39x slower  │ 630.1 ± 3.6     │ 623.5   │ 635.1   │
│ 2 │ gofeed (go)         │ 2.01x slower  │ 914.2 ± 9.9     │ 898.2   │ 931.1   │
│ 3 │ feedjira (ruby)     │ 2.84x slower  │ 1288.1 ± 16.4   │ 1273.1  │ 1330.2  │
│ 4 │ feedparser (python) │ 27.55x slower │ 12506.6 ± 113.0 │ 12351.3 │ 12656.1 │
└───┴─────────────────────┴───────────────┴─────────────────┴─────────┴─────────┘

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
┌───┬─────────────────────┬───────────────┬───────────────┬────────┬────────┐
│   │ Package             │ Performance   │ Mean (ms)     │ Min    │ Max    │
├───┼─────────────────────┼───────────────┼───────────────┼────────┼────────┤
│ 0 │ feedsmith *         │ baseline      │ 276.5 ± 8.8   │ 266.2  │ 297.8  │
│ 1 │ simplepie (php)     │ 1.03x slower  │ 283.4 ± 2.5   │ 280.0  │ 287.1  │
│ 2 │ gofeed (go)         │ 1.84x slower  │ 507.7 ± 3.5   │ 501.9  │ 512.6  │
│ 3 │ feedjira (ruby)     │ 2.78x slower  │ 768.9 ± 77.3  │ 710.6  │ 976.0  │
│ 4 │ feedparser (python) │ 20.43x slower │ 5648.0 ± 35.8 │ 5599.7 │ 5725.8 │
└───┴─────────────────────┴───────────────┴───────────────┴────────┴────────┘

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
┌───┬─────────────────────┬───────────────┬───────────────┬────────┬─────────┐
│   │ Package             │ Performance   │ Mean (ms)     │ Min    │ Max     │
├───┼─────────────────────┼───────────────┼───────────────┼────────┼─────────┤
│ 0 │ feedsmith *         │ baseline      │ 448.1 ± 4.0   │ 441.0  │ 454.1   │
│ 1 │ simplepie (php)     │ 1.28x slower  │ 575.7 ± 9.9   │ 558.2  │ 591.0   │
│ 2 │ gofeed (go)         │ 2.36x slower  │ 1059.5 ± 16.9 │ 1044.2 │ 1096.2  │
│ 3 │ feedjira (ruby)     │ 2.87x slower  │ 1284.2 ± 7.7  │ 1267.5 │ 1292.7  │
│ 4 │ feedparser (python) │ 22.32x slower │ 9999.7 ± 80.5 │ 9895.0 │ 10155.5 │
└───┴─────────────────────┴───────────────┴───────────────┴────────┴─────────┘

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
┌───┬─────────────────────┬───────────────┬─────────────────┬─────────┬─────────┐
│   │ Package             │ Performance   │ Mean (ms)       │ Min     │ Max     │
├───┼─────────────────────┼───────────────┼─────────────────┼─────────┼─────────┤
│ 0 │ feedsmith *         │ baseline      │ 1482.3 ± 13.7   │ 1460.3  │ 1506.7  │
│ 1 │ simplepie (php)     │ 1.52x slower  │ 2258.6 ± 11.4   │ 2246.5  │ 2279.6  │
│ 2 │ gofeed (go)         │ 2.81x slower  │ 4171.7 ± 37.7   │ 4112.2  │ 4219.7  │
│ 3 │ feedjira (ruby)     │ 3.11x slower  │ 4606.1 ± 43.4   │ 4547.6  │ 4696.5  │
│ 4 │ feedparser (python) │ 39.29x slower │ 58234.4 ± 359.4 │ 57691.6 │ 58729.3 │
└───┴─────────────────────┴───────────────┴─────────────────┴─────────┴─────────┘

⏳ Running: RDF feed parsing (100 files × 100KB–5MB)
┌───┬─────────────────────┬───────────────┬───────────────┬────────┬────────┐
│   │ Package             │ Performance   │ Mean (ms)     │ Min    │ Max    │
├───┼─────────────────────┼───────────────┼───────────────┼────────┼────────┤
│ 0 │ simplepie (php)     │ baseline      │ 259.4 ± 2.9   │ 253.3  │ 263.8  │
│ 1 │ feedsmith *         │ 1.11x slower  │ 286.7 ± 2.2   │ 284.4  │ 291.0  │
│ 2 │ feedjira (ruby)     │ 1.85x slower  │ 479.1 ± 1.2   │ 477.2  │ 481.4  │
│ 3 │ gofeed (go)         │ 2.47x slower  │ 640.1 ± 24.1  │ 619.8  │ 698.6  │
│ 4 │ feedparser (python) │ 23.76x slower │ 6162.2 ± 35.4 │ 6115.5 │ 6230.0 │
└───┴─────────────────────┴───────────────┴───────────────┴────────┴────────┘
```

### Setup

```bash
# 1. Install system packages
brew install hyperfine bun ruby python go php composer

# 2. Install language-specific packages
bundle install
composer install

# Composer's vendor/ directory makes Go assume vendored modules, so force module mode.
export GOFLAGS=-mod=mod
go mod tidy

# Python is installed in a local virtualenv (Homebrew Python blocks global pip installs
# per PEP 668). parsing.sh runs the benchmark with .venv/bin/python3.
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# 3. Build Go binary
go build -o parsing-gofeed parsing-gofeed.go

# 4. Run benchmarks
sh parsing.sh
```
