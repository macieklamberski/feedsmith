# Benchmarks

There are two distinct benchmark modes:

1. **[JavaScript Benchmarks](#javascript-benchmarks)** - Compare Feedsmith against other JavaScript feed parsing libraries
2. **[Cross-Language Benchmarks](#cross-language-benchmarks)** - Compare Feedsmith against prominent libraries in other languages

One important thing to note is that packages vary in feature support (such as handling specific namespaces or feed formats). The results should be taken with a grain of salt, as direct comparisons aren't always fair.

## JavaScript Benchmarks

Speed benchmarks comparing Feedsmith against popular JavaScript packages for parsing feeds. Feedsmith's results are marked with an asterisk (`*`).

The benchmarks use real-world feeds organized by feed format (RSS, Atom, RDF, JSON Feed, OPML) and file size ranges. Each range is tested on representative feed files, providing insight into how each package performs across various scenarios.

Tests performed in both [Tinybench](https://github.com/tinylibs/tinybench) and [Benchmark.js](https://github.com/bestiejs/benchmark.js) with random test order on every run.

### Results

```
$ bun parsing.ts

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
📊 Tinybench results:
┌───┬───────────────────────────────┬─────────┬──────────────┬───────────┬───────────┬──────┬──────────────┐
│   │ Package                       │ Ops/sec │ Average (ms) │ Min (ms)  │ Max (ms)  │ Runs │ Performance  │
├───┼───────────────────────────────┼─────────┼──────────────┼───────────┼───────────┼──────┼──────────────┤
│ 0 │ feedsmith *                   │ 1.42    │ 703.572      │ 632.485   │ 821.757   │ 22   │ baseline     │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1.01    │ 991.648      │ 924.213   │ 1091.525  │ 16   │ 1.4x slower  │
│ 2 │ @gaphub/feed                  │ 0.84    │ 1188.825     │ 1080.971  │ 1532.299  │ 13   │ 1.7x slower  │
│ 3 │ podcast-feed-parser           │ 0.79    │ 1264.037     │ 1196.235  │ 1383.260  │ 12   │ 1.8x slower  │
│ 4 │ feedparser                    │ 0.50    │ 2006.317     │ 1589.785  │ 2559.104  │ 8    │ 2.9x slower  │
│ 5 │ @extractus/feed-extractor     │ 0.49    │ 2053.763     │ 1744.730  │ 2444.751  │ 8    │ 2.9x slower  │
│ 6 │ feedme.js                     │ 0.47    │ 2145.687     │ 1986.029  │ 2403.754  │ 8    │ 3.0x slower  │
│ 7 │ rss-parser                    │ 0.46    │ 2179.177     │ 2074.249  │ 2354.436  │ 7    │ 3.1x slower  │
│ 8 │ @rowanmanning/feed-parser     │ 0.09    │ 10972.094    │ 10406.076 │ 11538.112 │ 2    │ 15.6x slower │
└───┴───────────────────────────────┴─────────┴──────────────┴───────────┴───────────┴──────┴──────────────┘
📊 Benchmark.js results:
┌───┬───────────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬──────────────┐
│   │ Package                       │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance  │
├───┼───────────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼──────────────┤
│ 0 │ feedsmith *                   │ 1.62    │ 616.070      │ 595.201  │ 701.781  │ 13   │ baseline     │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1.15    │ 872.926      │ 858.991  │ 918.282  │ 10   │ 1.4x slower  │
│ 2 │ @gaphub/feed                  │ 0.95    │ 1055.599     │ 1013.420 │ 1124.589 │ 9    │ 1.7x slower  │
│ 3 │ podcast-feed-parser           │ 0.87    │ 1147.616     │ 1114.169 │ 1186.725 │ 9    │ 1.9x slower  │
│ 4 │ @extractus/feed-extractor     │ 0.64    │ 1567.540     │ 1528.658 │ 1635.732 │ 8    │ 2.5x slower  │
│ 5 │ feedparser                    │ 0.62    │ 1603.387     │ 1560.609 │ 1728.343 │ 8    │ 2.6x slower  │
│ 6 │ feedme.js                     │ 0.57    │ 1767.724     │ 1735.740 │ 1857.794 │ 7    │ 2.9x slower  │
│ 7 │ rss-parser                    │ 0.51    │ 1964.313     │ 1920.083 │ 2030.721 │ 7    │ 3.2x slower  │
│ 8 │ @rowanmanning/feed-parser     │ 0.14    │ 7344.839     │ 7100.935 │ 7612.991 │ 5    │ 11.9x slower │
└───┴───────────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴──────────────┘

⏳ Running: RSS feed parsing (100 files × 100KB–5MB)
📊 Tinybench results:
┌───┬───────────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package                       │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼───────────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ feedsmith *                   │ 2.15    │ 464.233      │ 431.238  │ 560.196  │ 33   │ baseline    │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1.61    │ 619.751      │ 583.357  │ 702.199  │ 25   │ 1.3x slower │
│ 2 │ @gaphub/feed                  │ 1.51    │ 663.333      │ 615.706  │ 753.343  │ 23   │ 1.4x slower │
│ 3 │ podcast-feed-parser           │ 1.40    │ 713.043      │ 663.199  │ 822.646  │ 22   │ 1.5x slower │
│ 4 │ feedparser                    │ 0.99    │ 1013.059     │ 943.120  │ 1140.454 │ 15   │ 2.2x slower │
│ 5 │ @extractus/feed-extractor     │ 0.86    │ 1167.174     │ 1105.055 │ 1266.003 │ 13   │ 2.5x slower │
│ 6 │ feedme.js                     │ 0.74    │ 1347.627     │ 1192.642 │ 1633.812 │ 12   │ 2.9x slower │
│ 7 │ rss-parser                    │ 0.64    │ 1551.783     │ 1495.036 │ 1739.777 │ 10   │ 3.3x slower │
│ 8 │ @rowanmanning/feed-parser     │ 0.46    │ 2186.174     │ 2029.103 │ 2689.577 │ 7    │ 4.7x slower │
└───┴───────────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘
📊 Benchmark.js results:
┌───┬───────────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package                       │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼───────────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ feedsmith *                   │ 2.47    │ 404.751      │ 382.886  │ 482.109  │ 16   │ baseline    │
│ 1 │ @ulisesgascon/rss-feed-parser │ 1.71    │ 585.342      │ 577.511  │ 604.148  │ 13   │ 1.4x slower │
│ 2 │ @gaphub/feed                  │ 1.59    │ 627.924      │ 612.923  │ 661.756  │ 12   │ 1.6x slower │
│ 3 │ podcast-feed-parser           │ 1.51    │ 663.684      │ 656.628  │ 688.010  │ 12   │ 1.6x slower │
│ 4 │ feedparser                    │ 1.04    │ 960.095      │ 936.606  │ 1006.543 │ 10   │ 2.4x slower │
│ 5 │ feedme.js                     │ 0.89    │ 1125.727     │ 1106.288 │ 1159.720 │ 9    │ 2.8x slower │
│ 6 │ @extractus/feed-extractor     │ 0.85    │ 1171.536     │ 1117.491 │ 1414.566 │ 9    │ 2.9x slower │
│ 7 │ rss-parser                    │ 0.74    │ 1356.445     │ 1333.463 │ 1426.248 │ 8    │ 3.4x slower │
│ 8 │ @rowanmanning/feed-parser     │ 0.48    │ 2080.103     │ 2030.389 │ 2118.581 │ 7    │ 5.1x slower │
└───┴───────────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
📊 Tinybench results:
┌───┬───────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼───────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ feedsmith *               │ 1.77    │ 563.643      │ 544.287  │ 655.303  │ 27   │ baseline    │
│ 1 │ @rowanmanning/feed-parser │ 0.87    │ 1148.364     │ 1086.647 │ 1314.258 │ 14   │ 2.0x slower │
│ 2 │ @gaphub/feed              │ 0.78    │ 1285.044     │ 1211.747 │ 1375.215 │ 12   │ 2.3x slower │
│ 3 │ feedparser                │ 0.72    │ 1397.576     │ 1348.299 │ 1487.160 │ 11   │ 2.5x slower │
│ 4 │ @extractus/feed-extractor │ 0.56    │ 1775.547     │ 1745.622 │ 1824.283 │ 9    │ 3.2x slower │
│ 5 │ feedme.js                 │ 0.45    │ 2209.749     │ 2153.443 │ 2288.475 │ 7    │ 3.9x slower │
│ 6 │ rss-parser                │ 0.44    │ 2298.269     │ 2243.954 │ 2371.749 │ 7    │ 4.1x slower │
└───┴───────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘
📊 Benchmark.js results:
┌───┬───────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼───────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ feedsmith *               │ 1.82    │ 550.366      │ 539.697  │ 573.001  │ 13   │ baseline    │
│ 1 │ @gaphub/feed              │ 0.81    │ 1240.310     │ 1232.764 │ 1257.227 │ 8    │ 2.3x slower │
│ 2 │ @rowanmanning/feed-parser │ 0.75    │ 1338.981     │ 1308.848 │ 1409.143 │ 8    │ 2.4x slower │
│ 3 │ feedparser                │ 0.64    │ 1566.833     │ 1490.907 │ 1684.052 │ 7    │ 2.8x slower │
│ 4 │ @extractus/feed-extractor │ 0.51    │ 1979.892     │ 1882.792 │ 2101.049 │ 7    │ 3.6x slower │
│ 5 │ feedme.js                 │ 0.42    │ 2353.942     │ 2202.120 │ 2478.446 │ 7    │ 4.3x slower │
│ 6 │ rss-parser                │ 0.38    │ 2605.795     │ 2555.963 │ 2634.797 │ 6    │ 4.7x slower │
└───┴───────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
📊 Tinybench results:
┌───┬───────────────────────────┬─────────┬──────────────┬───────────┬───────────┬──────┬─────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms)  │ Max (ms)  │ Runs │ Performance │
├───┼───────────────────────────┼─────────┼──────────────┼───────────┼───────────┼──────┼─────────────┤
│ 0 │ feedsmith *               │ 0.45    │ 2218.248     │ 2195.860  │ 2258.982  │ 7    │ baseline    │
│ 1 │ @rowanmanning/feed-parser │ 0.18    │ 5553.175     │ 5249.846  │ 5861.476  │ 3    │ 2.5x slower │
│ 2 │ feedparser                │ 0.17    │ 6057.445     │ 5563.861  │ 6781.359  │ 3    │ 2.7x slower │
│ 3 │ @extractus/feed-extractor │ 0.15    │ 6685.829     │ 6494.192  │ 6984.887  │ 3    │ 3.0x slower │
│ 4 │ @gaphub/feed              │ 0.13    │ 7717.126     │ 6402.034  │ 9032.219  │ 2    │ 3.5x slower │
│ 5 │ feedme.js                 │ 0.12    │ 8053.625     │ 7935.369  │ 8171.881  │ 2    │ 3.6x slower │
│ 6 │ rss-parser                │ 0.08    │ 12999.252    │ 12819.434 │ 13179.070 │ 2    │ 5.9x slower │
└───┴───────────────────────────┴─────────┴──────────────┴───────────┴───────────┴──────┴─────────────┘
📊 Benchmark.js results:
┌───┬───────────────────────────┬─────────┬──────────────┬───────────┬───────────┬──────┬─────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms)  │ Max (ms)  │ Runs │ Performance │
├───┼───────────────────────────┼─────────┼──────────────┼───────────┼───────────┼──────┼─────────────┤
│ 0 │ feedsmith *               │ 0.43    │ 2333.896     │ 2198.065  │ 2503.009  │ 7    │ baseline    │
│ 1 │ @gaphub/feed              │ 0.22    │ 4649.076     │ 4511.172  │ 4993.714  │ 6    │ 2.0x slower │
│ 2 │ @rowanmanning/feed-parser │ 0.18    │ 5428.641     │ 5272.657  │ 5759.037  │ 5    │ 2.3x slower │
│ 3 │ feedparser                │ 0.18    │ 5435.761     │ 5269.356  │ 5635.290  │ 5    │ 2.3x slower │
│ 4 │ @extractus/feed-extractor │ 0.15    │ 6700.383     │ 6587.930  │ 6789.882  │ 5    │ 2.9x slower │
│ 5 │ feedme.js                 │ 0.14    │ 7049.677     │ 7020.649  │ 7132.463  │ 5    │ 3.0x slower │
│ 6 │ rss-parser                │ 0.10    │ 10410.135    │ 10335.102 │ 10443.847 │ 5    │ 4.5x slower │
└───┴───────────────────────────┴─────────┴──────────────┴───────────┴───────────┴──────┴─────────────┘

⏳ Running: RDF feed parsing (100 files × 100KB–5MB)
📊 Tinybench results:
┌───┬───────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬──────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance  │
├───┼───────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 5.93    │ 168.678      │ 153.476  │ 191.892  │ 89   │ baseline     │
│ 1 │ @rowanmanning/feed-parser │ 3.00    │ 333.512      │ 312.475  │ 387.156  │ 45   │ 2.0x slower  │
│ 2 │ @extractus/feed-extractor │ 1.80    │ 556.240      │ 504.258  │ 621.485  │ 27   │ 3.3x slower  │
│ 3 │ @gaphub/feed              │ 1.23    │ 815.776      │ 729.150  │ 1129.571 │ 19   │ 4.8x slower  │
│ 4 │ feedparser                │ 0.92    │ 1087.980     │ 1023.638 │ 1128.518 │ 14   │ 6.5x slower  │
│ 5 │ feedme.js                 │ 0.64    │ 1567.422     │ 1506.713 │ 1626.450 │ 10   │ 9.3x slower  │
│ 6 │ rss-parser                │ 0.42    │ 2368.398     │ 2288.041 │ 2438.408 │ 7    │ 14.0x slower │
└───┴───────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴──────────────┘
📊 Benchmark.js results:
┌───┬───────────────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬──────────────┐
│   │ Package                   │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance  │
├───┼───────────────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼──────────────┤
│ 0 │ feedsmith *               │ 6.68    │ 149.792      │ 148.036  │ 158.482  │ 35   │ baseline     │
│ 1 │ @rowanmanning/feed-parser │ 3.26    │ 307.143      │ 290.211  │ 338.977  │ 20   │ 2.1x slower  │
│ 2 │ @extractus/feed-extractor │ 1.99    │ 501.706      │ 488.105  │ 550.721  │ 14   │ 3.3x slower  │
│ 3 │ @gaphub/feed              │ 1.33    │ 749.906      │ 735.307  │ 832.016  │ 11   │ 5.0x slower  │
│ 4 │ feedparser                │ 0.95    │ 1049.346     │ 1011.123 │ 1205.642 │ 9    │ 7.0x slower  │
│ 5 │ feedme.js                 │ 0.64    │ 1564.067     │ 1472.422 │ 1669.391 │ 8    │ 10.4x slower │
│ 6 │ rss-parser                │ 0.43    │ 2319.371     │ 2270.883 │ 2483.491 │ 7    │ 15.5x slower │
└───┴───────────────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴──────────────┘

⏳ Running: JSON feed parsing (50 files × 100KB–5MB)
📊 Tinybench results:
┌───┬─────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package     │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼─────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ feedsmith * │ 98.40   │ 10.162       │ 9.477    │ 17.557   │ 1477 │ baseline    │
└───┴─────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘
📊 Benchmark.js results:
┌───┬─────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package     │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼─────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ feedsmith * │ 101.92  │ 9.812        │ 9.709    │ 10.044   │ 81   │ baseline    │
└───┴─────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘

⏳ Running: OPML parsing (50 files × 100KB–500KB)
📊 Tinybench results:
┌───┬──────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package          │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼──────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ opml             │ 23.27   │ 42.965       │ 40.329   │ 57.082   │ 350  │ baseline    │
│ 1 │ feedsmith *      │ 22.18   │ 45.089       │ 43.013   │ 59.750   │ 333  │ 1.0x slower │
│ 2 │ @gaphub/feed     │ 19.65   │ 50.901       │ 49.093   │ 61.334   │ 295  │ 1.2x slower │
│ 3 │ node-opml-parser │ 18.70   │ 53.488       │ 51.251   │ 61.774   │ 281  │ 1.2x slower │
│ 4 │ opmlparser       │ 15.72   │ 63.631       │ 60.584   │ 76.780   │ 236  │ 1.5x slower │
│ 5 │ opml-to-json     │ 14.36   │ 69.630       │ 64.425   │ 85.467   │ 216  │ 1.6x slower │
└───┴──────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘
📊 Benchmark.js results:
┌───┬──────────────────┬─────────┬──────────────┬──────────┬──────────┬──────┬─────────────┐
│   │ Package          │ Ops/sec │ Average (ms) │ Min (ms) │ Max (ms) │ Runs │ Performance │
├───┼──────────────────┼─────────┼──────────────┼──────────┼──────────┼──────┼─────────────┤
│ 0 │ opml             │ 23.68   │ 42.231       │ 40.455   │ 46.917   │ 59   │ baseline    │
│ 1 │ feedsmith *      │ 20.92   │ 47.796       │ 46.429   │ 55.098   │ 51   │ 1.1x slower │
│ 2 │ @gaphub/feed     │ 18.64   │ 53.639       │ 51.185   │ 68.143   │ 87   │ 1.3x slower │
│ 3 │ node-opml-parser │ 18.46   │ 54.157       │ 51.988   │ 64.146   │ 87   │ 1.3x slower │
│ 4 │ opmlparser       │ 15.69   │ 63.735       │ 61.594   │ 71.312   │ 75   │ 1.5x slower │
│ 5 │ opml-to-json     │ 14.52   │ 68.869       │ 64.658   │ 79.932   │ 70   │ 1.6x slower │
└───┴──────────────────┴─────────┴──────────────┴──────────┴──────────┴──────┴─────────────┘
```

> [!NOTE]
> It was hard to find libraries for handling JSON Feed, so at this moment only Feedsmith is listed.

### Methodology

The parsing benchmarks measure feed parsing libraries under realistic conditions where developers need access to fully parsed data. Some libraries use lazy evaluation (deferring computation until properties are accessed) while others parse everything upfront. To ensure fair comparison, we measure the total time required to produce equivalent, fully-accessible results.

For lazy parsers like `@rowanmanning/feed-parser`, we call methods such as .toJSON() to force complete evaluation. Without this step, we'd only be measuring the initial setup cost while ignoring the deferred work that still needs to happen when data is accessed.

This approach reflects typical usage patterns where developers parse feeds to immediately access properties like titles, descriptions, and item lists. Measuring only the initial parsing step for lazy libraries would create misleading comparisons since the computational cost simply shifts to when the data is actually used.

By standardizing on fully-evaluated results, these benchmarks provide realistic performance expectations for applications that need complete feed data processing.

### Setup

```bash
# 1. Install dependencies
bun install
# 2. Run benchmarks
bun parsing.ts
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
  Time (mean ± σ):     510.7 ms ±   1.6 ms    [User: 911.6 ms, System: 51.5 ms]
  Range (min … max):   508.6 ms … 513.2 ms    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):      1.376 s ±  0.042 s    [User: 1.328 s, System: 0.043 s]
  Range (min … max):    1.305 s …  1.432 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):      9.349 s ±  0.182 s    [User: 9.198 s, System: 0.126 s]
  Range (min … max):    9.136 s …  9.706 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     843.3 ms ±   2.2 ms    [User: 967.0 ms, System: 95.3 ms]
  Range (min … max):   839.4 ms … 846.6 ms    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):     526.4 ms ±   3.2 ms    [User: 494.5 ms, System: 24.7 ms]
  Range (min … max):   523.4 ms … 532.0 ms    10 runs

Summary
  feedsmith * ran
    1.03 ± 0.01 times faster than simplepie (php)
    1.65 ± 0.01 times faster than gofeed (go)
    2.70 ± 0.08 times faster than feedjira (ruby)
   18.31 ± 0.36 times faster than feedparser (python)

⏳ Running: RSS feed parsing (10 files × 5MB–50MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):      8.082 s ±  0.112 s    [User: 9.550 s, System: 0.512 s]
  Range (min … max):    7.905 s …  8.254 s    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):     19.694 s ±  0.059 s    [User: 19.250 s, System: 0.437 s]
  Range (min … max):   19.593 s … 19.791 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):     193.267 s ±  3.239 s    [User: 191.138 s, System: 1.731 s]
  Range (min … max):   190.205 s … 199.428 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     14.610 s ±  0.138 s    [User: 15.619 s, System: 0.869 s]
  Range (min … max):   14.412 s … 14.776 s    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):      9.739 s ±  0.195 s    [User: 8.610 s, System: 0.967 s]
  Range (min … max):    9.521 s … 10.103 s    10 runs

Summary
  feedsmith * ran
    1.21 ± 0.03 times faster than simplepie (php)
    1.81 ± 0.03 times faster than gofeed (go)
    2.44 ± 0.03 times faster than feedjira (ruby)
   23.91 ± 0.52 times faster than feedparser (python)

⏳ Running: Atom feed parsing (100 files × 100KB–5MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):      3.535 s ±  0.065 s    [User: 3.733 s, System: 0.204 s]
  Range (min … max):    3.400 s …  3.610 s    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):      9.249 s ±  0.137 s    [User: 9.026 s, System: 0.180 s]
  Range (min … max):    9.033 s …  9.433 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):     96.323 s ±  1.198 s    [User: 95.680 s, System: 0.565 s]
  Range (min … max):   95.152 s … 98.890 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):      5.550 s ±  0.016 s    [User: 5.661 s, System: 0.307 s]
  Range (min … max):    5.527 s …  5.571 s    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):      4.251 s ±  0.027 s    [User: 3.865 s, System: 0.337 s]
  Range (min … max):    4.216 s …  4.302 s    10 runs

Summary
  feedsmith * ran
    1.20 ± 0.02 times faster than simplepie (php)
    1.57 ± 0.03 times faster than gofeed (go)
    2.62 ± 0.06 times faster than feedjira (ruby)
   27.25 ± 0.60 times faster than feedparser (python)

⏳ Running: Atom feed parsing (10 files × 5MB–50MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):     28.825 s ±  0.255 s    [User: 28.784 s, System: 0.479 s]
  Range (min … max):   28.418 s … 29.238 s    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):     17.361 s ±  0.169 s    [User: 16.837 s, System: 0.457 s]
  Range (min … max):   17.081 s … 17.551 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):     148.009 s ±  1.366 s    [User: 145.473 s, System: 1.858 s]
  Range (min … max):   146.306 s … 149.844 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     13.259 s ±  0.170 s    [User: 13.081 s, System: 0.744 s]
  Range (min … max):   12.940 s … 13.495 s    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):      7.420 s ±  0.106 s    [User: 6.419 s, System: 0.869 s]
  Range (min … max):    7.254 s …  7.578 s    10 runs

Summary
  simplepie (php) ran
    1.79 ± 0.03 times faster than gofeed (go)
    2.34 ± 0.04 times faster than feedjira (ruby)
    3.88 ± 0.07 times faster than feedsmith *
   19.95 ± 0.34 times faster than feedparser (python)

⏳ Running: RDF feed parsing (100 files × 100KB–5MB)
Benchmark 1: feedsmith *
  Time (mean ± σ):     603.4 ms ±   2.8 ms    [User: 760.1 ms, System: 46.3 ms]
  Range (min … max):   598.4 ms … 607.1 ms    10 runs

Benchmark 2: feedjira (ruby)
  Time (mean ± σ):      1.006 s ±  0.005 s    [User: 0.961 s, System: 0.043 s]
  Range (min … max):    0.998 s …  1.014 s    10 runs

Benchmark 3: feedparser (python)
  Time (mean ± σ):      9.919 s ±  0.036 s    [User: 9.853 s, System: 0.059 s]
  Range (min … max):    9.880 s …  9.988 s    10 runs

Benchmark 4: gofeed (go)
  Time (mean ± σ):     940.3 ms ±   2.5 ms    [User: 993.1 ms, System: 67.8 ms]
  Range (min … max):   938.5 ms … 946.8 ms    10 runs

Benchmark 5: simplepie (php)
  Time (mean ± σ):     413.6 ms ±   6.4 ms    [User: 373.8 ms, System: 30.7 ms]
  Range (min … max):   407.1 ms … 425.0 ms    10 runs

Summary
  simplepie (php) ran
    1.46 ± 0.02 times faster than feedsmith *
    2.27 ± 0.04 times faster than gofeed (go)
    2.43 ± 0.04 times faster than feedjira (ruby)
   23.98 ± 0.38 times faster than feedparser (python)
```

### Setup

```bash
# 1. Install system packages
brew install hyperfine bun ruby python go php composer

# 2. Install language-specific packages
bundle install
pip3 install -r requirements.txt
composer install
go mod tidy

# 3. Build Go binary
go build -o parsing-gofeed parsing-gofeed.go

# 4. Run benchmarks
sh parsing.sh
```
