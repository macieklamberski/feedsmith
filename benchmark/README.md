# Feed Parsers Benchmark

Below are the speed benchmarks for popular JavaScript packages for parsing feeds.

The benchmarks use real-world feeds organized by feed type (RSS, Atom, JSON Feed, RDF) and file size ranges. Each category contains 10 representative feed files that span the specified size range, providing insight into how each package performs across various scenarios.

The results should be taken with a grain of salt, as direct comparisons aren't always fair. Packages vary in feature support (such as handling specific namespaces or feed formats).

Caveat regarding the `fast-xml-parser` results: Although `fast-xml-parser` is not strictly a feed parser, it is included in the benchmark to compare it with Feedsmith, which uses it internally. One key difference is that Feedsmith enhances performance by using the `entities` package to manage HTML entities, rather than relying on support built-in into `fast-xml-parser`, which appears to be slower. One other difference is `trimValues: false` in Feedsmith. All other settings remain the same.

## Results: Parsing

#### RSS feed parsing (5MB — 50MB)

| | Task | Average (s) | Min (s) | Max (s) | Total runs |
|-|------|------------|---------|---------|------------|
| 0 | feedsmith 👈                  | 755.211     | 664.028  | 820.137  | 20         |
| 1 | fast-xml-parser               | 865.120     | 806.579  | 928.190  | 18         |
| 2 | @rowanmanning/feed-parser     | 931.853     | 867.306  | 983.097  | 17         |
| 3 | @ulisesgascon/rss-feed-parser | 1186.041    | 1120.946 | 1269.645 | 13         |
| 4 | @extractus/feed-extractor     | 1828.458    | 1761.242 | 1894.493 | 9          |
| 5 | feedparser                    | 1864.981    | 1762.727 | 1945.281 | 9          |
| 6 | feedme.js                     | 2266.350    | 2234.914 | 2327.387 | 7          |
| 7 | rss-parser                    | 3091.859    | 2187.907 | 4587.056 | 5          |

#### RSS feed parsing (100KB — 5MB)

| | Task | Average (s) | Min (s) | Max (s) | Total runs |
|-|------|------------|---------|---------|------------|
| 0 | feedsmith 👈                  | 20.344      | 18.551  | 41.360  | 738        |
| 1 | fast-xml-parser               | 22.245      | 20.822  | 30.314  | 675        |
| 2 | @rowanmanning/feed-parser     | 28.810      | 27.162  | 38.005  | 521        |
| 3 | @ulisesgascon/rss-feed-parser | 38.421      | 33.627  | 50.146  | 391        |
| 4 | feedparser                    | 73.957      | 65.934  | 92.313  | 203        |
| 5 | @extractus/feed-extractor     | 76.518      | 71.324  | 92.092  | 197        |
| 6 | feedme.js                     | 82.185      | 73.683  | 94.891  | 183        |
| 7 | rss-parser                    | 82.412      | 78.261  | 104.037 | 183        |

#### Atom feed parsing (5MB — 50MB)

| | Task | Average (s) | Min (s) | Max (s) | Total runs |
|-|------|------------|---------|---------|------------|
| 0 | feedsmith 👈              | 554.220     | 538.189  | 613.308  | 28         |
| 1 | @rowanmanning/feed-parser | 1048.639    | 1006.666 | 1080.487 | 15         |
| 2 | fast-xml-parser           | 1260.333    | 1239.107 | 1284.932 | 12         |
| 3 | feedparser                | 1385.034    | 1347.026 | 1437.723 | 11         |
| 4 | @extractus/feed-extractor | 1780.728    | 1698.775 | 1861.066 | 9          |
| 5 | feedme.js                 | 1985.308    | 1933.855 | 2030.493 | 8          |
| 6 | rss-parser                | 2701.467    | 2663.419 | 2730.274 | 6          |

#### Atom feed parsing (100KB — 5MB)

| | Task | Average (s) | Min (s) | Max (s) | Total runs |
|-|------|------------|---------|---------|------------|
| 0 | feedsmith 👈              | 149.717     | 147.596  | 162.286  | 101        |
| 1 | @rowanmanning/feed-parser | 308.908     | 293.741  | 325.842  | 49         |
| 2 | fast-xml-parser           | 373.410     | 351.761  | 394.923  | 41         |
| 3 | feedparser                | 425.938     | 394.182  | 461.624  | 36         |
| 4 | @extractus/feed-extractor | 543.792     | 526.565  | 583.102  | 28         |
| 5 | feedme.js                 | 611.207     | 589.845  | 647.576  | 25         |
| 6 | rss-parser                | 1100.820    | 1081.251 | 1117.604 | 14         |

#### RDF feed parsing (100KB — 5MB)

| | Task | Average (s) | Min (s) | Max (s) | Total runs |
|-|------|------------|---------|---------|------------|
| 0 | fast-xml-parser           | 13.676      | 12.737  | 18.187  | 1097       |
| 1 | @rowanmanning/feed-parser | 14.324      | 13.602  | 19.544  | 1048       |
| 2 | feedsmith 👈              | 14.668      | 13.128  | 21.751  | 1023       |
| 3 | @extractus/feed-extractor | 41.669      | 39.297  | 48.281  | 360        |
| 4 | feedparser                | 80.165      | 71.945  | 116.352 | 188        |
| 5 | feedme.js                 | 106.037     | 100.018 | 115.874 | 142        |
| 6 | rss-parser                | 161.088     | 154.614 | 178.301 | 94         |

#### JSON feed parsing (100KB — 5MB)

| | Task | Average (s) | Min (s) | Max (s) | Total runs |
|-|------|------------|---------|---------|------------|
| 0 | feedsmith 👈 | 12.062      | 11.449  | 14.442  | 1244       |

**Note:** It was hard to find libraries for handling JSON Feed, so at this moment only Feedsmith is listed.
