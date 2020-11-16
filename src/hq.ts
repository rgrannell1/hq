
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

  await page.setContent(html)

  if (args['--all']) {
    const elems = await page.$$(args['<selector>'])

    const contentPromises = elems.map(elem => page.evaluate(extractElement, elem))

    const content = await Promise.all(contentPromises)

    for (const entry of content) {
      console.log(JSON.stringify(entry, null, 2))
    }
  } else {
    const elem = await page.$(args['<selector>'])

    const text = await page.evaluate(extractElement, elem)
    console.log(JSON.stringify(text, null, 2))
  }

  await browser.close()
}

export default hq
