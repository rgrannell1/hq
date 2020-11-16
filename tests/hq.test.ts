
import execa from 'execa'
import * as fs from 'fs'

const test = async () => {
  const subprocess = execa('./dist/src/cli.js')
  fs.createReadStream('./example.html').pipe(subprocess.stdin as any)

  console.log(await subprocess.stdout)
}

test()
