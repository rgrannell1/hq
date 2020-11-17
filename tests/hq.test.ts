
import stream from 'stream'
import fetch from 'node-fetch'
import execa from 'execa'
import * as fs from 'fs'

const { Readable } = stream

const test = async () => {
  const subprocess = execa('./dist/src/cli.js')
  const readable = Readable.from([
    `<html><p attr0=val0>content0</html>`
  ])

  readable.pipe(subprocess.stdin as any)

  const {stdout} = await subprocess
  console.log(stdout)
}

test()

