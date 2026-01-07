import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Benchmark from 'benchmark'
import { Bench } from 'tinybench'

export const loadFeedFiles = (dir: string, limit?: number): Record<string, string> => {
  const benchmarksDir = dirname(fileURLToPath(import.meta.url))
  const absoluteDir = join(benchmarksDir, dir)

  const files = readdirSync(absoluteDir)
  const result: Record<string, string> = {}

  const validFiles = files.filter((file) => !file.startsWith('.') && file !== 'Thumbs.db')
  const limitedFiles = limit ? validFiles.slice(0, limit) : validFiles

  for (const file of limitedFiles) {
    const filePath = join(absoluteDir, file)
    result[file] = readFileSync(filePath, 'utf-8')
  }

  return result
}

export const runTest = async <T, F = unknown>(
  feeds: Record<string, F>,
  test: (feed: F) => T | Promise<T>,
) => {
  for (const name in feeds) {
    try {
      await test(feeds[name])
    } catch (error) {
      console.error(`Error in ${name}:`, error)
    }
  }
}

export const runBenchmarks = async (name: string, tests: Record<string, () => Promise<void>>) => {
  console.log('')
  console.log(`⏳ Running: ${name}`)
  console.log('📊 Tinybench results:')
  await runTinybench(name, tests)
  console.log('📊 Benchmark.js results:')
  await runBenchmarkJs(name, tests)
}

export const runTinybench = async (name: string, tests: Record<string, () => Promise<void>>) => {
  const randomlySortedTests = Object.entries(tests).sort(() => Math.random() - 0.5)

  const bench = new Bench({
    name,
    iterations: 1,
    time: 15000,
  })

  for (const [testName, test] of randomlySortedTests) {
    bench.add(testName, test)
  }

  await bench.run()

  const results = bench.tasks
    .map(({ name, result }) => ({
      Package: name,
      'Ops/sec': result?.latency?.mean ? (1000 / result.latency.mean).toFixed(2) : 'n/a',
      'Average (ms)': result?.latency?.mean ? result.latency.mean.toFixed(3) : 'n/a',
      'Min (ms)': result?.latency?.min ? result.latency.min.toFixed(3) : 'n/a',
      'Max (ms)': result?.latency?.max ? result.latency.max.toFixed(3) : 'n/a',
      Runs: result?.latency?.samplesCount ?? 0,
      _rawMean: result?.latency?.mean || Number.MAX_VALUE,
    }))
    .sort((a, b) => a._rawMean - b._rawMean)

  const fastestTime = results[0]?._rawMean || 1

  const resultsWithPerformance = results.map(({ _rawMean, ...rest }, index) => ({
    ...rest,
    Performance: index === 0 ? 'baseline' : `${(_rawMean / fastestTime).toFixed(1)}x slower`,
  }))

  console.table(resultsWithPerformance)
}

export const runBenchmarkJs = async (name: string, tests: Record<string, () => Promise<void>>) => {
  const randomlySortedTests = Object.entries(tests).sort(() => Math.random() - 0.5)

  return new Promise<void>((resolve) => {
    const suite = new Benchmark.Suite(name)

    for (const [testName, testFn] of randomlySortedTests) {
      suite.add(testName, {
        defer: true,
        fn: (deferred: { resolve: () => void }) => {
          testFn().then(() => deferred.resolve())
        },
      })
    }

    suite.on('complete', function () {
      const results = Array.from(this)
        // biome-ignore lint/suspicious/noExplicitAny: Benchmark.js types limitation.
        .map((benchmark: any) => ({
          Package: benchmark.name,
          'Ops/sec': benchmark.hz.toFixed(2),
          'Average (ms)': (1000 / benchmark.hz).toFixed(3),
          'Min (ms)': (Math.min(...benchmark.stats.sample) * 1000).toFixed(3),
          'Max (ms)': (Math.max(...benchmark.stats.sample) * 1000).toFixed(3),
          Runs: benchmark.stats.sample.length,
          _rawHz: benchmark.hz || Number.MAX_VALUE,
        }))
        .sort((a, b) => b._rawHz - a._rawHz) // Sort by ops/sec descending (fastest first)

      const fastestHz = results[0]?._rawHz || 1

      const resultsWithPerformance = results.map(({ _rawHz, ...rest }, index) => ({
        ...rest,
        Performance: index === 0 ? 'baseline' : `${(fastestHz / _rawHz).toFixed(1)}x slower`,
      }))

      console.table(resultsWithPerformance)
      resolve()
    })

    suite.run({ async: true })
  })
}
