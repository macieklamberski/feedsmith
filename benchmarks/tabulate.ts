import { readFileSync } from 'node:fs'

// Renders a hyperfine --export-json file as a console.table in milliseconds, sorted fastest
// first. Usage: bun tabulate.ts <json>.
const [, , jsonPath] = process.argv

const format = (seconds: number): string => {
  return (seconds * 1000).toFixed(1)
}

const main = () => {
  const { results } = JSON.parse(readFileSync(jsonPath, 'utf-8'))
  // hyperfine 2 nests the timings under summary.time_wall_clock and keeps the --command-name
  // label in name. hyperfine 1 puts both at the top level, the label in command.
  const timings = results.map((result) => ({
    ...(result.summary?.time_wall_clock ?? result),
    label: result.name ?? result.command,
  }))
  const sorted = timings.sort((a, b) => a.mean - b.mean)
  const fastest = sorted[0]?.mean ?? 1

  const rows = sorted.map((result, index) => ({
    Package: result.label,
    Performance: index === 0 ? 'baseline' : `${(result.mean / fastest).toFixed(2)}x slower`,
    // hyperfine omits the deviation for single-run commands.
    'Mean (ms)':
      result.stddev != null
        ? `${format(result.mean)} ± ${format(result.stddev)}`
        : format(result.mean),
    Min: format(result.min),
    Max: format(result.max),
  }))

  console.table(rows)
}

main()
