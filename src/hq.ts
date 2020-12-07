
import {
  HqArgs,
  HqOpts
} from './types'
import puppeteer from 'puppeteer'

/**
 * readStream reads content from a stream and returns a utf8 string
 *
 * @param stream the stream to read from
 *
 * @returns {string} a utf8 stream
 */
export const readStream = async (stream: NodeJS.ReadableStream) => {
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
export const extractElement = (elem:any) => {
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


interface SuggestSelectorArgs {
  input: any,
  output: any
}

interface SelectorState {
  ids: any[],
  classes: any[],
  tags:any[]
}

export const suggestSelectors = async (page: puppeteer.Page, args: SuggestSelectorArgs) => {
  const $elems = await page.$$('*')
  const state:SelectorState = {
    ids: [],
    classes: [],
    tags: []
  }

  for (const $elem of $elems) {
    const classes = await (await $elem.getProperty('className')).jsonValue()
    const ids = await (await $elem.getProperty('id')).jsonValue()
    const tag = await (await $elem.getProperty('tagName')).jsonValue()

    if (typeof classes === 'string') {
      const items = (classes as string).split(' ')
      state.classes.push(...items)
    }

    if (typeof ids === 'string') {
      const items = (ids as string).split(' ')
      state.ids.push(...items)
    }

    if (typeof tag === 'string') {
      const items = (tag as string).split(' ')
      state.tags.push(...items)
    }
  }

  const idSet = new Set(state.ids.filter(id => id?.length > 0).sort())
  const classesSet = new Set(state.classes.filter(id => id?.length > 0).sort())
  const tagSet = new Set(state.tags.filter(id => id?.length > 0).sort())

  for (const tag of tagSet) {
    console.log(`#${tag}`)
  }
  for (const id of idSet) {
    console.log(`#${id}`)
  }
  for (const klassy of classesSet) {
    console.log(`.${klassy}`)
  }
}

/**
 * the main application
 *
 * @param args CLI arguments
 *
 */
export const hq = async (args: HqArgs, opts: HqOpts = {}) => {
  const input = opts.in ?? process.stdin
  const output = opts.out ?? process.stdout

  const browser = await puppeteer.launch({
    headless: true
  })

  const page = await browser.newPage()

  if (args['<url>']) {
    await page.goto(args['<url>'])
  } else {
    const html = await readStream(input)
    await page.setContent(html)
  }

  if (args.ls) {
    await suggestSelectors(page, { input, output })
    await browser.close()
    return
  }

  const elems = await page.$$(args['<selector>'])
  const contentPromises = elems.map(elem => page.evaluate(extractElement, elem))

  for (const entry of await Promise.all(contentPromises)) {
    output.write(JSON.stringify(entry, null, 2) + '\n')
  }

  await browser.close()
}

export default hq
