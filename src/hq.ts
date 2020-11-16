
import { HqArgs } from './types'
import puppeteer from 'puppeteer'

const readStream = async (stream: NodeJS.ReadableStream) => {
  const chunks:any[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

const getExtractor = (args:HqArgs) => {
  return (elem:any) => {
    return {text: elem.textContent}
  }
}

const hq = async (args:HqArgs) => {
  const html = await readStream(process.stdin)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html)

  const extractor = getExtractor(args)

  if (args['--all']) {
    const elems = await page.$$(args['<selector>'])

    const contentPromises = elems.map(elem => page.evaluate(extractor, elem))

    const content = await Promise.all(contentPromises)
    console.log(JSON.stringify(content, null, 2))
  } else {
    const elem = await page.$(args['<selector>'])

    const text = await page.evaluate(extractor, elem)
    console.log(JSON.stringify(text, null, 2))
  }

  await browser.close()
}

export default hq
