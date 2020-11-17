
import { HqArgs } from './types'
import puppeteer from 'puppeteer'

/**
 * readStream reads content from a stream and returns a utf8 string
 *
 * @param stream the stream to read from
 *
 * @returns {string} a utf8 stream
 */
const readStream = async (stream: NodeJS.ReadableStream) => {
  const chunks:any[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/**
 * Read the text and attribute content of an element
 *
 * @param elem a puppeteer element-handle
 *
 * @returns the attributes and text-content for an element
 */
const extractElement = (elem:any) => {
  const result:{ [key:string]: any } = {
    text: elem.textContent
  }

  for (let ith = 0; ith < elem.attributes.length; ith++) {
    let {
      name,
      value
    } = elem.attributes[ith]

    result[name] = value
  }

  return result
}

/**
 * the main application
 *
 * @param args CLI arguments
 *
 */
const hq = async (args:HqArgs) => {
  const html = await readStream(process.stdin)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // keep it simple, stupid.
  await page.setContent(html)

  const elems = await page.$$(args['<selector>'])
  const contentPromises = elems.map(elem => page.evaluate(extractElement, elem))

  for (const entry of await Promise.all(contentPromises)) {
    console.log(JSON.stringify(entry, null, 2))
  }

  await browser.close()
}

export default hq
