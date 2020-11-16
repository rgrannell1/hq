import puppeteer from 'puppeteer';
const readStream = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
};
const getExtractor = (args) => {
    return (elem) => {
        return { text: elem.textContent };
    };
};
const hq = async (args) => {
    const html = await readStream(process.stdin);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const extractor = getExtractor(args);
    if (args['--all']) {
        const elems = await page.$$(args['<selector>']);
        const contentPromises = elems.map(elem => page.evaluate(extractor, elem));
        const content = await Promise.all(contentPromises);
        console.log(JSON.stringify(content, null, 2));
    }
    else {
        const elem = await page.$(args['<selector>']);
        console.log(await elem?.jsonValue());
        const text = await page.evaluate(extractor, elem);
        console.log(JSON.stringify(text, null, 2));
    }
    await browser.close();
};
export default hq;
//# sourceMappingURL=hq.js.map