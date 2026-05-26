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

Running `bash parsing.sh` prints one hyperfine comparison per category. Absolute timings depend on the machine — run on an otherwise idle one for tight deviations.

```
$ bash parsing.sh

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
Benchmark 1: rss-parser
  Time (mean ± σ):      1.386 s ±  0.017 s    [User: 1.686 s, System: 0.073 s]
  Range (min … max):    1.364 s …  1.419 s    10 runs

Benchmark 2: @gaphub/feed
  Time (mean ± σ):     958.9 ms ±  12.0 ms    [User: 1383.7 ms, System: 74.0 ms]
  Range (min … max):   944.8 ms … 985.4 ms    10 runs

Benchmark 3: @rowanmanning/feed-parser
  Time (mean ± σ):      2.527 s ±  0.049 s    [User: 3.541 s, System: 0.137 s]
  Range (min … max):    2.465 s …  2.594 s    10 runs

Benchmark 4: feedme.js
  Time (mean ± σ):      1.754 s ±  0.089 s    [User: 2.257 s, System: 0.097 s]
  Range (min … max):    1.576 s …  1.815 s    10 runs

Benchmark 5: @extractus/feed-extractor
  Time (mean ± σ):      1.445 s ±  0.009 s    [User: 2.034 s, System: 0.093 s]
  Range (min … max):    1.434 s …  1.462 s    10 runs

Benchmark 6: @ulisesgascon/rss-feed-parser
  Time (mean ± σ):     672.6 ms ±  10.8 ms    [User: 836.6 ms, System: 61.0 ms]
  Range (min … max):   660.5 ms … 687.7 ms    10 runs

Benchmark 7: feedparser
  Time (mean ± σ):      2.192 s ±  0.006 s    [User: 3.089 s, System: 0.117 s]
  Range (min … max):    2.178 s …  2.200 s    10 runs

Benchmark 8: podcast-feed-parser
  Time (mean ± σ):      1.098 s ±  0.004 s    [User: 1.395 s, System: 0.067 s]
  Range (min … max):    1.093 s …  1.106 s    10 runs

Benchmark 9: feedsmith *
  Time (mean ± σ):     617.9 ms ±  14.0 ms    [User: 952.2 ms, System: 77.5 ms]
  Range (min … max):   601.0 ms … 650.2 ms    10 runs

Summary
  feedsmith * ran
    1.09 ± 0.03 times faster than @ulisesgascon/rss-feed-parser
    1.55 ± 0.04 times faster than @gaphub/feed
    1.78 ± 0.04 times faster than podcast-feed-parser
    2.24 ± 0.06 times faster than rss-parser
    2.34 ± 0.05 times faster than @extractus/feed-extractor
    2.84 ± 0.16 times faster than feedme.js
    3.55 ± 0.08 times faster than feedparser
    4.09 ± 0.12 times faster than @rowanmanning/feed-parser

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
Benchmark 1: rss-parser
  Time (mean ± σ):      3.569 s ±  0.012 s    [User: 4.594 s, System: 0.176 s]
  Range (min … max):    3.554 s …  3.590 s    10 runs

Benchmark 2: @gaphub/feed
  Time (mean ± σ):      3.071 s ±  0.014 s    [User: 4.285 s, System: 0.225 s]
  Range (min … max):    3.046 s …  3.092 s    10 runs

Benchmark 3: @rowanmanning/feed-parser
  Time (mean ± σ):     12.760 s ±  0.110 s    [User: 14.397 s, System: 0.464 s]
  Range (min … max):   12.629 s … 12.946 s    10 runs

Benchmark 4: feedme.js
  Time (mean ± σ):      4.076 s ±  0.481 s    [User: 5.065 s, System: 0.227 s]
  Range (min … max):    3.368 s …  4.407 s    10 runs

Benchmark 5: @extractus/feed-extractor
  Time (mean ± σ):      2.756 s ±  0.013 s    [User: 3.534 s, System: 0.163 s]
  Range (min … max):    2.737 s …  2.777 s    10 runs

Benchmark 6: @ulisesgascon/rss-feed-parser
  Time (mean ± σ):      1.500 s ±  0.046 s    [User: 2.049 s, System: 0.110 s]
  Range (min … max):    1.447 s …  1.593 s    10 runs

Benchmark 7: feedparser
  Time (mean ± σ):      4.905 s ±  0.102 s    [User: 6.405 s, System: 0.207 s]
  Range (min … max):    4.629 s …  5.012 s    10 runs

Benchmark 8: podcast-feed-parser
  Time (mean ± σ):      3.062 s ±  0.007 s    [User: 4.050 s, System: 0.144 s]
  Range (min … max):    3.049 s …  3.074 s    10 runs

Benchmark 9: feedsmith *
  Time (mean ± σ):     854.5 ms ±  20.6 ms    [User: 1318.5 ms, System: 109.1 ms]
  Range (min … max):   832.5 ms … 884.7 ms    10 runs

Summary
  feedsmith * ran
    1.76 ± 0.07 times faster than @ulisesgascon/rss-feed-parser
    3.23 ± 0.08 times faster than @extractus/feed-extractor
    3.58 ± 0.09 times faster than podcast-feed-parser
    3.59 ± 0.09 times faster than @gaphub/feed
    4.18 ± 0.10 times faster than rss-parser
    4.77 ± 0.57 times faster than feedme.js
    5.74 ± 0.18 times faster than feedparser
   14.93 ± 0.38 times faster than @rowanmanning/feed-parser

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
Benchmark 1: rss-parser
  Time (mean ± σ):     10.127 s ±  0.579 s    [User: 10.128 s, System: 1.000 s]
  Range (min … max):    9.296 s … 10.762 s    10 runs

Benchmark 2: @gaphub/feed
  Time (mean ± σ):      5.760 s ±  0.031 s    [User: 6.805 s, System: 0.287 s]
  Range (min … max):    5.726 s …  5.818 s    10 runs

Benchmark 3: @rowanmanning/feed-parser
  Time (mean ± σ):      6.922 s ±  0.098 s    [User: 8.203 s, System: 0.385 s]
  Range (min … max):    6.786 s …  7.099 s    10 runs

Benchmark 4: feedme.js
  Time (mean ± σ):     13.214 s ±  0.043 s    [User: 13.904 s, System: 0.446 s]
  Range (min … max):   13.125 s … 13.273 s    10 runs

Benchmark 5: @extractus/feed-extractor
  Time (mean ± σ):      9.537 s ±  0.128 s    [User: 10.603 s, System: 0.380 s]
  Range (min … max):    9.363 s …  9.742 s    10 runs

Benchmark 6: feedparser
  Time (mean ± σ):     15.713 s ±  0.137 s    [User: 16.882 s, System: 0.444 s]
  Range (min … max):   15.524 s … 15.894 s    10 runs

Benchmark 7: feedsmith *
  Time (mean ± σ):      2.443 s ±  0.028 s    [User: 2.865 s, System: 0.176 s]
  Range (min … max):    2.404 s …  2.481 s    10 runs

Summary
  feedsmith * ran
    2.36 ± 0.03 times faster than @gaphub/feed
    2.83 ± 0.05 times faster than @rowanmanning/feed-parser
    3.90 ± 0.07 times faster than @extractus/feed-extractor
    4.15 ± 0.24 times faster than rss-parser
    5.41 ± 0.06 times faster than feedme.js
    6.43 ± 0.09 times faster than feedparser

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
Benchmark 1: rss-parser
  Time (mean ± σ):      3.121 s ±  0.032 s    [User: 3.357 s, System: 0.442 s]
  Range (min … max):    3.085 s …  3.189 s    10 runs

Benchmark 2: @gaphub/feed
  Time (mean ± σ):      2.133 s ±  0.016 s    [User: 2.686 s, System: 0.122 s]
  Range (min … max):    2.107 s …  2.155 s    10 runs

Benchmark 3: @rowanmanning/feed-parser
  Time (mean ± σ):      5.895 s ±  0.077 s    [User: 7.012 s, System: 0.306 s]
  Range (min … max):    5.785 s …  6.062 s    10 runs

Benchmark 4: feedme.js
  Time (mean ± σ):      2.745 s ±  0.043 s    [User: 3.504 s, System: 0.164 s]
  Range (min … max):    2.689 s …  2.825 s    10 runs

Benchmark 5: @extractus/feed-extractor
  Time (mean ± σ):      3.121 s ±  0.044 s    [User: 3.869 s, System: 0.203 s]
  Range (min … max):    3.048 s …  3.192 s    10 runs

Benchmark 6: feedparser
  Time (mean ± σ):      3.117 s ±  0.053 s    [User: 4.258 s, System: 0.172 s]
  Range (min … max):    3.014 s …  3.191 s    10 runs

Benchmark 7: feedsmith *
  Time (mean ± σ):     751.5 ms ±  34.0 ms    [User: 934.3 ms, System: 94.4 ms]
  Range (min … max):   715.3 ms … 822.8 ms    10 runs

Summary
  feedsmith * ran
    2.84 ± 0.13 times faster than @gaphub/feed
    3.65 ± 0.18 times faster than feedme.js
    4.15 ± 0.20 times faster than feedparser
    4.15 ± 0.20 times faster than @extractus/feed-extractor
    4.15 ± 0.19 times faster than rss-parser
    7.84 ± 0.37 times faster than @rowanmanning/feed-parser

⏳ Running: RDF feed parsing (97 files × 100KB–5MB)
Benchmark 1: rss-parser
  Time (mean ± σ):      2.101 s ±  0.014 s    [User: 2.514 s, System: 0.104 s]
  Range (min … max):    2.079 s …  2.128 s    10 runs

Benchmark 2: @gaphub/feed
  Time (mean ± σ):      1.149 s ±  0.011 s    [User: 1.767 s, System: 0.101 s]
  Range (min … max):    1.126 s …  1.165 s    10 runs

Benchmark 3: @rowanmanning/feed-parser
  Time (mean ± σ):     497.3 ms ±   6.9 ms    [User: 931.4 ms, System: 62.0 ms]
  Range (min … max):   486.2 ms … 506.7 ms    10 runs

Benchmark 4: feedme.js
  Time (mean ± σ):      2.218 s ±  0.037 s    [User: 2.760 s, System: 0.118 s]
  Range (min … max):    2.179 s …  2.284 s    10 runs

Benchmark 5: @extractus/feed-extractor
  Time (mean ± σ):     716.7 ms ±  17.7 ms    [User: 1042.6 ms, System: 65.3 ms]
  Range (min … max):   695.1 ms … 748.0 ms    10 runs

Benchmark 6: feedparser
  Time (mean ± σ):      2.464 s ±  0.069 s    [User: 3.348 s, System: 0.130 s]
  Range (min … max):    2.419 s …  2.617 s    10 runs

Benchmark 7: feedsmith *
  Time (mean ± σ):     420.4 ms ±   4.6 ms    [User: 626.1 ms, System: 59.4 ms]
  Range (min … max):   413.5 ms … 426.1 ms    10 runs

Summary
  feedsmith * ran
    1.18 ± 0.02 times faster than @rowanmanning/feed-parser
    1.70 ± 0.05 times faster than @extractus/feed-extractor
    2.73 ± 0.04 times faster than @gaphub/feed
    5.00 ± 0.06 times faster than rss-parser
    5.28 ± 0.10 times faster than feedme.js
    5.86 ± 0.18 times faster than feedparser

⏳ Running: OPML parsing (50 files × 100KB–500KB)
Benchmark 1: @gaphub/feed
  Time (mean ± σ):     533.7 ms ±  17.1 ms    [User: 967.6 ms, System: 51.7 ms]
  Range (min … max):   513.7 ms … 564.5 ms    10 runs

Benchmark 2: node-opml-parser
  Time (mean ± σ):     585.9 ms ±   8.6 ms    [User: 1000.7 ms, System: 48.4 ms]
  Range (min … max):   576.0 ms … 601.9 ms    10 runs

Benchmark 3: opml-to-json
  Time (mean ± σ):     684.2 ms ±   8.0 ms    [User: 1180.6 ms, System: 50.5 ms]
  Range (min … max):   672.1 ms … 702.6 ms    10 runs

Benchmark 4: opml
  Time (mean ± σ):     590.5 ms ±   4.7 ms    [User: 969.7 ms, System: 54.3 ms]
  Range (min … max):   583.5 ms … 595.8 ms    10 runs

Benchmark 5: opmlparser
  Time (mean ± σ):     649.7 ms ±  17.3 ms    [User: 1085.5 ms, System: 48.6 ms]
  Range (min … max):   627.5 ms … 691.4 ms    10 runs

Benchmark 6: feedsmith *
  Time (mean ± σ):     305.3 ms ±   9.4 ms    [User: 424.4 ms, System: 46.5 ms]
  Range (min … max):   292.1 ms … 327.2 ms    10 runs

Summary
  feedsmith * ran
    1.75 ± 0.08 times faster than @gaphub/feed
    1.92 ± 0.07 times faster than node-opml-parser
    1.93 ± 0.06 times faster than opml
    2.13 ± 0.09 times faster than opmlparser
    2.24 ± 0.07 times faster than opml-to-json

⏳ Running: JSON feed parsing (32 files × 100KB–5MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):     182.6 ms ±   4.5 ms    [User: 193.2 ms, System: 46.7 ms]
  Range (min … max):   175.6 ms … 190.5 ms    15 runs
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

```
$ sh parsing.sh

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):     600.7 ms ±  10.0 ms    [User: 917.0 ms, System: 67.2 ms]
  Range (min … max):   590.5 ms … 619.6 ms    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):      1.217 s ±  0.022 s    [User: 1.165 s, System: 0.045 s]
  Range (min … max):    1.184 s …  1.261 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):      6.263 s ±  0.120 s    [User: 6.139 s, System: 0.074 s]
  Range (min … max):    6.090 s …  6.474 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     826.6 ms ±  16.4 ms    [User: 892.7 ms, System: 102.8 ms]
  Range (min … max):   808.0 ms … 852.2 ms    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):     466.0 ms ±   5.7 ms    [User: 426.8 ms, System: 34.1 ms]
  Range (min … max):   459.1 ms … 480.0 ms    10 runs

Summary
  simplepie (php) ran
    1.29 ± 0.03 times faster than feedsmith *
    1.77 ± 0.04 times faster than gofeed (go)
    2.61 ± 0.06 times faster than feedjira (ruby)
   13.44 ± 0.31 times faster than feedparser (python)

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):      6.194 s ±  0.066 s    [User: 7.897 s, System: 0.485 s]
  Range (min … max):    6.079 s …  6.270 s    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):     18.040 s ±  0.189 s    [User: 17.522 s, System: 0.489 s]
  Range (min … max):   17.814 s … 18.437 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):    128.995 s ±  2.106 s    [User: 127.294 s, System: 1.285 s]
  Range (min … max):  126.633 s … 132.472 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     13.511 s ±  0.080 s    [User: 14.238 s, System: 0.806 s]
  Range (min … max):   13.422 s … 13.703 s    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):      8.183 s ±  0.090 s    [User: 7.253 s, System: 0.836 s]
  Range (min … max):    8.021 s …  8.301 s    10 runs

Summary
  feedsmith * ran
    1.32 ± 0.02 times faster than simplepie (php)
    2.18 ± 0.03 times faster than gofeed (go)
    2.91 ± 0.04 times faster than feedjira (ruby)
   20.83 ± 0.41 times faster than feedparser (python)

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):      3.193 s ±  0.027 s    [User: 3.622 s, System: 0.169 s]
  Range (min … max):    3.167 s …  3.261 s    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):      8.015 s ±  0.114 s    [User: 7.786 s, System: 0.187 s]
  Range (min … max):    7.840 s …  8.296 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):     64.641 s ±  1.200 s    [User: 63.767 s, System: 0.525 s]
  Range (min … max):   63.044 s … 67.346 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):      5.237 s ±  0.053 s    [User: 5.306 s, System: 0.315 s]
  Range (min … max):    5.176 s …  5.340 s    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):      3.968 s ±  0.073 s    [User: 3.617 s, System: 0.306 s]
  Range (min … max):    3.876 s …  4.137 s    10 runs

Summary
  feedsmith * ran
    1.24 ± 0.03 times faster than simplepie (php)
    1.64 ± 0.02 times faster than gofeed (go)
    2.51 ± 0.04 times faster than feedjira (ruby)
   20.24 ± 0.41 times faster than feedparser (python)

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):      6.297 s ±  0.040 s    [User: 6.618 s, System: 0.335 s]
  Range (min … max):    6.254 s …  6.373 s    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):     13.846 s ±  0.076 s    [User: 13.332 s, System: 0.452 s]
  Range (min … max):   13.712 s … 13.949 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):     93.833 s ±  0.763 s    [User: 92.413 s, System: 0.987 s]
  Range (min … max):   92.812 s … 95.110 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     12.301 s ±  0.115 s    [User: 12.169 s, System: 0.658 s]
  Range (min … max):   12.192 s … 12.558 s    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):      7.045 s ±  0.114 s    [User: 6.102 s, System: 0.837 s]
  Range (min … max):    6.925 s …  7.280 s    10 runs

Summary
  feedsmith * ran
    1.12 ± 0.02 times faster than simplepie (php)
    1.95 ± 0.02 times faster than gofeed (go)
    2.20 ± 0.02 times faster than feedjira (ruby)
   14.90 ± 0.15 times faster than feedparser (python)

⏳ Running: RDF feed parsing (100 files × 100KB–5MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):     769.2 ms ±   9.5 ms    [User: 983.3 ms, System: 72.1 ms]
  Range (min … max):   755.9 ms … 784.8 ms    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):     757.9 ms ±   6.4 ms    [User: 714.5 ms, System: 39.6 ms]
  Range (min … max):   749.0 ms … 765.9 ms    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):      6.736 s ±  0.128 s    [User: 6.645 s, System: 0.062 s]
  Range (min … max):    6.564 s …  6.952 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     894.5 ms ±   6.0 ms    [User: 948.4 ms, System: 71.1 ms]
  Range (min … max):   884.5 ms … 902.0 ms    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):     383.4 ms ±   7.7 ms    [User: 340.7 ms, System: 36.6 ms]
  Range (min … max):   372.7 ms … 397.4 ms    10 runs

Summary
  simplepie (php) ran
    1.98 ± 0.04 times faster than feedjira (ruby)
    2.01 ± 0.05 times faster than feedsmith *
    2.33 ± 0.05 times faster than gofeed (go)
   17.57 ± 0.49 times faster than feedparser (python)
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
