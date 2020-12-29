import puppeteerExtra from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
puppeteerExtra.use(stealth());
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
export const suggestSelectors = async (page, args) => {
    const $elems = await page.$$('*');
    const state = {
        ids: [],
        classes: [],
        tags: []
    };
    for (const $elem of $elems) {
        const classes = await (await $elem.getProperty('className')).jsonValue();
        const ids = await (await $elem.getProperty('id')).jsonValue();
        const tag = await (await $elem.getProperty('tagName')).jsonValue();
        if (typeof classes === 'string') {
            const items = classes.split(' ');
            state.classes.push(...items);
        }
        if (typeof ids === 'string') {
            const items = ids.split(' ');
            state.ids.push(...items);
        }
        if (typeof tag === 'string') {
            const items = tag.split(' ');
            state.tags.push(...items);
        }
    }
    const idSet = new Set(state.ids.filter(id => id?.length > 0).sort());
    const classesSet = new Set(state.classes.filter(id => id?.length > 0).sort());
    const tagSet = new Set(state.tags.filter(id => id?.length > 0).sort());
    for (const tag of tagSet) {
        console.log(`#${tag}`);
    }
    for (const id of idSet) {
        console.log(`#${id}`);
    }
    for (const klassy of classesSet) {
        console.log(`.${klassy}`);
    }
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
    const browser = await puppeteerExtra.launch({
        headless: true,
        executablePath: args['--exec']
    });
    const page = await browser.newPage();
    if (args['<url>']) {
        try {
            await page.goto(args['<url>']);
        }
        catch (err) {
            if (err.message.includes('invalid URL')) {
                console.error(`"${args['<url>']}" is an invalid URL; did you mix up argument order?`);
                await browser.close();
                return;
            }
            throw err;
        }
    }
    else {
        const html = await readStream(input);
        await page.setContent(html);
    }
    if (args.ls) {
        await suggestSelectors(page, { input, output });
        await browser.close();
        return;
    }
    const elems = await page.$$(args['<selector>']);
    const contentPromises = elems.map(elem => page.evaluate(extractElement, elem));
    for (const entry of await Promise.all(contentPromises)) {
        output.write(JSON.stringify(entry, null, 2) + '\n');
    }
    await browser.close();
};
export default hq;
