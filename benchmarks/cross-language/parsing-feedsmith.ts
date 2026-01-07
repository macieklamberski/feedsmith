import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseFeed } from '../../src/index'

const main = () => {
  const [, , dirPath, feedType] = process.argv
  const fileList = readdirSync(dirPath).filter((f) => f.endsWith(`.${feedType}`))

  for (const file of fileList) {
    const filePath = join(dirPath, file)
    const fileData = readFileSync(filePath, 'utf-8')

    parseFeed(fileData)
  }
}

main()
