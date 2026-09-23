# Benchmarks

There are two distinct benchmark modes:

1. **[JavaScript Benchmarks](#javascript-benchmarks)** - Compare Feedsmith against other JavaScript feed parsing libraries
2. **[Cross-Language Benchmarks](#cross-language-benchmarks)** - Compare Feedsmith against prominent libraries in other languages

One important thing to note is that packages vary in feature support (such as handling specific namespaces or feed formats). The results should be taken with a grain of salt, as direct comparisons aren't always fair.

## JavaScript Benchmarks

Speed benchmarks comparing Feedsmith against popular JavaScript packages for parsing feeds. Feedsmith's results are marked with an asterisk (`*`).

The benchmarks use real-world feeds organized by feed format (RSS, Atom, RDF, JSON Feed, OPML) and file size ranges. Each range is tested on representative feed files, providing insight into how each package performs across various scenarios.

The recommended measurement uses [hyperfine](https://github.com/sharkdp/hyperfine), running each library in a **fresh subprocess** so no library shares a JIT or garbage-collector state with another, and reading **one feed into memory at a time** rather than loading the whole fixture set up front. This is the same approach as the cross-language benchmarks below and avoids the run-to-run drift that an in-process loop suffers from once hundreds of megabytes of feeds accumulate in a single heap.

```bash
$ bash parsing.sh
```

### Results

Running `bash parsing.sh` prints one comparison per category, sorted fastest first (mean ± σ over at least ten runs). Absolute timings depend on the machine.

```
$ bash parsing.sh

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
┌───┬───────────────────────────────┬───────────────┬────────┬────────┬──────┬───────────────┐
│   │ Package                       │ Mean (ms)     │ Min    │ Max    │ Runs │ Performance   │
├───┼───────────────────────────────┼───────────────┼────────┼────────┼──────┼───────────────┤
│ 0 │ feedsmith *                   │ 484.1 ± 6.5   │ 472.6  │ 495.3  │ 10   │ baseline      │
│ 1 │ @ulisesgascon/rss-feed-parser │ 785.3 ± 129.7 │ 682.8  │ 1139.4 │ 10   │ 1.62x slower  │
│ 2 │ @gaphub/feed                  │ 1000.8 ± 65.4 │ 921.5  │ 1061.5 │ 10   │ 2.07x slower  │
│ 3 │ podcast-feed-parser           │ 1221.5 ± 36.9 │ 1195.4 │ 1295.6 │ 10   │ 2.52x slower  │
│ 4 │ @extractus/feed-extractor     │ 1229.3 ± 35.6 │ 1167.1 │ 1281.7 │ 10   │ 2.54x slower  │
│ 5 │ feedme.js                     │ 1243.2 ± 6.3  │ 1233.7 │ 1252.6 │ 10   │ 2.57x slower  │
│ 6 │ rss-parser                    │ 1367.5 ± 45.0 │ 1284.7 │ 1426.2 │ 10   │ 2.83x slower  │
│ 7 │ feedparser                    │ 1942.9 ± 24.0 │ 1895.1 │ 1973.7 │ 10   │ 4.01x slower  │
│ 8 │ @rowanmanning/feed-parser     │ 8416.2 ± 98.9 │ 8272.4 │ 8571.8 │ 10   │ 17.39x slower │
└───┴───────────────────────────────┴───────────────┴────────┴────────┴──────┴───────────────┘

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────────┬───────────────┬────────┬────────┬──────┬──────────────┐
│   │ Package                       │ Mean (ms)     │ Min    │ Max    │ Runs │ Performance  │
├───┼───────────────────────────────┼───────────────┼────────┼────────┼──────┼──────────────┤
│ 0 │ feedsmith *                   │ 281.2 ± 6.7   │ 271.3  │ 294.7  │ 10   │ baseline     │
│ 1 │ @ulisesgascon/rss-feed-parser │ 328.9 ± 10.8  │ 316.2  │ 341.7  │ 10   │ 1.17x slower │
│ 2 │ @gaphub/feed                  │ 428.4 ± 28.9  │ 401.8  │ 471.3  │ 10   │ 1.52x slower │
│ 3 │ podcast-feed-parser           │ 446.0 ± 13.6  │ 424.2  │ 465.7  │ 10   │ 1.59x slower │
│ 4 │ feedme.js                     │ 539.0 ± 6.1   │ 532.2  │ 552.2  │ 10   │ 1.92x slower │
│ 5 │ rss-parser                    │ 555.0 ± 27.2  │ 501.6  │ 587.2  │ 10   │ 1.97x slower │
│ 6 │ @extractus/feed-extractor     │ 663.0 ± 14.6  │ 643.5  │ 685.9  │ 10   │ 2.36x slower │
│ 7 │ feedparser                    │ 789.1 ± 8.6   │ 780.0  │ 804.0  │ 10   │ 2.81x slower │
│ 8 │ @rowanmanning/feed-parser     │ 1758.4 ± 28.7 │ 1714.8 │ 1793.8 │ 10   │ 6.25x slower │
└───┴───────────────────────────────┴───────────────┴────────┴────────┴──────┴──────────────┘

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
┌───┬───────────────────────────┬───────────────┬────────┬────────┬──────┬──────────────┐
│   │ Package                   │ Mean (ms)     │ Min    │ Max    │ Runs │ Performance  │
├───┼───────────────────────────┼───────────────┼────────┼────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 409.8 ± 5.9   │ 403.0  │ 424.1  │ 10   │ baseline     │
│ 1 │ @gaphub/feed              │ 988.9 ± 8.0   │ 979.0  │ 1001.1 │ 10   │ 2.41x slower │
│ 2 │ feedme.js                 │ 1278.2 ± 47.3 │ 1258.6 │ 1412.3 │ 10   │ 3.12x slower │
│ 3 │ feedparser                │ 1595.3 ± 6.3  │ 1581.0 │ 1602.7 │ 10   │ 3.89x slower │
│ 4 │ @extractus/feed-extractor │ 1662.4 ± 21.3 │ 1612.6 │ 1690.6 │ 10   │ 4.06x slower │
│ 5 │ rss-parser                │ 1889.8 ± 34.9 │ 1842.1 │ 1939.7 │ 10   │ 4.61x slower │
│ 6 │ @rowanmanning/feed-parser │ 3709.5 ± 43.0 │ 3630.0 │ 3769.9 │ 10   │ 9.05x slower │
└───┴───────────────────────────┴───────────────┴────────┴────────┴──────┴──────────────┘

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────┬─────────────────┬────────┬────────┬──────┬──────────────┐
│   │ Package                   │ Mean (ms)       │ Min    │ Max    │ Runs │ Performance  │
├───┼───────────────────────────┼─────────────────┼────────┼────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 1251.2 ± 9.8    │ 1240.2 │ 1268.1 │ 10   │ baseline     │
│ 1 │ @rowanmanning/feed-parser │ 4217.6 ± 279.3  │ 4037.3 │ 4752.6 │ 10   │ 3.37x slower │
│ 2 │ @extractus/feed-extractor │ 4752.5 ± 106.8  │ 4624.2 │ 4927.4 │ 10   │ 3.80x slower │
│ 3 │ rss-parser                │ 5109.2 ± 369.2  │ 4751.9 │ 5586.6 │ 10   │ 4.08x slower │
│ 4 │ @gaphub/feed              │ 5156.6 ± 1120.0 │ 3007.7 │ 5759.3 │ 10   │ 4.12x slower │
│ 5 │ feedme.js                 │ 5888.9 ± 49.0   │ 5823.1 │ 5987.2 │ 10   │ 4.71x slower │
│ 6 │ feedparser                │ 5966.7 ± 145.3  │ 5745.0 │ 6178.1 │ 10   │ 4.77x slower │
└───┴───────────────────────────┴─────────────────┴────────┴────────┴──────┴──────────────┘

⏳ Running: RDF feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────┬──────────────┬───────┬───────┬──────┬──────────────┐
│   │ Package                   │ Mean (ms)    │ Min   │ Max   │ Runs │ Performance  │
├───┼───────────────────────────┼──────────────┼───────┼───────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 158.3 ± 1.5  │ 155.0 │ 160.5 │ 18   │ baseline     │
│ 1 │ @rowanmanning/feed-parser │ 287.8 ± 6.5  │ 278.0 │ 298.3 │ 10   │ 1.82x slower │
│ 2 │ @extractus/feed-extractor │ 349.9 ± 6.0  │ 339.8 │ 355.7 │ 10   │ 2.21x slower │
│ 3 │ @gaphub/feed              │ 378.6 ± 3.3  │ 374.7 │ 385.5 │ 10   │ 2.39x slower │
│ 4 │ feedme.js                 │ 436.5 ± 19.7 │ 422.7 │ 483.2 │ 10   │ 2.76x slower │
│ 5 │ rss-parser                │ 507.4 ± 4.0  │ 502.1 │ 513.6 │ 10   │ 3.21x slower │
│ 6 │ feedparser                │ 883.0 ± 9.9  │ 869.2 │ 904.1 │ 10   │ 5.58x slower │
└───┴───────────────────────────┴──────────────┴───────┴───────┴──────┴──────────────┘

⏳ Running: OPML parsing (100 files × 100KB–500KB)
┌───┬──────────────────┬──────────────┬───────┬───────┬──────┬──────────────┐
│   │ Package          │ Mean (ms)    │ Min   │ Max   │ Runs │ Performance  │
├───┼──────────────────┼──────────────┼───────┼───────┼──────┼──────────────┤
│ 0 │ feedsmith *      │ 330.4 ± 2.7  │ 326.4 │ 334.9 │ 10   │ baseline     │
│ 1 │ opml             │ 599.2 ± 38.3 │ 560.2 │ 650.6 │ 10   │ 1.81x slower │
│ 2 │ node-opml-parser │ 618.2 ± 41.3 │ 587.7 │ 703.7 │ 10   │ 1.87x slower │
│ 3 │ @gaphub/feed     │ 629.8 ± 70.8 │ 525.4 │ 687.1 │ 10   │ 1.91x slower │
│ 4 │ opmlparser       │ 688.3 ± 30.1 │ 676.0 │ 773.9 │ 10   │ 2.08x slower │
│ 5 │ opml-to-json     │ 764.7 ± 51.4 │ 684.7 │ 804.9 │ 10   │ 2.31x slower │
└───┴──────────────────┴──────────────┴───────┴───────┴──────┴──────────────┘

⏳ Running: JSON feed parsing (100 files × 100KB–5MB)
┌───┬─────────────┬─────────────┬───────┬───────┬──────┬─────────────┐
│   │ Package     │ Mean (ms)   │ Min   │ Max   │ Runs │ Performance │
├───┼─────────────┼─────────────┼───────┼───────┼──────┼─────────────┤
│ 0 │ feedsmith * │ 152.9 ± 1.2 │ 151.3 │ 156.5 │ 19   │ baseline    │
└───┴─────────────┴─────────────┴───────┴───────┴──────┴─────────────┘
```

> [!NOTE]
> It was hard to find libraries for handling JSON Feed, so at this moment only Feedsmith is listed.

### Methodology

The parsing benchmarks measure feed parsing libraries under realistic conditions where developers need access to fully parsed data. Some libraries use lazy evaluation (deferring computation until properties are accessed) while others parse everything upfront. To ensure fair comparison, we measure the total time required to produce equivalent, fully-accessible results.

For lazy parsers like `@rowanmanning/feed-parser`, we call methods such as .toJSON() to force complete evaluation. Without this step, we'd only be measuring the initial setup cost while ignoring the deferred work that still needs to happen when data is accessed.

This approach reflects typical usage patterns where developers parse feeds to immediately access properties like titles, descriptions, and item lists. Measuring only the initial parsing step for lazy libraries would create misleading comparisons since the computational cost simply shifts to when the data is actually used.

By standardizing on fully-evaluated results, these benchmarks provide realistic performance expectations for applications that need complete feed data processing.

The hyperfine path runs each library as a separate process (`runner.ts <library> <directory> <format>`), discarding three warmup runs and then measuring at least ten runs per library. Results are reported as mean ± standard deviation, so the variance of each measurement is explicit. Big-feed categories are capped at ten files to keep the total runtime reasonable. For stable numbers, run on an otherwise idle machine.

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

Cross-language performance comparison using [hyperfine](https://github.com/sharkdp/hyperfine) to compare Feedsmith against popular feed parsing libraries in other languages:

- **Ruby**: [Feedjira](https://github.com/feedjira/feedjira)
- **Python**: [feedparser](https://github.com/kurtmckee/feedparser)
- **Go**: [gofeed](https://github.com/mmcdole/gofeed)
- **PHP**: [SimplePie](https://github.com/simplepie/simplepie)

Focuses on core feed formats: **RSS**, **Atom**, and **RDF**.

### Results

Results are sorted fastest first (mean ± σ over at least ten runs).

```
$ sh parsing.sh

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
┌───┬─────────────────────┬─────────────────┬─────────┬─────────┬──────┬───────────────┐
│   │ Package             │ Mean (s)        │ Min     │ Max     │ Runs │ Performance   │
├───┼─────────────────────┼─────────────────┼─────────┼─────────┼──────┼───────────────┤
│ 0 │ feedsmith *         │ 6.262 ± 0.042   │ 6.201   │ 6.343   │ 10   │ baseline      │
│ 1 │ simplepie (php)     │ 8.126 ± 0.090   │ 8.023   │ 8.291   │ 10   │ 1.30x slower  │
│ 2 │ gofeed (go)         │ 13.416 ± 0.052  │ 13.353  │ 13.528  │ 10   │ 2.14x slower  │
│ 3 │ feedjira (ruby)     │ 17.950 ± 0.125  │ 17.769  │ 18.242  │ 10   │ 2.87x slower  │
│ 4 │ feedparser (python) │ 127.305 ± 1.259 │ 125.403 │ 129.302 │ 10   │ 20.33x slower │
└───┴─────────────────────┴─────────────────┴─────────┴─────────┴──────┴───────────────┘

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
┌───┬─────────────────────┬───────────────┬───────┬───────┬──────┬───────────────┐
│   │ Package             │ Mean (s)      │ Min   │ Max   │ Runs │ Performance   │
├───┼─────────────────────┼───────────────┼───────┼───────┼──────┼───────────────┤
│ 0 │ simplepie (php)     │ 0.469 ± 0.005 │ 0.461 │ 0.478 │ 10   │ baseline      │
│ 1 │ feedsmith *         │ 0.606 ± 0.007 │ 0.598 │ 0.618 │ 10   │ 1.29x slower  │
│ 2 │ gofeed (go)         │ 0.822 ± 0.006 │ 0.814 │ 0.834 │ 10   │ 1.75x slower  │
│ 3 │ feedjira (ruby)     │ 1.194 ± 0.009 │ 1.181 │ 1.206 │ 10   │ 2.55x slower  │
│ 4 │ feedparser (python) │ 6.162 ± 0.052 │ 6.094 │ 6.265 │ 10   │ 13.15x slower │
└───┴─────────────────────┴───────────────┴───────┴───────┴──────┴───────────────┘

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
┌───┬─────────────────────┬────────────────┬────────┬────────┬──────┬───────────────┐
│   │ Package             │ Mean (s)       │ Min    │ Max    │ Runs │ Performance   │
├───┼─────────────────────┼────────────────┼────────┼────────┼──────┼───────────────┤
│ 0 │ feedsmith *         │ 6.449 ± 0.095  │ 6.270  │ 6.576  │ 10   │ baseline      │
│ 1 │ simplepie (php)     │ 6.936 ± 0.092  │ 6.845  │ 7.163  │ 10   │ 1.08x slower  │
│ 2 │ gofeed (go)         │ 12.265 ± 0.044 │ 12.212 │ 12.342 │ 10   │ 1.90x slower  │
│ 3 │ feedjira (ruby)     │ 13.723 ± 0.141 │ 13.572 │ 13.975 │ 10   │ 2.13x slower  │
│ 4 │ feedparser (python) │ 91.862 ± 0.350 │ 91.299 │ 92.330 │ 10   │ 14.24x slower │
└───┴─────────────────────┴────────────────┴────────┴────────┴──────┴───────────────┘

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
┌───┬─────────────────────┬────────────────┬────────┬────────┬──────┬───────────────┐
│   │ Package             │ Mean (s)       │ Min    │ Max    │ Runs │ Performance   │
├───┼─────────────────────┼────────────────┼────────┼────────┼──────┼───────────────┤
│ 0 │ feedsmith *         │ 3.150 ± 0.015  │ 3.127  │ 3.174  │ 10   │ baseline      │
│ 1 │ simplepie (php)     │ 4.007 ± 0.062  │ 3.918  │ 4.103  │ 10   │ 1.27x slower  │
│ 2 │ gofeed (go)         │ 5.241 ± 0.052  │ 5.157  │ 5.300  │ 10   │ 1.66x slower  │
│ 3 │ feedjira (ruby)     │ 7.632 ± 0.042  │ 7.538  │ 7.693  │ 10   │ 2.42x slower  │
│ 4 │ feedparser (python) │ 62.754 ± 0.934 │ 62.047 │ 65.278 │ 10   │ 19.92x slower │
└───┴─────────────────────┴────────────────┴────────┴────────┴──────┴───────────────┘

⏳ Running: RDF feed parsing (100 files × 100KB–5MB)
┌───┬─────────────────────┬───────────────┬───────┬───────┬──────┬───────────────┐
│   │ Package             │ Mean (s)      │ Min   │ Max   │ Runs │ Performance   │
├───┼─────────────────────┼───────────────┼───────┼───────┼──────┼───────────────┤
│ 0 │ simplepie (php)     │ 0.384 ± 0.007 │ 0.377 │ 0.394 │ 10   │ baseline      │
│ 1 │ feedjira (ruby)     │ 0.726 ± 0.001 │ 0.724 │ 0.727 │ 10   │ 1.89x slower  │
│ 2 │ feedsmith *         │ 0.744 ± 0.008 │ 0.730 │ 0.761 │ 10   │ 1.94x slower  │
│ 3 │ gofeed (go)         │ 0.896 ± 0.006 │ 0.890 │ 0.909 │ 10   │ 2.33x slower  │
│ 4 │ feedparser (python) │ 6.520 ± 0.031 │ 6.479 │ 6.583 │ 10   │ 16.98x slower │
└───┴─────────────────────┴───────────────┴───────┴───────┴──────┴───────────────┘
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
