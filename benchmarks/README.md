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
┌───┬───────────────────────────────┬────────────────┬─────────┬─────────┬──────┬───────────────┐
│   │ Package                       │ Mean (ms)      │ Min     │ Max     │ Runs │ Performance   │
├───┼───────────────────────────────┼────────────────┼─────────┼─────────┼──────┼───────────────┤
│ 0 │ feedsmith *                   │ 844.4 ± 19.3   │ 821.7   │ 876.1   │ 10   │ baseline      │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1515.7 ± 61.2  │ 1437.2  │ 1585.3  │ 10   │ 1.79x slower  │
│ 2 │ @extractus/feed-extractor     │ 2780.3 ± 61.7  │ 2690.2  │ 2866.3  │ 10   │ 3.29x slower  │
│ 3 │ @gaphub/feed                  │ 3018.8 ± 13.0  │ 2992.2  │ 3033.8  │ 10   │ 3.57x slower  │
│ 4 │ podcast-feed-parser           │ 3096.2 ± 47.3  │ 3040.7  │ 3196.8  │ 10   │ 3.67x slower  │
│ 5 │ rss-parser                    │ 3521.2 ± 26.4  │ 3487.6  │ 3585.3  │ 10   │ 4.17x slower  │
│ 6 │ feedme.js                     │ 4033.9 ± 451.0 │ 3382.8  │ 4416.7  │ 10   │ 4.78x slower  │
│ 7 │ feedparser                    │ 4998.1 ± 63.7  │ 4909.1  │ 5129.4  │ 10   │ 5.92x slower  │
│ 8 │ @rowanmanning/feed-parser     │ 12365.3 ± 46.4 │ 12275.7 │ 12457.3 │ 10   │ 14.64x slower │
└───┴───────────────────────────────┴────────────────┴─────────┴─────────┴──────┴───────────────┘

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────────┬───────────────┬────────┬────────┬──────┬──────────────┐
│   │ Package                       │ Mean (ms)     │ Min    │ Max    │ Runs │ Performance  │
├───┼───────────────────────────────┼───────────────┼────────┼────────┼──────┼──────────────┤
│ 0 │ feedsmith *                   │ 598.7 ± 11.6  │ 582.0  │ 624.5  │ 10   │ baseline     │
│ 1 │ @ulisesgascon/rss-feed-parser │ 641.1 ± 3.2   │ 635.7  │ 644.9  │ 10   │ 1.07x slower │
│ 2 │ @gaphub/feed                  │ 940.5 ± 5.7   │ 932.9  │ 950.3  │ 10   │ 1.57x slower │
│ 3 │ podcast-feed-parser           │ 1073.9 ± 7.1  │ 1064.5 │ 1090.0 │ 10   │ 1.79x slower │
│ 4 │ rss-parser                    │ 1385.5 ± 7.2  │ 1378.3 │ 1400.0 │ 10   │ 2.31x slower │
│ 5 │ @extractus/feed-extractor     │ 1418.0 ± 8.2  │ 1399.5 │ 1428.9 │ 10   │ 2.37x slower │
│ 6 │ feedme.js                     │ 1723.6 ± 89.8 │ 1586.8 │ 1790.7 │ 10   │ 2.88x slower │
│ 7 │ feedparser                    │ 2153.1 ± 12.4 │ 2131.3 │ 2174.3 │ 10   │ 3.60x slower │
│ 8 │ @rowanmanning/feed-parser     │ 2440.9 ± 26.7 │ 2399.2 │ 2478.9 │ 10   │ 4.08x slower │
└───┴───────────────────────────────┴───────────────┴────────┴────────┴──────┴──────────────┘

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
┌───┬───────────────────────────┬────────────────┬────────┬────────┬──────┬──────────────┐
│   │ Package                   │ Mean (ms)      │ Min    │ Max    │ Runs │ Performance  │
├───┼───────────────────────────┼────────────────┼────────┼────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 711.0 ± 8.8    │ 695.9  │ 725.2  │ 10   │ baseline     │
│ 1 │ @gaphub/feed              │ 2139.9 ± 26.0  │ 2099.0 │ 2171.2 │ 10   │ 3.01x slower │
│ 2 │ feedme.js                 │ 2728.6 ± 22.6  │ 2699.7 │ 2765.9 │ 10   │ 3.84x slower │
│ 3 │ feedparser                │ 3072.6 ± 10.9  │ 3059.2 │ 3088.7 │ 10   │ 4.32x slower │
│ 4 │ @extractus/feed-extractor │ 3119.7 ± 51.5  │ 3043.4 │ 3226.7 │ 10   │ 4.39x slower │
│ 5 │ rss-parser                │ 3176.7 ± 52.6  │ 3110.9 │ 3280.7 │ 10   │ 4.47x slower │
│ 6 │ @rowanmanning/feed-parser │ 6000.4 ± 133.3 │ 5807.1 │ 6171.5 │ 10   │ 8.44x slower │
└───┴───────────────────────────┴────────────────┴────────┴────────┴──────┴──────────────┘

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
┌───┬───────────────────────────┬─────────────────┬─────────┬─────────┬──────┬──────────────┐
│   │ Package                   │ Mean (ms)       │ Min     │ Max     │ Runs │ Performance  │
├───┼───────────────────────────┼─────────────────┼─────────┼─────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 2487.5 ± 18.1   │ 2458.8  │ 2527.9  │ 10   │ baseline     │
│ 1 │ @gaphub/feed              │ 5838.9 ± 31.7   │ 5789.8  │ 5914.6  │ 10   │ 2.35x slower │
│ 2 │ @rowanmanning/feed-parser │ 6991.7 ± 75.0   │ 6840.3  │ 7073.9  │ 10   │ 2.81x slower │
│ 3 │ @extractus/feed-extractor │ 9549.1 ± 92.7   │ 9336.3  │ 9652.5  │ 10   │ 3.84x slower │
│ 4 │ rss-parser                │ 10602.7 ± 864.1 │ 9667.9  │ 12216.0 │ 10   │ 4.26x slower │
│ 5 │ feedme.js                 │ 13403.7 ± 110.5 │ 13230.2 │ 13590.1 │ 10   │ 5.39x slower │
│ 6 │ feedparser                │ 15836.8 ± 140.0 │ 15638.4 │ 16065.9 │ 10   │ 6.37x slower │
└───┴───────────────────────────┴─────────────────┴─────────┴─────────┴──────┴──────────────┘

⏳ Running: RDF feed parsing (97 files × 100KB–5MB)
┌───┬───────────────────────────┬───────────────┬────────┬────────┬──────┬──────────────┐
│   │ Package                   │ Mean (ms)     │ Min    │ Max    │ Runs │ Performance  │
├───┼───────────────────────────┼───────────────┼────────┼────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 448.6 ± 6.6   │ 438.7  │ 457.1  │ 10   │ baseline     │
│ 1 │ @rowanmanning/feed-parser │ 489.9 ± 10.1  │ 480.1  │ 510.0  │ 10   │ 1.09x slower │
│ 2 │ @extractus/feed-extractor │ 716.5 ± 13.7  │ 704.2  │ 746.0  │ 10   │ 1.60x slower │
│ 3 │ @gaphub/feed              │ 1123.1 ± 12.4 │ 1103.5 │ 1141.1 │ 10   │ 2.50x slower │
│ 4 │ rss-parser                │ 2112.1 ± 28.1 │ 2074.9 │ 2150.3 │ 10   │ 4.71x slower │
│ 5 │ feedme.js                 │ 2206.2 ± 23.3 │ 2177.5 │ 2250.1 │ 10   │ 4.92x slower │
│ 6 │ feedparser                │ 2499.4 ± 31.1 │ 2456.5 │ 2542.5 │ 10   │ 5.57x slower │
└───┴───────────────────────────┴───────────────┴────────┴────────┴──────┴──────────────┘

⏳ Running: OPML parsing (50 files × 100KB–500KB)
┌───┬──────────────────┬──────────────┬───────┬───────┬──────┬──────────────┐
│   │ Package          │ Mean (ms)    │ Min   │ Max   │ Runs │ Performance  │
├───┼──────────────────┼──────────────┼───────┼───────┼──────┼──────────────┤
│ 0 │ feedsmith *      │ 306.6 ± 1.9  │ 302.9 │ 308.8 │ 10   │ baseline     │
│ 1 │ @gaphub/feed     │ 535.4 ± 7.8  │ 521.1 │ 546.6 │ 10   │ 1.75x slower │
│ 2 │ node-opml-parser │ 570.3 ± 10.0 │ 557.8 │ 587.3 │ 10   │ 1.86x slower │
│ 3 │ opml             │ 587.9 ± 12.8 │ 568.7 │ 606.0 │ 10   │ 1.92x slower │
│ 4 │ opmlparser       │ 650.0 ± 13.5 │ 633.1 │ 671.1 │ 10   │ 2.12x slower │
│ 5 │ opml-to-json     │ 664.0 ± 5.8  │ 658.5 │ 673.8 │ 10   │ 2.17x slower │
└───┴──────────────────┴──────────────┴───────┴───────┴──────┴──────────────┘

⏳ Running: JSON feed parsing (32 files × 100KB–5MB)
┌───┬─────────────┬─────────────┬───────┬───────┬──────┬─────────────┐
│   │ Package     │ Mean (ms)   │ Min   │ Max   │ Runs │ Performance │
├───┼─────────────┼─────────────┼───────┼───────┼──────┼─────────────┤
│ 0 │ feedsmith * │ 188.6 ± 6.4 │ 181.4 │ 207.3 │ 15   │ baseline    │
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
