
import execa from 'execa'
import * as fs from 'fs'

const readStream = async (stream: NodeJS.ReadableStream) => {
  const chunks: any[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

const test = async () => {
  const subprocess = execa('./dist/src/cli.js')
  fs.createReadStream('./example.html').pipe(subprocess.stdin as any)

  const content = await readStream(subprocess.stdout as any)
  console.log(content)
  console.log(content)
  console.log(content)

}

test()

