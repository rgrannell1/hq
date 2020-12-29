
import tap from 'tap'
import stream from 'stream'
const { Readable } = stream

import {
  readStream,
  extractElement,
  hq
} from '../src/hq.js'

const testReadStream = async () => {
  for (const testInput of ['test']) {
    const testStream = Readable.from([Buffer.from(testInput)])
    const out = await readStream(testStream)

    tap.equals('test', out)
  }
}

const testExtractElement = async () => {
  // -- a mock dom element
  const $elem = {
    textContent: 'test',
    attributes: [
      { name: 'key0', value: 'val0' }
    ]
  }
  const result = extractElement($elem)

  tap.equals(result.text, 'test')
  tap.equals(result.key0, 'val0')
}

const testHq = async (childTest:any) => {
  const html = `<html><p attr0=val0>content</p></html>`

  await new Promise(resolve => {
    const out = {
      write(content: string) {
        const parsed = JSON.parse(content)

        tap.equals(parsed.text, 'content')
        tap.equals(parsed.attr0, 'val0')

        resolve(undefined)
      }
    }

    hq({ '<selector>': 'p', ls: false }, {
      in: Readable.from( Buffer.from(html) ),
      out
    })
  })
}

tap.test('readStream works as expected for test-examples', async childTest => {
  await testReadStream()
  childTest.end()
})

tap.test('extractElement works as expected for test-examples', async childTest => {
  await testExtractElement()
  childTest.end()
})

tap.test('hq produces the expected', async childTest => {
  await testHq(childTest)
})
