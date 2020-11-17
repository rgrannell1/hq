import puppeteer from 'puppeteer';
/**
 * readStream reads content from a stream and returns a utf8 string
 *
 * @param stream the stream to read from
 *
 * @returns {string} a utf8 stream
 */
export const readStream = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
};
/**
 * Read the text and attribute content of an element
 *
 * @param elem a puppeteer element-handle
 *
 * @returns the attributes and text-content for an element
 */
export const extractElement = (elem) => {
    const result = {
        text: elem.textContent
    };
    for (let ith = 0; ith < elem.attributes.length; ith++) {
        let { name, value } = elem.attributes[ith];
        result[name] = value;
    }
    return result;
};
/**
 * the main application
 *
 * @param args CLI arguments
 *
 */
export const hq = async (args, opts = {}) => {
    const input = opts.in ?? process.stdin;
    const output = opts.out ?? process.stdout;
    const html = await readStream(input);
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    // keep it simple, stupid.
    await page.setContent(html);
    const elems = await page.$$(args['<selector>']);
    const contentPromises = elems.map(elem => page.evaluate(extractElement, elem));
    for (const entry of await Promise.all(contentPromises)) {
        output.write(JSON.stringify(entry, null, 2) + '\n');
    }
    const printed = await readStream(output);
    await browser.close();
};
export default hq;
