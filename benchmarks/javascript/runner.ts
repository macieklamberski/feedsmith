import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { adapterFactories, type Format } from './adapters'

// Parses every fixture of a single format with a single library, reading one file into
// memory at a time. Invoked as a fresh subprocess by hyperfine so each measured run
// starts with a clean JIT and garbage collector state.
const main = async () => {
  const [, , library, directory, format, limit] = process.argv

  const adapterFactory = adapterFactories[library]

  if (!adapterFactory) {
    console.error(`Unknown library: ${library}`)
    process.exit(1)
  }

  // The file extension matches the format name (rss, atom, rdf, json, opml). Sort for a
  // deterministic file set, then optionally cap the count: big-feed directories hold many
  // files, and capping keeps the benchmark duration sane while staying reproducible.
  const files = readdirSync(directory)
    .filter((file) => file.endsWith(`.${format}`))
    .sort()
    .slice(0, limit ? Number(limit) : undefined)

  if (files.length === 0) {
    console.error(`No .${format} files found in ${directory}`)
    process.exit(1)
  }

  // Dynamically imports only this library. Its load cost is part of the measured wall
  // clock, just like the runtime startup of each language in the cross-language benchmark.
  const adapter = await adapterFactory()

  for (const file of files) {
    const content = readFileSync(join(directory, file), 'utf-8')

    try {
      await adapter(content, format as Format)
    } catch (error) {
      // Log and continue so a single unparseable fixture does not fail the whole run
      // and abort hyperfine.
      console.error(`Error in ${file}:`, error)
    }
  }
}

await main()
