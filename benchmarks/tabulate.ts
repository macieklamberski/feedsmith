import { readFileSync } from 'node:fs'

// Renders a hyperfine --export-json file as a console.table in milliseconds, sorted fastest
// first. Usage: bun tabulate.ts <json>.
const [, , jsonPath] = process.argv

const format = (seconds: number): string => {
  return (seconds * 1000).toFixed(1)
}

const main = () => {
  const { results } = JSON.parse(readFileSync(jsonPath, 'utf-8'))
  const sorted = [...results].sort((a, b) => a.mean - b.mean)
  const fastest = sorted[0]?.mean ?? 1

  const rows = sorted.map((result, index) => ({
    Package: result.command,
    // hyperfine omits the deviation for single-run commands.
    'Mean (ms)':
      result.stddev != null
        ? `${format(result.mean)} ± ${format(result.stddev)}`
        : format(result.mean),
    Min: format(result.min),
    Max: format(result.max),
    Runs: result.times.length,
    Performance: index === 0 ? 'baseline' : `${(result.mean / fastest).toFixed(2)}x slower`,
  }))

  console.table(rows)
}

main()
