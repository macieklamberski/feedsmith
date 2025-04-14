import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { run } from 'node:test'
import Benchmark from 'benchmark'
import { Bench, nToMs } from 'tinybench'

export const loadFeedFiles = (dir: string, limit?: number): Record<string, string> => {
  const files = readdirSync(dir)
  const result: Record<string, string> = {}

  const validFiles = files.filter((file) => !file.startsWith('.') && file !== 'Thumbs.db')
  const limitedFiles = limit ? validFiles.slice(0, limit) : validFiles

  for (const file of limitedFiles) {
    const filePath = join(dir, file)
    result[file] = readFileSync(filePath, 'utf-8')
  }

  return result
}

export const runTest = async <T, F = unknown>(
  feeds: Record<string, F>,
  test: (feed: F) => T | Promise<T>,
) => {
  for (const [name, feed] of Object.entries(feeds)) {
    try {
      await test(feed)
    } catch (error) {
      console.error(`Error in ${name}:`, error)
    }
  }
}

export const runBenchmarks = async (
  name: string,
  tests: Record<string, () => Promise<unknown> | unknown>,
) => {
  await runTinybench(name, tests)
  await runBenchmarkJs(name, tests)
}

export const runTinybench = async (
  name: string,
  tests: Record<string, () => Promise<unknown> | unknown>,
) => {
  const bench = new Bench({
    name,
    iterations: 1,
    time: 15000,
    now: () => nToMs(Bun.nanoseconds()),
    setup: (_task, mode) => {
      if (mode === 'warmup') {
        Bun.gc(true)
      }
    },
  })

  const randomlySortedTests = Object.entries(tests).sort(() => Math.random() - 0.5)

  for (const [name, test] of randomlySortedTests) {
    bench.add(name, test)
  }

  console.log(`⏳ Running in Tinybench: ${name}`)
  await bench.run()

  console.log(`📊 Results for: ${name}`)
  const results = bench.tasks
    .map(({ name, result }) => ({
      Task: name,
      'Average (s)': result?.latency?.mean ? result.latency.mean.toFixed(3) : 'n/a',
      'Min (s)': result?.latency?.min ? result.latency.min.toFixed(3) : 'n/a',
      'Max (s)': result?.latency?.max ? result.latency.max.toFixed(3) : 'n/a',
      'Total runs': result?.latency?.samples.length || 0,
      _rawMean: result?.latency?.mean || Number.MAX_VALUE,
    }))
    .sort((a, b) => a._rawMean - b._rawMean)
    .map(({ _rawMean, ...rest }) => rest)

  console.table(results)
}

export const runBenchmarkJs = async (
  name: string,
  tests: Record<string, () => Promise<unknown> | unknown>,
) => {
  const suite = new Benchmark.Suite(name)
  const randomlySortedTests = Object.entries(tests).sort(() => Math.random() - 0.5)

  for (const [testName, testFn] of randomlySortedTests) {
    suite.add(testName, {
      defer: true,
      fn: (deferred: { resolve: () => void }) => {
        // @ts-ignore
        testFn().then(() => deferred.resolve())
      },
    })
  }

  console.log(`⏳ Running in benchmark.js: ${name}`)

  return new Promise<void>((resolve) => {
    suite.on('cycle', ({ target }) => {
      console.log(`🧪 ${target}`)
    })
    suite.on('complete', function () {
      console.log(`📊 Fastest is ${this.filter('fastest').map('name')}`)
      resolve()
    })

    suite.run({ async: true })
  })
}
