
import stream from 'stream'
import child_process from 'child_process'
const { spawn } = child_process
import * as fs from 'fs'

const { Readable } = stream

const testHq = async () => {
  const hq = spawn('./dist/src/cli.js', ['p'])

  hq.stdin.write(`<html><p attr0=val0>content0</html>\n`)
  hq.stdin.end()

  hq.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  hq.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

console.log('x')

}

testHq()

